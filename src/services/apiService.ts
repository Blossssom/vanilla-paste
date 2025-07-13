interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

interface ApiError {
  status: number;
  message: string;
  details?: any;
}

export class ApiService {
  private baseUrl: string;
  private defaultHeaders: HeadersInit;
  // private abortController: AbortController | null = null;
  private pendingRequests: Map<string, AbortController> = new Map();

  constructor() {
    // this.baseUrl = "http://10.30.8.25:8080/api/v1"; // 로컬 개발용
    this.baseUrl = import.meta.env.DEV
      ? "http://10.30.8.25:8080/api/v1"
      : "https://dropnote.onrender.com/api/v1"; // 프로덕션용
    this.defaultHeaders = {
      "Content-Type": "application/json",
    };
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      console.log("inner url :", url);
      const requestKey = `${options.method || "GET"}-${url}`;

      // 기존 요청 취소
      if (this.pendingRequests.has(requestKey)) {
        this.pendingRequests.get(requestKey)!.abort();
        this.pendingRequests.delete(requestKey);
      }

      const controller = new AbortController();
      this.pendingRequests.set(requestKey, controller);

      const config: RequestInit = {
        ...options,
        headers: {
          ...this.defaultHeaders,
          ...options.headers,
        },
        signal: controller.signal,
        credentials: "include",
      };

      const timeoutId = setTimeout(() => {
        controller.abort();
        this.pendingRequests.delete(requestKey);
      }, 10000);

      const response = await fetch(url, config);

      clearTimeout(timeoutId);
      this.pendingRequests.delete(requestKey);

      if (!response.ok) {
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${response.statusText}`
        );
      }

      const data = await response.json();

      return {
        data: data as T,
        status: response.status,
      };
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        throw {
          status: 408,
          message: "Request timeout or cancelled",
          details: null,
        } as ApiError;
      }

      throw {
        status: (error as any).status || 500,
        message: (error as Error).message || "An error occurred",
        details: (error as any).details || null,
      } as ApiError;
    }
  }

  async get<T>(
    endpoint: string,
    params?: Record<string, any>
  ): Promise<ApiResponse<T>> {
    const url = params
      ? `${endpoint}?${new URLSearchParams(params).toString()}`
      : endpoint;
    return this.request<T>(url, {
      method: "GET",
    });
  }

  async post<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  async put<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(body),
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "DELETE",
    });
  }

  // 모든 진행 중인 요청 취소
  cancelAllRequests(): void {
    this.pendingRequests.forEach((controller) => {
      controller.abort();
    });
    this.pendingRequests.clear();
  }

  // 특정 요청 취소
  cancelRequest(endpoint: string, method: string = "GET"): void {
    const requestKey = `${method}-${this.baseUrl}${endpoint}`;
    const controller = this.pendingRequests.get(requestKey);
    if (controller) {
      controller.abort();
      this.pendingRequests.delete(requestKey);
    }
  }
}

export const apiService = new ApiService();
