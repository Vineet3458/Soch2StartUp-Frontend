import { useState } from "react";
import { Link } from "react-router-dom";
import { Bell, Check, CheckCheck, KeyRound, Moon, Sun, Trash2, UserCog } from "lucide-react";
import api from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useConfig } from "../context/ConfigContext.jsx";
import { act, useLive } from "../lib/live.js";
import { ago, fmtDate, roleLabel } from "../lib/format.js";
import { Alert, Async, Avatar, Badge, Button, Card, Empty, Field, PageHeader, StatusBadge, Tabs, Toggle } from "../components/ui.jsx";
import { toast } from "../lib/toast.js";
import { errMsg } from "../api/client.js";
import { isPasswordValid, isBreachedPassword } from "../pages/Auth.jsx";

export default function AccountViews({ page }) {
  return page === "notifications" ? <Notifications /> : page === "profile" ? <Profile /> : <Settings />;
}

function Notifications() {
  const q = useLive("/notifications");
  const [tab, setTab] = useState("all");
  const items = (q.data?.items || []).filter((n) => tab === "all" || !n.read);
  return (
    <>
      <PageHeader title="Notifications" subtitle="Everything that happens to your ideas, assignments and account — delivered live.">
        <Button variant="outline" icon={CheckCheck} onClick={() => act(() => api.post("/notifications/read-all"), "All marked as read")}>Mark all read</Button>
        <Button variant="ghost" icon={Trash2} onClick={() => act(() => api.delete("/notifications/read"), "Cleared read notifications")}>Clear read</Button>
      </PageHeader>
      <div className="mb"><Tabs value={tab} onChange={setTab} tabs={[{ id: "all", label: "All", count: q.data?.items.length }, { id: "unread", label: "Unread", count: q.data?.unread }]} /></div>
      <Async q={q}>{() => !items.length ? <Empty icon={Bell} title="You're all caught up" /> : (
        <Card className="pad0"><div>{items.map((n) => (
          <div key={n._id} className={`notif-item ${n.read ? "" : "unread"}`} style={{ alignItems: "center" }}>
            <div className="notif-ico"><Bell size={16} /></div>
            <div className="grow"><b>{n.title}</b>{n.message && <div className="small muted">{n.message}</div>}<div className="tiny faint">{ago(n.createdAt)}</div></div>
            {n.link && <Link to={n.link} className="btn btn-outline btn-sm" onClick={() => !n.read && api.patch(`/notifications/${n._id}/read`)}>Open</Link>}
            {!n.read && <button className="icon-btn" onClick={() => act(() => api.patch(`/notifications/${n._id}/read`))} aria-label="Mark read"><Check size={16} /></button>}
            <button className="icon-btn" onClick={() => act(() => api.delete(`/notifications/${n._id}`))} aria-label="Delete"><Trash2 size={16} /></button>
          </div>))}</div></Card>)}</Async>
    </>
  );
}

