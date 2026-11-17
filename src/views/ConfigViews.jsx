import { useEffect, useMemo, useRef, useState } from "react";
import { CheckCircle2, Cpu, Lock, Plug, Plus, RefreshCw, RotateCcw, Save, Send, Trash2, Zap } from "lucide-react";
import api from "../api/client.js";
import { act, useLive } from "../lib/live.js";
import { toast } from "../lib/toast.js";
import { errMsg } from "../api/client.js";
import { roleLabel, METRIC_LABELS, scoreColor } from "../lib/format.js";
import { Alert, Async, Badge, Button, Card, Field, PageHeader, Slider, Toggle, confirmDialog } from "../components/ui.jsx";
import { ScoreRing } from "../components/charts.jsx";

const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

// Loads one config group, keeps an editable draft, and saves it back (changes then reach every user live)
function useCfg(key) {
  const q = useLive("/config");
  const server = q.data?.[key];
  const [draft, setDraft] = useState(null);
  const [busy, setBusy] = useState(false);
  const prevServer = useRef(undefined);
  // Adopt server changes (e.g. another superadmin saved) unless the user has unsaved edits
  useEffect(() => { if (server !== undefined && (draft === null || same(draft, prevServer.current))) setDraft(structuredClone(server)); prevServer.current = server; }, [JSON.stringify(server)]);
  const dirty = draft !== null && !same(draft, server);
  const save = async (msg = "Settings saved – applied platform-wide instantly") => { setBusy(true); const ok = await act(() => api.put(`/config/${key}`, draft), msg); setBusy(false); return ok; };
  const reset = async () => { if (await confirmDialog({ title: "Reset to defaults?", message: "This restores the factory settings for this section.", confirmText: "Reset", danger: true })) { const ok = await act(() => api.post(`/config/${key}/reset`), "Reset to defaults"); if (ok) setDraft(null); } };
  return { q, server, draft, setDraft, dirty, busy, save, reset, extra: q.data };
}

const SaveBar = ({ c, label }) => (
  <div className="row wrap mt" style={{ gap: 12 }}>
    <Button icon={Save} loading={c.busy} disabled={!c.dirty} onClick={() => c.save()}>{c.dirty ? label || "Save changes" : "All changes saved"}</Button>
    {c.dirty && <Button variant="ghost" onClick={() => c.setDraft(structuredClone(c.server))}>Discard</Button>}
    <Button variant="ghost" icon={RotateCcw} onClick={c.reset} style={{ marginLeft: "auto" }}>Reset to defaults</Button>
  </div>
);
const Row = ({ title, desc, children }) => <div className="row between" style={{ padding: "14px 0", borderBottom: "1px solid var(--border)", gap: 20 }}><div><b>{title}</b>{desc && <div className="small muted">{desc}</div>}</div><div className="row" style={{ flex: "none" }}>{children}</div></div>;

export default function ConfigViews({ page }) {
  const P = { platform: Platform, features: Features, permissions: Permissions, categories: Categories, engine: Engine, scoring: Scoring, integrations: Integrations }[page];
  return <P />;
}

