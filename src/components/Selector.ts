import { Component } from "@/core/Component";

interface SelectorProps {
  options: Record<string, any>[];
  selected?: string;
  onChange?: (selected: string) => void;
}
export class Selector extends Component<SelectorProps> {
  constructor(props: SelectorProps) {
    super(props);
  }

  template(): string {
    const selectedOption = this.props.selected || this.props.options[0];

    return /*html */ `
        <div class="w-full">
            <select class="w-full border-0" id="language-selector">
            ${this.props.options
              .map(
                (option) => `
                <option class="w-full text-gray-900" value="${option.value}" ${
                  option.value === selectedOption ? "selected" : ""
                }>${option.label}</option>
            `
              )
              .join("")}
            </select>
        </div>    
    `;
  }

  protected bindEvents(): void {
    const selectElement = this.$container?.querySelector(
      `#language-selector`
    ) as HTMLSelectElement;
    if (selectElement) {
      selectElement.addEventListener("change", (event) => {
        const selectedValue = (event.target as HTMLSelectElement).value;
        if (this.props.onChange) {
          this.props.onChange(selectedValue);
        }
      });
    }
  }
}
