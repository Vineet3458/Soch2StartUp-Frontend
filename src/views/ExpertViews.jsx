import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Award, Check, Download, Gauge, HandHeart, Play, Scale, Send, Star } from "lucide-react";
import api from "../api/client.js";
import { act, useLive } from "../lib/live.js";
import { csvDownload, fmtDate } from "../lib/format.js";
import { Alert, Async, Badge, Button, Card, Empty, Field, Modal, PageHeader, Slider, Stat, Tabs } from "../components/ui.jsx";
import DataTable from "../components/DataTable.jsx";
import { AssignmentTable } from "./MentorViews.jsx";
import { FeedbackItem } from "../components/idea.jsx";
import { Bars, Donut, Legend, RadarMetrics, ScoreRing } from "../components/charts.jsx";

export default function ExpertViews({ page }) {
  const P = { queue: Queue, evaluate: Evaluate, scorecards: Scorecards, disputes: Disputes, reports: EvalReports, quality: Quality }[page];
  return <P />;
}

const CRITERIA = [["problem", "Problem clarity"], ["market", "Market opportunity"], ["innovation", "Innovation"], ["execution", "Execution plan"], ["scalability", "Scalability"], ["team", "Team strength"]];
const overall = (c) => Math.round((CRITERIA.reduce((s, [k]) => s + (c[k] || 0), 0) / CRITERIA.length) * 10);

const FILTERS = { assigned: (a) => a.stage !== "archived", pending: (a) => ["assigned", "in_progress"].includes(a.stage) && !a.reEval, completed: (a) => a.stage === "completed", re: (a) => a.reEval };
function Queue() {
  const nav = useNavigate();
  const [sp, setSp] = useSearchParams();
  const f = FILTERS[sp.get("f")] ? sp.get("f") : "assigned";
  const q = useLive("/assignments", { params: { kind: "evaluation" } });
  const ideas = useLive("/ideas");
  const list = q.data || [];
  const rows = list.filter(FILTERS[f]);
  const pool = (ideas.data || []).filter((i) => ["submitted", "under_review"].includes(i.status) && !i.assignments?.some((a) => a.kind === "evaluation"));
  return (
    <>
      <PageHeader title="Evaluation tasks" subtitle="Ideas waiting for your expert scorecard. Disputed evaluations come back here as re-evaluations." />
      <div className="mb"><Tabs value={f} onChange={(t) => setSp({ f: t })} tabs={[["assigned", "Assigned"], ["pending", "Pending"], ["completed", "Completed"], ["re", "Re-evaluations"]].map(([id, label]) => ({ id, label, count: list.filter(FILTERS[id]).length }))} /></div>
      <Card className="pad0"><Async q={q}>{() => <AssignmentTable rows={rows} actions={(a) => <>
        {a.stage === "assigned" && <Button size="sm" variant="outline" icon={Play} onClick={() => act(() => api.patch(`/assignments/${a._id}`, { stage: "in_progress" }), "Started")}>Start</Button>}
        {a.stage !== "completed" && a.stage !== "archived" && <Button size="sm" icon={Star} onClick={() => nav(`/app/evaluate?idea=${a.idea._id}`)}>{a.reEval ? "Re-evaluate" : "Evaluate"}</Button>}
      </>} />}</Async></Card>
      <h2 style={{ fontSize: 20, margin: "34px 0 6px" }}>Open pool</h2><p className="muted small mb">Submitted ideas that nobody is evaluating yet.</p>
      <Card className="pad0"><DataTable rows={pool} pageSize={6} empty={<Empty icon={HandHeart} title="No ideas waiting for an evaluator" />} onRowClick={(i) => nav(`/app/ideas/${i._id}`)} columns={[
        { key: "title", label: "Idea", render: (i) => <div><b>{i.title}</b><div className="tiny faint">{i.industry} · {i.user?.name}</div></div> }, { key: "s", label: "AI score", render: (i) => i.report?.score ?? "—" }, { key: "d", label: "Submitted", render: (i) => fmtDate(i.createdAt) },
        { key: "a", label: "", sortable: false, render: (i) => <div className="actions" onClick={(e) => e.stopPropagation()}><Button size="sm" icon={HandHeart} onClick={() => act(() => api.post(`/ideas/${i._id}/claim`), "Added to your evaluation queue")}>Claim</Button></div> }]} /></Card>
    </>
  );
}

