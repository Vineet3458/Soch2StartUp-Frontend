import axios from "axios";

export const getApiBase = () => {
  // 1. Runtime URL query param override: ?api=https://...onrender.com (saves to localStorage)
  if (typeof window !== "undefined" && window.location?.search) {
    try {
      const params = new URLSearchParams(window.location.search);
      const queryApi = params.get("api");
      if (queryApi && /^https?:\/\//i.test(queryApi)) {
        const clean = queryApi.trim().replace(/\/+$/, "");
        const normalized = clean.endsWith("/api") ? clean : `${clean}/api`;
        localStorage.setItem("API_URL", normalized);
        return normalized;
      }
    } catch { /* ignore */ }
  }

  // 2. Runtime localStorage override
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem("API_URL");
      if (stored && /^https?:\/\//i.test(stored)) {
        const clean = stored.trim().replace(/\/+$/, "");
        return clean.endsWith("/api") ? clean : `${clean}/api`;
      }
    } catch { /* ignore */ }
  }

  // 3. Build-time Vite environment variable
  const rawApiUrl =
    typeof import.meta !== "undefined" && import.meta.env?.VITE_API_URL
      ? String(import.meta.env.VITE_API_URL).trim().replace(/\/+$/, "")
      : "";

  if (rawApiUrl) {
    return rawApiUrl.endsWith("/api") ? rawApiUrl : `${rawApiUrl}/api`;
  }

  // 4. Default relative /api (local development proxy or reverse proxy)
  return "/api";
};

export const API_BASE = getApiBase();

const api = axios.create({ baseURL: API_BASE });

api.interceptors.request.use((config) => {
  config.baseURL = getApiBase();
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Guard against HTML responses when an API endpoint was expected (e.g. Vercel SPA rewrite fallback)
api.interceptors.response.use(
  (r) => {
    if (
      typeof r.data === "string" &&
      r.data.trim().startsWith("<!DOCTYPE html") &&
      !r.config?.url?.includes("/health")
    ) {
      const isVercel = typeof window !== "undefined" && window.location?.hostname?.endsWith("vercel.app");
      const msg = isVercel
        ? "Frontend cannot reach the backend on Render. Set VITE_API_URL in your Vercel Dashboard -> Environment Variables (or add ?api=https://your-backend.onrender.com to the URL)."
        : "Cannot reach backend: received HTML instead of JSON API response.";
      const err = new Error(msg);
      err.response = { status: 502, data: { message: msg } };
      return Promise.reject(err);
    }
    return r;
  },
  (error) => {
    const url = error.config?.url || "";
    if (error.response?.status === 401 && !url.includes("/auth/login") && !url.includes("/auth/register")) {
      window.dispatchEvent(new Event("auth:expired"));
    }
    return Promise.reject(error);
  }
);

export const errMsg = (err) =>
  err?.response?.data?.message ||
  err?.response?.data?.error ||
  (err?.code === "ERR_NETWORK" ? "Cannot reach the server. Is the Render backend running?" : "Something went wrong");

export default api;
