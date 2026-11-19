import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Archive, Calendar, Check, ClipboardList, HandHeart, MessageSquare, Pencil, Play, Plus, RotateCcw, Send, Star, Trash2, Video, Phone, MapPin } from "lucide-react";
import api from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";
import { act, useLive } from "../lib/live.js";
import { fmtDate, fmtDateTime } from "../lib/format.js";
import { Async, Avatar, Badge, Button, Card, Empty, Field, Modal, PageHeader, StatusBadge, Tabs, VerdictBadge, confirmDialog } from "../components/ui.jsx";
import DataTable from "../components/DataTable.jsx";
import { FeedbackItem } from "../components/idea.jsx";

export default function MentorViews({ page }) {
  return page === "assignments" ? <Assignments /> : page === "sessions" ? <Sessions /> : page === "guidance" ? <Guidance /> : <MyFeedback />;
}

const TABS = { all: null, assigned: ["assigned"], progress: ["in_progress"], completed: ["completed"], archived: ["archived"] };
export function AssignmentTable({ rows, actions, kindLabel }) {
  const nav = useNavigate();
  return <DataTable rows={rows} onRowClick={(a) => nav(`/app/ideas/${a.idea._id}`)} empty={<Empty icon={ClipboardList} title="Nothing here yet" />} columns={[
    { key: "idea", label: "Startup", sort: (a) => a.idea.title, render: (a) => <div><b>{a.idea.title}</b><div className="tiny faint">{a.idea.industry} · {a.idea.user?.name}</div></div> },
    { key: "score", label: "AI score", sort: (a) => a.idea.report?.score ?? -1, render: (a) => a.idea.report ? <span className="row gap-s"><b className="mono">{a.idea.report.score}</b><VerdictBadge verdict={a.idea.report.verdict} /></span> : "—" },
    { key: "stage", label: kindLabel || "Stage", render: (a) => <div className="row wrap gap-s"><StatusBadge value={a.stage} label={a.stage.replace("_", " ")} />{a.reEval && <Badge kind="warning">re-evaluation</Badge>}</div> },
    { key: "dueDate", label: "Due", hideM: true, render: (a) => (a.dueDate ? fmtDate(a.dueDate) : "—") },
    { key: "updatedAt", label: "Updated", hideM: true, render: (a) => fmtDate(a.updatedAt) },
    { key: "actions", label: "", sortable: false, render: (a) => <div className="actions" onClick={(e) => e.stopPropagation()}>{actions(a)}</div> },
  ]} />;
}

function Assignments() {
  const nav = useNavigate();
  const [sp, setSp] = useSearchParams();
  const tab = TABS[sp.get("f")] !== undefined && sp.get("f") ? sp.get("f") : "all";
  const q = useLive("/assignments", { params: { kind: "mentor" } });
  const ideas = useLive("/ideas");
  const list = q.data || [];
  const rows = list.filter((a) => !TABS[tab] || TABS[tab].includes(a.stage));
  const pool = (ideas.data || []).filter((i) => ["submitted", "under_review", "approved"].includes(i.status) && !i.assignments?.some((a) => a.kind === "mentor"));
  const stage = (a, s, msg) => act(() => api.patch(`/assignments/${a._id}`, { stage: s }), msg);
  return (
    <>
      <PageHeader title="Assigned startups" subtitle="Founders you are mentoring. Move each one through its stages — founders are notified as you go." />
      <div className="mb"><Tabs value={tab} onChange={(t) => setSp(t === "all" ? {} : { f: t })} tabs={[["all", "All"], ["assigned", "New"], ["progress", "In progress"], ["completed", "Completed"], ["archived", "Archived"]].map(([id, label]) => ({ id, label, count: id === "all" ? list.length : list.filter((a) => TABS[id].includes(a.stage)).length }))} /></div>
      <Card className="pad0"><Async q={q}>{() => <AssignmentTable rows={rows} actions={(a) => <>
        {a.stage === "assigned" && <Button size="sm" icon={Play} onClick={() => stage(a, "in_progress", "Marked in progress")}>Start</Button>}
        {["assigned", "in_progress"].includes(a.stage) && <Button size="sm" variant="outline" icon={MessageSquare} onClick={() => nav(`/app/guidance?idea=${a.idea._id}`)}>Guide</Button>}
        {a.stage === "in_progress" && <Button size="sm" variant="success" icon={Check} onClick={() => stage(a, "completed", "Mentoring completed")}>Complete</Button>}
        {a.stage !== "archived" ? <Button size="sm" variant="ghost" icon={Archive} onClick={() => stage(a, "archived", "Archived")} aria-label="Archive" /> : <Button size="sm" variant="outline" icon={RotateCcw} onClick={() => stage(a, "assigned", "Restored")}>Restore</Button>}
      </>} />}</Async></Card>
      <h2 style={{ fontSize: 20, margin: "34px 0 6px" }}>Open pool</h2><p className="muted small mb">Ideas that don't have a mentor yet. Claim one to add it to your list.</p>
      <Card className="pad0"><DataTable rows={pool} pageSize={6} empty={<Empty icon={HandHeart} title="No unassigned ideas" />} onRowClick={(i) => nav(`/app/ideas/${i._id}`)} columns={[
        { key: "title", label: "Idea", render: (i) => <div><b>{i.title}</b><div className="tiny faint">{i.industry} · {i.user?.name}</div></div> }, { key: "s", label: "Score", render: (i) => i.report?.score ?? "—" }, { key: "status", label: "Status", render: (i) => <StatusBadge value={i.status} /> },
        { key: "a", label: "", sortable: false, render: (i) => <div className="actions" onClick={(e) => e.stopPropagation()}><Button size="sm" icon={HandHeart} onClick={() => act(() => api.post(`/ideas/${i._id}/claim`), "Added to your assignments")}>Claim</Button></div> }]} /></Card>
    </>
  );
}

