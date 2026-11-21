import { Download, FileCheck2, GraduationCap, Inbox, Lightbulb, ShieldAlert, Target, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { useLive } from "../lib/live.js";
import { csvDownload } from "../lib/format.js";
import { Async, Card, SkeletonGrid, Stat, VerdictBadge } from "../components/ui.jsx";
import { AreaTrend, Bars, Donut, Legend, PALETTE } from "../components/charts.jsx";
import { Spotlight, ShimmerButton, FlipWords, InfiniteMovingCards, Meteors } from "../components/aceternity/index.js";

const STATUS_COLORS = { submitted: "var(--primary)", under_review: "var(--warning)", approved: "var(--success)", rejected: "var(--danger)", changes_requested: "var(--info)", archived: "var(--faint)" };
const ROLE_COLORS = PALETTE;

export function AdminDashboard({ title = "Analytics & insights", subtitle = "Live platform metrics. Every chart updates as people use the platform.", exportable }) {
  const q = useLive("/stats/admin");
  const ideas = useLive("/ideas", { skip: !exportable });
  const exportCsv = () => csvDownload("ideas.csv", (ideas.data || []).map((i) => ({ title: i.title, founder: i.user?.name, industry: i.industry, status: i.status, score: i.report?.score ?? "", verdict: i.report?.verdict ?? "", expertScore: i.expertScore ?? "", created: i.createdAt })));
  return (
    <>
      <div className="admin-hero-banner">
        <Spotlight className="admin-spotlight" fill="var(--primary)" />
        <Meteors number={16} />
        <div style={{ position: "relative", zIndex: 2, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <span className="live-pulse-badge">
                <i className="live-pulse-dot" />
                ADMINISTRATIVE INTELLIGENCE
              </span>
            </div>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 700, margin: 0, letterSpacing: "-0.02em" }}>
              {title}
            </h1>
            <p className="muted small" style={{ marginTop: 6, marginBottom: 0 }}>
              {subtitle} &bull; <FlipWords words={["Real-time user signals", "Idea validation pipeline", "Market sentiment & volume", "Advisor workload balance"]} duration={2900} />
            </p>
          </div>
          {exportable && (
            <ShimmerButton variant="shimmer" size="sm" onClick={exportCsv}>
              <Download size={14} style={{ marginRight: 6 }} /> Export ideas (CSV)
            </ShimmerButton>
          )}
        </div>
      </div>

      <Async q={q} skeleton={<SkeletonGrid n={8} h={110} />}>{(d) => {
        const status = Object.entries(d.ideasByStatus).map(([name, value]) => ({ name: name.replace("_", " "), value, color: STATUS_COLORS[name] }));
        const verdict = ["GO", "IMPROVE", "AVOID"].map((k, i) => ({ name: k, value: d.verdicts[k] || 0, color: ["var(--success)", "var(--warning)", "var(--danger)"][i] }));
        const roles = Object.entries(d.usersByRole).map(([name, value]) => ({ name: name.replace("_", " "), value }));
        return (
          <div className="col gap-l stagger">
            <div className="grid g4">
              <Stat icon={Users} label="Total users" value={d.totals.users} tone="purple" sub={`${d.usersByStatus.pending} pending · ${d.usersByStatus.blocked} blocked`} to="/app/users" />
              <Stat icon={Lightbulb} label="Ideas submitted" value={d.totals.ideas} tone="cyan" sub={`${d.totals.drafts} drafts`} to="/app/ideas" />
              <Stat icon={Target} label="Average AI score" value={d.avgScore} tone="green" sub={`${d.verdicts.GO || 0} GO · ${d.verdicts.AVOID || 0} AVOID`} />
              <Stat icon={FileCheck2} label="Awaiting review" value={(d.ideasByStatus.submitted || 0) + (d.ideasByStatus.under_review || 0)} tone="orange" sub="Click to review" to="/app/ideas?s=review" />
            </div>
            <div className="grid g4">
              <Stat icon={Inbox} label="Pending requests" value={d.pendingRequests} tone="pink" to="/app/requests" />
              <Stat icon={ShieldAlert} label="Open reports" value={d.openReports} tone="orange" to="/app/mod-ideas" />
              <Stat icon={GraduationCap} label="Upcoming sessions" value={d.sessions.upcoming} tone="cyan" sub={`${d.sessions.completed} completed`} />
              <Stat icon={Users} label="Feedback given" value={d.totals.feedback} tone="purple" />
            </div>

            {d.industries?.length > 0 && (
              <div style={{ margin: "2px 0 8px" }}>
                <InfiniteMovingCards
                  items={d.industries}
                  direction="left"
                  speed="slow"
                  renderItem={(ind) => (
                    <span className="category-pill">
                      <span style={{ color: "var(--primary)", fontWeight: 600 }}>{ind.name}</span>
                      <span className="tiny faint mono">{ind.count} ideas</span>
                      <span className="tiny mono" style={{ opacity: 0.85 }}>avg {ind.avgScore}</span>
                    </span>
                  )}
                />
              </div>
            )}

            <div className="grid g2">
              <Card title="New sign-ups (14 days)" spotlight><AreaTrend data={d.signups} name="Sign-ups" color="var(--accent)" /></Card>
              <Card title="Idea submissions (14 days)" spotlight><AreaTrend data={d.submissions} name="Ideas" color="var(--primary)" /></Card>
            </div>
            <div className="grid g3">
              <Card title="Ideas by status" spotlight><Donut data={status} /><Legend items={status} /></Card>
              <Card title="AI verdicts" spotlight><Donut data={verdict} /><Legend items={verdict} /></Card>
              <Card title="Users by role" spotlight><Donut data={roles} colors={ROLE_COLORS} /><Legend items={roles} /></Card>
            </div>
            <div className="grid g-main">
              <Card title="Industries: volume & average score" spotlight><Bars data={d.industries} bars={[{ key: "count", name: "Ideas", color: "var(--primary)" }, { key: "avgScore", name: "Avg score", color: "var(--accent)" }]} /></Card>
              <div className="col">
                <Card title="Top-scoring ideas" spotlight>{d.topIdeas.length ? <div className="list">{d.topIdeas.map((i, n) => <div className="list-item" key={i._id}><b className="faint">{n + 1}</b><div className="grow"><Link to={`/app/ideas/${i._id}`}>{i.title}</Link><div className="tiny faint">{i.industry}</div></div><b className="mono">{i.score}</b><VerdictBadge verdict={i.verdict} /></div>)}</div> : <p className="muted">No scored ideas yet.</p>}</Card>
                <Card title="Mentor & expert workload" spotlight>{d.workload.length ? <div className="list">{d.workload.map((w) => <div className="list-item" key={w.name}><div className="grow small">{w.name}</div><div className="progress" style={{ width: 90 }}><i style={{ width: `${Math.min(100, w.active * 25)}%` }} /></div><b>{w.active}</b></div>)}</div> : <p className="muted small">No active assignments.</p>}</Card>
              </div>
            </div>
          </div>);
      }}</Async>
    </>
  );
}
export default function AnalyticsView() { return <AdminDashboard title="Analytics & reports" exportable />; }
