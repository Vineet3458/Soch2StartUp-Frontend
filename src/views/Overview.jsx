import { Link, useNavigate } from "react-router-dom";
import { Activity, Award, Bell, BookOpen, Calendar, CheckCircle2, ClipboardCheck, Clock, Cpu, Database, Eye, FileCheck2, Flag, Gauge, GraduationCap, Lightbulb, LineChart, MessageSquare, MessageSquareWarning, Radio, Rocket, Scale, ScrollText, Server, Settings, ShieldAlert, Sparkles, Star, Tags, Target, Timer, TrendingUp, Users, UserX, Zap } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { useLive } from "../lib/live.js";
import { ago, fmtDateTime } from "../lib/format.js";
import { Alert, Async, Avatar, Badge, Card, Empty, SkeletonGrid, Stat, StatusBadge, VerdictBadge } from "../components/ui.jsx";
import { AreaTrend, Bars, ScoreRing } from "../components/charts.jsx";
import { AdminDashboard } from "./AnalyticsView.jsx";
import { useConfig } from "../context/ConfigContext.jsx";
import { Spotlight, SpotlightCard, ShimmerButton, FlipWords, Meteors, InfiniteMovingCards, CardHoverEffect, BentoGrid, BentoGridItem } from "../components/aceternity/index.js";

const FOUNDER_SIGNALS = [
  "⚡ Multi-Model AI Council: Real-time consensus scoring",
  "🎯 Live Market Signals: Continuous competitive web crawling",
  "🤝 Verified Startup Mentors: 1-on-1 strategy sessions",
  "📊 Investor Metrics: Problem, Market, Moat & Feasibility",
  "🚀 MVP Execution: Milestone roadmaps synced live",
  "💡 High-Conviction Verdicts: GO, IMPROVE, and actionable feedback",
];

const MENTOR_SIGNALS = [
  "🎓 1-on-1 Founder Mentorship: High-touch strategic guidance",
  "⚡ Venture Milestone Tracking: Accelerating MVP execution",
  "🎯 Go-To-Market Alignment: Customer discovery & channel fit",
  "💡 Sustainable Unit Economics: Margin optimization & pricing",
  "📊 AI Consensus Scoring: Benchmarking against industry standards",
  "🤝 Real-Time Founder Sync: Immediate advice delivery & review",
];

const MENTOR_ADVISORY_MODULES = [
  {
    title: "Assigned Startups",
    description: "Inspect active mentees, track progress stages, and review AI validation scores.",
    to: "/app/assignments",
    icon: Lightbulb,
    badge: "Portfolio",
    footer: "Manage mentees →",
  },
  {
    title: "Strategy Sessions",
    description: "Schedule 1-on-1 calls, run live video advisory, and record founder action items.",
    to: "/app/sessions",
    icon: Calendar,
    badge: "1-on-1 Advisory",
    footer: "Open scheduler →",
  },
  {
    title: "Provide Guidance",
    description: "Deliver tactical advice on GTM, pricing, moat, and unit economics with quick tags.",
    to: "/app/guidance",
    icon: MessageSquare,
    badge: "Actionable Feedback",
    footer: "Compose advice →",
  },
  {
    title: "Advisory Archive",
    description: "Browse historical feedback recommendations and verify founder milestone execution.",
    to: "/app/my-feedback",
    icon: Star,
    badge: "Impact History",
    footer: "Review history →",
  },
];

const EXPERT_SIGNALS = [
  "⚖️ 6-Axis Diligence: Rigorous quantitative ratings on Problem, Market, Innovation, Execution, Scale & Team",
  "🎯 AI Consensus Calibration: Human expertise benchmarking and tuning automated multi-model baseline",
  "⚡ Evidentiary Due Process: Transparent appeal hearings and objective dispute resolutions",
  "📊 Institutional Benchmarking: Aligning startup viability with accredited venture criteria",
  "🤝 High-Conviction Guidance: Clear, actionable qualitative feedback empowering founders",
  "🛡️ Calibration Telemetry: Bias tracking within target ±10pt tolerance and <72h turnaround",
];

const greet = () => { const h = new Date().getHours(); return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening"; };

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
    <Card title="Live activity" icon={Radio} sub={n.data?.unread ? `${n.data.unread} unread` : ""} spotlight spotlightColor="rgba(168, 85, 247, 0.14)">
      {!items.length ? <p className="muted small">Activity will appear here in real time.</p> : <div className="list">{items.map((x) => <div className="list-item" key={x._id}><div className="notif-ico"><Bell size={15} /></div><div className="grow"><div className="small" style={{ fontWeight: x.read ? 400 : 700 }}>{x.title}</div>{x.message && <div className="tiny faint truncate">{x.message}</div>}</div><span className="tiny faint">{ago(x.createdAt)}</span></div>)}</div>}
      <Link to="/app/notifications" className="small" style={{ display: "block", marginTop: 12 }}>All notifications →</Link>
    </Card>
  );
}