function Platform() {
  const c = useCfg("platform");
  const d = c.draft;
  const set = (patch) => c.setDraft({ ...d, ...patch });
  return (
    <>
      <PageHeader title="Platform settings" subtitle="Branding, registration, maintenance mode and the site-wide banner. Saved changes appear for every visitor immediately." />
      <Async q={c.q}>{() => d && (
        <div className="grid g-main">
          <Card>
            <div className="col"><Field label="Platform name"><input className="input" value={d.name} onChange={(e) => set({ name: e.target.value })} maxLength={40} /></Field>
              <Field label="Tagline"><input className="input" value={d.tagline} onChange={(e) => set({ tagline: e.target.value })} maxLength={140} /></Field>
              <Field label="Support email"><input className="input" value={d.supportEmail} onChange={(e) => set({ supportEmail: e.target.value })} /></Field></div>
            <Row title="Open registration" desc="When off, new people cannot sign up."><Toggle label="Open registration" checked={d.registrationOpen} onChange={(v) => set({ registrationOpen: v })} /></Row>
            <Row title="Verify mentors & experts" desc="New mentor/expert accounts need admin approval before giving feedback."><Toggle label="Require verification" checked={d.requireVerification} onChange={(v) => set({ requireVerification: v })} /></Row>
            <Row title="Maintenance mode" desc="Only admins and superadmins can sign in."><Toggle label="Maintenance" checked={d.maintenance.enabled} onChange={(v) => set({ maintenance: { ...d.maintenance, enabled: v } })} /></Row>
            {d.maintenance.enabled && <Field label="Maintenance message" className="mt-s"><input className="input" value={d.maintenance.message} onChange={(e) => set({ maintenance: { ...d.maintenance, message: e.target.value } })} /></Field>}
            <Row title="Announcement banner" desc="Shown at the top of every page for all users."><Toggle label="Banner" checked={d.banner.enabled} onChange={(v) => set({ banner: { ...d.banner, enabled: v } })} /></Row>
            {d.banner.enabled && <div className="grid g2 mt-s"><Field label="Banner text"><input className="input" value={d.banner.text} onChange={(e) => set({ banner: { ...d.banner, text: e.target.value } })} /></Field><Field label="Tone"><select className="input" value={d.banner.tone} onChange={(e) => set({ banner: { ...d.banner, tone: e.target.value } })}>{["info", "success", "warning", "danger"].map((t) => <option key={t}>{t}</option>)}</select></Field></div>}
            <SaveBar c={c} />
          </Card>
          <Card title="Live preview">
            <div className="callout"><b style={{ fontFamily: "var(--font-display)", fontSize: 20 }}>{d.name}</b><p className="muted small">{d.tagline}</p></div>
            {d.banner.enabled && d.banner.text && <div className={`banner ${d.banner.tone} mt`} style={{ borderRadius: 12 }}>{d.banner.text}</div>}
            <div className="row wrap mt"><Badge kind={d.registrationOpen ? "success" : "danger"}>Registration {d.registrationOpen ? "open" : "closed"}</Badge><Badge kind={d.maintenance.enabled ? "warning" : "success"}>{d.maintenance.enabled ? "Maintenance ON" : "Live"}</Badge></div>
          </Card>
        </div>)}</Async>
    </>
  );
}

const FEATURE_INFO = {
  aiValidation: ["AI idea validation", "Founders can validate ideas and generate reports. Off = drafts only."], compareIdeas: ["Compare ideas", "Side-by-side comparison page."], mentorRequests: ["Mentor requests", "Founders can request a mentor from admins."],
  sessions: ["Mentor sessions", "Scheduling and viewing mentoring sessions."], resourceHub: ["Resource hub", "Guidelines, templates, playbooks, announcements."], evaluations: ["Expert evaluations", "Evaluation queue, scorecards and disputes."],
  moderation: ["Moderation & reporting", "Users can report content; moderators review it."], publicStats: ["Public live statistics", "Show live platform numbers on the landing page."],
};
function Features() {
  const c = useCfg("features");
  const d = c.draft;
  return (
    <>
      <PageHeader title="Feature management" subtitle="Switch modules on or off. Menus, pages and API endpoints react immediately for every user." />
      <Async q={c.q}>{() => d && <Card>{Object.entries(FEATURE_INFO).map(([k, [t, desc]]) => <Row key={k} title={t} desc={desc}><Badge kind={d[k] ? "success" : "draft"}>{d[k] ? "Enabled" : "Disabled"}</Badge><Toggle label={t} checked={d[k]} onChange={(v) => c.setDraft({ ...d, [k]: v })} /></Row>)}<SaveBar c={c} /></Card>}</Async>
    </>
  );
}

