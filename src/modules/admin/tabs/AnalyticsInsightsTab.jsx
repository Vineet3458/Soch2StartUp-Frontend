import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import {
  AdminPageHeader,
  AdminMetricCards,
  AdminCard,
  AdminBanner,
} from "../AdminSharedComponents.jsx";

const METRICS = [
  {
    title: "Platform Users",
    value: "1,248",
    sub: "+12% this month",
    subType: "green",
    iconColor: "purple",
  },
  {
    title: "Ideas Submitted",
    value: "326",
    sub: "+18% this month",
    subType: "green",
    iconColor: "cyan",
  },
  {
    title: "Validation Rate",
    value: "31.3%",
    sub: "+4.2% this month",
    subType: "green",
    iconColor: "green",
  },
  {
    title: "Avg. Review Time",
    value: "2.4 days",
    sub: "-0.6 days",
    subType: "green",
    iconColor: "orange",
  },
];

const ACTIVITY_DATA = [
  { month: "Jan", activity: 22 },
  { month: "Feb", activity: 28 },
  { month: "Mar", activity: 26 },
  { month: "Apr", activity: 35 },
  { month: "May", activity: 44 },
  { month: "Jun", activity: 56 },
];

const CATEGORIES = [
  { name: "Technology", count: 82, percent: 100, color: "#7c3aed" },
  { name: "Education", count: 65, percent: 79, color: "#06b6d4" },
  { name: "Healthcare", count: 48, percent: 58, color: "#10b981" },
  { name: "Agriculture", count: 35, percent: 43, color: "#f59e0b" },
  { name: "Commerce", count: 28, percent: 34, color: "#8b5cf6" },
];

export default function AnalyticsInsightsTab() {
  return (
    <div className="admin-tab-analytics-root">
      <AdminPageHeader
        title="Analytics & Insights"
        subtitle="Explore platform growth, startup activity, validation outcomes and operational trends."
      />

      <AdminMetricCards cards={METRICS} />

      <div className="admin-analytics-grid">
        {/* Left Card: Platform activity trend */}
        <AdminCard
          title="Platform activity trend"
          subtitle="Illustrative monthly activity overview"
        >
          <div style={{ width: "100%", height: 280, marginTop: "16px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={ACTIVITY_DATA}
                margin={{ top: 12, right: 18, left: -20, bottom: 0 }}
              >
                <CartesianGrid stroke="#f1f5f9" vertical={false} />
                <XAxis
                  dataKey="month"
                  stroke="#94a3b8"
                  fontSize={12}
                  tickLine={false}
                  axisLine={{ stroke: "#e2e8f0" }}
                />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    borderRadius: "10px",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                    fontSize: "12px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="activity"
                  stroke="#7c3aed"
                  strokeWidth={3}
                  dot={{
                    r: 5,
                    fill: "#ffffff",
                    stroke: "#7c3aed",
                    strokeWidth: 2.5,
                  }}
                  activeDot={{
                    r: 7,
                    fill: "#7c3aed",
                    stroke: "#ffffff",
                    strokeWidth: 2,
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <AdminBanner text="Use filters and date ranges to compare periods and export reports." />
        </AdminCard>

        {/* Right Card: Startup idea categories */}
        <AdminCard
          title="Startup idea categories"
          subtitle="Submission volume by industry"
        >
          <div className="admin-categories-list">
            {CATEGORIES.map((cat, idx) => (
              <div key={idx} className="admin-category-item">
                <span className="admin-category-name">{cat.name}</span>
                <div className="admin-category-track">
                  <div
                    className="admin-category-fill"
                    style={{
                      width: `${cat.percent}%`,
                      backgroundColor: cat.color,
                    }}
                  />
                </div>
                <span className="admin-category-count">{cat.count}</span>
              </div>
            ))}
          </div>
        </AdminCard>
      </div>
    </div>
  );
}
