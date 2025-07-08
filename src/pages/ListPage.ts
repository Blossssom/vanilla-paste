import { Component } from "@/core/Component";
import { useRouter } from "@/core/Router";
import { apiService } from "@/services/apiService";

interface ListPageState {
  listData: any[];
}

export class ListPage extends Component<{}, ListPageState> {
  private router = useRouter();
  constructor() {
    super();
    this.state = {
      listData: [],
    };
  }

  protected async onMounted(): Promise<void> {
    await this.getListData();
    this.setupEventListeners();
  }

  template(): string {
    return /*html*/ `
            <div class="w-full h-full flex flex-col items-center justify-center">
                <div id="paste-list__container" class="w-full flex flex-col gap-4">
                    ${this.renderListContent()}
                </div>
            </div>
        `;
  }

  protected updateDynamicContent(): void {
    const listContainer = this.$container?.querySelector(
      "#paste-list__container"
    );
    if (listContainer) {
      listContainer.innerHTML = this.renderListContent();
    }
  }

  private setupEventListeners(): void {
    this.addEventListenerSafe({
      element: this.$container!,
      event: "click",
      handler: (event) => {
        const target = event.target as HTMLElement;

        if (target.tagName === "BUTTON") {
          console.log("Clicked element:", target, target.tagName);
          const pasteId = target.getAttribute("data-paste-id");
          if (pasteId) {
            this.router.push(`/detail?id=${pasteId}`);
          }
        }
      },
    });
  }

  private async getListData(): Promise<void> {
    try {
      const response = await apiService.get("/paste/list", {
        page: 1,
        scale: 10,
      });
      if (response.status === 200) {
        const { data } = response.data as any;
        this.setState({
          listData: data.pastes ?? [],
        });
        this.update();
      }
    } catch (error) {
      console.log("Error fetching list data:", error);
      alert("Error fetching list data.");
    }
  }

  private renderListContent(): string {
    if (this.state.listData.length === 0) {
      return `<div class="text-center text-gray-500">No data available</div>`;
    }

    return `${this.state.listData
      .map(
        (item) => `
            <button class="w-full flex items-center justify-between button-with__span" data-paste-id="${
              item?.id
            }">
                <span>${item?.title ?? "untitled"}</span>
                <span>${item?.language}</span>
                <span>${item?.created_at}</span>
                <span>${item?.expires_at}</span>
            </button>
            `
      )
      .join("")}`;
  }
}