function Founder() {
  const { user } = useAuth();
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
      <div className="founder-hero-banner">
        <Spotlight className="founder-spotlight" fill="var(--primary)" />
        <Meteors number={16} />
        <div className="founder-hero-content">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <span className="live-pulse-badge">
                <i className="live-pulse-dot" />
                FOUNDER WORKSPACE &bull; LIVE TELEMETRY
              </span>
            </div>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 700, margin: 0, letterSpacing: "-0.02em" }}>
              {greet()}, {user.name.split(" ")[0]} 🚀
            </h1>
            <p className="muted small" style={{ marginTop: 6, marginBottom: 0 }}>
              Turn startup ideas into validated ventures &bull;{" "}
              <FlipWords
                words={[
                  "AI Multi-Model Validation",
                  "Live Market Telemetry",
                  "Investor-Ready SWOT",
                  "Verified Mentorship",
                  "MVP Milestones Roadmap",
                ]}
                duration={2800}
              />
            </p>
          </div>
          <div className="row wrap" style={{ gap: 10 }}>
            <ShimmerButton onClick={() => nav("/app/validate")} size="sm" variant="shimmer">
              <Sparkles size={14} style={{ marginRight: 6 }} /> Validate New Idea
            </ShimmerButton>
            <ShimmerButton to="/app/ideas" size="sm" variant="outline">
              <Lightbulb size={14} style={{ marginRight: 6 }} /> My Portfolio
            </ShimmerButton>
          </div>
        </div>
      </div>

      <InfiniteMovingCards
        items={FOUNDER_SIGNALS}
        speed="normal"
        className="founder-marquee"
        renderItem={(item) => <span className="category-pill">{item}</span>}
      />

      {attention.map((i) => <div className="mb" key={i._id}><Alert kind="warning"><b>Action needed:</b> changes were requested on “{i.title}”. <Link to={`/app/validate?edit=${i._id}`}>Edit & resubmit →</Link></Alert></div>)}
      <Async q={q} skeleton={<SkeletonGrid n={4} h={110} />}>{() => (
        <div className="col gap-l stagger">
          <div className="grid g4">
            <Stat icon={Lightbulb} label="Total ideas" value={ideas.length} tone="purple" sub={`${ideas.filter((i) => i.status === "draft").length} drafts`} to="/app/ideas" spotlight spotlightColor="rgba(168, 85, 247, 0.18)" />
            <Stat icon={Target} label="Average score" value={avg} tone="cyan" sub={best ? `Best: ${best.report.score}` : "Validate your first idea"} spotlight spotlightColor="rgba(6, 182, 212, 0.18)" />
            <Stat icon={CheckCircle2} label="Approved" value={ideas.filter((i) => i.status === "approved").length} tone="green" to="/app/ideas?f=validated" spotlight spotlightColor="rgba(34, 197, 94, 0.18)" />
            <Stat icon={MessageSquare} label="Feedback received" value={ideas.reduce((s, i) => s + (i.feedbackCount || 0), 0)} tone="pink" spotlight spotlightColor="rgba(236, 72, 153, 0.18)" />
          </div>
          <div className="grid g-main">
            <Card title="Score by idea" icon={TrendingUp} spotlight spotlightColor="rgba(0, 112, 243, 0.16)">{trend.length ? <Bars data={trend.map((t) => ({ name: t.date, Score: t.count }))} bars={[{ key: "Score", name: "AI score", color: "var(--primary)" }]} max={100} height={240} /> : <Empty icon={Lightbulb} title="No scores yet">Validate an idea to see your trend.</Empty>}</Card>
            <div className="col">
              <Card title="Next mentoring session" icon={Calendar} spotlight spotlightColor="rgba(6, 182, 212, 0.16)">{next ? <div><b>{next.title}</b><div className="small muted mt-s">{fmtDateTime(next.scheduledAt)} · {next.durationMin} min</div><div className="small muted">with {next.mentor?.name}</div>{next.link && /^https?:\/\//i.test(next.link) && <a href={next.link} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm mt-s">Join</a>}</div> : <p className="muted small">Nothing scheduled. Request a mentor from an idea page.</p>}</Card>
              <Activity_ limit={4} />
            </div>
          </div>
          <Card title="Your ideas" icon={Lightbulb} sub={<Link to="/app/ideas">View all</Link>} spotlight spotlightColor="rgba(168, 85, 247, 0.16)">
            {!ideas.length ? (
              <Empty icon={Rocket} title="Launch your first idea">
                It takes under a minute to get an AI-powered report.
                <div className="mt">
                  <ShimmerButton onClick={() => nav("/app/validate")} size="md" variant="shimmer">
                    <Sparkles size={15} style={{ marginRight: 6 }} /> Validate an idea
                  </ShimmerButton>
                </div>
              </Empty>
            ) : (
              <div className="list">{ideas.slice(0, 5).map((i) => <div key={i._id} className="list-item" style={{ cursor: "pointer" }} onClick={() => nav(`/app/ideas/${i._id}`)}>{i.report ? <ScoreRing score={i.report.score} size={52} stroke={6} label="" /> : <Badge kind="draft">Draft</Badge>}<div className="grow"><b>{i.title}</b><div className="tiny faint">{i.industry} · {ago(i.createdAt)}</div></div><StatusBadge value={i.status} />{i.report && <VerdictBadge verdict={i.report.verdict} />}</div>)}</div>
            )}
          </Card>
          <Card title="Recommended next steps & resources" icon={BookOpen} sub={<Link to="/app/resources">Resource hub</Link>} spotlight spotlightColor="rgba(6, 182, 212, 0.16)">
            <BentoGrid className="founder-bento-resources">
              {(() => {
                const items = (res.data || []).filter((r) => r.kind !== "announcement").slice(0, 3);
                if (items.length) {
                  return items.map((r) => (
                    <BentoGridItem
                      key={r._id}
                      as={Link}
                      to="/app/resources"
                      spotlightColor="rgba(0, 112, 243, 0.14)"
                      badge={r.kind}
                      title={r.title}
                      description={r.summary}
                      icon={<BookOpen size={18} />}
                      className="link-card"
                      style={{ color: "var(--text)", textDecoration: "none" }}
                    />
                  ));
                }
                const FALLBACK_ACTIONS = [
                  { title: "Customer Problem Discovery", desc: "Interview 10 potential users in your target niche to test urgency and willingness to pay.", badge: "Validation", to: "/app/validate", icon: <Target size={18} /> },
                  { title: "Live Market Analysis", desc: "Scan real-time competitor density and pricing structures before coding your MVP.", badge: "Telemetry", to: "/app/market", icon: <LineChart size={18} /> },
                  { title: "Execution Roadmap", desc: "Break your solution into prioritized milestones and schedule strategy mentor syncs.", badge: "Roadmap", to: "/app/roadmap", icon: <Flag size={18} /> },
                ];
                return FALLBACK_ACTIONS.map((a, idx) => (
                  <BentoGridItem
                    key={idx}
                    as={Link}
                    to={a.to}
                    spotlightColor="rgba(168, 85, 247, 0.14)"
                    badge={a.badge}
                    title={a.title}
                    description={a.desc}
                    icon={a.icon}
                    className="link-card"
                    style={{ color: "var(--text)", textDecoration: "none" }}
                  />
                ));
              })()}
            </BentoGrid>
          </Card>
        </div>)}</Async>
    </>
  );
}

