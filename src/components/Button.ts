import { Component } from "@/core/Component";

interface ButtonProps {
  onClick?: () => void;
}

export class Button extends Component<ButtonProps> {
  constructor(props: ButtonProps = {}) {
    super(props);
  }

  template(): string {
    return /*html */ `
        <button class="px-6 py-2  bg-blue-500">Click!!!</button>
      `;
  }

  protected bindEvents(): void {
    const button = this.$container?.querySelector(".test-button");
    if (button && this.props.onClick) {
      button.addEventListener("click", () => {
        this.props.onClick?.();
      });
    }
  }
}
