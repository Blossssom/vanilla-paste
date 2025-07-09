import { App } from "./App";
import "./index.css";
import "./monacoWorker";
import { apiService } from "./services/apiService";

document.addEventListener("DOMContentLoaded", async () => {
  console.log("DOM loaded, initializing app...");

  const appContainer = document.getElementById("app");

  if (!appContainer) {
    console.error("App container not found");
    return;
  }

  const app = new App();
  app.mount(appContainer);
});

// 페이지 언로드 시 진행 중인 API 요청 취소
window.addEventListener("beforeunload", () => {
  apiService.cancelAllRequests();
});

// 페이지 이동 시 진행 중인 API 요청 취소
window.addEventListener("popstate", () => {
  apiService.cancelAllRequests();
});
