import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const VERDICT_COLORS = {
  GO: "#16a34a",
  IMPROVE: "#d97706",
  AVOID: "#dc2626",
};

const PALETTE = ["#6D28D9", "#2563EB", "#059669", "#D97706", "#EC4899", "#8B5CF6"];

export default function ChartWidget({
  title,
  subtitle,
  type = "pie", // "pie" or "bar"
  data = [],
  dataKey = "count",
  nameKey = "name",
  height = 220,
}) {
  return (
    <div className="card chart-widget-card">
      <div className="chart-widget-header">
        <h4>{title}</h4>
        {subtitle && <p className="muted small">{subtitle}</p>}
      </div>

      <div className="chart-widget-body" style={{ width: "100%", height }}>
        <ResponsiveContainer width="100%" height="100%">
          {type === "pie" ? (
            <PieChart>
              <Pie
                data={data}
                dataKey={dataKey}
                nameKey={nameKey}
                cx="50%"
                cy="50%"
                innerRadius={36}
                outerRadius={68}
                paddingAngle={4}
              >
                {data.map((entry, index) => {
                  const keyVal = entry[nameKey];
                  const fill = VERDICT_COLORS[keyVal] || PALETTE[index % PALETTE.length];
                  return <Cell key={`cell-${index}`} fill={fill} />;
                })}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          ) : (
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey={nameKey} stroke="#94A3B8" fontSize={11} />
              <YAxis stroke="#94A3B8" fontSize={11} />
              <Tooltip />
              <Bar dataKey={dataKey} fill="#6D28D9" radius={[4, 4, 0, 0]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
