import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Scale } from "lucide-react";
import { useLive } from "../lib/live.js";
import { METRIC_LABELS, scoreColor } from "../lib/format.js";
import { Async, Card, Empty, PageHeader, VerdictBadge } from "../components/ui.jsx";
import { RadarMetrics, ScoreRing } from "../components/charts.jsx";

export default function Compare() {
  const [sp, setSp] = useSearchParams();
  const all = useLive("/ideas");
  const [a, setA] = useState(sp.get("a") || "");
  const [b, setB] = useState(sp.get("b") || "");
  const ideas = (all.data || []).filter((i) => i.report);
  useEffect(() => { setSp(a || b ? { ...(a && { a }), ...(b && { b }) } : {}, { replace: true }); }, [a, b]);
  const A = ideas.find((i) => i._id === a), B = ideas.find((i) => i._id === b); // live: re-derived on every change
  const opts = (skip) => <><option value="">Select an idea…</option>{ideas.filter((i) => i._id !== skip).map((i) => <option key={i._id} value={i._id}>{i.title}</option>)}</>;
  const winner = A && B ? (A.report.score === B.report.score ? null : A.report.score > B.report.score ? A : B) : null;
  return (
    <>
      <PageHeader title="Compare ideas" subtitle="Put two validated ideas side by side across every scoring dimension." />
      <Async q={all}>{() => ideas.length < 2 ? <Empty icon={Scale} title="Need two validated ideas">Submit at least two ideas to compare them.</Empty> : (
        <>
          <div className="grid g2 mb"><select className="input" value={a} onChange={(e) => setA(e.target.value)}>{opts(b)}</select><select className="input" value={b} onChange={(e) => setB(e.target.value)}>{opts(a)}</select></div>
          {A && B ? (
            <div className="col gap-l stagger">
              <div className="grid g2">{[A, B].map((x) => <Card key={x._id} className={winner?._id === x._id ? "glow-border" : ""}><div className="row" style={{ gap: 20 }}><ScoreRing score={x.report.score} size={120} /><div><h3>{x.title}</h3><div className="row gap-s mt-s"><VerdictBadge verdict={x.report.verdict} />{winner?._id === x._id && <span className="badge success">🏆 Higher score</span>}</div><p className="small muted mt-s">{x.industry}</p></div></div></Card>)}</div>
              <Card title="Radar overlay"><RadarMetrics series={[{ name: A.title.slice(0, 24), metrics: A.report.metrics, color: "#8b5cf6" }, { name: B.title.slice(0, 24), metrics: B.report.metrics, color: "#22d3ee" }]} height={320} /></Card>
              <Card title="Metric by metric"><div className="col">{Object.keys(METRIC_LABELS).map((k) => { const x = A.report.metrics[k], y = B.report.metrics[k]; return (
                <div key={k} className="row" style={{ gap: 14 }}><b className="mono" style={{ width: 36, color: scoreColor(x), fontWeight: x >= y ? 800 : 500 }}>{x}</b><div className="grow"><div className="tiny muted center">{METRIC_LABELS[k]}</div><div className="row" style={{ gap: 4 }}><div className="progress grow" style={{ transform: "scaleX(-1)" }}><i style={{ width: `${x}%` }} /></div><div className="progress grow"><i style={{ width: `${y}%`, background: "linear-gradient(90deg,#22d3ee,#3b82f6)" }} /></div></div></div><b className="mono" style={{ width: 36, textAlign: "right", color: scoreColor(y), fontWeight: y >= x ? 800 : 500 }}>{y}</b></div>); })}</div></Card>
            </div>) : <Empty icon={Scale} title="Pick two ideas above" />}
        </>)}</Async>
    </>
  );
}
