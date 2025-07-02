import { Component } from "@/core/Component";

interface ButtonProps {
  onClick?: () => void;
}

export class Button extends Component<ButtonProps> {
  constructor(props: ButtonProps = {}) {
    super(props);
  }

  template(): string {
    return `
        <button class="test-button">Click!!!</button>
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