const MODE = { video: [Video, "Video call"], call: [Phone, "Phone"], in_person: [MapPin, "In person"] };
function Sessions() {
  const { user } = useAuth();
  const mentor = user.role === "mentor", admin = ["admin", "superadmin"].includes(user.role);
  const [tab, setTab] = useState("upcoming");
  const [form, setForm] = useState(null);
  const [notes, setNotes] = useState(null);
  const q = useLive("/sessions");
  const list = q.data || [];
  const now = Date.now();
  const up = list.filter((s) => s.status === "scheduled" && new Date(s.scheduledAt) >= now - 3600000);
  const past = list.filter((s) => !up.includes(s));
  const rows = (tab === "upcoming" ? up : past).sort((a, b) => (tab === "upcoming" ? new Date(a.scheduledAt) - new Date(b.scheduledAt) : new Date(b.scheduledAt) - new Date(a.scheduledAt)));
  return (
    <>
      <PageHeader title="Mentor sessions" subtitle={mentor ? "Schedule and run sessions with the founders you mentor. They see changes instantly." : "Sessions with your mentors appear here as soon as they are scheduled."}>
        {mentor && <Button icon={Plus} onClick={() => setForm({})}>Schedule session</Button>}
      </PageHeader>
      <div className="mb"><Tabs value={tab} onChange={setTab} tabs={[{ id: "upcoming", label: "Upcoming", count: up.length }, { id: "past", label: "Past & cancelled", count: past.length }]} /></div>
      <Async q={q}>{() => !rows.length ? <Empty icon={Calendar} title="No sessions here">{mentor ? "Schedule a session with one of your startups." : "Your mentor will schedule sessions with you."}</Empty> : (
        <div className="grid g-auto stagger">{rows.map((s) => { const [I, ml] = MODE[s.mode] || MODE.video; const d = new Date(s.scheduledAt); return (
          <Card key={s._id} hover>
            <div className="row" style={{ gap: 14, alignItems: "flex-start" }}>
              <div className="stat"><div className="ico g-cyan" style={{ width: 56, height: 62, flexDirection: "column", lineHeight: 1.1 }}><b style={{ fontSize: 22 }}>{d.getDate()}</b><span style={{ fontSize: 11 }}>{d.toLocaleString("en", { month: "short" }).toUpperCase()}</span></div></div>
              <div className="grow"><div className="row between"><b>{s.title}</b><Badge kind={s.status}>{s.status}</Badge></div>
                <div className="small muted mt-s"><Link to={`/app/ideas/${s.idea._id}`}>{s.idea.title}</Link></div>
                <div className="row wrap small muted mt-s" style={{ gap: 12 }}><span className="row gap-s"><I size={14} />{ml}</span><span>{fmtDateTime(s.scheduledAt)} · {s.durationMin} min</span></div>
                <div className="row small muted mt-s gap-s"><Avatar name={mentor ? s.founder?.name : s.mentor?.name} size={22} />{mentor ? `Founder: ${s.founder?.name}` : `Mentor: ${s.mentor?.name}`}</div>
                {s.agenda && <p className="small muted mt-s">{s.agenda}</p>}{s.notes && <div className="callout small mt-s"><b>Notes:</b> {s.notes}</div>}
                {s.link && s.status === "scheduled" && /^https?:\/\//i.test(s.link) && <a className="btn btn-outline btn-sm mt-s" href={s.link} target="_blank" rel="noopener noreferrer">Join</a>}
                {(mentor || admin) && <div className="row wrap mt-s">
                  {s.status === "scheduled" && <><Button size="sm" variant="success" icon={Check} onClick={() => setNotes({ s, text: s.notes || "" })}>Complete</Button><Button size="sm" variant="outline" onClick={() => act(() => api.patch(`/sessions/${s._id}`, { status: "cancelled" }), "Session cancelled – founder notified")}>Cancel</Button></>}
                  <Button size="sm" variant="ghost" icon={Trash2} aria-label="Delete" onClick={async () => { if (await confirmDialog({ title: "Delete session?", message: s.title, danger: true, confirmText: "Delete" })) act(() => api.delete(`/sessions/${s._id}`), "Session deleted"); }} /></div>}
              </div>
            </div>
          </Card>); })}</div>)}</Async>
      {form && <ScheduleModal onClose={() => setForm(null)} />}
      <Modal open={Boolean(notes)} onClose={() => setNotes(null)} title="Complete session" footer={<><Button variant="outline" onClick={() => setNotes(null)}>Cancel</Button><Button onClick={async () => { const ok = await act(() => api.patch(`/sessions/${notes.s._id}`, { status: "completed", notes: notes.text }), "Session completed"); if (ok) setNotes(null); }}>Save</Button></>}>
        <Field label="Session notes (visible to the founder)"><textarea className="input" value={notes?.text || ""} onChange={(e) => setNotes({ ...notes, text: e.target.value })} placeholder="Key takeaways and next steps…" /></Field>
      </Modal>
    </>
  );
}

function ScheduleModal({ onClose }) {
  const mine = useLive("/assignments", { params: { kind: "mentor" } });
  const ideas = (mine.data || []).filter((a) => a.stage !== "archived");
  const [f, setF] = useState({ idea: "", title: "", scheduledAt: "", durationMin: 45, mode: "video", link: "", agenda: "" });
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const save = async () => { setBusy(true); const ok = await act(() => api.post("/sessions", { ...f, scheduledAt: new Date(f.scheduledAt).toISOString() }), "Session scheduled – the founder was notified"); setBusy(false); if (ok) onClose(); };
  return (
    <Modal open onClose={onClose} title="Schedule a session" width={600} footer={<><Button variant="outline" onClick={onClose}>Cancel</Button><Button loading={busy} disabled={!f.idea || !f.scheduledAt} onClick={save}>Schedule</Button></>}>
      <div className="col">
        <Field label="Startup"><select className="input" value={f.idea} onChange={set("idea")}><option value="">Select an idea you mentor…</option>{ideas.map((a) => <option key={a._id} value={a.idea._id}>{a.idea.title} — {a.idea.user?.name}</option>)}</select></Field>
        <Field label="Title"><input className="input" value={f.title} onChange={set("title")} placeholder="e.g. Pricing workshop" /></Field>
        <div className="grid g2"><Field label="Date & time"><input type="datetime-local" className="input" value={f.scheduledAt} onChange={set("scheduledAt")} /></Field><Field label="Duration (min)"><input type="number" min={10} max={240} className="input" value={f.durationMin} onChange={set("durationMin")} /></Field></div>
        <div className="grid g2"><Field label="Mode"><select className="input" value={f.mode} onChange={set("mode")}><option value="video">Video call</option><option value="call">Phone</option><option value="in_person">In person</option></select></Field><Field label="Meeting link"><input className="input" value={f.link} onChange={set("link")} placeholder="https://…" /></Field></div>
        <Field label="Agenda"><textarea className="input" value={f.agenda} onChange={set("agenda")} /></Field>
      </div>
    </Modal>
  );
}

function Guidance() {
  const [sp, setSp] = useSearchParams();
  const mine = useLive("/assignments", { params: { kind: "mentor" } });
  const list = (mine.data || []).filter((a) => a.stage !== "archived");
  const id = sp.get("idea") || list[0]?.idea._id;
  useEffect(() => { if (!sp.get("idea") && list[0]) setSp({ idea: list[0].idea._id }, { replace: true }); }, [list.length]);
  const detail = useLive(`/ideas/${id}`, { skip: !id });
  const [f, setF] = useState({ comment: "", tags: "" });
  const [busy, setBusy] = useState(false);
  const send = async () => { setBusy(true); const ok = await act(() => api.post(`/ideas/${id}/feedback`, { kind: "guidance", comment: f.comment, tags: f.tags.split(",").map((t) => t.trim()).filter(Boolean) }), "Guidance sent to the founder"); setBusy(false); if (ok) setF({ comment: "", tags: "" }); };
  return (
    <>
      <PageHeader title="Provide guidance" subtitle="Write actionable advice. The founder is notified the moment you send it." />
      <Async q={mine}>{() => !list.length ? <Empty icon={MessageSquare} title="No active assignments">Claim an idea from <Link to="/app/assignments">Assigned startups</Link> first.</Empty> : (
        <div className="grid g-main">
          <Card>
            <Field label="Startup"><select className="input" value={id} onChange={(e) => setSp({ idea: e.target.value })}>{list.map((a) => <option key={a._id} value={a.idea._id}>{a.idea.title}</option>)}</select></Field>
            <Field label="Your guidance" className="mt"><textarea className="input" style={{ minHeight: 180 }} value={f.comment} onChange={(e) => setF({ ...f, comment: e.target.value })} placeholder="What should they do next, and why?" /></Field>
            <Field label="Tags" className="mt" hint="Comma separated, e.g. pricing, go-to-market"><input className="input" value={f.tags} onChange={(e) => setF({ ...f, tags: e.target.value })} /></Field>
            <div className="mt"><Button icon={Send} loading={busy} disabled={!f.comment.trim()} onClick={send}>Send guidance</Button></div>
          </Card>
          <Card title="Earlier feedback on this idea" icon={Star}><Async q={detail}>{(d) => d.feedback.length ? d.feedback.map((x) => <FeedbackItem key={x._id} fb={x} />) : <p className="muted small">Nothing yet — you'd be the first.</p>}</Async></Card>
        </div>)}</Async>
    </>
  );
}

function MyFeedback() {
  const q = useLive("/feedback", { params: { kind: "guidance" } });
  const [edit, setEdit] = useState(null);
  return (
    <>
      <PageHeader title="My feedback" subtitle="Every piece of guidance you have given. Edits and deletions reach founders instantly." />
      <Async q={q}>{(rows) => !rows.length ? <Empty icon={Star} title="No feedback given yet" /> : (
        <div className="col">{rows.map((f) => <Card key={f._id}><div className="row between mb"><Link to={`/app/ideas/${f.idea._id}`}><b>{f.idea.title}</b></Link><span className="small muted">for {f.idea.user?.name}</span></div>
          <FeedbackItem fb={f} actions={<><Button size="sm" variant="outline" icon={Pencil} onClick={() => setEdit({ _id: f._id, comment: f.comment })}>Edit</Button><Button size="sm" variant="ghost" icon={Trash2} aria-label="Delete" onClick={async () => { if (await confirmDialog({ title: "Delete this feedback?", message: "The founder will no longer see it.", danger: true, confirmText: "Delete" })) act(() => api.delete(`/feedback/${f._id}`), "Feedback deleted"); }} /></>} /></Card>)}</div>)}</Async>
      <Modal open={Boolean(edit)} onClose={() => setEdit(null)} title="Edit feedback" footer={<><Button variant="outline" onClick={() => setEdit(null)}>Cancel</Button><Button disabled={!edit?.comment?.trim()} onClick={async () => { const ok = await act(() => api.patch(`/feedback/${edit._id}`, { comment: edit.comment }), "Feedback updated"); if (ok) setEdit(null); }}>Save</Button></>}>
        <textarea className="input" style={{ minHeight: 160 }} value={edit?.comment || ""} onChange={(e) => setEdit({ ...edit, comment: e.target.value })} />
      </Modal>
    </>
  );
}
