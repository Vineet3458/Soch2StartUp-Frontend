import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle2, Loader2, Save, Sparkles } from "lucide-react";
import api, { errMsg } from "../api/client.js";
import { useConfig } from "../context/ConfigContext.jsx";
import { invalidate, useLive } from "../lib/live.js";
import { toast } from "../lib/toast.js";
import { Alert, Button, Card, Field, PageHeader } from "../components/ui.jsx";

const BUDGETS = ["Under ₹1 lakh", "₹1–10 lakh", "Above ₹10 lakh"];
const TEAMS = ["Solo founder", "2–3 members", "4+ members"];
const STEPS = ["Reading your idea", "Sizing the market", "Mapping competitors", "Scoring feasibility & finances", "Assessing risks", "Writing your report"];

export default function ValidateIdea() {
  const nav = useNavigate();
  const cfg = useConfig();
  const [sp] = useSearchParams();
  const editId = sp.get("edit");
  const aiOn = cfg.feature("aiValidation");
  const cats = cfg.categories.filter((c) => c.enabled);
  const [form, setForm] = useState({ title: "", description: "", industry: "", budget: BUDGETS[1], teamSize: TEAMS[1] });
  const [busy, setBusy] = useState(null); // "draft" | "submit"
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  useEffect(() => { if (!form.industry && cats.length) setForm((f) => ({ ...f, industry: cats[0].name })); }, [cats.length]);
  const editLive = useLive(editId ? `/ideas/${editId}` : null);
  const loadedIdRef = useRef(null);
  useEffect(() => {
    if (editLive.data && loadedIdRef.current !== editId) {
      loadedIdRef.current = editId;
      const i = editLive.data;
      setForm({ title: i.title, description: i.description, industry: i.industry, budget: i.budget, teamSize: i.teamSize });
    } else if (editLive.error) {
      setError(errMsg(editLive.error));
    }
  }, [editLive.data, editLive.error, editId]);
  useEffect(() => { if (busy !== "submit") return; const t = setInterval(() => setStep((s) => Math.min(s + 1, STEPS.length - 1)), 1100); return () => clearInterval(t); }, [busy]);

  const save = async (asDraft) => {
    setError("");
    if (form.title.trim().length < 3) return setError("Please enter a title.");
    if (form.description.trim().length < 30) return setError("Describe your idea in at least 30 characters so the AI has enough to analyse.");
    setBusy(asDraft ? "draft" : "submit"); setStep(0);
    try {
      let res;
      if (editId) res = await api.patch(`/ideas/${editId}`, { ...form, submit: !asDraft });
      else res = await api.post("/ideas", { ...form, saveAsDraft: asDraft });
      invalidate();
      toast.success(asDraft ? "Draft saved" : "Validation complete!");
      nav(asDraft ? "/app/ideas?f=drafts" : `/app/ideas/${res.data._id}`);
    } catch (e) { setError(errMsg(e)); setBusy(null); }
  };

  if (busy === "submit") return (
    <div className="center" style={{ padding: "70px 0" }}>
      <div className="ai-orb" style={{ margin: "0 auto 36px" }} />
      <h2>Analysing {form.title || "your idea"}</h2>
      <p className="muted" style={{ margin: "8px 0 26px" }}>Our engine is evaluating demand, competition, feasibility, finances and risk.</p>
      <ul className="step-list col" style={{ listStyle: "none", padding: 0, maxWidth: 360, margin: "0 auto", textAlign: "left", gap: 10 }}>
        {STEPS.map((s, i) => <li key={s} className={i <= step ? "on" : ""}><span className="row" style={{ gap: 10 }}>{i < step ? <CheckCircle2 size={18} color="var(--success)" /> : i === step ? <Loader2 size={18} className="spin" color="var(--primary)" /> : <i style={{ width: 18 }} />}{s}</span></li>)}
      </ul>
    </div>
  );

  return (
    <>
      <PageHeader title={editId ? "Edit idea" : "Validate a new idea"} subtitle="Tell us about your startup. The more specific you are about the problem, customer and revenue, the sharper the analysis." />
      <div className="grid g-main">
        <Card className="glow-border">
          {error && <div className="mb"><Alert kind="error">{error}</Alert></div>}
          {!aiOn && <div className="mb"><Alert kind="warning">AI validation is currently switched off by the administrator. You can still save drafts.</Alert></div>}
          <div className="col" style={{ gap: 18 }}>
            <Field label="Idea title"><input className="input" value={form.title} onChange={set("title")} maxLength={120} placeholder="e.g. WhatsApp-first crop advisory for smallholder farmers" /></Field>
            <Field label="Describe your idea" hint={`${form.description.length}/4000 · mention the problem, target customer, solution and how you will earn revenue`}><textarea className="input" style={{ minHeight: 170 }} value={form.description} onChange={set("description")} maxLength={4000} placeholder="What problem are you solving, for whom, and how?" /></Field>
            <div className="grid g3">
              <Field label="Industry"><select className="input" value={form.industry} onChange={set("industry")}>{cats.map((c) => <option key={c.name}>{c.name}</option>)}</select></Field>
              <Field label="Budget"><select className="input" value={form.budget} onChange={set("budget")}>{BUDGETS.map((b) => <option key={b}>{b}</option>)}</select></Field>
              <Field label="Team size"><select className="input" value={form.teamSize} onChange={set("teamSize")}>{TEAMS.map((b) => <option key={b}>{b}</option>)}</select></Field>
            </div>
            <div className="row wrap" style={{ gap: 12 }}>
              <Button icon={Sparkles} size="lg" disabled={!aiOn} onClick={() => save(false)}>{editId ? "Save & re-validate" : "Validate with AI"}</Button>
              <Button variant="outline" size="lg" icon={Save} loading={busy === "draft"} onClick={() => save(true)}>Save as draft</Button>
            </div>
          </div>
        </Card>
        <div className="col">
          <Card title="Tips for a high score" icon={Sparkles}>
            <ul className="col muted small" style={{ paddingLeft: 18, margin: 0, gap: 10 }}>
              <li>Name a specific customer segment, not “everyone”.</li>
              <li>State how you will earn money (subscription, commission, licensing…).</li>
              <li>Explain what makes you different from incumbents.</li>
              <li>Mention a narrow starting niche or region.</li>
            </ul>
          </Card>
          <Card className="callout"><b>Live scoring</b><p className="small muted" style={{ marginTop: 6 }}>Weights and verdict thresholds are set by the platform admin (currently GO ≥ {cfg.scoring?.thresholds?.go}, IMPROVE ≥ {cfg.scoring?.thresholds?.improve}). If they change, your report updates too.</p></Card>
        </div>
      </div>
    </>
  );
}
