import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// In development, /api calls (including the live /api/events stream) are forwarded to the backend
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: process.env.VITE_PROXY_TARGET || "http://localhost:5000",
        changeOrigin: true,
        ws: true,
        configure: (proxy) => {
          proxy.on("error", (err, _req, res) => {
            if (err.code === "ECONNRESET" || err.code === "EPIPE" || err.code === "ECONNABORTED") return;
            if (res && !res.headersSent && typeof res.writeHead === "function") {
              res.writeHead(502, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ message: "Backend service unreachable" }));
            }
          });
        },
      },
    },
  },
  build: { chunkSizeWarningLimit: 900 },
});