function Permissions() {
  const c = useCfg("permissions");
  const d = c.draft, list = c.extra?.permissionList || [];
  const roles = ["entrepreneur", "mentor", "industry_expert", "moderator", "admin", "superadmin"];
  const toggle = (role, key) => c.setDraft({ ...d, [role]: d[role].includes(key) ? d[role].filter((k) => k !== key) : [...d[role], key] });
  return (
    <>
      <PageHeader title="Roles & permissions" subtitle="Decide what each role can do. The API enforces this matrix on every request — try removing a permission from Admin and watch their buttons disappear." />
      <Async q={c.q}>{() => d && (
        <Card className="pad0"><div className="table-wrap"><div className="perm-grid" style={{ minWidth: 760 }}>
          <div className="h">Permission</div>{roles.map((r) => <div className="h" key={r}>{roleLabel(r)}</div>)}
          {list.map((p) => [<div key={p.key}><div><b className="small">{p.label}</b><div className="tiny faint">{p.group} · {p.key}</div></div></div>, ...roles.map((r) => <div key={p.key + r}>{r === "superadmin" ? <Lock size={15} color="var(--faint)" /> : <Toggle label={`${r} ${p.key}`} checked={d[r]?.includes(p.key)} onChange={() => toggle(r, p.key)} />}</div>)])}
        </div></div><div style={{ padding: "0 22px 22px" }}><SaveBar c={c} label="Save permissions" /></div></Card>)}</Async>
    </>
  );
}

function Categories() {
  const c = useCfg("categories");
  const usage = useLive("/stats/market");
  const [name, setName] = useState("");
  const d = c.draft;
  const used = Object.fromEntries((usage.data?.industries || []).map((i) => [i.name, i.count]));
  const upd = (i, patch) => c.setDraft(d.map((x, n) => (n === i ? { ...x, ...patch } : x)));
  return (
    <>
      <PageHeader title="Idea categories" subtitle="These drive the industry dropdown on the idea form, analytics and the landing page." />
      <Async q={c.q}>{() => d && (
        <Card>
          <div className="col">{d.map((cat, i) => (
            <div key={i} className="row wrap" style={{ gap: 12 }}>
              <input type="color" value={cat.color} onChange={(e) => upd(i, { color: e.target.value })} aria-label="Colour" />
              <input className="input grow" style={{ minWidth: 160 }} value={cat.name} onChange={(e) => upd(i, { name: e.target.value })} maxLength={30} />
              <span className="small muted" style={{ width: 90 }}>{used[cat.name] || 0} ideas</span>
              <Toggle label={`${cat.name} enabled`} checked={cat.enabled} onChange={(v) => upd(i, { enabled: v })} />
              <button className="icon-btn" disabled={(used[cat.name] || 0) > 0} title={used[cat.name] ? "In use – disable it instead" : "Delete"} onClick={() => c.setDraft(d.filter((_, n) => n !== i))} aria-label="Delete category"><Trash2 size={16} /></button>
            </div>))}</div>
          <div className="row mt"><input className="input" style={{ maxWidth: 280 }} placeholder="New category name" value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && name.trim()) { c.setDraft([...d, { name: name.trim(), enabled: true, color: "#8b5cf6" }]); setName(""); } }} /><Button variant="outline" icon={Plus} disabled={!name.trim()} onClick={() => { c.setDraft([...d, { name: name.trim(), enabled: true, color: "#8b5cf6" }]); setName(""); }}>Add</Button></div>
          <SaveBar c={c} />
        </Card>)}</Async>
    </>
  );
}

