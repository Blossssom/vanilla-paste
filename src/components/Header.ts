import { Component } from "@/core/Component";
import { useRouter } from "@/core/Router";

interface HeaderState {
  currentPath: string;
}

export class Header extends Component<{}, HeaderState> {
  private router = useRouter();
  constructor() {
    super();
    this.state = {
      currentPath: this.router.getCurrentRoute()?.path || "/",
    };
  }

  protected onMounted(): void | Promise<void> {
    this.setupNavigation();
  }

  template(): string {
    return /*html */ `
      <header class=" text-white p-4">
       <div class="flex items-center justify-between">
        <h1 class="text-2xl font-bold">LOGO</h1>
        <nav>
          <ul class="flex gap-4 items-center font-bold">
            <li><button id="home-navigation" class="text-gray-300 hover:text-white">Home</Button></li>
            <li><button id="list-navigation" class="text-gray-300 hover:text-white">List</Button></li>
          </ul>
        </nav>
       </div>
      </header>
    `;
  }

  private setupNavigation(): void {
    this.addEventListenerSafe({
      element: this.$container!,
      event: "click",
      handler: (event) => {
        const target = event.target as HTMLElement;

        switch (target.id) {
          case "home-navigation": {
            this.handleNavigate("/");
            break;
          }
          case "list-navigation": {
            this.handleNavigate("/list");
            break;
          }
        }
      },
    });
  }

  private handleNavigate(path: string): void {
    try {
      if (this.state.currentPath === path) {
        console.log("inner if");
        return;
      }

      this.setState({ currentPath: path });
      this.router.push(path);
    } catch (err) {
      console.error("Error navigating to path:", path, err);
    }
  }
}
