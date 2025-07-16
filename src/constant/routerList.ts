import type { RouteConfig } from "@/core/Router";
import { MainPage } from "@/pages/MainPage";
import { ListPage } from "@/pages/ListPage";
import { DetailCodePage } from "@/pages/DetailCodePage";
import { ContactPage } from "@/pages/ContactPage";

export const routerList: RouteConfig[] = [
  {
    path: "/",
    component: MainPage,
    name: "MainPage",
    exact: true,
  },
  {
    path: "/list",
    component: ListPage,
    name: "ListPage",
    exact: true,
  },
  {
    path: "/detail",
    component: DetailCodePage,
    name: "DetailCodePage",
    exact: true,
  },
  {
    path: "/about",
    component: ContactPage,
    name: "ContactPage",
    exact: true,
  },
] as const;
