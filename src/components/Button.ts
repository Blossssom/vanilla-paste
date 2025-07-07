import { Component } from "@/core/Component";

interface ButtonProps {
  onClick?: () => void;
  text?: string;
}

export class Button extends Component<ButtonProps> {
  constructor(props: ButtonProps = {}) {
    super(props);
  }

  template(): string {
    return /*html */ `
        <button class="px-6 py-2  bg-blue-500 hover:bg-blue-600 rounded-md text-sm font-semibold flex items-center justify-center test-button">
          <span class="text-white">${this.props.text || "Click Me"}</span>
        </button>
      `;
  }

  protected bindEvents(): void {
    const button = this.$container?.querySelector(".test-button");
    if (button && this.props.onClick) {
      this.addEventListenerSafe({
        element: button,
        event: "click",
        handler: this.props.onClick,
      });
    }
  }
}
