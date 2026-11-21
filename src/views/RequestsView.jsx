import { useState } from "react";
import { Check, Inbox, X } from "lucide-react";
import api from "../api/client.js";
import { useConfig } from "../context/ConfigContext.jsx";
import { act, useLive } from "../lib/live.js";
import { ago, roleLabel } from "../lib/format.js";
import { Async, Avatar, Badge, Button, Card, Empty, Field, Modal, PageHeader, StatusBadge, Tabs, confirmDialog } from "../components/ui.jsx";
import DataTable from "../components/DataTable.jsx";
import { ShimmerButton, SpotlightCard } from "../components/aceternity/index.js";

export default function RequestsView() {
  const cfg = useConfig();
  const [tab, setTab] = useState("pending");
  const [approve, setApprove] = useState(null);
  const q = useLive("/requests");
  const dir = useLive("/users/directory");
  const [mentorId, setMentorId] = useState("");
  const list = q.data || [];
  const rows = list.filter((r) => tab === "all" || r.status === tab);
  const decide = (r, decision, note = "") => act(() => api.post(`/requests/${r._id}/decide`, { decision, note, mentorId: decision === "approve" ? mentorId : undefined }), decision === "approve" ? "Approved – everyone involved was notified" : "Declined");
  const reject = async (r) => { const note = await confirmDialog({ title: "Decline request", message: "Add a note so the requester understands why.", input: true, confirmText: "Decline", danger: true, placeholder: "Reason…" }); if (note !== null) decide(r, "reject", note); };
  const can = (r) => (r.type === "mentor_request" ? cfg.can("ideas.assign") : cfg.can("roles.change"));
  return (
    <>
      <PageHeader title="Requests & approvals" subtitle="Founders asking for mentors and people asking for new roles. Decisions notify them instantly." />
      <div className="grid g4 mb">
        <SpotlightCard className="admin-stat-mini card" spotlightColor="rgba(249, 115, 22, 0.18)">
          <div><div className="lbl">Pending Requests</div><div className="val">{list.filter((r) => r.status === "pending").length}</div></div>
          <Badge kind="warning">Pending</Badge>
        </SpotlightCard>
        <SpotlightCard className="admin-stat-mini card" spotlightColor="rgba(34, 197, 94, 0.18)">
          <div><div className="lbl">Approved</div><div className="val">{list.filter((r) => r.status === "approved").length}</div></div>
          <Badge kind="success">Approved</Badge>
        </SpotlightCard>
        <SpotlightCard className="admin-stat-mini card" spotlightColor="rgba(239, 68, 68, 0.18)">
          <div><div className="lbl">Declined</div><div className="val">{list.filter((r) => r.status === "rejected").length}</div></div>
          <Badge kind="danger">Declined</Badge>
        </SpotlightCard>
        <SpotlightCard className="admin-stat-mini card" spotlightColor="rgba(168, 85, 247, 0.18)">
          <div><div className="lbl">Total Requests</div><div className="val">{list.length}</div></div>
          <span className="tiny faint mono">All time</span>
        </SpotlightCard>
      </div>
      <div className="mb"><Tabs value={tab} onChange={setTab} tabs={["pending", "approved", "rejected", "all"].map((id) => ({ id, label: id[0].toUpperCase() + id.slice(1), count: id === "all" ? list.length : list.filter((r) => r.status === id).length }))} /></div>
      <Card className="pad0" spotlight><Async q={q}>{() => <DataTable rows={rows} empty={<Empty icon={Inbox} title="Nothing to review" />} columns={[
        { key: "type", label: "Request", render: (r) => <Badge kind={r.type === "mentor_request" ? "primary" : "info"}>{r.type === "mentor_request" ? "Mentor request" : "Role change"}</Badge> },
        { key: "requester", label: "From", sort: (r) => r.requester?.name, render: (r) => <div className="row"><Avatar name={r.requester?.name} size={32} /><div><b>{r.requester?.name}</b><div className="tiny faint">{roleLabel(r.requester?.role)}</div></div></div> },
        { key: "detail", label: "Details", sortable: false, render: (r) => <div>{r.type === "mentor_request" ? <><b>{r.idea?.title}</b><div className="tiny faint">{r.idea?.industry}{r.idea?.report && ` · score ${r.idea.report.score}`}</div></> : <>Wants to become <b>{roleLabel(r.requestedRole)}</b></>}{r.note && <div className="small muted mt-s">“{r.note}”</div>}</div> },
        { key: "status", label: "Status", render: (r) => <div><StatusBadge value={r.status} />{r.decidedBy && <div className="tiny faint mt-s">by {r.decidedBy.name}</div>}</div> },
        { key: "createdAt", label: "Requested", hideM: true, render: (r) => ago(r.createdAt) },
        { key: "actions", label: "", sortable: false, render: (r) => r.status === "pending" && can(r) && <div className="actions"><Button size="sm" variant="success" icon={Check} onClick={() => r.type === "mentor_request" ? (setMentorId(""), setApprove(r)) : decide(r, "approve")}>Approve</Button><Button size="sm" variant="outline" icon={X} onClick={() => reject(r)}>Decline</Button></div> },
      ]} />}</Async></Card>
      <Modal open={Boolean(approve)} onClose={() => setApprove(null)} title="Assign a mentor" width={480} footer={<><Button variant="outline" onClick={() => setApprove(null)}>Cancel</Button><ShimmerButton disabled={!mentorId} onClick={async () => { const ok = await decide(approve, "approve"); if (ok) setApprove(null); }}>Approve & assign</ShimmerButton></>}>
        <p className="muted small mb">Choose who will mentor <b>{approve?.idea?.title}</b>.</p>
        <Field label="Mentor"><select className="input" value={mentorId} onChange={(e) => setMentorId(e.target.value)}><option value="">Select a verified mentor…</option>{(dir.data || []).filter((u) => u.role === "mentor").map((u) => <option key={u._id} value={u._id}>{u.name}{u.expertise?.length ? ` — ${u.expertise.slice(0, 2).join(", ")}` : ""}</option>)}</select></Field>
      </Modal>
    </>
  );
}
