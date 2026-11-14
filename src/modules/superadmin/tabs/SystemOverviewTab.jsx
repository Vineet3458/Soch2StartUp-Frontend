import React, { useState } from "react";
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
  SuperAdminBadge,
} from "../SuperAdminSharedComponents.jsx";

const METRICS = [
  {
    title: "Platform Users",
    value: "1,248",
    sub: "+12% this month",
    subType: "green",
    iconColor: "purple",
  },
  {
    title: "Active Services",
    value: "18 / 20",
    sub: "2 require attention",
    subType: "green",
    iconColor: "green",
  },
  {
    title: "API Availability",
    value: "99.9%",
    sub: "Within target",
    subType: "green",
    iconColor: "cyan",
  },
  {
    title: "Open Incidents",
    value: "3",
    sub: "1 high priority",
    subType: "green",
    iconColor: "orange",
  },
];

const HEALTH_TREND_DATA = [
  { hour: "10:00", value: 99.85 },
  { hour: "11:00", value: 99.89 },
  { hour: "12:00", value: 99.88 },
  { hour: "13:00", value: 99.92 },
  { hour: "14:00", value: 99.91 },
  { hour: "15:00", value: 99.94 },
  { hour: "16:00", value: 99.93 },
  { hour: "17:00", value: 99.95 },
  { hour: "18:00", value: 99.94 },
  { hour: "19:00", value: 99.96 },
  { hour: "20:00", value: 99.95 },
  { hour: "21:00", value: 99.98 },
];

const SERVICES = [
  { name: "Authentication API", status: "Operational", variant: "green" },
  { name: "Database cluster", status: "Operational", variant: "green" },
  { name: "AI validation engine", status: "Degraded", variant: "orange" },
  { name: "Notification service", status: "Operational", variant: "green" },
];

const EVENTS = [
  "Scheduled backup completed",
  "Validation queue latency increased",
  "New feature flag enabled",
];

export default function SystemOverviewTab() {
  const [services, setServices] = useState(SERVICES);

  const toggleService = (index) => {
    setServices((prev) =>
      prev.map((s, idx) => {
        if (idx !== index) return s;
        const isOperational = s.status === "Operational";
        return {
          ...s,
          status: isOperational ? "Degraded" : "Operational",
          variant: isOperational ? "orange" : "green",
        };
      })
    );
  };

  return (
    <div className="superadmin-module-root">
      <AdminPageHeader
        title="System Overview"
        subtitle="Real-time health, platform activity and critical service status across Soch2Startup."
      />

      <AdminMetricCards cards={METRICS} />

      <div className="superadmin-layout-grid">
        {/* Left Column: Platform Health Trend */}
        <div className="superadmin-main-card">
          <div className="superadmin-card-header-row">
            <div>
              <h2 className="superadmin-card-title">Platform health trend</h2>
              <p className="superadmin-card-subtitle">
                Illustrative service availability over the last 12 hours
              </p>
            </div>
          </div>

          <div style={{ width: "100%", height: 320, marginTop: "24px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={HEALTH_TREND_DATA}
                margin={{ top: 20, right: 24, left: -20, bottom: 10 }}
              >
                <CartesianGrid stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="hour" hide />
                <YAxis
                  domain={[99.8, 100.0]}
                  hide
                />
                <Tooltip
                  formatter={(val) => [`${val}%`, "Availability"]}
                  contentStyle={{
                    background: "#0f172a",
                    border: "none",
                    borderRadius: "8px",
                    color: "#fff",
                    fontSize: "12px",
                  }}
                  itemStyle={{ color: "#c4b5fd" }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#7c3aed"
                  strokeWidth={3}
                  dot={{ r: 4.5, fill: "#ffffff", stroke: "#7c3aed", strokeWidth: 2.5 }}
                  activeDot={{ r: 6, fill: "#7c3aed", stroke: "#ffffff", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Column: Service Status & Recent Platform Events */}
        <div className="superadmin-side-col">
          <div className="superadmin-side-card">
            <h3 className="superadmin-side-card-title">Service status</h3>
            <p className="superadmin-side-card-sub">Core platform components</p>

            <div className="superadmin-status-list">
              {services.map((srv, idx) => (
                <div key={idx} className="superadmin-status-row">
                  <span className="superadmin-status-name">{srv.name}</span>
                  <SuperAdminBadge
                    status={srv.status}
                    variant={srv.variant}
                    onClick={() => toggleService(idx)}
                    title="Click to toggle component status"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="superadmin-side-card">
            <h3 className="superadmin-side-card-title">Recent platform events</h3>
            <p className="superadmin-side-card-sub">Latest system-level activity</p>

            <ul className="superadmin-events-list">
              {EVENTS.map((evt, idx) => (
                <li key={idx} className="superadmin-event-item">
                  {evt}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