const svcIcon = { api: Server, db: Database, ai: Cpu, realtime: Radio, webhook: Zap };
const SVC_SPOTLIGHT = {
  operational: "rgba(34, 197, 94, 0.20)",
  ok: "rgba(34, 197, 94, 0.20)",
  demo: "rgba(245, 166, 35, 0.20)",
  degraded: "rgba(245, 166, 35, 0.20)",
  disabled: "rgba(107, 107, 107, 0.16)",
  down: "rgba(239, 68, 68, 0.24)",
};

const SUPERADMIN_TELEMETRY = [
  "🛡️ ROOT GOVERNANCE: Superadmin RBAC access level active",
  "⚡ AI COUNCIL: Multi-model consensus pipeline online",
  "📡 SSE EVENT BUS: Real-time broadcast stream connected",
  "💾 ATLAS REPLICA: Sub-millisecond database queries",
  "🔒 AUDIT SURVEILLANCE: Tamper-evident logging active",
  "🚀 HIGH PERFORMANCE: Zero-lag GPU composited telemetry",
];

const CONFIG_MODULES = [
  {
    title: "Platform Settings",
    description: "Branding, maintenance mode, site-wide banner, and open registration policy.",
    to: "/app/platform",
    icon: Gauge,
    badge: "Core",
    footer: "Configure platform →",
  },
  {
    title: "Feature Management",
    description: "Instant feature toggles for AI validation, idea comparison, and session booking.",
    to: "/app/features",
    icon: Zap,
    badge: "Flags",
    footer: "Manage modules →",
  },
  {
    title: "Scoring Configuration",
    description: "Tune the 5 validation metric weights and live GO / IMPROVE thresholds.",
    to: "/app/scoring",
    icon: Target,
    badge: "Scoring",
    footer: "Tune algorithms →",
  },
  {
    title: "Validation Engine",
    description: "Multi-model AI council (GPT, Claude, Gemini, Llama) & web scraping config.",
    to: "/app/engine",
    icon: Cpu,
    badge: "AI Council",
    footer: "Configure engine →",
  },
  {
    title: "Roles & Permissions",
    description: "Live RBAC permission matrix governing founders, mentors, experts & admins.",
    to: "/app/permissions",
    icon: ShieldAlert,
    badge: "Security",
    footer: "Manage matrix →",
  },
  {
    title: "Idea Categories",
    description: "Industry taxonomy, color accents, and idea volume classification.",
    to: "/app/categories",
    icon: Tags,
    badge: "Taxonomy",
    footer: "Manage categories →",
  },
  {
    title: "Platform Integrations",
    description: "API connections for Gemini, OpenRouter, Tavily search, and outgoing webhooks.",
    to: "/app/integrations",
    icon: Server,
    badge: "Services",
    footer: "View integrations →",
  },
  {
    title: "System Logs & Audit",
    description: "Real-time SSE event stream, exception telemetry, and tamper-evident audit records.",
    to: "/app/logs",
    icon: ScrollText,
    badge: "Telemetry",
    footer: "Inspect logs →",
  },
];

