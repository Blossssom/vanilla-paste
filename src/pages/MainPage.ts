import { Component } from "@/core/Component";
import { Button } from "@/components/Button";
import { Editor } from "@/components/Editor";

interface MainPageState {
  isLoading: boolean;
  desc: string;
  count: number;
  code: string;
}

export class MainPage extends Component<{}, MainPageState> {
  constructor() {
    super();
    this.state = {
      isLoading: true,
      desc: "this is a simple vanilla JS app",
      count: 0,
      code: "// Type your code here",
    };
  }

  template(): string {
    return /*html */ `
      <div class="container mx-auto p-4">
        <h1 class="text-2xl font-bold mb-4">Welcome to Vanilla JS App</h1>
        <p class="mb-4">${this.state.desc}</p>
        <p>${this.state.code}</p>
        <p> Count: <span id="count-display">${this.state.count}</span></p>
        <div id="button-container" class="mb-4">

        </div>
        <div class="mb-4">
            <h3 class="text-lg font-semibold mb-2">Code Editor</h3>
            <div id="monaco-container" class="h-full w-full text-left">

            </div>
        </div>
      </div>
    `;
  }

  private clickEventHandler(): void {
    this.setState({
      count: this.state.count + 1,
    });
  }

  protected mountChildren(): void {
    this.addChild(
      Editor,
      { value: this.state.code, onChange: this.handleCodeChange.bind(this) },
      "#monaco-container",
      "monaco-editor"
    );
    this.addChild(
      Button,
      { onClick: this.clickEventHandler.bind(this) },
      "#button-container",
      "test-button"
    );
  }

  private handleCodeChange(code: string): void {
    this.setState({
      code: code,
    });
  }

  protected updateDynamicContent(): void {
    this.updateTextContent("#count-display", this.state.count.toString());
  }
}
