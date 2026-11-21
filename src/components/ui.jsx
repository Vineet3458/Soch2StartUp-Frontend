import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { AlertTriangle, CheckCircle2, Info, Loader2, Search, X, XCircle } from "lucide-react";
import { toastStore } from "../lib/toast.js";
import { initials, statusLabel } from "../lib/format.js";
import { errMsg } from "../api/client.js";
import { CountUp } from "./fx.jsx";
import { useNavigate } from "react-router-dom";
import { SpotlightCard } from "./aceternity/index.js";

const TONE_SPOTLIGHT = {
  purple: "rgba(168, 85, 247, 0.16)",
  cyan: "rgba(6, 182, 212, 0.16)",
  green: "rgba(34, 197, 94, 0.16)",
  orange: "rgba(249, 115, 22, 0.16)",
  pink: "rgba(236, 72, 153, 0.16)",
};

export function Button({ variant = "primary", size, icon: Icon, loading, children, className = "", ...p }) {
  const cls = ["btn", variant !== "primary" && `btn-${variant}`, size && `btn-${size}`, className].filter(Boolean).join(" ");
  return <button className={cls} disabled={loading || p.disabled} {...p}>{loading ? <Loader2 size={16} className="spin" /> : Icon && <Icon size={size === "sm" ? 15 : 17} />}{children}</button>;
}

export const Card = ({ children, className = "", hover, title, icon: Icon, sub, spotlight = false, spotlightColor, ...p }) => {
  const Comp = spotlight ? SpotlightCard : "div";
  return (
    <Comp
      className={`card ${hover ? "hover" : ""} ${className}`}
      {...(spotlight ? { spotlightColor } : {})}
      {...p}
    >
      {title && <div className="card-title">{Icon && <Icon size={18} color="var(--primary)" />}{title}{sub !== undefined && sub !== null && sub !== false && sub !== "" && <span className="sub">{sub}</span>}</div>}
      {children}
    </Comp>
  );
};

export const Badge = ({ kind, children, dot }) => <span className={`badge ${kind || ""}`}>{dot && <i className="dot" />}{children}</span>;
export const StatusBadge = ({ value, label }) => value ? <Badge kind={value} dot>{label || statusLabel(value) || value}</Badge> : null;
export const VerdictBadge = ({ verdict }) => verdict ? <Badge kind={verdict}>{verdict === "GO" ? "✓ GO" : verdict === "IMPROVE" ? "◐ IMPROVE" : "✕ AVOID"}</Badge> : null;

export function Avatar({ name = "?", size = 38 }) {
  const h = [...name].reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
  return <span className="avatar" style={{ "--s": `${size}px`, "--h": h }}>{initials(name)}</span>;
}

export function Stat({ icon: Icon, label, value, sub, subTone, tone = "purple", decimals = 0, suffix = "", to, spotlight = true, spotlightColor }) {
  const nav = useNavigate();
  const glow = spotlightColor || TONE_SPOTLIGHT[tone] || "rgba(0, 112, 243, 0.16)";
  const Comp = spotlight ? SpotlightCard : "div";
  return (
    <Comp
      className={`card stat hover g-${tone} ${to ? "link" : ""}`}
      {...(spotlight ? { spotlightColor: glow } : {})}
      onClick={to ? () => nav(to) : undefined}
    >
      <div className="ico">{Icon && <Icon size={24} />}</div>
      <div className="grow">
        <div className="lbl">{label}</div>
        <div className="val">{typeof value === "number" ? <CountUp value={value} decimals={decimals} suffix={suffix} /> : value}</div>
        {sub && <div className={`sub ${subTone || ""}`}>{sub}</div>}
      </div>
    </Comp>
  );
}

export function PageHeader({ title, subtitle, children }) {
  return <div className="page-head"><div><h1>{title}</h1>{subtitle && <p>{subtitle}</p>}</div><div className="row wrap">{children}</div></div>;
}

export function Tabs({ tabs, value, onChange }) {
  return (
    <div className="tabs" role="tablist">
      {tabs.map((t) => <button key={t.id} role="tab" className={`tab ${value === t.id ? "on" : ""}`} onClick={() => onChange(t.id)}>{t.icon && <t.icon size={15} />}{t.label}{t.count !== undefined && <span className="count">{t.count}</span>}</button>)}
    </div>
  );
}

export function Modal({ open, onClose, title, children, footer, width = 560 }) {
  useEffect(() => {
    if (!open) return;
    const k = (e) => e.key === "Escape" && onClose?.();
    document.addEventListener("keydown", k);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", k); document.body.style.overflow = ""; };
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose?.()}>
      <div className="modal" style={{ maxWidth: width }} role="dialog" aria-modal="true" aria-label={title}>
        <div className="modal-head"><h3>{title}</h3><button className="icon-btn" onClick={onClose} aria-label="Close"><X size={18} /></button></div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-foot">{footer}</div>}
      </div>
    </div>
  );
}

