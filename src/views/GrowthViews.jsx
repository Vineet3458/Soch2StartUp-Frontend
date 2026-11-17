import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Flag, Lightbulb, Plus, Printer, Save, Sparkles, Trash2, Wand2 } from "lucide-react";
import api from "../api/client.js";
import { act } from "../lib/live.js";
import { fmtDate } from "../lib/format.js";
import { Async, Badge, Button, Card, Empty, Field, PageHeader, Progress, confirmDialog } from "../components/ui.jsx";
import { useIdeaPicker } from "../components/IdeaPicker.jsx";

const NoIdeas = () => <Empty icon={Lightbulb} title="No ideas yet">Submit an idea first.<div className="mt"><Link to="/app/validate" className="btn">Validate an idea</Link></div></Empty>;
export default function GrowthViews({ page }) { return page === "plan" ? <Plan /> : <Roadmap />; }

const FIELDS = [["problem", "Problem", "What painful problem exist today and who has it?"], ["solution", "Solution", "How does your product solve it?"], ["customers", "Target customers", "Who will pay first?"], ["revenue", "Revenue model", "How will you earn money?"], ["goToMarket", "Go-to-market", "How will you reach your first 100 customers?"], ["financials", "Financial summary", "Costs, pricing, break-even, funding needs"], ["team", "Team & resources", "Who is building this and what is missing?"]];

function Plan() {
  const { q, idea, picker } = useIdeaPicker({ statuses: ["draft", "submitted", "under_review", "approved", "changes_requested"] });
  const [plan, setPlan] = useState({});
  const [dirty, setDirty] = useState(false);
  useEffect(() => { if (idea) { setPlan(idea.plan || {}); setDirty(false); } }, [idea?._id, idea?.updatedAt]);
  const set = (k, v) => { setPlan((p) => ({ ...p, [k]: v })); setDirty(true); };
  const filled = FIELDS.filter(([k]) => (plan[k] || "").trim()).length;
  const autofill = () => {
    const r = idea.report || {};
    const next = { ...plan }; const put = (k, v) => { if (!(next[k] || "").trim() && v) next[k] = v; };
    put("problem", idea.description.split(/(?<=[.!?])\s/)[0]); put("solution", idea.description); put("customers", (r.targetCustomers || []).join("; "));
    put("goToMarket", (r.recommendations || []).join(". ")); put("financials", r.feasibilityNote); put("team", `Team size: ${idea.teamSize}. Budget: ${idea.budget}.`); put("revenue", (idea.description.match(/[^.]*(subscription|commission|fee|revenue|pricing)[^.]*\./i) || [])[0]?.trim());
    setPlan(next); setDirty(true);
  };
  return (
    <>
      <PageHeader title="Business plan" subtitle="A living one-page plan for each idea. Autofill from your validation report, then refine.">{picker}</PageHeader>
      <Async q={q}>{() => !idea ? <NoIdeas /> : (
        <div className="grid g-main">
          <Card>
            <div className="col" style={{ gap: 18 }}>{FIELDS.map(([k, l, h]) => <Field key={k} label={l}><textarea className="input" value={plan[k] || ""} onChange={(e) => set(k, e.target.value)} placeholder={h} maxLength={2000} /></Field>)}</div>
          </Card>
          <div className="col" style={{ position: "sticky", top: 90, alignSelf: "start" }}>
            <Card title="Plan progress"><Progress value={(filled / FIELDS.length) * 100} /><p className="small muted mt-s">{filled} of {FIELDS.length} sections complete</p>
              <div className="col mt"><Button icon={Save} disabled={!dirty} onClick={async () => { await act(() => api.put(`/ideas/${idea._id}/plan`, plan), "Business plan saved"); setDirty(false); }}>{dirty ? "Save plan" : "Saved"}</Button>
                <Button variant="outline" icon={Wand2} onClick={autofill} disabled={!idea.report}>Autofill from report</Button><Button variant="ghost" icon={Printer} onClick={() => window.print()}>Print / PDF</Button></div></Card>
            <Card className="callout small muted">Your plan is private to you and shared with mentors and admins who review this idea.</Card>
          </div>
        </div>)}</Async>
    </>
  );
}

