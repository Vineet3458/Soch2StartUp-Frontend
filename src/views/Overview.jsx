import { Link, useNavigate } from "react-router-dom";
import { Activity, Award, Bell, BookOpen, Calendar, CheckCircle2, Clock, Cpu, Database, FileCheck2, Flag, Gauge, GraduationCap, Lightbulb, MessageSquare, Radio, Rocket, Server, ShieldAlert, Sparkles, Star, Target, Timer, TrendingUp, Users, Zap } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { useLive } from "../lib/live.js";
import { ago, fmtDateTime } from "../lib/format.js";
import { Alert, Async, Avatar, Badge, Button, Card, Empty, PageHeader, SkeletonGrid, Stat, StatusBadge, VerdictBadge } from "../components/ui.jsx";
import { AreaTrend, Bars, ScoreRing } from "../components/charts.jsx";
import { AdminDashboard } from "./AnalyticsView.jsx";
import { useConfig } from "../context/ConfigContext.jsx";

const greet = () => { const h = new Date().getHours(); return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening"; };
const Hello = ({ sub, children }) => { const { user } = useAuth(); return <PageHeader title={<>{greet()}, {user.name.split(" ")[0]}</>} subtitle={sub}>{children}</PageHeader>; };

export default function Overview() {
  const { user } = useAuth();
  const cfg = useConfig();
  if (user.role === "entrepreneur") return <Founder />;
  if (user.role === "superadmin") return <SystemOverview />;
  if (user.role === "admin") return cfg.can("analytics.view") ? <AdminDashboard /> : <Alert kind="info">Your role does not currently include analytics. Use the menu to access your tools.</Alert>;
  if (user.role === "mentor") return <MentorHome />;
  if (user.role === "industry_expert") return <ExpertHome />;
  return <ModeratorHome />;
}

function Activity_({ limit = 6 }) {
  const n = useLive("/notifications");
  const items = (n.data?.items || []).slice(0, limit);
  return (
    <Card title="Live activity" icon={Radio} sub={n.data?.unread ? `${n.data.unread} unread` : ""}>
      {!items.length ? <p className="muted small">Activity will appear here in real time.</p> : <div className="list">{items.map((x) => <div className="list-item" key={x._id}><div className="notif-ico"><Bell size={15} /></div><div className="grow"><div className="small" style={{ fontWeight: x.read ? 400 : 700 }}>{x.title}</div>{x.message && <div className="tiny faint truncate">{x.message}</div>}</div><span className="tiny faint">{ago(x.createdAt)}</span></div>)}</div>}
      <Link to="/app/notifications" className="small" style={{ display: "block", marginTop: 12 }}>All notifications →</Link>
    </Card>
  );
}

function Founder() {
  const nav = useNavigate();
  const q = useLive("/ideas");
  const sessions = useLive("/sessions");
  const res = useLive("/resources");
  const ideas = q.data || [];
  const scored = ideas.filter((i) => i.report);
  const avg = scored.length ? Math.round(scored.reduce((s, i) => s + i.report.score, 0) / scored.length) : 0;
  const best = [...scored].sort((a, b) => b.report.score - a.report.score)[0];
  const next = (sessions.data || []).filter((s) => s.status === "scheduled" && new Date(s.scheduledAt) > Date.now())[0];
  const trend = [...scored].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)).map((i) => ({ date: i.title.slice(0, 12), count: i.report.score }));
  const attention = ideas.filter((i) => i.status === "changes_requested");
  return (
    <>
      <Hello sub="Here's what's happening with your startup ideas — updated live."><Button icon={Sparkles} size="lg" onClick={() => nav("/app/validate")}>Validate new idea</Button></Hello>
      {attention.map((i) => <div className="mb" key={i._id}><Alert kind="warning"><b>Action needed:</b> changes were requested on “{i.title}”. <Link to={`/app/validate?edit=${i._id}`}>Edit & resubmit →</Link></Alert></div>)}
      <Async q={q} skeleton={<SkeletonGrid n={4} h={110} />}>{() => (
        <div className="col gap-l stagger">
          <div className="grid g4">
            <Stat icon={Lightbulb} label="Total ideas" value={ideas.length} tone="purple" sub={`${ideas.filter((i) => i.status === "draft").length} drafts`} to="/app/ideas" />
            <Stat icon={Target} label="Average score" value={avg} tone="cyan" sub={best ? `Best: ${best.report.score}` : "Validate your first idea"} />
            <Stat icon={CheckCircle2} label="Approved" value={ideas.filter((i) => i.status === "approved").length} tone="green" to="/app/ideas?f=validated" />
            <Stat icon={MessageSquare} label="Feedback received" value={ideas.reduce((s, i) => s + (i.feedbackCount || 0), 0)} tone="pink" />
          </div>
          <div className="grid g-main">
            <Card title="Score by idea" icon={TrendingUp}>{trend.length ? <Bars data={trend.map((t) => ({ name: t.date, Score: t.count }))} bars={[{ key: "Score", name: "AI score", color: "var(--primary)" }]} max={100} height={240} /> : <Empty icon={Lightbulb} title="No scores yet">Validate an idea to see your trend.</Empty>}</Card>
            <div className="col">
              <Card title="Next mentoring session" icon={Calendar}>{next ? <div><b>{next.title}</b><div className="small muted mt-s">{fmtDateTime(next.scheduledAt)} · {next.durationMin} min</div><div className="small muted">with {next.mentor?.name}</div>{next.link && <a href={next.link} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm mt-s">Join</a>}</div> : <p className="muted small">Nothing scheduled. Request a mentor from an idea page.</p>}</Card>
              <Activity_ limit={4} />
            </div>
          </div>
          <Card title="Your ideas" icon={Lightbulb} sub={<Link to="/app/ideas">View all</Link>}>
            {!ideas.length ? <Empty icon={Rocket} title="Launch your first idea">It takes under a minute to get an AI-powered report.<div className="mt"><Link to="/app/validate" className="btn">Validate an idea</Link></div></Empty> :
              <div className="list">{ideas.slice(0, 5).map((i) => <div key={i._id} className="list-item" style={{ cursor: "pointer" }} onClick={() => nav(`/app/ideas/${i._id}`)}>{i.report ? <ScoreRing score={i.report.score} size={52} stroke={6} label="" /> : <Badge kind="draft">Draft</Badge>}<div className="grow"><b>{i.title}</b><div className="tiny faint">{i.industry} · {ago(i.createdAt)}</div></div><StatusBadge value={i.status} />{i.report && <VerdictBadge verdict={i.report.verdict} />}</div>)}</div>}
          </Card>
          <Card title="Recommended for you" icon={BookOpen} sub={<Link to="/app/resources">Resource hub</Link>}>
            <div className="grid g3">{(res.data || []).filter((r) => r.kind !== "announcement").slice(0, 3).map((r) => <Link key={r._id} to="/app/resources" className="card tight hover" style={{ color: "var(--text)" }}><Badge kind="primary">{r.kind}</Badge><b style={{ display: "block", margin: "8px 0 4px" }}>{r.title}</b><span className="small muted">{r.summary}</span></Link>)}</div>
          </Card>
        </div>)}</Async>
    </>
  );
}

const svcIcon = { api: Server, db: Database, ai: Cpu, realtime: Radio, webhook: Zap };
function SystemOverview() {
  const h = useLive("/system/health", { poll: 8000 });
  return (
    <>
      <PageHeader title="System overview" subtitle="Live health of every platform service. Refreshes automatically." />
      <Async q={h} skeleton={<SkeletonGrid n={8} h={110} />}>{(d) => (
        <div className="col gap-l stagger">
          <div className="grid g4">{d.services.map((s) => { const I = svcIcon[s.key] || Server; return (
            <Card key={s.key} hover><div className="row between"><div className="stat" style={{ padding: 0 }}><div className="ico g-purple" style={{ width: 42, height: 42 }}><I size={20} /></div></div><StatusBadge value={s.status} label={s.status} /></div><b style={{ display: "block", marginTop: 12 }}>{s.name}</b><div className="small muted truncate">{s.detail}</div></Card>); })}</div>
          <div className="grid g4">
            <Stat icon={Timer} label="Uptime" value={d.uptimeSec >= 3600 ? Math.round(d.uptimeSec / 360) / 10 : Math.round(d.uptimeSec / 60)} suffix={d.uptimeSec >= 3600 ? " h" : " min"} decimals={d.uptimeSec >= 3600 ? 1 : 0} tone="green" />
            <Stat icon={Gauge} label="Avg response" value={d.avgMs} suffix=" ms" tone="cyan" sub={`${d.requests} requests served`} />
            <Stat icon={Users} label="Online now" value={d.online} tone="purple" sub={`${d.connections} live connections · ${d.activeUsers} active accounts`} />
            <Stat icon={ShieldAlert} label="Errors (24h)" value={d.errors24h} tone={d.errors24h ? "orange" : "green"} sub={`${d.memoryMb} MB memory · ${d.node}`} />
          </div>
          <div className="grid g-main">
            <Card title="API requests per minute" icon={Activity}>{d.perMinute.length ? <AreaTrend data={d.perMinute.map((p) => ({ date: new Date(p.t).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }), count: p.count }))} fmtX={(v) => v} name="Requests" color="var(--accent)" /> : <p className="muted">Collecting data…</p>}</Card>
            <Card title="Recent system events" icon={Clock} sub={<Link to="/app/logs">All logs</Link>}>{d.recent.length ? <div className="list">{d.recent.map((l) => <div className="list-item" key={l._id}><Badge kind={l.level === "error" ? "danger" : l.level === "warn" ? "warning" : "info"}>{l.level}</Badge><div className="grow small"><code>{l.action}</code><div className="tiny faint truncate">{l.message}</div></div><span className="tiny faint">{ago(l.createdAt)}</span></div>)}</div> : <p className="muted small">No events yet.</p>}</Card>
          </div>
          <div className="grid g3">{[["Platform settings", "/app/platform", Gauge], ["Feature management", "/app/features", Zap], ["Scoring configuration", "/app/scoring", Target]].map(([l, to, I]) => <Link key={to} to={to} className="card hover row" style={{ color: "var(--text)" }}><I size={20} color="var(--primary)" /><b className="grow">{l}</b>→</Link>)}</div>
        </div>)}</Async>
    </>
  );
}