function Profile() {
  const { user, updateUser } = useAuth();
  const [f, setF] = useState({ name: user.name, bio: user.bio || "", company: user.company || "", location: user.location || "", expertise: (user.expertise || []).join(", ") });
  const [busy, setBusy] = useState(false);
  const reqs = useLive("/requests", { params: { type: "role_change" } });
  const [role, setRole] = useState("mentor");
  const pending = (reqs.data || []).find((r) => r.status === "pending");
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const save = async () => { setBusy(true); try { const r = await api.patch("/auth/me", { ...f, expertise: f.expertise.split(",").map((x) => x.trim()).filter(Boolean) }); updateUser(r.data.user); toast.success("Profile updated"); } catch (e) { toast.error(errMsg(e)); } setBusy(false); };
  return (
    <>
      <PageHeader title="My profile" subtitle="Your public details. Mentors and experts show this information to founders." />
      <div className="grid g-main">
        <Card>
          <div className="row mb" style={{ gap: 18 }}><Avatar name={user.name} size={72} /><div><h2>{user.name}</h2><div className="row wrap gap-s mt-s"><Badge kind="primary">{roleLabel(user.role)}</Badge><StatusBadge value={user.status} /></div><div className="small muted mt-s">{user.email} · joined {fmtDate(user.createdAt)}</div></div></div>
          <div className="col"><div className="grid g2"><Field label="Full name"><input className="input" value={f.name} onChange={set("name")} maxLength={80} /></Field><Field label="Company / title"><input className="input" value={f.company} onChange={set("company")} /></Field></div>
            <div className="grid g2"><Field label="Location"><input className="input" value={f.location} onChange={set("location")} /></Field><Field label="Expertise" hint="Comma separated"><input className="input" value={f.expertise} onChange={set("expertise")} placeholder="FinTech, Pricing, GTM" /></Field></div>
            <Field label="Bio"><textarea className="input" value={f.bio} onChange={set("bio")} maxLength={500} /></Field><div><Button loading={busy} onClick={save}>Save profile</Button></div></div>
        </Card>
        {["entrepreneur", "mentor", "industry_expert"].includes(user.role) && (
          <Card title="Change my role" icon={UserCog}>
            {pending ? <Alert kind="info">Your request to become <b>{roleLabel(pending.requestedRole)}</b> is waiting for admin approval.</Alert> : (
              <div className="col"><p className="muted small">Want to mentor or evaluate startups? Request a role change — an admin will review it.</p>
                <select className="input" value={role} onChange={(e) => setRole(e.target.value)}>{["entrepreneur", "mentor", "industry_expert"].filter((r) => r !== user.role).map((r) => <option key={r} value={r}>{roleLabel(r)}</option>)}</select>
                <Button variant="outline" onClick={async () => { const ok = await act(() => api.post("/requests/role-change", { requestedRole: role }), "Request sent to admins"); if (ok) reqs.refresh(); }}>Send request</Button></div>)}
            {(reqs.data || []).filter((r) => r.status !== "pending").slice(0, 3).map((r) => <div key={r._id} className="list-item small"><span className="grow">→ {roleLabel(r.requestedRole)}</span><StatusBadge value={r.status} /></div>)}
          </Card>)}
      </div>
    </>
  );
}

function Settings() {
  const { user, updateUser } = useAuth();
  const cfg = useConfig();
  const [pw, setPw] = useState({ currentPassword: "", newPassword: "" });
  const [busy, setBusy] = useState(false);
  const setPref = async (patch) => { try { const r = await api.patch("/auth/me", { prefs: patch }); updateUser(r.data.user); } catch (e) { toast.error(errMsg(e)); } };
  const change = async () => {
    if (pw.newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    if (!isPasswordValid(pw.newPassword)) {
      toast.error("Password must contain at least one letter and one number");
      return;
    }
    if (isBreachedPassword(pw.newPassword)) {
      toast.error("This password is known to be compromised in data breaches. Please choose a more secure password.");
      return;
    }
    setBusy(true);
    try {
      await api.patch("/auth/password", pw);
      toast.success("Password updated");
      setPw({ currentPassword: "", newPassword: "" });
    } catch (e) {
      toast.error(errMsg(e));
    }
    setBusy(false);
  };
  return (
    <>
      <PageHeader title="Account settings" subtitle="Appearance, notifications and security." />
      <div className="grid g2">
        <Card title="Appearance" icon={Moon}>
          <div className="row between"><div><b>Theme</b><div className="small muted">Applies instantly on all your devices.</div></div>
            <div className="tabs"><button className={`tab ${cfg.theme === "dark" ? "on" : ""}`} onClick={() => cfg.setTheme("dark")}><Moon size={14} /> Dark</button><button className={`tab ${cfg.theme === "light" ? "on" : ""}`} onClick={() => cfg.setTheme("light")}><Sun size={14} /> Light</button></div></div>
          <hr className="divider" />
          <div className="row between"><div><b>Email notifications</b><div className="small muted">Receive important updates by email.</div></div><Toggle label="Email notifications" checked={user.prefs?.emailNotifications !== false} onChange={(v) => setPref({ emailNotifications: v })} /></div>
        </Card>
        <Card title="Change password" icon={KeyRound}><div className="col">
          <Field label="Current password"><input type="password" className="input" value={pw.currentPassword} onChange={(e) => setPw({ ...pw, currentPassword: e.target.value })} autoComplete="current-password" /></Field>
          <Field label="New password" hint="At least 8 characters with letters & numbers"><input type="password" className="input" minLength={8} maxLength={128} value={pw.newPassword} onChange={(e) => setPw({ ...pw, newPassword: e.target.value })} autoComplete="new-password" /></Field>
          <div><Button loading={busy} disabled={!pw.currentPassword || pw.newPassword.length < 8} onClick={change}>Update password</Button></div></div></Card>
      </div>
    </>
  );
}
