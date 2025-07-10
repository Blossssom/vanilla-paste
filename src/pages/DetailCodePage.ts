import { Editor } from "@/components/Editor";
import { Component } from "@/core/Component";
import { useRouter } from "@/core/Router";
import { apiService } from "@/services/apiService";

interface DetailState {
  code: string;
  language: string;
}
export class DetailCodePage extends Component<{}, DetailState> {
  private router = useRouter();

  constructor() {
    super();
    this.state = {
      code: "",
      language: "plaintext",
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
        <div class="w-full max-w-5xl p-4 h-[90vh] overflow-y-auto">
          <p class="text-gray-600">This is the detail code page for a specific paste.</p>
          <div id="editor-container" class="w-full h-full  max-h-3/4 text-left">
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

  private async getPasteDetail(): Promise<void> {
    const pasteId = this.router.getQueryParams();
    if (!pasteId.id) {
      console.error("Paste ID not found in query parameters.");
      return;
    }
    try {
      const response = await apiService.get(`/paste/${pasteId.id}`);
      if (response.status === 200) {
        const { data } = response.data as any;
        this.setState({
          code: data.content,
          language: data.language || "plaintext",
        });
        this.update();
      }
    } catch (error) {
      //   alert("Failed to fetch paste details. Please try again later.");
      console.error("Error fetching paste details:", error);
    }
  }
}
