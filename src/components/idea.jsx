import { useState } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, Calendar, CheckCircle2, Cpu, Download, FileText, MessageSquare, Printer, Star } from "lucide-react";
import api from "../api/client.js";
import { act, useLive } from "../lib/live.js";
import { ago, fmtDate, roleLabel, scoreColor } from "../lib/format.js";
import { Avatar, Badge, Button, Card, Field, Modal, StatusBadge, VerdictBadge } from "./ui.jsx";
import { MetricBars, RadarMetrics, ScoreRing } from "./charts.jsx";

export function IdeaCard({ idea, selected, onSelect, actions }) {
  const r = idea.report;
  return (
    <Card hover className={`idea-card ${selected ? "glow-border" : ""}`}>
      <div className="row between" style={{ alignItems: "flex-start" }}>
        <div className="col gap-s grow" style={{ gap: 8 }}>
          <div className="row wrap gap-s"><StatusBadge value={idea.status} /><Badge kind="primary">{idea.industry}</Badge>{idea.flagged && <Badge kind="danger"><AlertTriangle size={12} /> Flagged</Badge>}</div>
          <Link to={`/app/ideas/${idea._id}`} style={{ color: "var(--text)" }}><h3>{idea.title}</h3></Link>
        </div>
        {r ? <ScoreRing score={r.score} size={72} stroke={7} label="" /> : <Badge kind="draft">No score</Badge>}
      </div>
      <p className="desc">{idea.description}</p>
      {idea.reviewNote && ["rejected", "changes_requested"].includes(idea.status) && <div className="callout small">{idea.reviewNote}</div>}
      <div className="row between small muted" style={{ marginTop: "auto" }}>
        <span className="row gap-s"><Calendar size={14} />{fmtDate(idea.createdAt)}</span>
        <span className="row" style={{ gap: 12 }}>{idea.feedbackCount > 0 && <span className="row gap-s"><MessageSquare size={14} />{idea.feedbackCount}</span>}{r && <VerdictBadge verdict={r.verdict} />}</span>
      </div>
      <div className="row wrap" style={{ gap: 8 }}>
        {onSelect && r && <label className="row small muted" style={{ gap: 6, cursor: "pointer" }}><input type="checkbox" className="check" checked={selected} onChange={() => onSelect(idea._id)} /> Compare</label>}
        <div className="row wrap" style={{ marginLeft: "auto", gap: 8 }}>{actions}</div>
      </div>
    </Card>
  );
}

export function ReportBody({ idea, compact }) {
  const r = idea.report;
  if (!r) return <Card><p className="muted">This idea has no validation report yet. {idea.status === "draft" && "Submit the draft to generate one."}</p></Card>;
  const dl = () => { const b = new Blob([JSON.stringify({ title: idea.title, industry: idea.industry, report: r }, null, 2)], { type: "application/json" }); const a = document.createElement("a"); a.href = URL.createObjectURL(b); a.download = `${idea.title.replace(/\W+/g, "-")}-report.json`; a.click(); };
  return (
    <div className="col gap-l stagger">
      <Card className="glow-border">
        <div className="report-hero">
          <ScoreRing score={r.score} size={170} stroke={14} label="VALIDATION" />
          <div className="col" style={{ gap: 10 }}>
            <div className="row wrap" style={{ gap: 10 }}><VerdictBadge verdict={r.verdict} /><Badge kind={r.source === "gemini" ? "primary" : "demo"}><Cpu size={12} /> {r.source === "gemini" ? "Gemini AI" : "Demo engine"}</Badge><span className="tiny faint">Generated {ago(r.generatedAt || idea.updatedAt)}</span></div>
            <h2 style={{ fontSize: 26 }}>{idea.title}</h2>
            <p className="muted">{r.verdict === "GO" ? "Strong potential. Validate with real customers and move to MVP." : r.verdict === "IMPROVE" ? "Promising, but strengthen the weak areas before investing heavily." : "High risk in its current form. Reconsider the concept or narrow your focus."}</p>
            {!compact && <div className="row wrap no-print"><Button variant="outline" size="sm" icon={Printer} onClick={() => window.print()}>Print / PDF</Button><Button variant="outline" size="sm" icon={Download} onClick={dl}>Download JSON</Button></div>}
          </div>
        </div>
      </Card>
      <div className="grid g2">
        <Card title="Score breakdown" icon={Star}><MetricBars metrics={r.metrics} /></Card>
        <Card title="Strength profile" icon={Star}><RadarMetrics series={[{ name: "This idea", metrics: r.metrics, color: "var(--primary)" }]} height={250} /></Card>
      </div>
      <div className="grid g2">
        <Card title="Market research" icon={FileText}><p className="muted pre">{r.marketResearch}</p></Card>
        <Card title="Feasibility" icon={CheckCircle2}><p className="muted pre">{r.feasibilityNote}</p></Card>
      </div>
      <Card title="SWOT analysis"><Swot swot={r.swot} /></Card>
      <div className="grid g2">
        <ListCard title="Target customers" items={r.targetCustomers} /><ListCard title="Key competitors" items={r.competitors} />
        <ListCard title="Top risks" items={r.risks} tone="var(--danger)" /><ListCard title="Recommendations" items={r.recommendations} tone="var(--success)" />
      </div>
    </div>
  );
}

