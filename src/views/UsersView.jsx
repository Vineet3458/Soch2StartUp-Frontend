import { useMemo, useState } from "react";
import { Ban, Check, GraduationCap, Plus, Trash2, UserCheck, Users, X } from "lucide-react";
import api from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useConfig } from "../context/ConfigContext.jsx";
import { act, useLive } from "../lib/live.js";
import { ago, fmtDate, roleLabel } from "../lib/format.js";
import { Async, Avatar, Badge, Button, Card, Empty, Field, Modal, PageHeader, SearchBox, StatusBadge, confirmDialog } from "../components/ui.jsx";
import DataTable from "../components/DataTable.jsx";

const TITLES = { all: ["All users", "Everyone registered on the platform."], pending: ["Pending verification", "Mentors and experts waiting for approval."], roles: ["Role management", "Change what each person can do. Permissions per role are set by the superadmin."], blocked: ["Blocked users", "Accounts that cannot sign in."], mentors: ["Mentors & experts", "Verified advisers, their workload and expertise."] };
const ROLES = ["entrepreneur", "mentor", "industry_expert", "moderator", "admin", "superadmin"];

export default function UsersView({ preset }) {
  const { user: me } = useAuth();
  const cfg = useConfig();
  const [q, setQ] = useState("");
  const [role, setRole] = useState("");
  const [add, setAdd] = useState(false);
  const users = useLive("/users");
  const manage = cfg.can("users.manage"), changeRole = cfg.can("roles.change");
  const list = users.data || [];
  const base = useMemo(() => list.filter((u) => preset === "pending" ? u.status === "pending" : preset === "blocked" ? u.status === "blocked" : preset === "mentors" ? ["mentor", "industry_expert"].includes(u.role) : true), [list, preset]);
  const rows = base.filter((u) => (!role || u.role === role) && (!q || (u.name + u.email).toLowerCase().includes(q.toLowerCase())));
  const locked = (u) => u._id === me.id || (me.role !== "superadmin" && ["admin", "superadmin"].includes(u.role));

  const block = async (u, b) => { const reason = b ? await confirmDialog({ title: `Block ${u.name}?`, message: "They will be signed out of new sessions and unable to log in.", input: true, placeholder: "Reason (shown to the user)…", confirmText: "Block user", danger: true }) : true; if (reason === null) return; act(() => api.post(`/users/${u._id}/block`, { block: b, reason: b ? reason : "" }), b ? "User blocked" : "User unblocked"); };
  const del = async (u) => { if (await confirmDialog({ title: `Delete ${u.name}?`, message: "Their ideas and assignments will also be deleted. This cannot be undone.", confirmText: "Delete permanently", danger: true })) act(() => api.delete(`/users/${u._id}`), "User deleted"); };

  const cols = [
    { key: "name", label: "User", render: (u) => <div className="row"><Avatar name={u.name} size={36} /><div><b>{u.name}</b><div className="tiny faint">{u.email}</div></div></div> },
    { key: "role", label: "Role", render: (u) => preset === "roles" && changeRole ? (
      <select className="input" style={{ width: 170, padding: "6px 10px" }} disabled={locked(u)} value={u.role} onChange={(e) => act(() => api.patch(`/users/${u._id}/role`, { role: e.target.value }), `${u.name} is now ${roleLabel(e.target.value)}`)}>{ROLES.filter((r) => me.role === "superadmin" || !["admin", "superadmin"].includes(r) || r === u.role).map((r) => <option key={r} value={r}>{roleLabel(r)}</option>)}</select>
    ) : <Badge kind="primary">{roleLabel(u.role)}</Badge> },
    { key: "status", label: "Status", render: (u) => <div><StatusBadge value={u.status} />{u.blockedReason && <div className="tiny faint mt-s">{u.blockedReason}</div>}</div> },
    ...(preset === "mentors" ? [{ key: "expertise", label: "Expertise", hideM: true, sortable: false, render: (u) => <div className="row wrap gap-s">{(u.expertise || []).slice(0, 3).map((x) => <span key={x} className="chip">{x}</span>)}</div> }, { key: "activeAssignments", label: "Active load", render: (u) => <b>{u.activeAssignments}</b> }] : [{ key: "ideaCount", label: "Ideas", hideM: true, render: (u) => u.ideaCount }]),
    { key: "lastLoginAt", label: "Last seen", hideM: true, render: (u) => (u.lastLoginAt ? ago(u.lastLoginAt) : "Never") },
    { key: "createdAt", label: "Joined", hideM: true, render: (u) => fmtDate(u.createdAt) },
    { key: "actions", label: "", sortable: false, render: (u) => manage && !locked(u) && (
      <div className="actions">
        {u.status === "pending" && <><Button size="sm" variant="success" icon={Check} onClick={() => act(() => api.post(`/users/${u._id}/verify`, { approve: true }), `${u.name} verified`)}>Approve</Button><Button size="sm" variant="outline" icon={X} onClick={() => act(() => api.post(`/users/${u._id}/verify`, { approve: false, reason: "Verification rejected" }), "Verification rejected")}>Reject</Button></>}
        {u.status === "blocked" ? <Button size="sm" variant="outline" icon={UserCheck} onClick={() => block(u, false)}>Unblock</Button> : u.status !== "pending" && <Button size="sm" variant="outline" icon={Ban} onClick={() => block(u, true)}>Block</Button>}
        <Button size="sm" variant="ghost" icon={Trash2} onClick={() => del(u)} aria-label="Delete user" />
      </div>) },
  ];
  const count = (f) => list.filter(f).length;
  return (
    <>
      <PageHeader title={TITLES[preset][0]} subtitle={TITLES[preset][1]}>{manage && <Button icon={Plus} onClick={() => setAdd(true)}>Add user</Button>}</PageHeader>
      <div className="row wrap mb" style={{ gap: 12 }}>
        <Badge kind="success">{count((u) => u.status === "active")} active</Badge><Badge kind="warning">{count((u) => u.status === "pending")} pending</Badge><Badge kind="danger">{count((u) => u.status === "blocked")} blocked</Badge><span className="small muted">Total {list.length}</span>
      </div>
      <div className="toolbar"><SearchBox value={q} onChange={setQ} placeholder="Search by name or email…" />
        <select className="input" value={role} onChange={(e) => setRole(e.target.value)}><option value="">All roles</option>{ROLES.map((r) => <option key={r} value={r}>{roleLabel(r)}</option>)}</select></div>
      <Card className="pad0"><Async q={users} skeleton={<div className="skeleton" style={{ height: 320 }} />}>{() => <DataTable rows={rows} columns={cols} pageSize={12} empty={<Empty icon={preset === "mentors" ? GraduationCap : Users} title="No users here">{preset === "pending" ? "No one is waiting for verification 🎉" : "Nothing matches your filters."}</Empty>} />}</Async></Card>
      {add && <AddUser onClose={() => setAdd(false)} isSuper={me.role === "superadmin"} />}
    </>
  );
}

function AddUser({ onClose, isSuper }) {
  const [f, setF] = useState({ name: "", email: "", password: "", role: "entrepreneur" });
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const save = async () => { setBusy(true); const ok = await act(() => api.post("/users", f), "User created"); setBusy(false); if (ok) onClose(); };
  return (
    <Modal open onClose={onClose} title="Add a user" width={480} footer={<><Button variant="outline" onClick={onClose}>Cancel</Button><Button loading={busy} disabled={!f.name || !f.email || f.password.length < 6} onClick={save}>Create user</Button></>}>
      <div className="col"><Field label="Full name"><input className="input" value={f.name} onChange={set("name")} /></Field><Field label="Email"><input className="input" type="email" value={f.email} onChange={set("email")} /></Field>
        <Field label="Temporary password" hint="At least 6 characters"><input className="input" type="text" value={f.password} onChange={set("password")} /></Field>
        <Field label="Role"><select className="input" value={f.role} onChange={set("role")}>{ROLES.filter((r) => isSuper || !["admin", "superadmin"].includes(r)).map((r) => <option key={r} value={r}>{roleLabel(r)}</option>)}</select></Field></div>
    </Modal>
  );
}