function Engine() {
  const c = useCfg("engine");
  const d = c.draft;
  const [test, setTest] = useState(null);
  const [testing, setTesting] = useState(false);
  const run = async () => { setTesting(true); setTest(null); try { setTest((await api.post("/config/engine/test")).data); } catch (e) { toast.error(errMsg(e)); } setTesting(false); };
  const set = (p) => c.setDraft({ ...d, ...p });
  const key = c.extra?.geminiKeyPresent;
  return (
    <>
      <PageHeader title="Validation engine" subtitle="Control which AI provider scores ideas and how it behaves." />
      <Async q={c.q}>{() => d && (
        <div className="grid g-main">
          <Card>
            <Row title="Engine enabled" desc="Master switch for AI scoring."><Toggle label="Engine" checked={d.enabled} onChange={(v) => set({ enabled: v })} /></Row>
            <div className="grid g2 mt"><Field label="Provider"><select className="input" value={d.provider} onChange={(e) => set({ provider: e.target.value })}><option value="gemini">Google Gemini</option><option value="demo">Built-in demo analysis</option></select></Field>
              <Field label="Model"><input className="input" value={d.model} onChange={(e) => set({ model: e.target.value })} disabled={d.provider !== "gemini"} /></Field></div>
            <Field label={`Creativity (temperature): ${d.temperature}`} className="mt"><Slider min={0} max={1} step={0.05} value={d.temperature} onChange={(v) => set({ temperature: v })} /></Field>
            <Field label="Target market" className="mt"><input className="input" value={d.market} onChange={(e) => set({ market: e.target.value })} /></Field>
            <Row title="Fall back to demo analysis" desc="If the AI provider fails, still produce a report instead of an error."><Toggle label="Fallback" checked={d.fallbackToDemo} onChange={(v) => set({ fallbackToDemo: v })} /></Row>
            <SaveBar c={c} />
          </Card>
          <div className="col">
            <Card title="Provider status" icon={Cpu}><div className="col"><div className="row between"><span>Gemini API key</span><Badge kind={key ? "success" : "warning"}>{key ? "Configured" : "Missing"}</Badge></div>{!key && <Alert kind="info">Add <code>GEMINI_API_KEY</code> to the backend <code>.env</code> to use Gemini. Until then the demo engine is used.</Alert>}</div></Card>
            <Card title="Test run" icon={Zap}><p className="small muted mb">Analyses a sample idea with the <b>saved</b> settings (nothing is stored).</p><Button icon={Zap} loading={testing} onClick={run}>Run test</Button>
              {test && <div className="callout mt"><div className="row between"><b>Result</b><Badge kind={test.source === "gemini" ? "success" : "demo"}>{test.source}</Badge></div><div className="small muted mt-s">Score {test.score} ({test.verdict}) · {test.ms} ms</div></div>}</Card>
          </div>
        </div>)}</Async>
    </>
  );
}

