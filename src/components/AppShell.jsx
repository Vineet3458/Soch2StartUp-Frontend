import { Suspense, useEffect, useMemo, useState } from "react";
import { Link, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { Bell, CheckCheck, ChevronRight, LogOut, Megaphone, Menu, Moon, Sun, User as UserIcon, Settings, Wrench, Lock, SearchX } from "lucide-react";
import api from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useConfig } from "../context/ConfigContext.jsx";
import { act, useLive, useLiveStatus } from "../lib/live.js";
import { ago, roleLabel } from "../lib/format.js";
import { navFor, Overview, ROUTES } from "../views/registry.jsx";
import { BrandMark, BrandName } from "./Brand.jsx";
import { Avatar, Empty, Loader, useClickOutside } from "./ui.jsx";

/* ── Sidebar ── */
const matches = (to, loc) => {
  const [p, qs] = to.split("?");
  if (loc.pathname.replace(/\/$/, "") !== p.replace(/\/$/, "")) return false;
  const want = new URLSearchParams(qs || ""), have = new URLSearchParams(loc.search);
  if (qs) return [...want].every(([k, v]) => have.get(k) === v);
  return !["f", "s", "kind", "saved"].some((k) => have.has(k));
};

function Sidebar({ open, onClose }) {
  const { user } = useAuth();
  const cfg = useConfig();
  const loc = useLocation();
  const nav = navFor(user.role);
  const badges = useLive("/stats/badges").data || {};
  const [expanded, setExpanded] = useState({});
  const visible = (i) => (!i.feature || cfg.feature(i.feature)) && (!i.perm || cfg.can(i.perm));
  const CardIcon = nav.card.icon;

  return (
    <>
      <div className={`sb-overlay ${open ? "open" : ""}`} onClick={onClose} />
      <aside className={`sidebar ${open ? "open" : ""}`} aria-label="Main navigation">
        <Link to="/" className="sb-brand"><BrandMark /><BrandName name={cfg.platform.name} /></Link>
        <div className="role-card"><Avatar name={user.name} size={40} /><div className="grow"><div className="t truncate">{user.name}</div><div className="s truncate">{nav.card.sub}</div></div><CardIcon size={18} color="var(--primary)" /></div>
        <nav className="sb-scroll">
          {nav.sections.map((s) => {
            const items = s.items.filter(visible);
            if (!items.length) return null;
            return (
              <div key={s.title}>
                <div className="nav-title">{s.title}</div>
                {items.map((it) => {
                  const Icon = it.icon;
                  const count = it.badge ? badges[it.badge] : 0;
                  if (!it.children) return (
                    <Link key={it.label} to={it.to} className={`nav-item ${matches(it.to, loc) ? "active" : ""}`} onClick={onClose}><Icon size={19} />{it.label}{count > 0 && <span className="nb">{count}</span>}</Link>
                  );
                  const childActive = it.children.some((c) => matches(c.to, loc));
                  const isOpen = expanded[it.label] ?? childActive;
                  return (
                    <div key={it.label}>
                      <button className={`nav-item ${isOpen ? "open" : ""} ${childActive ? "active" : ""}`} onClick={() => setExpanded((e) => ({ ...e, [it.label]: !isOpen }))} aria-expanded={isOpen}>
                        <Icon size={19} />{it.label}{count > 0 && <span className="nb" style={{ marginLeft: "auto" }}>{count}</span>}<ChevronRight size={16} className="chev" style={count > 0 ? { marginLeft: 8 } : undefined} />
                      </button>
                      <div className={`nav-sub ${isOpen ? "open" : ""}`}><div>
                        {it.children.map((c) => <Link key={c.label} to={c.to} className={`nav-item ${matches(c.to, loc) ? "active" : ""}`} onClick={onClose}>{c.label}</Link>)}
                      </div></div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </nav>
        <div className="sb-foot small muted">v2.0 · {roleLabel(user.role)}</div>
      </aside>
    </>
  );
}

/* ── Notification bell ── */
const NOTIF_COLOR = { success: "var(--success)", warning: "var(--warning)", feedback: "var(--accent)", session: "var(--info)", system: "var(--primary)" };
function Bell_() {
  const [open, setOpen] = useState(false);
  const ref = useClickOutside(() => setOpen(false));
  const nav = useNavigate();
  const q = useLive("/notifications");
  const items = q.data?.items || [], unread = q.data?.unread || 0;
  const go = async (n) => { if (!n.read) await act(() => api.patch(`/notifications/${n._id}/read`)); setOpen(false); if (n.link) nav(n.link); };
  return (
    <div style={{ position: "relative" }} ref={ref}>
      <button className="icon-btn" onClick={() => setOpen(!open)} aria-label={`Notifications (${unread} unread)`}><Bell size={19} />{unread > 0 && <span className="pip">{unread > 99 ? "99+" : unread}</span>}</button>
      {open && (
        <div className="menu notif">
          <div className="row between" style={{ padding: "14px 16px", borderBottom: "1px solid var(--border)" }}>
            <b>Notifications</b>
            {unread > 0 && <button className="btn btn-ghost btn-sm" onClick={() => act(() => api.post("/notifications/read-all"))}><CheckCheck size={14} /> Mark all read</button>}
          </div>
          <div className="notif-list">
            {!items.length && <div className="empty" style={{ padding: 36 }}>You're all caught up 🎉</div>}
            {items.slice(0, 8).map((n) => (
              <div key={n._id} className={`notif-item ${n.read ? "" : "unread"}`} onClick={() => go(n)}>
                <div className="notif-ico" style={{ color: NOTIF_COLOR[n.type] }}><Bell size={16} /></div>
                <div className="grow"><div style={{ fontWeight: 600, fontSize: 14 }}>{n.title}</div>{n.message && <div className="small muted truncate">{n.message}</div>}<div className="tiny faint">{ago(n.createdAt)}</div></div>
              </div>))}
          </div>
          <Link to="/app/notifications" onClick={() => setOpen(false)} className="menu-item" style={{ justifyContent: "center", margin: 6, color: "var(--primary)" }}>View all notifications</Link>
        </div>
      )}
    </div>
  );
}

function UserMenu() {
  const { user, logout } = useAuth();
  const cfg = useConfig();
  const [open, setOpen] = useState(false);
  const ref = useClickOutside(() => setOpen(false));
  return (
    <div style={{ position: "relative" }} ref={ref}>
      <button className="row" style={{ background: "none", border: "none", color: "var(--text)", gap: 10 }} onClick={() => setOpen(!open)} aria-label="Account menu">
        <Avatar name={user.name} size={38} /><div className="hide-m" style={{ textAlign: "left", lineHeight: 1.2 }}><div style={{ fontWeight: 600, fontSize: 14 }}>{user.name}</div><div className="tiny muted">{roleLabel(user.role)}</div></div>
      </button>
      {open && (
        <div className="menu" onClick={() => setOpen(false)}>
          <Link to="/app/profile" className="menu-item"><UserIcon size={16} /> My profile</Link>
          <Link to="/app/account" className="menu-item"><Settings size={16} /> Account settings</Link>
          <button className="menu-item" onClick={(e) => { e.stopPropagation(); cfg.setTheme(cfg.theme === "dark" ? "light" : "dark"); }}>{cfg.theme === "dark" ? <Sun size={16} /> : <Moon size={16} />} {cfg.theme === "dark" ? "Light" : "Dark"} theme</button>
          <hr className="divider" style={{ margin: "6px 0" }} />
          <button className="menu-item" onClick={logout} style={{ color: "var(--danger)" }}><LogOut size={16} /> Sign out</button>
        </div>
      )}
    </div>
  );
}

export function LivePill() {
  const s = useLiveStatus();
  return <span className="live-pill" title="Changes made by anyone appear here instantly"><i className={`dot-live ${s === "live" ? "" : s === "connecting" ? "wait" : "off"}`} /><span className="hide-m">{s === "live" ? "Live" : s === "connecting" ? "Reconnecting…" : "Offline"}</span></span>;
}

export function PlatformBanner({ admin }) {
  const { platform } = useConfig();
  return (
    <>
      {platform.maintenance?.enabled && admin && <div className="banner warning"><Wrench size={16} /> Maintenance mode is ON – only admins can sign in. {platform.maintenance.message}</div>}
      {platform.banner?.enabled && platform.banner.text && <div className={`banner ${platform.banner.tone}`}><Megaphone size={16} /> {platform.banner.text}</div>}
    </>
  );
}

const Blocked = ({ icon: I, title, text }) => <Empty icon={I} title={title}>{text}<div className="mt"><Link to="/app" className="btn">Back to dashboard</Link></div></Empty>;

/* ── Shell ── */
export default function AppShell() {
  const { user } = useAuth();
  const cfg = useConfig();
  const loc = useLocation();
  const [open, setOpen] = useState(false);
  useEffect(() => { setOpen(false); window.scrollTo({ top: 0 }); }, [loc.pathname]);

  const title = useMemo(() => {
    const items = navFor(user.role).sections.flatMap((s) => s.items.flatMap((i) => [i, ...(i.children || [])]));
    return (items.find((i) => i.to && matches(i.to, loc)) || items.find((i) => i.to === loc.pathname) || {}).label || (loc.pathname.startsWith("/app/ideas/") ? "Idea details" : undefined);
  }, [user.role, loc]);

  if (!cfg.ready) return <Loader text="Loading your workspace…" />; // permissions must be known before gating pages
  const allowed = (r) => r.roles.includes(user.role) && (!r.feature || cfg.feature(r.feature)) && (!r.perm || cfg.can(r.perm));
  return (
    <div className="shell">
      <Sidebar open={open} onClose={() => setOpen(false)} />
      <div className="main">
        <PlatformBanner admin={["admin", "superadmin"].includes(user.role)} />
        <header className="topbar">
          <button className="icon-btn mobile-only" onClick={() => setOpen(true)} aria-label="Open menu"><Menu size={20} /></button>
          <div className="grow"><div className="tiny faint hide-m">{cfg.platform.name}</div><b style={{ fontFamily: "var(--font-display)", fontSize: 17 }}>{title || "Dashboard"}</b></div>
          <LivePill />
          <button className="icon-btn" onClick={() => cfg.setTheme(cfg.theme === "dark" ? "light" : "dark")} aria-label="Toggle theme">{cfg.theme === "dark" ? <Sun size={19} /> : <Moon size={19} />}</button>
          <Bell_ />
          <UserMenu />
        </header>
        <div className="stage page-enter" key={loc.pathname}>
          <Suspense fallback={<Loader />}>
            <Routes>
              <Route index element={<Overview />} />
              {ROUTES.map((r) => (
                <Route key={r.path} path={r.path} element={allowed(r) ? <r.C {...(r.props || {})} /> : r.roles.includes(user.role) ? <Blocked icon={Lock} title="Not available" text="This feature is disabled or your role does not currently have access." /> : <Blocked icon={Lock} title="Access restricted" text="Your role does not have access to this page." />} />
              ))}
              <Route path="*" element={<Blocked icon={SearchX} title="Page not found" text="That page does not exist." />} />
            </Routes>
          </Suspense>
        </div>
      </div>
    </div>
  );
}
