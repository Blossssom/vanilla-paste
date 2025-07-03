import { Component } from "@/core/Component";
import { Editor } from "@/components/Editor";
import { Button } from "@/components/Button";
import { monaco } from "@/monacoWorker";
import { Selector } from "@/components/Selector";

interface MainPageState {
  isLoading: boolean;
  code: string;
  language: string;
}

export class MainPage extends Component<{}, MainPageState> {
  private availableLanguages: monaco.languages.ILanguageExtensionPoint[] = [];
  private placeholder: string = "Enter your paste title here";

  constructor() {
    super();
    this.state = {
      isLoading: true,
      code: "// Type your code here",
      language: "",
    };
    this.availableLanguages = monaco.languages.getLanguages();
  }

  template(): string {
    return /*html */ `
      <section class="w-full py-14">
        <div class="w-full h-full flex flex-col gap-4">
          <div class="flex justify-between items-center gap-4">
            <div class="w-full flex-1 flex flex-col gap-2 items-start">
              <label>Title paste</label>
              <input type="text" class="w-full bg-input__bg border-gray-400 border p-2" placeholder='${this.placeholder}' />
            </div>
            <div class="w-full flex-1 flex flex-col gap-2 items-start">
              <label for="language-selector">Language</label>
              <div id="language-selector" class="w-full bg-input__bg border-gray-400 border p-2">
              </div>  
            </div>
          </div>
          <div id="monaco-container" class="h-full w-full text-left">
          </div>
          <div id="create-button__paste" class="w-full flex justify-end">
          </div>
        </div>
      </section>
    `;
  }

  protected created(): void {
    console.log("MainPage component created");
    try {
      const languages = monaco.languages.getLanguages();
      this.setState({
        language: languages.length > 0 ? languages[0].id : "javascript",
      });
      console.log("Available languages:", languages, this.state);
    } catch (err) {
      console.error("Error during component creation:", err);
    }
  }

  private languageChangeHandler(newLanguage: string): void {
    this.setState({
      language: newLanguage,
    });
  }

  protected mountChildren(): void {
    console.log("Mounting child components in MainPage", this.state);
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
        options: this.availableLanguages.map((lang) => lang.id),
        onChange: this.languageChangeHandler.bind(this),
      },
      "#language-selector",
      "language-selector"
    );

    this.addChild(Button, {}, "#create-button__paste", "create-button__paste");
  }

  private createButtonHandler(): void {
    document
      .querySelector("#create-button__paste")
      ?.addEventListener("click", () => {
        console.log(JSON.stringify(this.state.code));
      });
  }

  private changeCodeHandler(newValue: string): void {
    this.setState({
      code: newValue,
    });
  }

  protected bindEvents(): void {
    this.createButtonHandler();
  }
}