const COLS = [["todo", "To do", "var(--faint)"], ["doing", "In progress", "var(--warning)"], ["done", "Done", "var(--success)"]];
function Roadmap() {
  const { q, idea, picker } = useIdeaPicker({ statuses: ["draft", "submitted", "under_review", "approved", "changes_requested"] });
  const [form, setForm] = useState({ title: "", due: "" });
  const rm = idea?.roadmap || [];
  const save = (next, msg) => act(() => api.put(`/ideas/${idea._id}/roadmap`, { roadmap: next }), msg);
  const move = (m, dir) => { const i = COLS.findIndex(([k]) => k === m.status); const to = COLS[Math.max(0, Math.min(2, i + dir))][0]; save(rm.map((x) => (x._id === m._id ? { ...x, status: to } : x))); };
  const add = async () => { if (!form.title.trim()) return; const ok = await save([...rm, { title: form.title, due: form.due || undefined, status: "todo" }], "Milestone added"); if (ok) setForm({ title: "", due: "" }); };
  const done = rm.filter((m) => m.status === "done").length;
  return (
    <>
      <PageHeader title="MVP roadmap" subtitle="Plan milestones and move them across the board. Mentors and admins see your progress live.">{picker}</PageHeader>
      <Async q={q}>{() => !idea ? <NoIdeas /> : (
        <div className="col gap-l">
          <Card><div className="row between wrap"><div className="grow"><div className="row between small muted"><span><Flag size={14} /> {done} of {rm.length} milestones done</span><b>{rm.length ? Math.round((done / rm.length) * 100) : 0}%</b></div><Progress value={rm.length ? (done / rm.length) * 100 : 0} /></div></div>
            <div className="row wrap mt"><input className="input grow" style={{ minWidth: 220 }} placeholder="New milestone, e.g. Launch pilot with 20 users" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} onKeyDown={(e) => e.key === "Enter" && add()} /><input type="date" className="input" style={{ width: 170 }} value={form.due} onChange={(e) => setForm({ ...form, due: e.target.value })} /><Button icon={Plus} onClick={add} disabled={!form.title.trim()}>Add</Button></div></Card>
          <div className="kanban">{COLS.map(([k, l, c]) => (
            <div className="kcol" key={k}><div className="row between"><b style={{ color: c }}>{l}</b><Badge>{rm.filter((m) => m.status === k).length}</Badge></div>
              {rm.filter((m) => m.status === k).map((m) => (
                <div className="kcard" key={m._id}><div style={{ fontWeight: 600 }}>{m.title}</div>{m.due && <div className="tiny faint mt-s">Due {fmtDate(m.due)}</div>}
                  <div className="row between mt-s"><div className="row gap-s"><button className="icon-btn" style={{ width: 30, height: 30 }} disabled={k === "todo"} onClick={() => move(m, -1)} aria-label="Move back"><ArrowLeft size={14} /></button><button className="icon-btn" style={{ width: 30, height: 30 }} disabled={k === "done"} onClick={() => move(m, 1)} aria-label="Move forward"><ArrowRight size={14} /></button></div>
                    <button className="icon-btn" style={{ width: 30, height: 30 }} onClick={async () => { if (await confirmDialog({ title: "Remove milestone?", message: m.title, danger: true, confirmText: "Remove" })) save(rm.filter((x) => x._id !== m._id), "Milestone removed"); }} aria-label="Delete"><Trash2 size={14} /></button></div></div>))}
              {!rm.some((m) => m.status === k) && <p className="tiny faint center" style={{ padding: 20 }}>Nothing here</p>}</div>))}</div>
        </div>)}</Async>
      <span className="sr-only"><Sparkles /></span>
    </>
  );
}