function SystemOverview() {
  const h = useLive("/system/health", { poll: 8000 });
  return (
    <>
      <div className="superadmin-hero-banner">
        <Spotlight className="superadmin-spotlight" fill="#a855f7" />
        <Meteors number={16} color="#c084fc" />
        <div style={{ position: "relative", zIndex: 2, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <MovingBorder
                as="div"
                containerClassName="superadmin-root-halo"
                duration={7000}
              >
                <span className="superadmin-root-badge">
                  <i className="root-dot" />
                  SUPERADMIN &bull; ROOT ARCHITECTURE TELEMETRY
                </span>
              </MovingBorder>
            </div>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 700, margin: 0, letterSpacing: "-0.02em" }}>
              System Health & Architecture
            </h1>
            <p className="muted small" style={{ marginTop: 6, marginBottom: 0 }}>
              Live infrastructure telemetry &bull; <FlipWords words={["Real-time health", "Multi-model AI Council", "Sub-second event bus", "High availability"]} duration={2800} />
            </p>
          </div>
          <div className="row wrap" style={{ gap: 10 }}>
            <ShimmerButton to="/app/platform" size="sm" variant="shimmer">
              <Settings size={14} style={{ marginRight: 6 }} /> Platform Settings
            </ShimmerButton>
            <ShimmerButton to="/app/logs" size="sm" variant="outline">
              <ScrollText size={14} style={{ marginRight: 6 }} /> System Logs
            </ShimmerButton>
          </div>
        </div>
      </div>

      <div className="superadmin-telemetry-marquee">
        <InfiniteMovingCards
          items={SUPERADMIN_TELEMETRY}
          direction="left"
          speed="slow"
          renderItem={(text) => (
            <span className="category-pill">
              <span style={{ color: "var(--primary)", fontWeight: 600 }}>{text.split(":")[0]}:</span>
              <span>{text.split(":")[1]}</span>
            </span>
          )}
        />
      </div>

      <Async q={h} skeleton={<SkeletonGrid n={8} h={110} />}>{(d) => (
        <div className="col gap-l stagger">
          <div className="superadmin-services-grid">
            {d.services.map((s) => {
              const I = svcIcon[s.key] || Server;
              return (
                <SpotlightCard
                  key={s.key}
                  spotlightColor={SVC_SPOTLIGHT[s.status] || "rgba(0, 112, 243, 0.18)"}
                  className="card hover"
                >
                  <div className="row between">
                    <div className="stat" style={{ padding: 0 }}>
                      <div className="ico g-purple" style={{ width: 42, height: 42 }}>
                        <I size={20} />
                      </div>
                    </div>
                    <StatusBadge value={s.status} label={s.status} />
                  </div>
                  <b style={{ display: "block", marginTop: 12 }}>{s.name}</b>
                  <div className="small muted truncate">{s.detail}</div>
                </SpotlightCard>
              );
            })}
          </div>

          <div className="grid g4">
            <Stat icon={Timer} label="Uptime" value={d.uptimeSec >= 3600 ? Math.round(d.uptimeSec / 360) / 10 : Math.round(d.uptimeSec / 60)} suffix={d.uptimeSec >= 3600 ? " h" : " min"} decimals={d.uptimeSec >= 3600 ? 1 : 0} tone="green" spotlight spotlightColor="rgba(34, 197, 94, 0.20)" />
            <Stat icon={Gauge} label="Avg response" value={d.avgMs} suffix=" ms" tone="cyan" sub={`${d.requests} requests served`} spotlight spotlightColor="rgba(6, 182, 212, 0.20)" />
            <Stat icon={Users} label="Online now" value={d.online} tone="purple" sub={`${d.connections} live connections · ${d.activeUsers} active accounts`} spotlight spotlightColor="rgba(168, 85, 247, 0.20)" />
            <Stat icon={ShieldAlert} label="Errors (24h)" value={d.errors24h} tone={d.errors24h ? "orange" : "green"} sub={`${d.memoryMb} MB memory · ${d.node}`} spotlight spotlightColor={d.errors24h ? "rgba(249, 115, 22, 0.20)" : "rgba(34, 197, 94, 0.20)"} />
          </div>

          <div className="grid g-main">
            <Card title="API requests per minute" icon={Activity} spotlight>
              {d.perMinute.length ? <AreaTrend data={d.perMinute.map((p) => ({ date: new Date(p.t).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }), count: p.count }))} fmtX={(v) => v} name="Requests" color="var(--accent)" /> : <p className="muted">Collecting data…</p>}
            </Card>
            <Card title="Recent system events" icon={Clock} sub={<Link to="/app/logs">All logs</Link>} spotlight>
              {d.recent.length ? <div className="list">{d.recent.map((l) => <div className="list-item" key={l._id}><Badge kind={l.level === "error" ? "danger" : l.level === "warn" ? "warning" : "info"}>{l.level}</Badge><div className="grow small"><code>{l.action}</code><div className="tiny faint truncate">{l.message}</div></div><span className="tiny faint">{ago(l.createdAt)}</span></div>)}</div> : <p className="muted small">No events yet.</p>}
            </Card>
          </div>

          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <div>
                <b style={{ fontFamily: "var(--font-display)", fontSize: 18 }}>System Configuration & Architecture</b>
                <div className="small muted">Fine-grained platform controls for security, algorithms, and service integrations.</div>
              </div>
            </div>
            <CardHoverEffect items={CONFIG_MODULES} className="superadmin-hover-grid" />
          </div>
        </div>
      )}</Async>
    </>
  );
}

