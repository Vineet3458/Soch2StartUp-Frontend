import { Link } from "react-router-dom";
import { Lightbulb, Swords, TrendingUp, Target } from "lucide-react";
import { useLive } from "../lib/live.js";
import { Async, Badge, Card, Empty, PageHeader, Stat } from "../components/ui.jsx";
import { Bars, Donut, Legend, RadarMetrics } from "../components/charts.jsx";
import { Swot, ListCard } from "../components/idea.jsx";
import { useIdeaPicker } from "../components/IdeaPicker.jsx";

const NoIdeas = () => <Empty icon={Lightbulb} title="Validate an idea first">These insights are generated from your validation reports.<div className="mt"><Link to="/app/validate" className="btn">Validate an idea</Link></div></Empty>;

export default function InsightViews({ page }) {
  return page === "market" ? <Market /> : page === "competitors" ? <Competitors /> : <SwotPage />;
}

function Market() {
  const m = useLive("/stats/market");
  const { q, ideas, idea, picker } = useIdeaPicker({ needReport: true });
  const mine = ideas.length ? Math.round(ideas.reduce((s, i) => s + i.report.score, 0) / ideas.length) : 0;
  return (
    <>
      <PageHeader title="Market insights" subtitle="Anonymous, live statistics from every idea validated on the platform — compared with yours.">{picker}</PageHeader>
      <Async q={m}>{(d) => (
        <div className="col gap-l stagger">
          <div className="grid g4">
            <Stat icon={Lightbulb} label="Ideas on the platform" value={d.total} tone="purple" />
            <Stat icon={Target} label="Platform average score" value={d.avgScore} tone="cyan" />
            <Stat icon={TrendingUp} label="Your average score" value={mine} tone="green" sub={mine ? (mine >= d.avgScore ? `▲ ${mine - d.avgScore} above average` : `▼ ${d.avgScore - mine} below average`) : "No ideas yet"} subTone={mine >= d.avgScore ? "up" : "down"} />
            <Stat icon={TrendingUp} label="Hottest industry (30d)" value={d.trending[0]?.name || "—"} tone="orange" sub={d.trending[0] ? `${d.trending[0].count} new ideas` : ""} />
          </div>
          <div className="grid g2">
            <Card title="Average score by industry"><Bars data={d.industries} bars={[{ key: "avgScore", name: "Avg score", color: "var(--primary)" }, { key: "goRate", name: "GO rate %", color: "var(--accent)" }]} max={100} /></Card>
            <Card title="Score distribution"><Donut data={d.distribution.map((x) => ({ name: x.label, value: x.count }))} colors={["var(--danger)", "var(--warning)", "var(--info)", "var(--success)"]} /><Legend items={d.distribution.map((x) => ({ name: x.label, value: x.count }))} /></Card>
          </div>
          <div className="grid g2">
            <Card title={idea ? `${idea.title} vs platform average` : "Strength profile"}>{idea ? <RadarMetrics series={[{ name: "Your idea", metrics: idea.report.metrics, color: "var(--primary)" }, { name: "Platform avg", metrics: Object.fromEntries(d.metricAverages.map((x) => [x.key, x.value])), color: "var(--accent)" }]} /> : <p className="muted">Validate an idea to compare.</p>}</Card>
            <Card title="Market research for your idea">{idea ? <><Badge kind="primary">{idea.industry}</Badge><p className="muted pre mt-s">{idea.report.marketResearch}</p><hr className="divider" /><div className="label">Target customers</div><div className="row wrap gap-s mt-s">{idea.report.targetCustomers.map((c) => <span key={c} className="chip">{c}</span>)}</div></> : <NoIdeas />}</Card>
          </div>
        </div>)}</Async>
      {!q.loading && !ideas.length && <div className="mt"><NoIdeas /></div>}
    </>
  );
}

function Competitors() {
  const m = useLive("/stats/market");
  const { ideas, idea, picker, q } = useIdeaPicker({ needReport: true });
  const freq = {};
  ideas.forEach((i) => i.report.competitors.forEach((c) => { freq[c] = (freq[c] || 0) + 1; }));
  return (
    <>
      <PageHeader title="Competitor analysis" subtitle="Who you are up against — for your ideas and across the platform.">{picker}</PageHeader>
      <Async q={q}>{() => !ideas.length ? <NoIdeas /> : (
        <div className="col gap-l stagger">
          <div className="grid g2">
            <Card title={`Competitors for “${idea.title}”`} icon={Swords}>
              <div className="col">{idea.report.competitors.map((c, i) => <div key={c} className="row"><div className="stat"><div className="ico g-pink" style={{ width: 40, height: 40, borderRadius: 12, font: "700 15px var(--font-display)" }}>{i + 1}</div></div><b className="grow">{c}</b><Badge kind={idea.report.metrics.competition < 45 ? "danger" : "warning"}>{idea.report.metrics.competition < 45 ? "High threat" : "Moderate"}</Badge></div>)}</div>
              <hr className="divider" /><div className="row small muted" style={{ gap: 10 }}>Competition score <b style={{ color: "var(--text)" }}>{idea.report.metrics.competition}/100</b> <span className="faint">(higher = less crowded)</span></div>
            </Card>
            <Card title="Most mentioned across your ideas"><div className="row wrap">{Object.entries(freq).sort((a, b) => b[1] - a[1]).map(([n, c]) => <span key={n} className="chip">{n} <b>×{c}</b></span>)}</div></Card>
          </div>
          <Card title="Most common competitors platform-wide"><Async q={m}>{(d) => <Bars layout="vertical" data={d.topCompetitors} bars={[{ key: "count", name: "Mentions", color: "var(--primary)" }]} height={Math.max(180, d.topCompetitors.length * 38)} />}</Async></Card>
        </div>)}</Async>
    </>
  );
}

function SwotPage() {
  const { idea, picker, q } = useIdeaPicker({ needReport: true });
  return (
    <>
      <PageHeader title="SWOT analysis" subtitle="Strengths, weaknesses, opportunities and threats for the selected idea.">{picker}</PageHeader>
      <Async q={q}>{() => !idea ? <NoIdeas /> : (
        <div className="col gap-l stagger"><Card title={idea.title}><Swot swot={idea.report.swot} /></Card>
          <div className="grid g2"><ListCard title="Risks to manage" items={idea.report.risks} tone="var(--danger)" /><ListCard title="Recommended next steps" items={idea.report.recommendations} tone="var(--success)" /></div></div>)}</Async>
    </>
  );
}
