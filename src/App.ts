import { Component } from "./core/Component";
import { createRouter } from "./core/Router";
import { routerList } from "@/constant/routerList";

export class App extends Component {
  private router = createRouter(document.createElement("div"));
  constructor() {
    super();
  }

  protected mountChildren(): void {
    this.setupRouter();
  }

  private setupRouter(): void {
    const routerProvider = this.$container?.querySelector("#router-provider");
    if (!routerProvider) {
      console.error("Router provider element not found.");
      return;
    }
    if (this.router) {
      this.router.destroy();
    }

    this.router = createRouter(routerProvider as HTMLElement);
    this.router.addRoutes(routerList);
    this.router.start();
  }

  template(): string {
    return /*html*/ `
        <div class="w-full h-full">
            <main>
                <div id="router-provider">
                    
                </div>
            </main>
        </div>
      `;
  }
}
