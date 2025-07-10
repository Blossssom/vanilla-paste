import { Component } from "@/core/Component";
import { useRouter } from "@/core/Router";
import { apiService } from "@/services/apiService";

interface ListPageState {
  listData: any[];
  totalPages: number;
  currentPage: number;
}

export class ListPage extends Component<{}, ListPageState> {
  private router = useRouter();
  private PAGE_SCALE = 10;
  constructor() {
    super();
    this.state = {
      listData: [],
      totalPages: 0,
      currentPage: 1,
    };
  }

  protected async onMounted(): Promise<void> {
    await this.getListData();
    this.setupEventListeners();
  }

  template(): string {
    return /*html*/ `
            <div class="w-full h-[80vh] flex flex-col items-center">
                <div class="w-full flex items-center justify-between list-header border-b pb-3">
                  <div>
                    <span>Name</span>
                  </div>
                  <div>
                    <span>Syntax</span>
                  </div>
                  <div>
                    <span>Created</span>
                  </div>
                  <div>
                    <span>expired</span>
                  </div>  
                </div>
                <div id="paste-list__container" class="w-full h-full flex flex-col gap-4 py-4">
                    ${this.renderListContent()}
                </div>
                <div id="paste-list__pagination">

                </div>
            </div>
        `;
  }

  protected updateDynamicContent(): void {
    const listContainer = this.$container?.querySelector(
      "#paste-list__container"
    );

    const paginationContainer = this.$container?.querySelector(
      "#paste-list__pagination"
    );
    if (listContainer) {
      listContainer.innerHTML = this.renderListContent();
    }

    if (paginationContainer) {
      const MAGIC_NUMBER = 10;
      const halfPageCount = Math.floor(MAGIC_NUMBER / 2);
      let startPage = Math.max(1, this.state.currentPage - halfPageCount);
      const endPage = startPage + MAGIC_NUMBER - 1;
      if (endPage > this.state.totalPages) {
        startPage = Math.max(1, this.state.totalPages - MAGIC_NUMBER + 1);
      }

      const totalPageArray = Array.from(
        { length: Math.min(MAGIC_NUMBER, this.state.totalPages) },
        (_, i) => startPage + i
      );

      paginationContainer.innerHTML = totalPageArray
        .map(
          (page) => `
        <button class="px-4 py-2 rounded-md text-sm font-semibold ${
          page === this.state.currentPage ? "bg-amber-200" : "bg-secondary"
        }" data-pagination-id="${page}">
          ${page}
        </button>
      `
        )
        .join("");
    }
  }

  private setupEventListeners(): void {
    this.addEventListenerSafe({
      element: this.$container!,
      event: "click",
      handler: (event) => {
        const target = event.target as HTMLElement;

        if (
          target.tagName === "BUTTON" &&
          target.hasAttribute("data-paste-id")
        ) {
          const pasteId = target.getAttribute("data-paste-id");
          if (pasteId) {
            this.router.push(`/detail?id=${pasteId}`);
          }
        }

        if (
          target.tagName === "BUTTON" &&
          target.hasAttribute("data-pagination-id")
        ) {
          const page = parseInt(
            target.getAttribute("data-pagination-id") || "1"
          );
          if (!isNaN(page) && page !== this.state.currentPage) {
            this.setState({
              currentPage: page,
            });

            this.getListData();
          }
        }
      },
    });
  }

  private async getListData(): Promise<void> {
    /**
     * @Check - error_code 4403: too many requests
     * @Check - error_code 4401: captcha required
     *
     */
    try {
      const response = await apiService.get("/paste/list", {
        page: this.state.currentPage,
        scale: this.PAGE_SCALE,
      });
      if (response.status === 200) {
        const { data } = response.data as any;
        this.setState({
          listData: data.pastes ?? [],
          totalPages: data.total_page ?? 0,
        });
        this.update();
      }
    } catch (error) {
      const { error_code } = error as any;
      console.error("Error fetching list data:", error);
      if (error_code === 4403) {
        alert("Too many requests. Please try again later.");
      }
    }
  }

  private renderListContent(): string {
    if (this.state.listData.length === 0) {
      return `<div class="flex flex-col items-center justify-center text-gray-500 min-h-64">No data available</div>`;
    }

    return `${this.state.listData
      .map(
        (item) => `
            <button class="w-full flex hover:bg-secondary items-center justify-between button-with__span" data-paste-id="${
              item?.id
            }">
                <div>
                  <span>${item?.title ?? "untitled"}</span>
                </div>
                <div>
                  <span>${item?.language}</span>
                </div>
                <div>
                  <span>${item?.created_at}</span>
                </div>
                <div>
                  <span>${item?.expires_at}</span>
                </div>
            </button>
            `
      )
      .join("")}`;
  }
}