function Evaluate() {
  const nav = useNavigate();
  const [sp, setSp] = useSearchParams();
  const mine = useLive("/assignments", { params: { kind: "evaluation" } });
  const open = (mine.data || []).filter((a) => !["completed", "archived"].includes(a.stage));
  const id = sp.get("idea") || open[0]?.idea._id;
  useEffect(() => { if (!sp.get("idea") && open[0]) setSp({ idea: open[0].idea._id }, { replace: true }); }, [open.length]);
  const detail = useLive(`/ideas/${id}`, { skip: !id });
  const [c, setC] = useState({ problem: 5, market: 5, innovation: 5, execution: 5, scalability: 5, team: 5 });
  const [rec, setRec] = useState("maybe");
  const [comment, setComment] = useState("");
  const [busy, setBusy] = useState(false);
  const score = overall(c);
  const submit = async () => { setBusy(true); const ok = await act(() => api.post(`/ideas/${id}/feedback`, { kind: "evaluation", comment, criteria: c, recommendation: rec }), "Evaluation submitted – the founder was notified"); setBusy(false); if (ok) { setComment(""); nav("/app/evaluations?f=completed"); } };
  return (
    <>
      <PageHeader title="Idea evaluation" subtitle="Score the idea on six criteria. The overall score is calculated for you." />
      <Async q={mine}>{() => !id ? <Empty icon={Award} title="Nothing to evaluate">Claim an idea from <Link to="/app/evaluations">Evaluation tasks</Link>.</Empty> : (
        <div className="grid g-main">
          <Card>
            <Field label="Idea"><select className="input" value={id} onChange={(e) => setSp({ idea: e.target.value })}>{open.map((a) => <option key={a._id} value={a.idea._id}>{a.idea.title}{a.reEval ? " (re-evaluation)" : ""}</option>)}{!open.some((a) => a.idea._id === id) && <option value={id}>{detail.data?.title}</option>}</select></Field>
            <div className="col mt" style={{ gap: 20 }}>{CRITERIA.map(([k, l]) => <div key={k}><div className="row between small"><b>{l}</b><span className="mono" style={{ fontSize: 18, fontWeight: 700 }}>{c[k]}<span className="faint small">/10</span></span></div><Slider min={0} max={10} value={c[k]} onChange={(v) => setC({ ...c, [k]: v })} /></div>)}</div>
            <Field label="Recommendation" className="mt"><div className="row wrap">{[["strong_yes", "Strong yes", "success"], ["yes", "Yes", "success"], ["maybe", "Maybe", "warning"], ["no", "No", "danger"]].map(([v, l, k]) => <button key={v} type="button" className={`chip chip-btn ${rec === v ? "on" : ""}`} onClick={() => setRec(v)}><Badge kind={k}>{l}</Badge></button>)}</div></Field>
            <Field label="Evaluation comments" className="mt"><textarea className="input" style={{ minHeight: 150 }} value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Justify your scores — especially extremes. Be specific and constructive." /></Field>
            <div className="mt"><Button icon={Send} loading={busy} disabled={!comment.trim()} onClick={submit}>Submit evaluation</Button></div>
          </Card>
          <div className="col" style={{ position: "sticky", top: 90, alignSelf: "start" }}>
            <Card className="center glow-border"><ScoreRing score={score} size={150} label="YOUR SCORE" />{detail.data?.report && <div className="mt"><div className="small muted">AI score <b style={{ color: "var(--text)" }}>{detail.data.report.score}</b> · difference <b style={{ color: Math.abs(score - detail.data.report.score) > 15 ? "var(--warning)" : "var(--success)" }}>{score - detail.data.report.score > 0 ? "+" : ""}{score - detail.data.report.score}</b></div></div>}</Card>
            <Card title={detail.data?.title || "Idea"} sub={detail.data?.industry}><p className="small muted pre" style={{ maxHeight: 200, overflowY: "auto" }}>{detail.data?.description}</p>{detail.data && <Link to={`/app/ideas/${id}`} className="small">Open full report →</Link>}</Card>
          </div>
        </div>)}</Async>
    </>
  );
}

function useMyEvals() {
  const q = useLive("/feedback", { params: { kind: "evaluation" } });
  return { q, rows: q.data || [] };
}

