import { defineConfig, createLogger } from "vite";
import react from "@vitejs/plugin-react";
const logger = createLogger();
const originalError = logger.error;

// Suppress noisy SSE proxy disconnect errors (ECONNRESET/EPIPE) when client reloads,
// and provide clear guidance when backend is not running.
let lastNotice = 0;
logger.error = (msg, options) => {
  if (typeof msg === "string" && msg.includes("http proxy error")) {
    if (msg.includes("ECONNRESET") || msg.includes("EPIPE") || msg.includes("ERR_STREAM_PREMATURE_CLOSE")) {
      return;
    }
    if (msg.includes("ECONNREFUSED")) {
      const now = Date.now();
      if (now - lastNotice > 10000) {
        lastNotice = now;
        console.warn("\x1b[33m[vite proxy]\x1b[0m Cannot reach backend at http://127.0.0.1:5000. Ensure the backend server is running (`cd soch2startup-backend && npm run dev`).");
      }
      return;
    }
  }
  originalError(msg, options);
};

// In development, /api calls (including the live /api/events stream) are forwarded to the backend
export default defineConfig({
  customLogger: logger,
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