function MentorHome() {
  const { user } = useAuth();
  const nav = useNavigate();
  const a = useLive("/assignments", { params: { kind: "mentor" } });
  const s = useLive("/sessions");
  const fb = useLive("/feedback", { params: { kind: "guidance" } });
  const list = a.data || [];
  const up = (s.data || []).filter((x) => x.status === "scheduled" && new Date(x.scheduledAt) > Date.now());
  const activeStartups = list.filter((x) => ["assigned", "in_progress"].includes(x.stage));

  return (
    <>
      <div className="mentor-hero-banner">
        <Spotlight className="mentor-spotlight" fill="#06b6d4" />
        <Meteors number={14} />
        <div className="mentor-hero-content">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <span className="live-pulse-badge">
                <i className="live-pulse-dot" />
                MENTOR WORKSPACE &bull; ADVISORY TELEMETRY
              </span>
            </div>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 700, margin: 0, letterSpacing: "-0.02em" }}>
              {greet()}, {user.name.split(" ")[0]} 🎓
            </h1>
            <p className="muted small" style={{ marginTop: 6, marginBottom: 0 }}>
              Accelerate early-stage founders &bull;{" "}
              <FlipWords
                words={[
                  "1-on-1 Strategic Mentorship",
                  "Venture Milestone Roadmaps",
                  "Targeted GTM Advice",
                  "AI Validation Reviews",
                ]}
                duration={2800}
              />
            </p>
          </div>
          <div className="row wrap" style={{ gap: 10 }}>
            <ShimmerButton onClick={() => nav("/app/sessions")} size="sm" variant="shimmer">
              <Calendar size={14} style={{ marginRight: 6 }} /> Schedule Session
            </ShimmerButton>
            <ShimmerButton onClick={() => nav("/app/assignments")} size="sm" variant="outline">
              <Lightbulb size={14} style={{ marginRight: 6 }} /> Manage Mentees
            </ShimmerButton>
            <ShimmerButton onClick={() => nav("/app/guidance")} size="sm" variant="outline">
              <MessageSquare size={14} style={{ marginRight: 6 }} /> Provide Guidance
            </ShimmerButton>
          </div>
        </div>
      </div>

      <div className="mentor-marquee">
        <InfiniteMovingCards
          items={MENTOR_SIGNALS}
          direction="left"
          speed="slow"
          renderItem={(signal) => <span className="category-pill">{signal}</span>}
        />
      </div>

      <div className="mb-l">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <div>
            <b style={{ fontFamily: "var(--font-display)", fontSize: 18 }}>Mentor Advisory Command Center</b>
            <div className="small muted">Direct workflows to guide, evaluate, and accelerate your assigned startup founders.</div>
          </div>
        </div>
        <CardHoverEffect items={MENTOR_ADVISORY_MODULES} className="mentor-hover-grid" />
      </div>

      <Async q={a} skeleton={<SkeletonGrid n={4} h={110} />}>{() => (
        <div className="col gap-l stagger">
          <div className="grid g4">
            <Stat icon={Lightbulb} label="New assignments" value={list.filter((x) => x.stage === "assigned").length} tone="orange" to="/app/assignments" spotlightColor="rgba(249, 115, 22, 0.16)" />
            <Stat icon={Activity} label="In progress" value={list.filter((x) => x.stage === "in_progress").length} tone="purple" to="/app/assignments?f=progress" spotlightColor="rgba(168, 85, 247, 0.16)" />
            <Stat icon={Calendar} label="Upcoming sessions" value={up.length} tone="cyan" to="/app/sessions" spotlightColor="rgba(6, 182, 212, 0.16)" />
            <Stat icon={Star} label="Guidance given" value={(fb.data || []).length} tone="green" to="/app/my-feedback" spotlightColor="rgba(34, 197, 94, 0.16)" />
          </div>
          <div className="grid g-main">
            <Card title="Your active startups" icon={GraduationCap} sub={<Link to="/app/assignments">View all</Link>} spotlight spotlightColor="rgba(6, 182, 212, 0.14)">
              {!activeStartups.length ? (
                <Empty icon={Lightbulb} title="No active startups">
                  Claim ideas from the open pool to begin mentoring.
                  <div className="mt"><Link to="/app/assignments" className="btn">Browse open pool</Link></div>
                </Empty>
              ) : (
                <div className="list">
                  {activeStartups.slice(0, 5).map((x) => (
                    <div key={x._id} className="list-item" style={{ cursor: "pointer" }} onClick={() => x.idea?._id && nav(`/app/ideas/${x.idea._id}`)}>
                      <Avatar name={x.idea?.user?.name || "?"} size={38} />
                      <div className="grow">
                        <b>{x.idea?.title || "Untitled Startup"}</b>
                        <div className="tiny faint">{x.idea?.user?.name || "Founder"} &bull; {x.idea?.industry || "General"}</div>
                      </div>
                      <StatusBadge value={x.stage} label={x.stage.replace("_", " ")} />
                    </div>
                  ))}
                </div>
              )}
            </Card>
            <div className="col">
              <Card title="Next sessions" icon={Calendar} spotlight spotlightColor="rgba(168, 85, 247, 0.14)">
                {up.length ? (
                  <div className="list">
                    {up.slice(0, 3).map((x) => (
                      <div className="list-item" key={x._id}>
                        <div className="grow">
                          <b className="small">{x.title}</b>
                          <div className="tiny faint">{fmtDateTime(x.scheduledAt)} &bull; {x.founder?.name}</div>
                        </div>
                        <Badge kind="info">{x.mode || "video"}</Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="muted small">No upcoming sessions scheduled.</p>
                )}
              </Card>
              <Activity_ limit={4} />
            </div>
          </div>
        </div>
      )}</Async>
    </>
  );
}

function ExpertHome() {
  const { user } = useAuth();
  const a = useLive("/assignments", { params: { kind: "evaluation" } });
  const ev = useLive("/feedback", { params: { kind: "evaluation" } });
  const dis = useLive("/feedback", { params: { disputed: "true" } });
  const list = a.data || [];
  const evals = ev.data || [];
  const avg = evals.length ? Math.round(evals.reduce((s, x) => s + (x.score || 0), 0) / evals.length) : 0;
  const todo = list.filter((x) => ["assigned", "in_progress"].includes(x.stage));
  return (
    <>
      <div className="expert-hero-banner">
        <Spotlight className="expert-spotlight" fill="#f5a623" />
        <Meteors number={12} />
        <div className="expert-hero-content">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <span className="live-pulse-badge">
                <i className="live-pulse-dot" style={{ background: "#f5a623" }} />
                EXPERT DILIGENCE & CALIBRATION ENGINE
              </span>
            </div>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 700, margin: 0, letterSpacing: "-0.02em" }}>
              {greet()}, {(user?.name || "Expert").split(" ")[0]}
            </h1>
            <p className="muted small" style={{ marginTop: 6, marginBottom: 0 }}>
              Startup evaluations & AI calibration &bull; <FlipWords words={["6-Axis Rubric Scoring", "AI Engine Benchmarking", "Founder Guidance & Diligence", "Objective Quality Calibration"]} duration={2800} />
            </p>
          </div>
          <ShimmerButton variant="shimmer" size="md" to="/app/evaluate">
            <Star size={16} style={{ marginRight: 6 }} /> Start evaluating
          </ShimmerButton>
        </div>
      </div>

      <div className="expert-marquee">
        <InfiniteMovingCards
          items={EXPERT_SIGNALS}
          direction="left"
          speed="slow"
          renderItem={(signal) => <span className="category-pill">{signal}</span>}
        />
      </div>

      <Async q={a} skeleton={<SkeletonGrid n={4} h={110} />}>{() => (
        <div className="col gap-l stagger">
          <div className="grid g4">
            <Stat icon={Timer} label="Pending evaluations" value={todo.length} tone="orange" spotlightColor="rgba(245, 166, 35, 0.20)" to="/app/evaluations?f=pending" />
            <Stat icon={CheckCircle2} label="Completed" value={list.filter((x) => x.stage === "completed").length} tone="green" spotlightColor="rgba(34, 197, 94, 0.20)" to="/app/evaluations?f=completed" />
            <Stat icon={Gauge} label="Average score given" value={avg} tone="purple" spotlightColor="rgba(168, 85, 247, 0.20)" to="/app/eval-reports" />
            <Stat icon={Flag} label="Open disputes" value={(dis.data || []).filter((x) => x.dispute?.status === "open").length} tone="pink" spotlightColor="rgba(236, 72, 153, 0.20)" to="/app/disputes" />
          </div>

          <div className="grid g-main">
            <SpotlightCard className="card" spotlightColor="rgba(245, 166, 35, 0.16)">
              <div className="card-title">
                <Award size={18} color="var(--primary)" />
                Evaluation queue
                <span className="sub"><Link to="/app/evaluations">View all</Link></span>
              </div>
              {!todo.length ? (
                <Empty icon={CheckCircle2} title="You're all caught up" />
              ) : (
                <div className="list">
                  {todo.slice(0, 5).map((x) => (
                    <div key={x._id} className="list-item">
                      <div className="grow">
                        <b>{x.idea?.title || "Untitled Startup"}</b>
                        <div className="tiny faint">{x.idea?.industry || "Venture"} · AI score {x.idea?.report?.score ?? "—"}</div>
                      </div>
                      {x.reEval && <Badge kind="warning">re-eval</Badge>}
                      <ShimmerButton size="sm" variant="shimmer" to={`/app/evaluate?idea=${x.idea?._id || ""}`}>
                        Evaluate
                      </ShimmerButton>
                    </div>
                  ))}
                </div>
              )}
            </SpotlightCard>
            <Activity_ limit={5} />
          </div>

          {evals.length > 0 && (
            <SpotlightCard className="card" spotlightColor="rgba(0, 112, 243, 0.18)">
              <div className="card-title">
                <Cpu size={18} color="var(--primary)" />
                Your scores vs AI
              </div>
              <Bars
                data={evals.map((e) => ({ name: (e.idea?.title || "Untitled").slice(0, 12), Expert: e.score, AI: e.idea?.report?.score || 0 }))}
                bars={[
                  { key: "Expert", name: "Expert", color: "var(--primary)" },
                  { key: "AI", name: "AI", color: "var(--accent)" },
                ]}
                max={100}
              />
            </SpotlightCard>
          )}

          <div className="expert-bento-grid">
            {[
              { title: "Evaluation Tasks", desc: "Manage assigned decks & browse open pool", icon: ClipboardCheck, to: "/app/evaluations", color: "rgba(245, 166, 35, 0.18)", accent: "#f5a623", badge: `${todo.length} tasks` },
              { title: "Scorecards Registry", desc: "Review 6-axis radar & historical feedback", icon: Gauge, to: "/app/scorecards", color: "rgba(0, 112, 243, 0.18)", accent: "#0070f3", badge: `${evals.length} reviews` },
              { title: "Calibration & Disputes", desc: "Resolve founder appeals & maintain rigor", icon: Scale, to: "/app/disputes", color: "rgba(236, 72, 153, 0.18)", accent: "#ec4899", badge: `${(dis.data || []).filter((x) => x.dispute?.status === "open").length} open` },
              { title: "Quality Insights", desc: "Track AI bias delta & review turnaround", icon: LineChart, to: "/app/quality", color: "rgba(80, 227, 194, 0.18)", accent: "#50e3c2", badge: "telemetry" },
            ].map((item) => (
              <SpotlightCard
                as={Link}
                key={item.to}
                to={item.to}
                spotlightColor={item.color}
                className="expert-quick-card card hover"
                style={{ "--item-accent": item.accent }}
              >
                <div className="quick-icon" style={{ background: `${item.accent}1f`, color: item.accent, borderColor: `${item.accent}3d` }}>
                  <item.icon size={20} />
                </div>
                <div className="quick-meta">
                  <div className="row between" style={{ alignItems: "center" }}>
                    <div className="quick-title">{item.title}</div>
                    {item.badge && <span className="bento-badge" style={{ fontSize: 10, padding: "1px 6px" }}>{item.badge}</span>}
                  </div>
                  <div className="quick-desc">{item.desc}</div>
                </div>
              </SpotlightCard>
            ))}
          </div>
        </div>
      )}</Async>
    </>
  );
}

