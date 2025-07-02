import { Component } from "@/core/Component";
import { monaco } from "@/monacoWorker";
import { Selector } from "@/components/Selector";

interface EditorProps {
  value?: string;
  onChange?: (code: string) => void;
}

interface EditorState {}

export class Editor extends Component<EditorProps, EditorState> {
  private editor: monaco.editor.IStandaloneCodeEditor | null = null;
  private languages: monaco.languages.ILanguageExtensionPoint[] = [];
  private editorId: string;

  constructor(props: EditorProps) {
    super(props);
    this.editorId = `monaco-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;
  }

  template(): string {
    return /*html */ `
      <div id='selector-container'></div>
      <div id="${this.editorId}" style="height: 400px; width: 100%;">
        <!-- Monaco Editor will be rendered here -->
      </div>
    `;
  }

  private async initMonacoEditor(): Promise<void> {
    try {
      const container = this.$container?.querySelector(`#${this.editorId}`);
      if (!container) {
        throw new Error("Editor container not found");
      }

      this.editor = monaco.editor.create(container as HTMLElement, {
        value: this.props.value || "// Type your code here",
        language:
          this.languages.length > 0 ? this.languages[0].id : "javascript",
        theme: "vs-dark",
      });
    } catch (error) {
      console.error("Failed to initialize Monaco Editor:", error);
    }
  }

  private handleLanguageChange(selectedLanguage: string): void {
    if (this.editor) {
      monaco.editor.setModelLanguage(this.editor.getModel()!, selectedLanguage);
    }
  }

  protected async onMounted(): Promise<void> {
    console.log("mount");
    await this.initMonacoEditor();
  }

  protected mountChildren(): void {
    this.languages = monaco.languages.getLanguages();

    this.addChild(
      Selector,
      {
        options: this.languages.map((lang) => lang.id),
        onChange: this.handleLanguageChange.bind(this),
      },
      `#selector-container`,
      "language-selector"
    );
  }

  protected cleanUp(): void {
    if (this.editor) {
      this.editor.dispose();
      this.editor = null;
    }
  }
}
