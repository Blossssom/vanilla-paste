import { Component } from "@/core/Component";
import { Editor } from "@/components/Editor";
import { Button } from "@/components/Button";
import { monaco } from "@/monacoWorker";
import { Selector } from "@/components/Selector";
import { expiredOptions } from "@/constant/options";
import { apiService } from "@/services/apiService";
import logoImage from "@/assets/images/dropnote_logo.png";
import { useRouter } from "@/core/Router";

interface MainPageState {
  isLoading: boolean;
  code: string;
  language: string;
  expired: number;
  title: string;
}

/**
 * @Check - max kb 지정 필요 (128kb?)
 */

export class MainPage extends Component<{}, MainPageState> {
  private availableLanguages: monaco.languages.ILanguageExtensionPoint[] = [];
  private placeholder: string = "Enter your paste title here";
  private codeChangeTimerId: number | NodeJS.Timeout | null = null;
  private router = useRouter();
  private isSubmitting: boolean = false;

  constructor() {
    super();
    this.state = {
      isLoading: true,
      code: "// Type your code here",
      language: "",
      expired: 1,
      title: "",
    };
    this.availableLanguages = monaco.languages.getLanguages();
  }

  template(): string {
    return /*html */ `
      <section class="w-full py-14">
        <div class="w-full h-full flex flex-col gap-10">
          <div class="flex flex-col items-center gap-4">
            <img id="logo-img" class="object-containj w-24" />
            <div class="flex flex-col items-center gap-2">
              <h2 class="text-4xl font-bold">DROP NOTE</h2>
              <p class="text-neutral-400">Share your code snippets easily!</p>
            </div>
          </div>
          <article class="w-full h-full flex flex-col gap-4">
            <div class="flex justify-between items-center gap-4">
              <div class="w-full flex-1 flex flex-col gap-2 items-start">
                <label>Title paste</label>
                <input id="paste-input__title" autocomplete="off" type="text" class="w-full bg-input__bg border-gray-400 border p-2" placeholder='${this.placeholder}' />
              </div>
              <div class="w-full flex-1 flex flex-col gap-2 items-start">
                <label for="language-selector">Language</label>
                <div id="language-selector" class="w-full bg-input__bg border-gray-400 border p-2">
                </div>  
              </div>
              <div class="w-full flex-1 flex flex-col gap-2 items-start">
                <label for="expired-selector">Expired</label>
                <div id="expired-selector" class="w-full bg-input__bg border-gray-400 border p-2">
                </div>
              </div>
            </div>
            <div id="monaco-container" class="w-full h-[400px] text-left">
            </div>
            <div id="create-button__paste" class="w-full flex justify-end">
            </div>
          </article>
        </div>
      </section>
    `;
  }

  protected onMounted(): void | Promise<void> {
    document.querySelector<HTMLImageElement>("#logo-img")!.src = logoImage;

    try {
      const languages = monaco.languages.getLanguages();
      this.setState({
        language: languages.length > 0 ? languages[0].id : "plaintext",
      });
    } catch (err) {
      console.error("Error during component creation:", err);
    }
  }

  private languageChangeHandler(newLanguage: string): void {
    this.setState({
      language: newLanguage,
    });
  }

  private expiredChangeHandler(newExpired: number): void {
    this.setState({
      expired: newExpired,
    });
  }

  protected mountChildren(): void {
    this.addChild(
      Editor,
      {
        value: this.state.code,
        changeCode: this.changeCodeHandler.bind(this),
        language: this.state.language,
      },
      "#monaco-container",
      "monaco-editor"
    );

    /**
     * @Check - create 타이밍으로 인해 props가 제대로 전달되지 않을 수 있음
     */
    this.addChild(
      Selector,
      {
        options: this.availableLanguages.map((lang) => ({
          label: lang.id,
          value: lang.id,
        })),
        onChange: this.languageChangeHandler.bind(this),
      },
      "#language-selector",
      "language-selector"
    );

    this.addChild(
      Selector,
      {
        options: expiredOptions,
        onChange: this.expiredChangeHandler.bind(this),
      },
      "#expired-selector",
      "expired-selector"
    );

    this.addChild(
      Button,
      {
        id: "create-button",
        text: "Create",
        onClick: this.handleCreateButtonClick.bind(this),
      },
      "#create-button__paste",
      "create-button__paste"
    );
  }

  private changeCodeHandler(newValue: string): void {
    if (this.codeChangeTimerId) {
      this.clearTimeoutSafe(this.codeChangeTimerId);
    }

    this.codeChangeTimerId = this.addTimeoutSafe(() => {
      this.setState({
        code: newValue,
      });
    }, 300);
  }

  override unmount(): void {
    if (this.codeChangeTimerId) {
      this.clearTimeoutSafe(this.codeChangeTimerId);
      this.codeChangeTimerId = null;
    }
    super.unmount();
  }

  private async handleCreateButtonClick(): Promise<void> {
    if (this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;
    const titleInput = document.getElementById(
      "paste-input__title"
    ) as HTMLInputElement;

    if (titleInput.value.trim() === "") {
      alert("Please enter a title for your paste.");
      this.isSubmitting = false;
      return;
    }
    try {
      const response = await apiService.post("/paste", {
        content: this.state.code,
        expire: this.state.expired,
        language: this.state.language,
        title: titleInput.value,
      });

      if (response.status === 201) {
        const { data } = response.data as any;
        this.router.push(`/detail?id=${data.id}`);
      }
    } catch (error) {
      alert("Failed to create paste. Please try again.");
      throw new Error("Failed to create paste");
    } finally {
      this.isSubmitting = false;
    }
  }
}
