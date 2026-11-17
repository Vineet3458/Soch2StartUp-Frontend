import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// In development, /api calls (including the live /api/events stream) are forwarded to the backend
export default defineConfig({
  plugins: [react()],
  server: { port: 5173, proxy: { "/api": { target: process.env.VITE_PROXY_TARGET || "http://localhost:5000", changeOrigin: true } } },
  build: { chunkSizeWarningLimit: 900 },
});
