import { useEffect, useId, useState } from "react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { METRIC_LABELS, METRIC_SHORT, scoreColor } from "../lib/format.js";
import { CountUp } from "./fx.jsx";

const axis = { stroke: "var(--faint)", fontSize: 12, tickLine: false, axisLine: false };
const tip = { contentStyle: { background: "var(--surface-solid)", border: "1px solid var(--border-strong)", borderRadius: 12, color: "var(--text)", fontSize: 13, boxShadow: "none" }, itemStyle: { color: "var(--text)" }, labelStyle: { color: "var(--muted)" }, cursor: { fill: "rgba(0,112,243,.08)" } };
export const PALETTE = ["var(--primary)", "var(--accent)", "var(--warning)", "var(--danger)", "#7928CA", "var(--muted)", "var(--text)", "#00B8D9"];

// Animated circular score gauge
export function ScoreRing({ score = 0, size = 150, stroke = 12, label = "SCORE", color }) {
  const [p, setP] = useState(0);
  useEffect(() => { const t = setTimeout(() => setP(score), 120); return () => clearTimeout(t); }, [score]);
  const r = (size - stroke) / 2, c = 2 * Math.PI * r, col = color || scoreColor(score);
  return (
    <div className="score-ring" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)", overflow: "visible" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--surface-2)" strokeWidth={stroke} />
        <circle className="ring-fg" cx={size / 2} cy={size / 2} r={r} fill="none" stroke={col} strokeWidth={stroke} strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c - (c * p) / 100} />
      </svg>
      <div className="num" style={{ fontSize: size * 0.3, color: col }}><CountUp value={score} />{label && <small>{label}</small>}</div>
    </div>
  );
}

export function MetricBars({ metrics = {} }) {
  const [on, setOn] = useState(false);
  useEffect(() => { const t = setTimeout(() => setOn(true), 150); return () => clearTimeout(t); }, []);
  return (
    <div className="col" style={{ gap: 14 }}>
      {Object.keys(METRIC_LABELS).map((k) => (
        <div className="metric" key={k}>
          <span className="muted">{METRIC_LABELS[k]}</span>
          <div className="bar"><i style={{ width: on ? `${metrics[k] || 0}%` : 0, "--c": scoreColor(metrics[k] || 0) }} /></div>
          <b className="mono right">{metrics[k] ?? 0}</b>
        </div>
      ))}
    </div>
  );
}

export function RadarMetrics({ series, height = 300 }) {
  // series: [{ name, metrics, color }]
  const data = Object.keys(METRIC_SHORT).map((k) => ({ metric: METRIC_SHORT[k], ...Object.fromEntries(series.map((s) => [s.name, s.metrics?.[k] || 0])) }));
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RadarChart data={data} outerRadius="72%">
        <PolarGrid stroke="var(--chart-grid)" /><PolarAngleAxis dataKey="metric" tick={{ fill: "var(--muted)", fontSize: 12 }} />
        {series.map((s, i) => <Radar key={s.name} name={s.name} dataKey={s.name} stroke={s.color || PALETTE[i]} fill={s.color || PALETTE[i]} fillOpacity={0.25} strokeWidth={2} />)}
        <Tooltip {...tip} />
      </RadarChart>
    </ResponsiveContainer>
  );
}

export function AreaTrend({ data, x = "date", y = "count", height = 220, color = "var(--primary)", name = "Count", fmtX }) {
  const id = useId();
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ left: -18, right: 8, top: 8 }}>
        <defs><linearGradient id={id} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={color} stopOpacity={0.55} /><stop offset="100%" stopColor={color} stopOpacity={0} /></linearGradient></defs>
        <CartesianGrid stroke="var(--chart-grid)" vertical={false} />
        <XAxis dataKey={x} {...axis} minTickGap={22} tickFormatter={fmtX || ((v) => String(v).slice(5))} /><YAxis {...axis} allowDecimals={false} />
        <Tooltip {...tip} /><Area type="monotone" dataKey={y} name={name} stroke={color} strokeWidth={2.5} fill={`url(#${id})`} animationDuration={1200} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function Bars({ data, x = "name", bars, height = 260, layout = "horizontal", max }) {
  // bars: [{ key, name, color }]
  const vertical = layout === "vertical";
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} layout={layout} margin={{ left: vertical ? 20 : -18, right: 8, top: 8 }}>
        <CartesianGrid stroke="var(--chart-grid)" horizontal={!vertical} vertical={vertical} />
        {vertical ? <><XAxis type="number" {...axis} domain={[0, max || "auto"]} /><YAxis type="category" dataKey={x} {...axis} width={90} /></> : <><XAxis dataKey={x} {...axis} /><YAxis {...axis} domain={[0, max || "auto"]} allowDecimals={false} /></>}
        <Tooltip {...tip} />
        {bars.map((b, i) => <Bar key={b.key} dataKey={b.key} name={b.name} fill={b.color || PALETTE[i]} radius={vertical ? [0, 8, 8, 0] : [8, 8, 0, 0]} animationDuration={1000} />)}
      </BarChart>
    </ResponsiveContainer>
  );
}

export function Donut({ data, height = 220, colors = PALETTE }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  return (
    <div style={{ position: "relative" }}>
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius="62%" outerRadius="88%" paddingAngle={3} stroke="none" animationDuration={1100}>
            {data.map((d, i) => <Cell key={d.name} fill={d.color || colors[i % colors.length]} />)}
          </Pie>
          <Tooltip {...tip} />
        </PieChart>
      </ResponsiveContainer>
      <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", pointerEvents: "none", textAlign: "center" }}>
        <div><div style={{ font: "700 28px var(--font-display)" }}><CountUp value={total} /></div><div className="tiny faint">TOTAL</div></div>
      </div>
    </div>
  );
}

export function Legend({ items }) {
  return <div className="row wrap gap-s" style={{ marginTop: 6 }}>{items.map((d, i) => <span key={d.name} className="chip"><i style={{ width: 9, height: 9, borderRadius: 3, background: d.color || PALETTE[i % PALETTE.length] }} />{d.name} <b>{d.value}</b></span>)}</div>;
}
