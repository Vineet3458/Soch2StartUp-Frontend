import axios from "axios";

export const API_BASE = import.meta.env.VITE_API_URL || "/api";
const api = axios.create({ baseURL: API_BASE });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// An expired/invalid token anywhere logs the user out cleanly (AuthContext listens for this)
api.interceptors.response.use(
  (r) => r,
  (error) => {
    const url = error.config?.url || "";
    if (error.response?.status === 401 && !url.includes("/auth/login") && !url.includes("/auth/register")) {
      window.dispatchEvent(new Event("auth:expired"));
    }
    return Promise.reject(error);
  }
);

export const errMsg = (err) => err?.response?.data?.message || (err?.code === "ERR_NETWORK" ? "Cannot reach the server. Is the backend running?" : "Something went wrong");
export default api;
