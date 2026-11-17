import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import api from "../api/client.js";
import { useAuth } from "./AuthContext.jsx";
import { useLive } from "../lib/live.js";

const ConfigContext = createContext(null);
export const useConfig = () => useContext(ConfigContext);

const FALLBACK = { platform: { name: "Soch2Startup", tagline: "Turn your startup idea into a scalable business", registrationOpen: true, maintenance: {}, banner: {} }, features: {}, categories: [], permissions: [], scoring: { thresholds: { go: 70, improve: 50 }, weights: {} } };

export function ConfigProvider({ children }) {
  const { user, updateUser } = useAuth();
  // Logged-in users get permissions + scoring thresholds; visitors get the public subset. Both update live.
  const app = useLive("/config/app", { skip: !user });
  const pub = useLive("/config/public", { skip: Boolean(user) });
  const cfg = (user ? app.data : pub.data) || FALLBACK;

  const [theme, setThemeState] = useState(() => localStorage.getItem("theme") || "dark");
  useEffect(() => { document.documentElement.dataset.theme = theme; localStorage.setItem("theme", theme); }, [theme]);
  useEffect(() => { if (user?.prefs?.theme && user.prefs.theme !== theme) setThemeState(user.prefs.theme); }, [user?.id]);
  useEffect(() => { document.title = `${cfg.platform.name} – ${cfg.platform.tagline}`; }, [cfg.platform.name, cfg.platform.tagline]);

  const setTheme = useCallback((t) => {
    setThemeState(t);
    if (user) api.patch("/auth/me", { prefs: { theme: t } }).then((r) => updateUser(r.data.user)).catch(() => {});
  }, [user, updateUser]);

  const value = useMemo(() => ({
    ...cfg,
    ready: Boolean(user ? app.data || app.error : pub.data || pub.error),
    theme, setTheme,
    can: (perm) => user?.role === "superadmin" || (cfg.permissions || []).includes(perm),
    feature: (name) => cfg.features?.[name] !== false,
  }), [cfg, theme, setTheme, user, app.data, pub.data, app.error, pub.error]);

  return <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>;
}
