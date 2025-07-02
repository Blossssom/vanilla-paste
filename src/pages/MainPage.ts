import { Component } from "@/core/Component";
import { Editor } from "@/components/Editor";

interface MainPageState {
  isLoading: boolean;
  code: string;
}

export class MainPage extends Component<{}, MainPageState> {
  constructor() {
    super();
    this.state = {
      isLoading: true,
      code: "// Type your code here",
    };
  }

  template(): string {
    return /*html */ `
      <section class=w-full">
        <div>
            <h3 class="text-lg font-semibold mb-2">Code Editor</h3>
            <div id="monaco-container" class="h-full w-full text-left">
            </div>
        </div>
      </div>
    `;
  }

  protected mountChildren(): void {
    this.addChild(
      Editor,
      { value: this.state.code, onChange: this.handleCodeChange.bind(this) },
      "#monaco-container",
      "monaco-editor"
    );
  }

  private handleCodeChange(code: string): void {
    this.setState({
      code: code,
    });
  }
}