function Scorecards() {
  const { q, rows } = useMyEvals();
  const avg = useMemo(() => Object.fromEntries(CRITERIA.map(([k]) => [k, rows.length ? Math.round(rows.reduce((s, r) => s + (r.criteria?.[k] || 0), 0) / rows.length * 10) : 0])), [rows]);
  return (
    <>
      <PageHeader title="Scorecards" subtitle="Every evaluation you have submitted, compared against the AI score." />
      <Async q={q}>{() => !rows.length ? <Empty icon={Gauge} title="No scorecards yet" /> : (
        <div className="col gap-l">
          <Card title="Your average scoring profile"><RadarMetrics height={260} series={[{ name: "Average (x/100)", metrics: { marketDemand: avg.market, competition: avg.innovation, feasibility: avg.execution, financial: avg.scalability, risk: avg.team }, color: "var(--accent)" }]} /><p className="tiny faint center">Axes mapped: Market, Innovation, Execution, Scalability, Team</p></Card>
          {rows.map((f) => <Card key={f._id}><div className="row between mb"><Link to={`/app/ideas/${f.idea._id}`}><b>{f.idea.title}</b></Link>{f.idea.report?.score != null && <span className="small muted">AI {f.idea.report.score} → Expert <b style={{ color: "var(--text)" }}>{f.score}</b> ({f.score - f.idea.report.score >= 0 ? "+" : ""}{f.score - f.idea.report.score})</span>}</div><FeedbackItem fb={f} /></Card>)}
        </div>)}</Async>
    </>
  );
}

function Disputes() {
  const q = useLive("/feedback", { params: { disputed: "true" } });
  const [tab, setTab] = useState("open");
  const [r, setR] = useState(null);
  const list = q.data || [];
  const rows = list.filter((f) => f.dispute?.status === tab);
  return (
    <>
      <PageHeader title="Calibration & disputes" subtitle="Founders can dispute a scorecard. Respond, optionally revise your scores, and keep evaluations calibrated." />
      <div className="mb"><Tabs value={tab} onChange={setTab} tabs={["open", "resolved"].map((id) => ({ id, label: id === "open" ? "Open" : "Resolved", count: list.filter((f) => f.dispute?.status === id).length }))} /></div>
      <Async q={q}>{() => !rows.length ? <Empty icon={Scale} title={tab === "open" ? "No open disputes 🎉" : "No resolved disputes yet"} /> : (
        <div className="col">{rows.map((f) => <Card key={f._id}><div className="row between mb"><Link to={`/app/ideas/${f.idea._id}`}><b>{f.idea.title}</b></Link><Badge kind={f.dispute.status === "open" ? "warning" : "success"}>{f.dispute.status}</Badge></div>
          <FeedbackItem fb={f} actions={f.dispute.status === "open" && <Button size="sm" onClick={() => setR({ f, response: "", criteria: { ...f.criteria } })}>Respond</Button>} /></Card>)}</div>)}</Async>
      <Modal open={Boolean(r)} onClose={() => setR(null)} width={620} title="Respond to dispute" footer={<><Button variant="outline" onClick={() => setR(null)}>Cancel</Button><Button disabled={!r?.response.trim()} onClick={async () => { const ok = await act(() => api.post(`/feedback/${r.f._id}/dispute/resolve`, { response: r.response, criteria: r.criteria }), "Dispute resolved – the founder was notified"); if (ok) setR(null); }}>Resolve</Button></>}>
        {r && <><Alert kind="warning"><b>Founder's reason:</b> {r.f.dispute.reason}</Alert>
          <p className="label mt">Revise scores (optional) — new overall: <b style={{ color: "var(--text)" }}>{overall(r.criteria)}</b></p>
          <div className="col mt-s">{CRITERIA.map(([k, l]) => <div key={k} className="crit" style={{ gridTemplateColumns: "130px 1fr 30px" }}><span className="muted">{l}</span><Slider min={0} max={10} value={r.criteria[k] || 0} onChange={(v) => setR({ ...r, criteria: { ...r.criteria, [k]: v } })} /><b className="mono">{r.criteria[k]}</b></div>)}</div>
          <Field label="Your response" className="mt"><textarea className="input" value={r.response} onChange={(e) => setR({ ...r, response: e.target.value })} placeholder="Explain your reasoning or what changed…" /></Field></>}
      </Modal>
    </>
  );
}

