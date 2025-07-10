import { Component } from "@/core/Component";

interface ButtonProps {
  id: string;
  text?: string;
  onClick?: () => void;
}

export class Button extends Component<ButtonProps> {
  constructor(props: ButtonProps) {
    super(props);
  }

  template(): string {
    return /*html */ `
        <button id=${
          this.props.id
        } class="px-6 py-2  bg-blue-500 hover:bg-blue-600 rounded-md text-sm font-semibold flex items-center justify-center test-button disabled:opacity-50 disabled:cursor-not-allowed">
          <span class="text-white">${this.props.text || "Click Me"}</span>
        </button>
      `;
  }

  protected bindEvents(): void {
    const button = this.$container?.querySelector(
      `#${this.props.id}`
    ) as HTMLButtonElement;
    if (button && this.props.onClick) {
      this.addEventListenerSafe({
        element: button,
        event: "click",
        handler: this.props.onClick,
      });
    }
  }
}
