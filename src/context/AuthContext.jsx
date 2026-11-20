import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import api from "../api/client.js";
import { clearCache, connectLive, disconnectLive } from "../lib/live.js";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(localStorage.getItem("token")));

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    clearCache();
    setUser(null);
  }, []);

  // Restore the session on page load
  useEffect(() => {
    if (!localStorage.getItem("token")) return;
    api.get("/auth/me")
      .then((r) => setUser(r.data.user))
      .catch((err) => {
        if (err.response?.status === 401 || err.response?.status === 403) {
          localStorage.removeItem("token");
        }
      })
      .finally(() => setLoading(false));
  }, []);

  // Token expired / revoked anywhere -> clean logout instead of a half-broken UI
  useEffect(() => {
    window.addEventListener("auth:expired", logout);
    return () => window.removeEventListener("auth:expired", logout);
  }, [logout]);

  // Open the live stream for as long as someone is signed in (and a public one for visitors)
  useEffect(() => {
    if (loading) return;
    connectLive(user ? localStorage.getItem("token") : null);
    return disconnectLive;
  }, [user?.id, loading]);

  const saveSession = (data) => { localStorage.setItem("token", data.token); clearCache(); setUser(data.user); return data.user; };
  const value = useMemo(() => ({
    user, loading, logout,
    login: async (email, password) => saveSession((await api.post("/auth/login", { email, password })).data),
    register: async (form) => saveSession((await api.post("/auth/register", form)).data),
    updateUser: (u) => setUser((prev) => ({ ...prev, ...u })),
  }), [user, loading, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
