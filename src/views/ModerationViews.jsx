import { useState } from "react";
import { Link } from "react-router-dom";
import { Ban, Eye, Flag, MessageSquareWarning, ShieldAlert, Trash2, UserX, X } from "lucide-react";
import api from "../api/client.js";
import { useConfig } from "../context/ConfigContext.jsx";
import { act, useLive } from "../lib/live.js";
import { ago } from "../lib/format.js";
import { Alert, Async, Avatar, Badge, Button, Card, Empty, Field, Modal, PageHeader, StatusBadge, Tabs, VerdictBadge } from "../components/ui.jsx";
import DataTable from "../components/DataTable.jsx";
import { ReportModal } from "../components/idea.jsx";

const META = {
  idea: ["Flagged ideas", "Ideas reported by the community.", ShieldAlert, [["remove", "Remove idea", "danger", Trash2], ["changes", "Request changes", "warning", Flag]]],
  feedback: ["Reported feedback", "Mentor, expert and admin feedback that was reported.", MessageSquareWarning, [["remove", "Remove feedback", "danger", Trash2]]],
  user: ["User reports", "People reported for harassment, spam or abuse.", UserX, [["warn", "Warn user", "warning", Flag], ["block", "Block user", "danger", Ban]]],
};

export default function ModerationViews({ page }) {
  return page === "audits" ? <Audits /> : <Queue type={page} />;
}

function Queue({ type }) {
  const cfg = useConfig();
  const [tab, setTab] = useState("open");
  const [act_, setAct] = useState(null);
  const [note, setNote] = useState("");
  const q = useLive("/reports", { params: { targetType: type } });
  const [title, sub, Icon, actions] = META[type];
  const list = q.data || [];
  const rows = list.filter((r) => r.status === tab);
  const run = async () => { const ok = await act(() => api.post(`/reports/${act_.r._id}/resolve`, { action: act_.action, note }), act_.action === "dismiss" ? "Report dismissed" : "Action taken – everyone involved was notified"); if (ok) { setAct(null); setNote(""); } };
  return (
    <>
      <PageHeader title={title} subtitle={sub} />
      <div className="mb"><Tabs value={tab} onChange={setTab} tabs={["open", "resolved", "dismissed"].map((id) => ({ id, label: id[0].toUpperCase() + id.slice(1), count: list.filter((r) => r.status === id).length }))} /></div>
      <Async q={q}>{() => !rows.length ? <Empty icon={Icon} title={tab === "open" ? "Queue is clear 🎉" : "Nothing here"} /> : (
        <div className="grid g2 stagger">{rows.map((r) => (
          <Card key={r._id} hover>
            <div className="row between"><div className="row wrap gap-s"><Badge kind="danger"><Flag size={12} /> {r.reason}</Badge><StatusBadge value={r.status} /></div><span className="tiny faint">{ago(r.createdAt)}</span></div>
            <div className="callout mt-s">
              {type === "idea" && (r.targetInfo ? <><Link to={`/app/ideas/${r.target}`}><b>{r.targetInfo.title}</b></Link><div className="small muted">{r.targetInfo.industry} · by {r.targetInfo.user?.name} · <StatusBadge value={r.targetInfo.status} /></div></> : <i className="muted">Idea no longer exists</i>)}
              {type === "feedback" && (r.targetInfo ? <><div className="small muted mb">{r.targetInfo.authorName} ({r.targetInfo.kind})</div><p className="pre small">“{r.targetInfo.comment}”</p>{r.idea && <Link className="small" to={`/app/ideas/${r.idea._id}`}>On: {r.idea.title}</Link>}</> : <i className="muted">Feedback no longer exists</i>)}
              {type === "user" && (r.targetInfo ? <div className="row"><Avatar name={r.targetInfo.name} size={36} /><div><b>{r.targetInfo.name}</b><div className="tiny faint">{r.targetInfo.email}</div></div>{!r.targetInfo.isActive && <Badge kind="blocked">blocked</Badge>}</div> : <i className="muted">User no longer exists</i>)}
            </div>
            {r.details && <p className="small muted mt-s">“{r.details}”</p>}
            <div className="tiny faint mt-s">Reported by {r.reporter?.name}</div>
            {r.status === "open" ? <div className="row wrap mt">{actions.filter(([a]) => a !== "block" || cfg.can("users.manage")).map(([a, l, k, I]) => <Button key={a} size="sm" variant={k === "danger" ? "danger" : "outline"} icon={I} onClick={() => { setNote(""); setAct({ r, action: a, label: l }); }}>{l}</Button>)}<Button size="sm" variant="ghost" icon={X} onClick={() => { setNote(""); setAct({ r, action: "dismiss", label: "Dismiss" }); }}>Dismiss</Button></div>
              : <div className="small muted mt">Resolved by <b>{r.resolvedBy?.name}</b>: {r.resolution}</div>}
          </Card>))}</div>)}</Async>
      <Modal open={Boolean(act_)} onClose={() => setAct(null)} title={act_?.label} width={480} footer={<><Button variant="outline" onClick={() => setAct(null)}>Cancel</Button><Button variant={act_?.action === "dismiss" ? "primary" : "danger"} onClick={run}>Confirm</Button></>}>
        <Field label="Moderator note" hint="Shared with the affected user where relevant"><textarea className="input" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Explain your decision…" /></Field>
      </Modal>
    </>
  );
}

function Audits() {
  const ideas = useLive("/ideas");
  const [flag, setFlag] = useState(null);
  const rows = (ideas.data || []).slice(0, 100);
  return (
    <>
      <PageHeader title="Content audits" subtitle="A live feed of the newest content on the platform. Spot something off? Flag it for review." />
      <Alert kind="info">Showing the 100 most recent submitted ideas. New submissions appear here automatically.</Alert>
      <Card className="pad0 mt"><Async q={ideas}>{() => <DataTable rows={rows} empty={<Empty icon={Eye} title="No content yet" />} columns={[
        { key: "title", label: "Idea", render: (i) => <div><Link to={`/app/ideas/${i._id}`}><b>{i.title}</b></Link><div className="tiny faint">{i.industry} · {i.user?.name}</div></div> },
        { key: "report", label: "AI", sort: (i) => i.report?.score ?? -1, render: (i) => i.report ? <span className="row gap-s"><b>{i.report.score}</b><VerdictBadge verdict={i.report.verdict} /></span> : "—" },
        { key: "status", label: "Status", render: (i) => <div className="row gap-s"><StatusBadge value={i.status} />{i.flagged && <Badge kind="danger">flagged</Badge>}</div> },
        { key: "createdAt", label: "Submitted", hideM: true, render: (i) => ago(i.createdAt) },
        { key: "a", label: "", sortable: false, render: (i) => <div className="actions"><Button size="sm" variant="outline" icon={Flag} disabled={i.flagged} onClick={() => setFlag(i)}>Flag</Button></div> }]} />}</Async></Card>
      {flag && <ReportModal targetType="idea" target={flag._id} label="idea" onClose={() => setFlag(null)} />}
    </>
  );
}