const SAMPLE = { marketDemand: 85, competition: 40, feasibility: 70, financial: 55, risk: 60 };
function Scoring() {
  const c = useCfg("scoring");
  const d = c.draft;
  const [busy, setBusy] = useState(false);
  const total = d ? Object.values(d.weights).reduce((a, b) => a + b, 0) : 0;
  const preview = useMemo(() => { if (!d || !total) return 0; return Math.round(Object.keys(SAMPLE).reduce((s, k) => s + SAMPLE[k] * (d.weights[k] / total), 0)); }, [d, total]);
  const verdict = d ? (preview >= d.thresholds.go ? "GO" : preview >= d.thresholds.improve ? "IMPROVE" : "AVOID") : "";
  const recalc = async () => { setBusy(true); try { if (c.dirty) { await api.put("/config/scoring", d); } const r = (await api.post("/config/scoring/recalculate")).data; toast.success("Recalculated all reports", `${r.changed} of ${r.total} scores changed · ${r.verdictChanges} verdicts changed`); } catch (e) { toast.error(errMsg(e)); } setBusy(false); };
  return (
    <>
      <PageHeader title="Scoring configuration" subtitle="Tune how the five metrics combine into the final score and where the GO / IMPROVE / AVOID lines sit." />
      <Async q={c.q}>{() => d && (
        <div className="grid g-main">
          <Card>
            <div className="col" style={{ gap: 20 }}>{Object.keys(METRIC_LABELS).map((k) => (
              <div key={k}><div className="row between small"><b>{METRIC_LABELS[k].replace(/ \(.*/, "")}</b><span className="mono">{d.weights[k]} <span className="faint">({total ? Math.round((d.weights[k] / total) * 100) : 0}% of total)</span></span></div><Slider value={d.weights[k]} onChange={(v) => c.setDraft({ ...d, weights: { ...d.weights, [k]: v } })} /></div>))}</div>
            <hr className="divider" />
            <div className="grid g2"><div><div className="row between small"><b>GO threshold</b><span className="mono">≥ {d.thresholds.go}</span></div><Slider min={1} max={100} value={d.thresholds.go} onChange={(v) => c.setDraft({ ...d, thresholds: { ...d.thresholds, go: v } })} /></div>
              <div><div className="row between small"><b>IMPROVE threshold</b><span className="mono">≥ {d.thresholds.improve}</span></div><Slider min={0} max={99} value={d.thresholds.improve} onChange={(v) => c.setDraft({ ...d, thresholds: { ...d.thresholds, improve: v } })} /></div></div>
            {d.thresholds.improve >= d.thresholds.go && <div className="mt"><Alert kind="warning">GO must be higher than IMPROVE.</Alert></div>}
            <SaveBar c={c} label="Save scoring" />
            <div className="callout mt"><b>Apply to existing ideas</b><p className="small muted">Saving only affects <i>new</i> reports. Recalculate to re-score every stored report with these settings — dashboards, founders and admins see the new scores instantly.</p><Button variant="outline" icon={RefreshCw} loading={busy} onClick={recalc} style={{ marginTop: 10 }}>{c.dirty ? "Save & recalculate all" : "Recalculate all reports"}</Button></div>
          </Card>
          <Card title="Live preview" icon={Zap}>
            <p className="small muted mb">A sample idea with fixed metrics, scored with your current sliders.</p>
            <div className="center"><ScoreRing score={preview} size={160} label={verdict} color={scoreColor(preview)} /></div>
            <div className="col mt" style={{ gap: 6 }}>{Object.entries(SAMPLE).map(([k, v]) => <div key={k} className="row between small"><span className="muted">{METRIC_LABELS[k].replace(/ \(.*/, "")}</span><b className="mono">{v}</b></div>)}</div>
          </Card>
        </div>)}</Async>
    </>
  );
}

function Integrations() {
  const c = useCfg("integrations");
  const d = c.draft;
  const [res, setRes] = useState(null);
  const [busy, setBusy] = useState(false);
  const w = d?.webhook;
  const setW = (p) => c.setDraft({ ...d, webhook: { ...w, ...p } });
  const test = async () => { setBusy(true); try { setRes((await api.post("/config/integrations/webhook/test", { url: w.url })).data); } catch (e) { toast.error(errMsg(e)); } setBusy(false); };
  return (
    <>
      <PageHeader title="Integrations" subtitle="Connect Soch2Startup to external services." />
      <Async q={c.q}>{() => d && (
        <div className="grid g2">
          <Card title="Google Gemini" icon={Cpu}><div className="row between"><span className="muted small">Server-side API key</span><Badge kind={c.extra?.geminiKeyPresent ? "success" : "warning"}>{c.extra?.geminiKeyPresent ? "Connected" : "Not configured"}</Badge></div><p className="small muted mt-s">The key is stored in the backend <code>.env</code> and never sent to the browser. Configure the model under <b>Validation engine</b>.</p></Card>
          <Card title="Outgoing webhook" icon={Plug}>
            <Row title="Enabled" desc="POSTs a JSON event whenever the selected things happen."><Toggle label="Webhook enabled" checked={w.enabled} onChange={(v) => setW({ enabled: v })} /></Row>
            <Field label="Endpoint URL" className="mt"><input className="input" placeholder="https://hooks.example.com/soch2startup" value={w.url} onChange={(e) => setW({ url: e.target.value })} /></Field>
            <div className="row wrap mt">{["idea.created", "idea.reviewed"].map((ev) => <label key={ev} className="chip chip-btn" style={{ cursor: "pointer" }}><input type="checkbox" className="check" checked={w.events.includes(ev)} onChange={(e) => setW({ events: e.target.checked ? [...w.events, ev] : w.events.filter((x) => x !== ev) })} />{ev}</label>)}</div>
            <div className="row wrap mt"><Button variant="outline" icon={Send} loading={busy} disabled={!w.url} onClick={test}>Send test event</Button>{res && <Badge kind={res.ok ? "success" : "danger"}>{res.ok ? <CheckCircle2 size={12} /> : null} {res.ok ? `OK ${res.status} · ${res.ms}ms` : res.error || `HTTP ${res.status}`}</Badge>}</div>
            <SaveBar c={c} />
          </Card>
        </div>)}</Async>
    </>
  );
}
