import { Component } from "@/core/Component";
import { useRouter } from "@/core/Router";

export class DetailCodePage extends Component {
  private router = useRouter();

  constructor() {
    super();
  }

  protected onMounted(): void | Promise<void> {
    console.log(this.router.getCurrentPath());
  }

  template(): string {
    return /*html*/ `
      <div class="w-full h-full flex flex-col items-center justify-center">
        <div class="w-full max-w-5xl p-4">
          <h1 class="text-2xl font-bold mb-4">Detail Code Page</h1>
          <p class="text-gray-600">This is the detail code page for a specific paste.</p>
        </div>
    </div>
    `;
  }
}