export const Swot = ({ swot = {} }) => (
  <div className="swot">
    {[["Strengths", "strengths", "var(--success)"], ["Weaknesses", "weaknesses", "var(--danger)"], ["Opportunities", "opportunities", "var(--info)"], ["Threats", "threats", "var(--warning)"]].map(([t, k, c]) => (
      <div key={k} style={{ "--c": c }}><h4>{t}</h4><ul>{(swot[k] || []).map((x, i) => <li key={i}>{x}</li>)}</ul></div>))}
  </div>
);

export const ListCard = ({ title, items = [], tone = "var(--primary)" }) => (
  <Card title={title}><ul className="col" style={{ margin: 0, padding: 0, listStyle: "none", gap: 10 }}>{items.map((x, i) => <li key={i} className="row" style={{ alignItems: "flex-start", gap: 10 }}><i style={{ width: 8, height: 8, borderRadius: 3, background: tone, marginTop: 7, flex: "none" }} /><span>{x}</span></li>)}</ul></Card>
);

export function ReviewModal({ idea, onClose }) {
  const [decision, setDecision] = useState("approve");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const opts = [["approve", "Approve", "success"], ["changes", "Request changes", "warning"], ["reject", "Reject", "danger"], ["review", "Mark under review", "primary"]];
  const need = ["reject", "changes"].includes(decision);
  const submit = async () => { setBusy(true); const ok = await act(() => api.post(`/ideas/${idea._id}/review`, { decision, note }), "Decision saved – the founder was notified"); setBusy(false); if (ok) onClose(); };
  return (
    <Modal open onClose={onClose} title={`Review: ${idea.title}`} footer={<><Button variant="outline" onClick={onClose}>Cancel</Button><Button loading={busy} onClick={submit} disabled={need && !note.trim()}>Submit decision</Button></>}>
      <div className="row wrap" style={{ marginBottom: 16 }}>{opts.map(([v, l, k]) => <button key={v} className={`chip chip-btn ${decision === v ? "on" : ""}`} onClick={() => setDecision(v)}><Badge kind={k}>{l}</Badge></button>)}</div>
      {idea.report && <div className="row small muted" style={{ marginBottom: 12, gap: 8 }}>AI score <b style={{ color: scoreColor(idea.report.score) }}>{idea.report.score}</b> <VerdictBadge verdict={idea.report.verdict} />{idea.expertScore != null && <>· Expert avg <b>{idea.expertScore}</b></>}</div>}
      <Field label={need ? "Note to the founder (required)" : "Note to the founder (optional)"}><textarea className="input" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Explain your decision so the founder can act on it…" /></Field>
    </Modal>
  );
}

export function AssignModal({ idea, onClose, defaultKind = "mentor" }) {
  const [kind, setKind] = useState(defaultKind);
  const [userId, setUserId] = useState("");
  const [due, setDue] = useState("");
  const [busy, setBusy] = useState(false);
  const dir = useLive("/users/directory");
  const list = (dir.data || []).filter((u) => (kind === "mentor" ? u.role === "mentor" : u.role === "industry_expert"));
  const submit = async () => { setBusy(true); const ok = await act(() => api.post(`/ideas/${idea._id}/assign`, { userId, kind, dueDate: due || undefined }), "Assigned – they were notified"); setBusy(false); if (ok) onClose(); };
  return (
    <Modal open onClose={onClose} title={`Assign: ${idea.title}`} footer={<><Button variant="outline" onClick={onClose}>Cancel</Button><Button loading={busy} disabled={!userId} onClick={submit}>Assign</Button></>}>
      <div className="col">
        <div className="tabs"><button className={`tab ${kind === "mentor" ? "on" : ""}`} onClick={() => { setKind("mentor"); setUserId(""); }}>Mentor</button><button className={`tab ${kind === "evaluation" ? "on" : ""}`} onClick={() => { setKind("evaluation"); setUserId(""); }}>Evaluator</button></div>
        <Field label={kind === "mentor" ? "Choose a mentor" : "Choose an evaluator"}>
          <select className="input" value={userId} onChange={(e) => setUserId(e.target.value)}><option value="">Select…</option>{list.map((u) => <option key={u._id} value={u._id}>{u.name}{u.expertise?.length ? ` — ${u.expertise.slice(0, 2).join(", ")}` : ""}</option>)}</select>
        </Field>
        <Field label="Due date (optional)"><input type="date" className="input" value={due} onChange={(e) => setDue(e.target.value)} /></Field>
      </div>
    </Modal>
  );
}

