import { Editor } from "@/components/Editor";
import { Component } from "@/core/Component";
import { useRouter } from "@/core/Router";
import { apiService } from "@/services/apiService";

interface DetailState {
  code: string;
  language: string;
  isLoading: boolean;
}
export class DetailCodePage extends Component<{}, DetailState> {
  private router = useRouter();

  constructor() {
    super();
    this.state = {
      code: "",
      language: "plaintext",
      isLoading: true,
    };
  }

  protected onMounted(): void | Promise<void> {
    this.getPasteDetail();
  }

  template(): string {
    return /*html*/ `
      <div class="w-full flex flex-col ">
        <div>
          <button></button>
        </div>
        <div class="w-full max-w-5xl p-4 h-[90vh] overflow-y-auto relative">
          <p class="text-gray-600">This is the detail code page for a specific paste.</p>
          <div id="editor-container" class="w-full h-full max-h-3/4 text-left">
          </div>
          <div id="loading-state" >
            ${this.renderLoadingState()}
          </div>
        </div>
      </div>
    `;
  }

  protected mountChildren(): void {
    this.addChild(
      Editor,
      {
        value: this.state.code || "",
        language: this.state.language || "plaintext",
        readonly: true,
      },
      "#editor-container",
      "editor"
    );
  }

  private renderLoadingState(): string {
    if (this.state.isLoading) {
      return /*html*/ `
            <div class="w-full h-full max-h-4/5 flex flex-col items-center justify-center text-gray-500 absolute top-0 left-0 bg-opacity-50 z-10">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mb-4"></div>
              <span>Loading...</span>
            </div>`;
    }

    return "";
  }

  protected updateDynamicContent(): void {
    const loadingContainer = this.$container?.querySelector("#loading-state");
    if (loadingContainer) {
      loadingContainer.innerHTML = this.renderLoadingState();
    }
  }

  private async getPasteDetail(): Promise<void> {
    const pasteId = this.router.getQueryParams();
    if (!pasteId.id) {
      console.error("Paste ID not found in query parameters.");
      return;
    }
    this.setState({ isLoading: true });
    try {
      const response = await apiService.get(`/paste/${pasteId.id}`);
      if (response.status === 200) {
        const { data } = response.data as any;
        this.setState({
          code: data.content,
          language: data.language || "plaintext",
          isLoading: false,
        });
        this.update();
      }
    } catch (error) {
      this.setState({ isLoading: false });
      //   alert("Failed to fetch paste details. Please try again later.");
      console.error("Error fetching paste details:", error);
    }
  }
}
