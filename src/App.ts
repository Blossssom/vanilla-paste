import { Component } from "./core/Component";
import { createRouter } from "./core/Router";
import { routerList } from "@/constant/routerList";
import { Header } from "@/components/Header";

export class App extends Component {
  private router = createRouter(document.createElement("div"));
  constructor() {
    super();
  }

  protected mountChildren(): void {
    this.setupRouter();

    this.addChild(Header, {}, "#header", "header");
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
        <div class="w-full h-full flex flex-col items-center relative">
            <div id="header" class="w-full max-w-5xl">
            </div>
            <main class="w-full max-w-5xl relative">
              <div class="gradient-wrapper">
                <div class="gradient-item first"></div>
                <div class="gradient-item second"></div>
                <div class="gradient-item third"></div>
              </div>
              <div id="router-provider">
                  
              </div>
            </main>
        </div>
      `;
  }
}