function MentorHome() {
  const nav = useNavigate();
  const a = useLive("/assignments", { params: { kind: "mentor" } });
  const s = useLive("/sessions");
  const fb = useLive("/feedback", { params: { kind: "guidance" } });
  const list = a.data || [];
  const up = (s.data || []).filter((x) => x.status === "scheduled" && new Date(x.scheduledAt) > Date.now());
  return (
    <>
      <Hello sub="Your mentees, sessions and guidance at a glance." />
      <Async q={a} skeleton={<SkeletonGrid n={4} h={110} />}>{() => (
        <div className="col gap-l stagger">
          <div className="grid g4">
            <Stat icon={Lightbulb} label="New assignments" value={list.filter((x) => x.stage === "assigned").length} tone="orange" to="/app/assignments" />
            <Stat icon={Activity} label="In progress" value={list.filter((x) => x.stage === "in_progress").length} tone="purple" to="/app/assignments?f=progress" />
            <Stat icon={Calendar} label="Upcoming sessions" value={up.length} tone="cyan" to="/app/sessions" />
            <Stat icon={Star} label="Guidance given" value={(fb.data || []).length} tone="green" to="/app/my-feedback" />
          </div>
          <div className="grid g-main">
            <Card title="Your active startups" icon={GraduationCap} sub={<Link to="/app/assignments">View all</Link>}>{!list.filter((x) => ["assigned", "in_progress"].includes(x.stage)).length ? <Empty icon={Lightbulb} title="No active startups">Claim ideas from the open pool.<div className="mt"><Link to="/app/assignments" className="btn">Browse pool</Link></div></Empty> :
              <div className="list">{list.filter((x) => ["assigned", "in_progress"].includes(x.stage)).slice(0, 5).map((x) => <div key={x._id} className="list-item" style={{ cursor: "pointer" }} onClick={() => nav(`/app/ideas/${x.idea._id}`)}><Avatar name={x.idea.user?.name} size={38} /><div className="grow"><b>{x.idea.title}</b><div className="tiny faint">{x.idea.user?.name} · {x.idea.industry}</div></div><StatusBadge value={x.stage} label={x.stage.replace("_", " ")} /></div>)}</div>}</Card>
            <div className="col"><Card title="Next sessions" icon={Calendar}>{up.length ? <div className="list">{up.slice(0, 3).map((x) => <div className="list-item" key={x._id}><div className="grow"><b className="small">{x.title}</b><div className="tiny faint">{fmtDateTime(x.scheduledAt)} · {x.founder?.name}</div></div></div>)}</div> : <p className="muted small">No sessions scheduled.</p>}</Card><Activity_ limit={4} /></div>
          </div>
        </div>)}</Async>
    </>
  );
}