function EvalReports() {
  const { q, rows } = useMyEvals();
  const asg = useLive("/assignments", { params: { kind: "evaluation" } });
  const recs = ["strong_yes", "yes", "maybe", "no"].map((k, i) => ({ name: k.replace("_", " "), value: rows.filter((r) => r.recommendation === k).length, color: ["var(--success)", "var(--info)", "var(--warning)", "var(--danger)"][i] }));
  const avg = rows.length ? Math.round(rows.reduce((s, r) => s + r.score, 0) / rows.length) : 0;
  return (
    <>
      <PageHeader title="Evaluation reports" subtitle="A summary of your evaluation activity."><Button variant="outline" icon={Download} onClick={() => csvDownload("my-evaluations.csv", rows.map((r) => ({ idea: r.idea.title, score: r.score, ai: r.idea.report?.score ?? "", recommendation: r.recommendation, date: r.createdAt })))}>Export CSV</Button></PageHeader>
      <Async q={q}>{() => (
        <div className="col gap-l stagger">
          <div className="grid g4"><Stat icon={Award} label="Evaluations done" value={rows.length} tone="purple" /><Stat icon={Star} label="Average score given" value={avg} tone="cyan" /><Stat icon={Check} label="Completed tasks" value={(asg.data || []).filter((a) => a.stage === "completed").length} tone="green" /><Stat icon={Scale} label="Open disputes" value={rows.filter((r) => r.dispute?.status === "open").length} tone="orange" /></div>
          <div className="grid g2"><Card title="Recommendations"><Donut data={recs} /><Legend items={recs} /></Card><Card title="Scores given"><Bars data={rows.map((r) => ({ name: r.idea.title.slice(0, 14), Expert: r.score, AI: r.idea.report?.score || 0 }))} bars={[{ key: "Expert", name: "Expert", color: "var(--primary)" }, { key: "AI", name: "AI", color: "var(--accent)" }]} max={100} /></Card></div>
        </div>)}</Async>
    </>
  );
}

function Quality() {
  const { q, rows } = useMyEvals();
  const asg = useLive("/assignments", { params: { kind: "evaluation" } });
  const withAi = rows.filter((r) => r.idea.report?.score != null);
  const deltas = withAi.map((r) => r.score - r.idea.report.score);
  const bias = deltas.length ? Math.round(deltas.reduce((a, b) => a + b, 0) / deltas.length) : 0;
  const mad = deltas.length ? Math.round(deltas.reduce((a, b) => a + Math.abs(b), 0) / deltas.length) : 0;
  const done = (asg.data || []).filter((a) => a.completedAt);
  const turn = done.length ? (done.reduce((s, a) => s + (new Date(a.completedAt) - new Date(a.createdAt)), 0) / done.length / 86400000).toFixed(1) : "—";
  const disputeRate = rows.length ? Math.round((rows.filter((r) => r.dispute?.status && r.dispute.status !== "none").length / rows.length) * 100) : 0;
  return (
    <>
      <PageHeader title="Quality insights" subtitle="How well calibrated and timely your evaluations are, versus the AI baseline." />
      <Async q={q}>{() => (
        <div className="col gap-l stagger">
          <div className="grid g4"><Stat icon={Scale} label="Bias vs AI" value={bias} suffix=" pts" tone={Math.abs(bias) > 10 ? "orange" : "green"} sub={bias > 0 ? "You score higher than AI" : bias < 0 ? "You score lower than AI" : "Perfectly aligned"} /><Stat icon={Gauge} label="Avg. deviation" value={mad} suffix=" pts" tone="cyan" /><Stat icon={Check} label="Avg. turnaround" value={turn} suffix={turn === "—" ? "" : " days"} tone="purple" /><Stat icon={Scale} label="Dispute rate" value={disputeRate} suffix="%" tone="pink" /></div>
          <Card title="Calibration: expert minus AI score per idea">{withAi.length ? <Bars data={withAi.map((r) => ({ name: r.idea.title.slice(0, 14), Delta: r.score - r.idea.report.score }))} bars={[{ key: "Delta", name: "Expert − AI", color: "var(--primary)" }]} /> : <p className="muted">Submit evaluations to see calibration.</p>}</Card>
        </div>)}</Async>
    </>
  );
}
