// ─────────────────────────────────────────────────────────────────────────────
// Live data layer.
//  • useLive(path) fetches a resource and shares it between every component that asks for it.
//  • The server pushes "change" events over Server-Sent Events whenever ANY user changes data.
//  • A change event re-fetches every on-screen query that depends on that topic, so every module
//    (dashboards, tables, sidebar badges, charts) updates without a page refresh.
// ─────────────────────────────────────────────────────────────────────────────
import { useCallback, useEffect, useRef, useSyncExternalStore } from "react";
import api, { API_BASE } from "../api/client.js";
import { toast } from "./toast.js";

const ALL = ["ideas", "users", "assignments", "feedback", "sessions", "reports", "requests", "resources", "config", "logs", "notifications"];
// Which server topics invalidate which endpoint
const TOPICS = [
  ["/stats", ALL], ["/system", ALL], ["/ideas", ["ideas", "assignments", "feedback", "sessions", "requests", "reports"]],
  ["/assignments", ["assignments", "ideas"]], ["/feedback", ["feedback", "ideas", "assignments"]], ["/sessions", ["sessions", "ideas"]],
  ["/users", ["users", "assignments", "ideas"]], ["/requests", ["requests", "ideas", "users"]], ["/reports", ["reports", "ideas", "feedback", "users"]],
  ["/resources", ["resources"]], ["/logs", ["logs"]], ["/config", ["config"]], ["/notifications", ["notifications"]],
];
const topicsFor = (path) => (TOPICS.find(([p]) => path.startsWith(p)) || [null, [path.split("/")[1]]])[1];

const cache = new Map(); // key -> { data, error, loading }
const subs = new Map(); // key -> Set<fn>
const active = new Map(); // key -> { path, params, refs, topics }
const EMPTY = Object.freeze({ data: undefined, error: null, loading: true });

const keyOf = (path, params) => path + (params && Object.keys(params).length ? "?" + new URLSearchParams(params).toString() : "");
const notify = (key) => subs.get(key)?.forEach((f) => f());
const setEntry = (key, patch) => { cache.set(key, { ...(cache.get(key) || EMPTY), ...patch }); notify(key); };

const fetchKey = async (key) => {
  const a = active.get(key);
  if (!a) return;
  try {
    const { data } = await api.get(a.path, { params: a.params });
    setEntry(key, { data, error: null, loading: false });
  } catch (error) {
    setEntry(key, { error, loading: false });
  }
};

export const useLive = (path, { params, skip = false, poll = 0 } = {}) => {
  const key = keyOf(path, params);
  const paramsRef = useRef(params);
  paramsRef.current = params;

  useEffect(() => {
    if (skip || !path) return;
    const entry = active.get(key) || { path, params: paramsRef.current, refs: 0, topics: topicsFor(path) };
    entry.refs++;
    active.set(key, entry);
    fetchKey(key); // always revalidate on mount (stale-while-revalidate)
    const timer = poll ? setInterval(() => fetchKey(key), poll) : null;
    return () => {
      clearInterval(timer);
      entry.refs--;
      if (entry.refs <= 0) active.delete(key);
    };
  }, [key, skip, poll, path]);

  const snapshot = useSyncExternalStore(
    useCallback((cb) => { if (!subs.has(key)) subs.set(key, new Set()); subs.get(key).add(cb); return () => subs.get(key)?.delete(cb); }, [key]),
    () => cache.get(key) || EMPTY
  );
  const refresh = useCallback(() => fetchKey(key), [key]);
  return skip ? { data: undefined, loading: false, error: null, refresh } : { ...snapshot, refresh };
};

// Re-fetch everything on screen that depends on one of these topics (debounced)
let pending = new Set();
let flushTimer = null;
export const invalidate = (topics = ALL) => {
  topics.forEach((t) => pending.add(t));
  clearTimeout(flushTimer);
  flushTimer = setTimeout(() => {
    const t = pending; pending = new Set();
    for (const [key, a] of active) if (a.topics.some((x) => t.has(x))) fetchKey(key);
  }, 80);
};

export const clearCache = () => { cache.clear(); };

/* ── connection (Server-Sent Events) ───────────────────────────────────────── */
let es = null;
let status = "offline";
const statusSubs = new Set();
const setStatus = (s) => { status = s; statusSubs.forEach((f) => f()); };
export const useLiveStatus = () => useSyncExternalStore((cb) => { statusSubs.add(cb); return () => statusSubs.delete(cb); }, () => status);

export const connectLive = (token) => {
  disconnectLive();
  setStatus("connecting");
  const url = `${API_BASE}/events${token ? `?token=${encodeURIComponent(token)}` : ""}`;
  es = new EventSource(url);
  let opened = false;
  es.addEventListener("ready", () => { setStatus("live"); if (opened) invalidate(); opened = true; }); // catch up after a reconnect
  es.addEventListener("change", (e) => { try { invalidate([JSON.parse(e.data).topic]); } catch { /* ignore */ } });
  es.addEventListener("toast", (e) => {
    try { const t = JSON.parse(e.data); toast[t.type === "success" ? "success" : t.type === "warning" ? "warning" : "info"](t.title, t.message, { link: t.link }); } catch { /* ignore */ }
  });
  es.onerror = () => setStatus(es?.readyState === EventSource.CLOSED ? "offline" : "connecting");
};

export const disconnectLive = () => { es?.close(); es = null; setStatus("offline"); };

/* ── mutations ─────────────────────────────────────────────────────────────── */
// Runs an API call, shows success/error toasts and refreshes dependent data immediately.
export const act = async (fn, success) => {
  try {
    const res = await fn();
    if (success) toast.success(success);
    invalidate();
    return res?.data ?? true;
  } catch (err) {
    toast.error(err?.response?.data?.message || "Something went wrong");
    return undefined;
  }
};
