import { Download, FileCheck2, GraduationCap, Inbox, Lightbulb, ShieldAlert, Target, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { useLive } from "../lib/live.js";
import { csvDownload } from "../lib/format.js";
import { Async, Button, Card, PageHeader, SkeletonGrid, Stat, VerdictBadge } from "../components/ui.jsx";
import { AreaTrend, Bars, Donut, Legend } from "../components/charts.jsx";

const STATUS_COLORS = { submitted: "#8b5cf6", under_review: "#fbbf24", approved: "#34d399", rejected: "#fb7185", changes_requested: "#60a5fa", archived: "#94a3b8" };
const ROLE_COLORS = ["#8b5cf6", "#22d3ee", "#ec4899", "#34d399", "#fbbf24", "#60a5fa"];

export function AdminDashboard({ title = "Analytics & insights", subtitle = "Live platform metrics. Every chart updates as people use the platform.", exportable }) {
  const q = useLive("/stats/admin");
  const ideas = useLive("/ideas", { skip: !exportable });
  const exportCsv = () => csvDownload("ideas.csv", (ideas.data || []).map((i) => ({ title: i.title, founder: i.user?.name, industry: i.industry, status: i.status, score: i.report?.score ?? "", verdict: i.report?.verdict ?? "", expertScore: i.expertScore ?? "", created: i.createdAt })));
  return (
    <>
      <PageHeader title={title} subtitle={subtitle}>{exportable && <Button variant="outline" icon={Download} onClick={exportCsv}>Export ideas (CSV)</Button>}</PageHeader>
      <Async q={q} skeleton={<SkeletonGrid n={8} h={110} />}>{(d) => {
        const status = Object.entries(d.ideasByStatus).map(([name, value]) => ({ name: name.replace("_", " "), value, color: STATUS_COLORS[name] }));
        const verdict = ["GO", "IMPROVE", "AVOID"].map((k, i) => ({ name: k, value: d.verdicts[k] || 0, color: ["#34d399", "#fbbf24", "#fb7185"][i] }));
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
            <div className="grid g2">
              <Card title="New sign-ups (14 days)"><AreaTrend data={d.signups} name="Sign-ups" color="#22d3ee" /></Card>
              <Card title="Idea submissions (14 days)"><AreaTrend data={d.submissions} name="Ideas" color="#8b5cf6" /></Card>
            </div>
            <div className="grid g3">
              <Card title="Ideas by status"><Donut data={status} /><Legend items={status} /></Card>
              <Card title="AI verdicts"><Donut data={verdict} /><Legend items={verdict} /></Card>
              <Card title="Users by role"><Donut data={roles} colors={ROLE_COLORS} /><Legend items={roles} /></Card>
            </div>
            <div className="grid g-main">
              <Card title="Industries: volume & average score"><Bars data={d.industries} bars={[{ key: "count", name: "Ideas", color: "#8b5cf6" }, { key: "avgScore", name: "Avg score", color: "#22d3ee" }]} /></Card>
              <div className="col">
                <Card title="Top-scoring ideas">{d.topIdeas.length ? <div className="list">{d.topIdeas.map((i, n) => <div className="list-item" key={i._id}><b className="faint">{n + 1}</b><div className="grow"><Link to={`/app/ideas/${i._id}`}>{i.title}</Link><div className="tiny faint">{i.industry}</div></div><b className="mono">{i.score}</b><VerdictBadge verdict={i.verdict} /></div>)}</div> : <p className="muted">No scored ideas yet.</p>}</Card>
                <Card title="Mentor & expert workload">{d.workload.length ? <div className="list">{d.workload.map((w) => <div className="list-item" key={w.name}><div className="grow small">{w.name}</div><div className="progress" style={{ width: 90 }}><i style={{ width: `${Math.min(100, w.active * 25)}%` }} /></div><b>{w.active}</b></div>)}</div> : <p className="muted small">No active assignments.</p>}</Card>
              </div>
            </div>
          </div>);
      }}</Async>
    </>
  );
}
export default function AnalyticsView() { return <AdminDashboard title="Analytics & reports" exportable />; }