export const Field = ({ label, hint, htmlFor, children, className = "" }) => <div className={`field ${className}`}>{label && <label htmlFor={htmlFor}>{label}</label>}{children}{hint && <span className="hint">{hint}</span>}</div>;
export const Toggle = ({ checked, onChange, disabled, label }) => <button type="button" role="switch" aria-checked={checked} aria-label={label} className={`toggle ${checked ? "on" : ""}`} disabled={disabled} onClick={() => onChange(!checked)} />;
export const Slider = ({ value, onChange, min = 0, max = 100, step = 1 }) => <input type="range" min={min} max={max} step={step} value={value} style={{ "--p": `${((value - min) / (max - min)) * 100}%` }} onChange={(e) => onChange(Number(e.target.value))} />;

export function SearchBox({ value, onChange, placeholder = "Search…" }) {
  return <div className="input-icon"><Search size={17} /><input className="input" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} aria-label={placeholder} /></div>;
}

export const Empty = ({ icon: Icon, title, children }) => <div className="empty"><div className="ico">{Icon && <Icon size={30} />}</div><h3>{title}</h3><div>{children}</div></div>;
export const Loader = ({ text = "Loading…" }) => <div className="loader"><div className="spinner" /><span>{text}</span></div>;
export const Progress = ({ value }) => <div className="progress"><i style={{ width: `${Math.max(0, Math.min(100, value))}%` }} /></div>;
export const Alert = ({ kind = "info", children }) => <div className={`alert ${kind}`}>{kind === "error" ? <XCircle size={18} /> : kind === "success" ? <CheckCircle2 size={18} /> : kind === "warning" ? <AlertTriangle size={18} /> : <Info size={18} />}<div>{children}</div></div>;

export function SkeletonGrid({ n = 4, h = 90, cols = "g4" }) {
  return <div className={`grid ${cols}`}>{Array.from({ length: n }, (_, i) => <div key={i} className="skeleton" style={{ height: h }} />)}</div>;
}

// Shows a skeleton while the first fetch is in flight
export function Async({ q, children, skeleton, empty }) {
  if (q.loading && q.data === undefined) return skeleton || <Loader />;
  if (q.error && q.data === undefined) return <Alert kind="error">{errMsg(q.error)}</Alert>;
  if (empty && Array.isArray(q.data) && !q.data.length) return empty;
  return children(q.data);
}

export function useClickOutside(onOut) {
  const ref = useRef(null);
  useEffect(() => {
    const h = (e) => ref.current && !ref.current.contains(e.target) && onOut();
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [onOut]);
  return ref;
}

/* ── Toaster ── */
export function Toaster() {
  const items = useSyncExternalStore(toastStore.subscribe, toastStore.get);
  const nav = useNavigate();
  const Icon = { success: CheckCircle2, error: XCircle, warning: AlertTriangle, info: Info };
  return (
    <div className="toasts" aria-live="polite">
      {items.map((t) => { const I = Icon[t.type]; return (
        <div key={t.id} className={`toast ${t.type}`} onClick={() => { toastStore.dismiss(t.id); if (t.link) nav(t.link); }}>
          <I className="ico" size={20} /><div><b>{t.title}</b>{t.message && <span>{t.message}</span>}</div>
        </div>); })}
    </div>
  );
}

/* ── Promise-based confirm dialog (replaces window.confirm) ── */
let confirmState = null; const confirmSubs = new Set();
const setConfirm = (s) => { confirmState = s; confirmSubs.forEach((f) => f()); };
export const confirmDialog = (opts) => new Promise((resolve) => setConfirm({ ...opts, resolve }));
export function ConfirmHost() {
  const s = useSyncExternalStore((cb) => { confirmSubs.add(cb); return () => confirmSubs.delete(cb); }, () => confirmState);
  const [text, setText] = useState("");
  useEffect(() => setText(""), [s]);
  const close = (v) => { s.resolve(v); setConfirm(null); };
  return (
    <Modal open={Boolean(s)} onClose={() => close(s?.input ? null : false)} title={s?.title || "Are you sure?"} width={460}
      footer={<><Button variant="outline" onClick={() => close(s.input ? null : false)}>Cancel</Button><Button variant={s?.danger ? "danger" : "primary"} disabled={s?.input && s.required && !text.trim()} onClick={() => close(s.input ? text.trim() : true)}>{s?.confirmText || "Confirm"}</Button></>}>
      <p className="muted">{s?.message}</p>
      {s?.input && <Field className="mt-s"><textarea className="input" autoFocus value={text} onChange={(e) => setText(e.target.value)} placeholder={s.placeholder || "Add a note…"} /></Field>}
    </Modal>
  );
}
