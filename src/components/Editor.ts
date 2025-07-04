import { Component } from "@/core/Component";
import { monaco } from "@/monacoWorker";

interface EditorProps {
  value?: string;
  language?: string;
  changeCode?: (code: string) => void;
}

interface EditorState {}

export class Editor extends Component<EditorProps, EditorState> {
  private editor: monaco.editor.IStandaloneCodeEditor | null = null;
  private editorId: string;

  constructor(props: EditorProps) {
    super(props);
    this.editorId = `monaco-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;
  }

  template(): string {
    return /*html */ `
      <div class="w-full flex flex-col gap-2">
        <div class="w-full flex-1 flex flex-col gap-2">
          <label for="${this.editorId}">Code Editor</label>
          <div id="${this.editorId}" style="height: 400px; width: 100%;" class=" border-gray-400 border">
        </div>
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
        language: this.props.language || "",
        theme: "vs-dark",
      });

      this.editor.onDidChangeModelContent(() => {
        const currentValue = this.editor?.getValue() || "";

        if (this.props.changeCode) {
          this.props.changeCode(currentValue);
        }
      });
    } catch (error) {
      console.error("Failed to initialize Monaco Editor:", error);
    }
  }

  protected async onMounted(): Promise<void> {
    await this.initMonacoEditor();
  }

  protected onUpdate(): void | Promise<void> {
    if (this.editor) {
      monaco.editor.setModelLanguage(
        this.editor.getModel() as monaco.editor.ITextModel,
        this.props.language || "javascript"
      );
    }
  }

  protected cleanUp(): void {
    if (this.editor) {
      this.editor.dispose();
      this.editor = null;
    }
  }
}