function ExpertHome() {
  const nav = useNavigate();
  const a = useLive("/assignments", { params: { kind: "evaluation" } });
  const ev = useLive("/feedback", { params: { kind: "evaluation" } });
  const dis = useLive("/feedback", { params: { disputed: "true" } });
  const list = a.data || [];
  const evals = ev.data || [];
  const avg = evals.length ? Math.round(evals.reduce((s, x) => s + x.score, 0) / evals.length) : 0;
  const todo = list.filter((x) => ["assigned", "in_progress"].includes(x.stage));
  return (
    <>
      <Hello sub="Your evaluation queue and calibration summary."><Button icon={Star} onClick={() => nav("/app/evaluate")}>Start evaluating</Button></Hello>
      <Async q={a} skeleton={<SkeletonGrid n={4} h={110} />}>{() => (
        <div className="col gap-l stagger">
          <div className="grid g4">
            <Stat icon={Timer} label="Pending evaluations" value={todo.length} tone="orange" to="/app/evaluations?f=pending" />
            <Stat icon={CheckCircle2} label="Completed" value={list.filter((x) => x.stage === "completed").length} tone="green" to="/app/evaluations?f=completed" />
            <Stat icon={Gauge} label="Average score given" value={avg} tone="purple" to="/app/eval-reports" />
            <Stat icon={Flag} label="Open disputes" value={(dis.data || []).filter((x) => x.dispute?.status === "open").length} tone="pink" to="/app/disputes" />
          </div>
          <div className="grid g-main">
            <Card title="Evaluation queue" icon={Award} sub={<Link to="/app/evaluations">View all</Link>}>{!todo.length ? <Empty icon={CheckCircle2} title="You're all caught up" /> : <div className="list">{todo.slice(0, 5).map((x) => <div key={x._id} className="list-item"><div className="grow"><b>{x.idea.title}</b><div className="tiny faint">{x.idea.industry} · AI score {x.idea.report?.score ?? "—"}</div></div>{x.reEval && <Badge kind="warning">re-eval</Badge>}<Button size="sm" onClick={() => nav(`/app/evaluate?idea=${x.idea._id}`)}>Evaluate</Button></div>)}</div>}</Card>
            <Activity_ limit={5} />
          </div>
          {evals.length > 0 && <Card title="Your scores vs AI" icon={Cpu}><Bars data={evals.map((e) => ({ name: e.idea.title.slice(0, 12), Expert: e.score, AI: e.idea.report?.score || 0 }))} bars={[{ key: "Expert", name: "Expert", color: "var(--primary)" }, { key: "AI", name: "AI", color: "var(--accent)" }]} max={100} /></Card>}
        </div>)}</Async>
    </>
  );
}

