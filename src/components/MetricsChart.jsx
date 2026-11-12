import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip } from "recharts";

const LABELS = {
  marketDemand: "Market Demand",
  competition: "Low Competition",
  feasibility: "Feasibility",
  financial: "Financial",
  risk: "Risk Safety",
};

export default function MetricsChart({ metrics }) {
  const data = Object.keys(LABELS).map((key) => ({ name: LABELS[key], value: metrics[key] }));
  return (
    <ResponsiveContainer width="100%" height={280}>
      <RadarChart data={data}>
        <PolarGrid />
        <PolarAngleAxis dataKey="name" tick={{ fontSize: 12 }} />
        <Tooltip />
        <Radar dataKey="value" stroke="#5b5bf0" fill="#5b5bf0" fillOpacity={0.35} />
      </RadarChart>
    </ResponsiveContainer>
  );
}

export { LABELS };
