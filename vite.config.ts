import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/create-payment-intent": {
        target: "http://localhost:3000",
        changeOrigin: true,
        rewrite: (path) =>
          path.replace(/^\/create-payment-intent/, "/create-payment-intent"),
        // remove any cookie header before it hits your API
        configure: (proxy) => {
          proxy.on("proxyReq", (proxyReq) => {
            proxyReq.removeHeader("cookie");
          });
        },
      },
    },
  },
});
