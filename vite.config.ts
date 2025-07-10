import { defineConfig } from "vite";
import { resolve } from "path";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss()],
  server: {
    // proxy: {
    //   "/api": {
    //     target: "http://10.30.8.25:8080/api/v1",
    //     changeOrigin: true,
    //     rewrite: (path) => path.replace(/^\/api/, ""),
    //     // secure: true,
    //     configure: (proxy, options) => {
    //       proxy.on("error", (err, req, res) => {
    //         console.log("proxy error", err);
    //       });
    //       proxy.on("proxyReq", (proxyReq, req, res) => {
    //         console.log("🚀 Proxying request:", req.method, req.url);
    //         console.log(
    //           "🎯 Target URL:",
    //           `https://dropnote.onrender.com${req.url}`
    //         );
    //       });
    //       proxy.on("proxyRes", (proxyRes, req, res) => {
    //         console.log(
    //           "Received Response from the Target:",
    //           proxyRes.statusCode,
    //           req.url
    //         );
    //       });
    //     },
    //   },
    // },
    port: 5500,
    open: true,
    host: "0.0.0.0",
  },
  build: {
    rollupOptions: {},
  },
  define: {
    __APP_VERSION__: JSON.stringify("v1.0.0"),
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
});
