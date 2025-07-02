import type { RouteConfig } from "@/core/Router";
import { MainPage } from "@/pages/MainPage";

export const routerList: RouteConfig[] = [
  {
    path: "/",
    component: MainPage,
    name: "MainPage",
    exact: true,
  },
] as const;
