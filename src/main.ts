import { App } from "./App";
import "./index.css";
import "./monacoWorker";

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