const MODERATOR_STANDARDS = [
  "🛡️ Zero Harassment: Immediate action on community abuse",
  "⚡ Real-Time Triage: Automated flag ingestion within seconds",
  "⚖️ Fair Due Process: Transparent moderation notes & founder hearing",
  "🔒 Tamper-Evident Logs: Encrypted audit trail for compliance",
  "🎯 Sub-Hour SLA: Rapid review of flagged startup materials",
  "✨ AI Radar Scrutiny: Preemptive detection of fraud & plagiarism",
];

function ModeratorHome() {
  const { user } = useAuth();
  const r = useLive("/reports");
  const list = r.data || [];
  const open = list.filter((x) => x.status === "open");
  const openIdeas = open.filter((x) => x.targetType === "idea").length;
  const openFb = open.filter((x) => x.targetType === "feedback").length;
  const openUsers = open.filter((x) => x.targetType === "user").length;
  const today = list.filter((x) => x.resolvedAt && Date.now() - new Date(x.resolvedAt) < 86400000).length;

  return (
    <>
      <div className="moderator-hero-banner">
        <Spotlight className="moderator-spotlight" fill="rgba(244, 63, 94, 0.28)" />
        <Meteors number={12} color="#f43f5e" />
        <div style={{ position: "relative", zIndex: 2, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <span className="live-pulse-badge">
                <i className="live-pulse-dot pulse-danger" />
                TRUST & SAFETY DISPATCH &bull; {open.length === 0 ? "ALL CLEAR" : `${open.length} UNRESOLVED CASE${open.length > 1 ? "S" : ""}`}
              </span>
            </div>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 700, margin: 0, letterSpacing: "-0.02em" }}>
              {greet()}, {user.name.split(" ")[0]}
            </h1>
            <p className="muted small" style={{ marginTop: 6, marginBottom: 0 }}>
              Live Trust & Safety dispatch &bull;{" "}
              <FlipWords
                words={[
                  "Real-time queue monitoring",
                  "Community trust & safety",
                  "Spam & harassment defense",
                  "Sub-hour SLA enforcement",
                  "Proactive AI content audits",
                ]}
                duration={2800}
                wordClassName="flip-rose"
              />
            </p>
          </div>
          <div className="row wrap" style={{ gap: 10 }}>
            <ShimmerButton to="/app/mod-ideas" size="sm" variant="shimmer">
              <ShieldAlert size={14} style={{ marginRight: 6 }} /> Review Queue
            </ShimmerButton>
            <ShimmerButton to="/app/mod-audits" size="sm" variant="outline">
              <Eye size={14} style={{ marginRight: 6 }} /> Content Audits
            </ShimmerButton>
          </div>
        </div>
      </div>

      <InfiniteMovingCards
        items={MODERATOR_STANDARDS}
        speed="normal"
        className="moderator-marquee"
        renderItem={(item) => <span className="category-pill">{item}</span>}
      />

      <Async q={r} skeleton={<SkeletonGrid n={4} h={110} />}>{() => (
        <div className="col gap-l stagger">
          <div className="grid g4">
            <Stat
              icon={ShieldAlert}
              label="Open reports"
              value={open.length}
              tone="orange"
              spotlightColor="rgba(239, 68, 68, 0.20)"
              sub={open.length ? "Action required" : "Zero pending"}
              to="/app/mod-ideas"
            />
            <Stat
              icon={Flag}
              label="Flagged ideas"
              value={openIdeas}
              tone="pink"
              spotlightColor="rgba(244, 63, 94, 0.20)"
              sub="Community flags"
              to="/app/mod-ideas"
            />
            <Stat
              icon={MessageSquareWarning}
              label="Reported feedback"
              value={openFb}
              tone="purple"
              spotlightColor="rgba(168, 85, 247, 0.20)"
              sub="Mentor & expert notes"
              to="/app/mod-feedback"
            />
            <Stat
              icon={FileCheck2}
              label="Resolved (24h)"
              value={today}
              tone="green"
              spotlightColor="rgba(34, 197, 94, 0.20)"
              sub="Audited & enforced"
            />
          </div>

          <div className="grid g-main">
            <SpotlightCard className="card" spotlightColor="rgba(239, 68, 68, 0.16)">
              <div className="card-title">
                <ShieldAlert size={18} color="var(--danger)" />
                Latest open reports
                <span className="sub"><Link to="/app/mod-ideas">View all</Link></span>
              </div>
              {!open.length ? (
                <Empty icon={CheckCircle2} title="Queue is clear 🎉">
                  No pending community reports. All ideas, feedback, and user accounts are in good standing.
                </Empty>
              ) : (
                <div className="list">
                  {open.slice(0, 6).map((x) => (
                    <div className="list-item" key={x._id}>
                      <Badge kind="danger">{x.targetType}</Badge>
                      <div className="grow">
                        <b className="small">{x.reason}</b>
                        <div className="tiny faint truncate">
                          {x.targetInfo?.title || x.targetInfo?.name || x.targetInfo?.comment || "—"} &bull; by {x.reporter?.name}
                        </div>
                      </div>
                      <span className="tiny faint">
                        <Clock size={11} style={{ marginRight: 3, verticalAlign: -1 }} />
                        {ago(x.createdAt)}
                      </span>
                      <ShimmerButton
                        size="sm"
                        variant="outline"
                        to={`/app/mod-${x.targetType === "idea" ? "ideas" : x.targetType === "feedback" ? "feedback" : "users"}`}
                      >
                        Review
                      </ShimmerButton>
                    </div>
                  ))}
                </div>
              )}
            </SpotlightCard>
            <Activity_ limit={5} />
          </div>

          <CardHoverEffect
            className="moderator-hover-grid"
            items={[
              {
                title: "Flagged Ideas Queue",
                description: "Review reported startup concepts for plagiarism, non-compliant claims, or fraud.",
                icon: ShieldAlert,
                to: "/app/mod-ideas",
                badge: `${openIdeas} open`,
                footer: <span>Open queue &rarr;</span>,
              },
              {
                title: "Reported Feedback",
                description: "Mediate advisor disputes, abusive comments, and biased expert scorecards.",
                icon: MessageSquareWarning,
                to: "/app/mod-feedback",
                badge: `${openFb} open`,
                footer: <span>Open queue &rarr;</span>,
              },
              {
                title: "User Reports & Safety",
                description: "Investigate harassment complaints, spam bots, impersonation, or malicious accounts.",
                icon: UserX,
                to: "/app/mod-users",
                badge: `${openUsers} open`,
                footer: <span>Open queue &rarr;</span>,
              },
              {
                title: "Live Content Audits",
                description: "Proactively inspect newest submitted ideas and AI radar scores in real time.",
                icon: Eye,
                to: "/app/mod-audits",
                badge: "Radar",
                footer: <span>Audit radar &rarr;</span>,
              },
            ]}
          />
        </div>
      )}</Async>
    </>
  );
}