function ModeratorHome() {
  const r = useLive("/reports");
  const list = r.data || [];
  const open = list.filter((x) => x.status === "open");
  const today = list.filter((x) => x.resolvedAt && Date.now() - new Date(x.resolvedAt) < 86400000).length;
  return (
    <>
      <Hello sub="Keep the community safe. New reports arrive here the moment they are filed." />
      <Async q={r} skeleton={<SkeletonGrid n={4} h={110} />}>{() => (
        <div className="col gap-l stagger">
          <div className="grid g4">
            <Stat icon={ShieldAlert} label="Open reports" value={open.length} tone="orange" />
            <Stat icon={Flag} label="Flagged ideas" value={open.filter((x) => x.targetType === "idea").length} tone="pink" to="/app/mod-ideas" />
            <Stat icon={MessageSquare} label="Reported feedback" value={open.filter((x) => x.targetType === "feedback").length} tone="purple" to="/app/mod-feedback" />
            <Stat icon={FileCheck2} label="Resolved (24h)" value={today} tone="green" />
          </div>
          <div className="grid g-main">
            <Card title="Latest open reports" icon={ShieldAlert}>{!open.length ? <Empty icon={CheckCircle2} title="Queue is clear 🎉" /> : <div className="list">{open.slice(0, 6).map((x) => <div className="list-item" key={x._id}><Badge kind="danger">{x.targetType}</Badge><div className="grow"><b className="small">{x.reason}</b><div className="tiny faint truncate">{x.targetInfo?.title || x.targetInfo?.name || x.targetInfo?.comment || "—"} · by {x.reporter?.name}</div></div><span className="tiny faint">{ago(x.createdAt)}</span><Link to={`/app/mod-${x.targetType === "idea" ? "ideas" : x.targetType === "feedback" ? "feedback" : "users"}`} className="btn btn-outline btn-sm">Review</Link></div>)}</div>}</Card>
            <Activity_ limit={5} />
          </div>
        </div>)}</Async>
    </>
  );
}