const REASONS = ["Spam / low effort", "Possible duplicate", "Inappropriate content", "Harmful advice", "Harassment", "Misleading claims", "Other"];
export function ReportModal({ targetType, target, label, onClose }) {
  const [reason, setReason] = useState(REASONS[0]);
  const [details, setDetails] = useState("");
  const [busy, setBusy] = useState(false);
  const submit = async () => { setBusy(true); const ok = await act(() => api.post("/reports", { targetType, target, reason, details }), "Report sent to the moderators"); setBusy(false); if (ok) onClose(); };
  return (
    <Modal open onClose={onClose} title={`Report ${label || targetType}`} width={480} footer={<><Button variant="outline" onClick={onClose}>Cancel</Button><Button variant="danger" loading={busy} onClick={submit}>Send report</Button></>}>
      <div className="col"><Field label="Reason"><select className="input" value={reason} onChange={(e) => setReason(e.target.value)}>{REASONS.map((r) => <option key={r}>{r}</option>)}</select></Field>
        <Field label="Details (optional)"><textarea className="input" value={details} onChange={(e) => setDetails(e.target.value)} placeholder="Help moderators understand the problem…" /></Field></div>
    </Modal>
  );
}

export function Criteria({ c = {}, small }) {
  const items = [["problem", "Problem"], ["market", "Market"], ["innovation", "Innovation"], ["execution", "Execution"], ["scalability", "Scalability"], ["team", "Team"]];
  return <div className="col" style={{ gap: small ? 6 : 10 }}>{items.map(([k, l]) => <div className="crit" key={k}><span className="muted">{l}</span><div className="progress" style={{ height: 6 }}><i style={{ width: `${(c[k] || 0) * 10}%` }} /></div><b className="mono">{c[k] ?? 0}</b></div>)}</div>;
}

const REC = { strong_yes: ["Strong yes", "success"], yes: ["Yes", "success"], maybe: ["Maybe", "warning"], no: ["No", "danger"] };
export function FeedbackItem({ fb, actions }) {
  return (
    <div className="fb">
      <div className="row" style={{ alignItems: "flex-start" }}>
        <Avatar name={fb.authorName || "?"} size={36} />
        <div className="grow">
          <div className="row wrap" style={{ gap: 8 }}><b>{fb.authorName}</b><Badge kind={fb.kind === "evaluation" ? "warning" : "primary"}>{fb.kind === "evaluation" ? "Evaluation" : "Guidance"}</Badge><span className="tiny faint">{roleLabel(fb.authorRole)} · {ago(fb.createdAt)}</span>
            {fb.status === "removed" && <Badge kind="danger">Removed</Badge>}</div>
          <p className="pre" style={{ marginTop: 8 }}>{fb.comment}</p>
          {fb.tags?.length > 0 && <div className="row wrap gap-s" style={{ marginTop: 8 }}>{fb.tags.map((t) => <span key={t} className="chip">#{t}</span>)}</div>}
          {fb.kind === "evaluation" && fb.criteria && <div className="grid g2" style={{ marginTop: 12, alignItems: "center" }}><Criteria c={fb.criteria} small /><div className="row" style={{ gap: 14, justifyContent: "center" }}><ScoreRing score={fb.score || 0} size={92} stroke={9} label="EXPERT" />{fb.recommendation && <Badge kind={REC[fb.recommendation]?.[1]}>{REC[fb.recommendation]?.[0]}</Badge>}</div></div>}
          {fb.dispute?.status && fb.dispute.status !== "none" && (
            <div className="callout small" style={{ marginTop: 10, borderColor: fb.dispute.status === "open" ? "var(--warning)" : "var(--success)" }}>
              <b>{fb.dispute.status === "open" ? "⚖ Disputed" : "✓ Dispute resolved"}:</b> {fb.dispute.reason}{fb.dispute.response && <div style={{ marginTop: 4 }}><b>Evaluator response:</b> {fb.dispute.response}</div>}
            </div>)}
        </div>
        {actions && <div className="row no-print" style={{ gap: 6 }}>{actions}</div>}
      </div>
    </div>
  );
}
