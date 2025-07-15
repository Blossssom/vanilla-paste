import { Component } from "./Component";

interface RouteInfo {
  path: string;
  params: Record<string, string>;
  query: Record<string, string>;
  name?: string;
  meta?: Record<string, any>;
}

export interface RouteConfig {
  path: string;
  component: new (props?: any) => Component<any, any>;
  name?: string;
  meta?: Record<string, any>;
  exact?: boolean;
  beforeEnter?: (to: RouteInfo, from: RouteInfo) => boolean | Promise<boolean>;
}

type RouterEventType = "beforeRouteChange" | "afterRouteChange" | "routeError";

export class Router {
  private routes: RouteConfig[] = [];
  private currentRoute: RouteInfo | null = null;
  private currentComponent: Component | null = null;
  private $container: HTMLElement | null = null;
  private listeners: Map<RouterEventType, Array<(data: any) => void>> =
    new Map();
  private popstateHandler: (() => void) | null = null;

  constructor(container: HTMLElement) {
    this.$container = container;
    this.init();
  }

  private init(): void {
    this.listeners.set("beforeRouteChange", []);
    this.listeners.set("afterRouteChange", []);
    this.listeners.set("routeError", []);

    this.popstateHandler = this.handleRouteChange.bind(this);
    window.addEventListener("popstate", this.popstateHandler);
  }

  private async handleRouteChange(): Promise<void> {
    const path = this.getCurrentPath();
    const matchedRoute = this.matchRoute(path);

    if (!matchedRoute) {
      this.emit("routeError", { path, error: "No matching route found" });
      return;
    }

    const newRouteInfo = this.parseRoute(path, matchedRoute);
    const oldRouteInfo = this.currentRoute;

    this.emit("beforeRouteChange", { to: newRouteInfo, from: oldRouteInfo });

    if (matchedRoute.beforeEnter) {
      try {
        const ableToEnter = await matchedRoute.beforeEnter(
          newRouteInfo,
          oldRouteInfo || this.createEmptyRoute()
        );

        if (!ableToEnter) {
          return;
        }
      } catch (err) {
        this.emit("routeError", { path, error: err });
        return;
      }
    }

    if (this.currentComponent) {
      this.currentComponent.unmount();
      this.currentComponent = null;
    }

    try {
      this.currentComponent = new matchedRoute.component();
      this.currentComponent.mount(this.$container!);
      this.currentRoute = newRouteInfo;

      this.emit("afterRouteChange", { to: newRouteInfo, from: oldRouteInfo });
    } catch (err) {
      this.emit("routeError", { path, error: err });
      this.currentRoute = null;
      this.currentComponent = null;
    }
  }

  private matchRoute(path: string): RouteConfig | null {
    // query 스트링을 제거하고 경로만 추출
    const [pathname] = path.split("?");

    const exactMatch = this.routes.find((route) =>
      this.pathMatches(route.path, pathname, "exact")
    );

    if (exactMatch) {
      return exactMatch;
    }

    return (
      this.routes.find((route) =>
        this.pathMatches(route.path, pathname, "prefix")
      ) || null
    );
  }

  private pathMatches(
    routePath: string,
    currentPath: string,
    mode: "exact" | "prefix" = "exact"
  ): boolean {
    const routeSegments = routePath.split("/");
    const pathSegments = currentPath.split("/");

    if (mode === "exact") {
      if (routeSegments.length !== pathSegments.length) {
        return false;
      }
    } else if (mode === "prefix") {
      if (routeSegments.length > pathSegments.length) {
        return false;
      }
    }

    return routeSegments.every((segment, idx) => {
      if (segment.startsWith(":")) {
        // 파라미터인 경우
        return true;
      }

      return segment === pathSegments[idx];
    });
  }

  private parseRoute(path: string, route: RouteConfig): RouteInfo {
    const [pathname, search] = path.split("?");
    const query = this.parseQueryString(search || "");
    const params = this.extractParams(route.path, pathname);
    return {
      path: pathname,
      params,
      query,
      name: route.name,
      meta: route.meta,
    };
  }

  private parseQueryString(search: string): Record<string, string> {
    const params = new URLSearchParams(search);
    const query: Record<string, string> = {};

    for (const [key, value] of params) {
      query[key] = value;
    }

    return query;
  }

  private extractParams(
    routePath: string,
    currentPath: string
  ): Record<string, string> {
    const routeSegments = routePath.split("/");
    const pathSegments = currentPath.split("/");

    const params: Record<string, string> = {};

    routeSegments.forEach((segment, idx) => {
      if (segment.startsWith(":")) {
        // 파라미터인 경우
        const paramName = segment.slice(1);
        params[paramName] = pathSegments[idx] || "";
      }
    });

    return params;
  }

  private createEmptyRoute(): RouteInfo {
    return {
      path: "",
      params: {},
      query: {},
    };
  }

  private emit(event: RouterEventType, data: any): void {
    this.listeners.get(event)?.forEach((callback) => callback(data));
  }

  public on(event: RouterEventType, callback: (data: any) => void): void {
    this.listeners.get(event)?.push(callback);
  }

  public off(event: RouterEventType, callback: (data: any) => void): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  public start(): void {
    this.handleRouteChange();
  }

  public destroy(): void {
    if (this.currentComponent) {
      this.currentComponent.unmount();
      this.currentComponent = null;
    }

    if (this.popstateHandler) {
      window.removeEventListener("popstate", this.popstateHandler);
      this.popstateHandler = null;
    }
  }

  /**
   *
   * @returns query 스트링을 포함한 현재 경로
   */
  public getCurrentPath(): string {
    return window.location.pathname + window.location.search;
  }

  public getQueryParams(): Record<string, string> {
    const search = window.location.search;
    return this.parseQueryString(search);
  }

  public getCurrentRoute(): RouteInfo | null {
    return this.currentRoute;
  }

  public addRoute(config: RouteConfig): void {
    this.routes.push(config);
  }

  public addRoutes(configs: RouteConfig[]): void {
    this.routes.push(...configs);
  }

  public push(path: string): void {
    if (this.getCurrentPath() === path) {
      return;
    }

    window.history.pushState(null, "", path);
    this.handleRouteChange();
  }

  public replace(path: string): void {
    window.history.replaceState(null, "", path);
  }

  public go(delta: number): void {
    window.history.go(delta);
  }

  public back(): void {
    window.history.back();
  }

  public forward(): void {
    window.history.forward();
  }
}

// instance function

let globalRouter: Router | null = null;

export function createRouter(container: HTMLElement): Router {
  globalRouter = new Router(container);
  return globalRouter;
}

export function useRouter(): Router {
  if (!globalRouter) {
    throw new Error(
      "Router is not initialized. Please call createRouter first."
    );
  }
  return globalRouter;
}

// helper component
export abstract class RoutableComponent extends Component {
  protected get $router(): Router {
    return useRouter();
  }

  protected get $route(): RouteInfo | null {
    return this.$router.getCurrentRoute();
  }

  protected navigateTo(path: string): void {
    this.$router.push(path);
  }

  protected replaceRoute(path: string): void {
    this.$router.replace(path);
  }

  protected goBack(): void {
    this.$router.back();
  }
}
