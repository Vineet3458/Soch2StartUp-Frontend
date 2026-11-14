import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useAuth } from "../../context/AuthContext.jsx";
import { SidebarIcon } from "../../components/sidebar/sidebarIcons.jsx";

const ENGINE_THROUGHPUT_DATA = [
  { month: "Jun", runs: 4200 },
  { month: "Jul", runs: 6800 },
  { month: "Aug", runs: 9100 },
  { month: "Sep", runs: 11400 },
  { month: "Oct", runs: 14290 },
  { month: "Nov", runs: 13800 },
];

const ROLE_HIERARCHY_FUNNEL = [
  { label: "Superadmins (Full Control)", count: 2, gradient: "linear-gradient(135deg, #6528D7 0%, #8B5CF6 100%)", width: "100%" },
  { label: "Platform Admins", count: 8, gradient: "linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)", width: "86%" },
  { label: "Mentors & Evaluators", count: 52, gradient: "linear-gradient(135deg, #06B6D4 0%, #22D3EE 100%)", width: "72%" },
  { label: "Startup Entrepreneurs", count: 1186, gradient: "linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)", width: "58%" },
];

const AUDIT_LOGS_SAMPLE = [
  {
    id: 1,
    time: "2 mins ago",
    actor: "Super Admin",
    action: "Updated Engine Weights",
    target: "Scoring v2.4",
    status: "Verified",
    statusClass: "status-validated",
  },
  {
    id: 2,
    time: "14 mins ago",
    actor: "Platform Admin",
    action: "Approved Mentor Account",
    target: "Rohan Sharma",
    status: "Applied",
    statusClass: "status-in-review",
  },
  {
    id: 3,
    time: "48 mins ago",
    actor: "System Engine",
    action: "Automated Backup Completed",
    target: "MongoDB Cluster",
    status: "Optimal",
    statusClass: "status-validated",
  },
];

export default function SuperadminDashboard({ ideas = [], onViewAll = null }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [period, setPeriod] = useState("System Telemetry");

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="trend-custom-tooltip">
          <span>{payload[0].value.toLocaleString()} AI Runs</span>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="founderverse-overview-root role-superadmin-dashboard">
      {/* 1. PANORAMIC SUPERADMIN BANNER */}
      <section className="cosmic-welcome-banner">
        <div className="banner-glow-overlay" />
        <div className="banner-content-col">
          <h1 className="banner-title">Welcome back, Superadmin 👑</h1>
          <p className="banner-subtitle">
            Full platform governance, role permission matrix, scoring engine configuration, and system audit logs.
          </p>

          <div className="banner-actions-group">
            <button
              type="button"
              className="banner-btn-primary"
              onClick={() => navigate("/admin?tab=roles")}
            >
              🛡️ Roles &amp; Permissions
            </button>
            <button
              type="button"
              className="banner-btn-glass"
              onClick={() => navigate("/admin?tab=engine")}
            >
              ⚙️ Validation Engine
            </button>
            <button
              type="button"
              className="banner-btn-glass"
              onClick={() => navigate("/admin?tab=logs")}
            >
              📋 System Audit Logs
            </button>
          </div>
        </div>

        <div className="banner-astronaut-col">
          <img
            src="/assets/founderverse/astronaut-laptop.png"
            alt="Founderverse Astronaut exploring startup intelligence"
            className="banner-astronaut-img"
          />
        </div>
      </section>

      {/* 2. 4 SUPERADMIN KPI CARDS */}
      <section className="fv-stat-cards-grid">
        <div className="fv-kpi-card">
          <div className="kpi-icon-wrap kpi-icon-violet">
            <SidebarIcon name="database" size={22} color="#8B5CF6" />
          </div>
          <div className="kpi-info-block">
            <h3 className="kpi-value">1,248</h3>
            <span className="kpi-label">Platform Accounts</span>
            <span className="kpi-growth-pill">
              <span className="growth-arrow">★</span> 6 Active Roles
            </span>
          </div>
        </div>

        <div className="fv-kpi-card">
          <div className="kpi-icon-wrap kpi-icon-amber">
            <SidebarIcon name="zap" size={22} color="#F59E0B" />
          </div>
          <div className="kpi-info-block">
            <h3 className="kpi-value">99.8%</h3>
            <span className="kpi-label">AI Engine Uptime</span>
            <span className="kpi-growth-pill">
              <span className="growth-arrow">⚡</span> 184ms Avg Latency
            </span>
          </div>
        </div>

        <div className="fv-kpi-card">
          <div className="kpi-icon-wrap kpi-icon-cyan">
            <SidebarIcon name="chart-bar" size={22} color="#06B6D4" />
          </div>
          <div className="kpi-info-block">
            <h3 className="kpi-value">14,290</h3>
            <span className="kpi-label">Validation Runs</span>
            <span className="kpi-growth-pill">
              <span className="growth-arrow">↑</span> +24% Volume
            </span>
          </div>
        </div>

        <div className="fv-kpi-card">
          <div className="kpi-icon-wrap kpi-icon-emerald">
            <SidebarIcon name="shield" size={22} color="#10B981" />
          </div>
          <div className="kpi-info-block">
            <h3 className="kpi-value">0 Flags</h3>
            <span className="kpi-label">Security Health</span>
            <span className="kpi-growth-pill">
              <span className="growth-arrow">✓</span> All Systems Nominal
            </span>
          </div>
        </div>
      </section>

      {/* 3. MIDDLE ROW: ROLE MATRIX + ENGINE THROUGHPUT + SYSTEM CONTROLS */}
      <section className="fv-middle-dashboard-grid">
        {/* Role Matrix Funnel */}
        <div className="fv-card fv-funnel-card">
          <div className="fv-card-header">
            <div className="card-title-group">
              <span className="card-title-icon">
                <SidebarIcon name="key" size={18} color="#8B5CF6" />
              </span>
              <h2 className="card-title-text">Role Access Hierarchy</h2>
            </div>
          </div>

          <div className="funnel-container">
            {ROLE_HIERARCHY_FUNNEL.map((tier, idx) => (
              <div
                key={idx}
                className="funnel-tier"
                style={{ width: tier.width, background: tier.gradient }}
              >
                <span className="funnel-tier-label">{tier.label}</span>
                <span className="funnel-tier-count">{tier.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Engine Throughput Chart */}
        <div className="fv-card fv-trend-card">
          <div className="fv-card-header">
            <div className="card-title-group">
              <span className="card-title-icon">
                <SidebarIcon name="chart-bar" size={18} color="#8B5CF6" />
              </span>
              <h2 className="card-title-text">Engine Throughput</h2>
            </div>

            <div className="trend-period-dropdown-wrap">
              <button type="button" className="trend-period-pill">
                <span>{period}</span>
                <SidebarIcon name="chevron-down" size={12} color="#64748B" />
              </button>
            </div>
          </div>

          <div className="trend-chart-stage">
            <div className="trend-pin-callout" style={{ left: "68%", top: "8%" }}>
              <span>14.2k Runs</span>
            </div>

            <ResponsiveContainer width="100%" height={175}>
              <AreaChart
                data={ENGINE_THROUGHPUT_DATA}
                margin={{ top: 15, right: 15, left: -10, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="violetSuperadminGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6528D7" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6528D7" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94A3B8", fontSize: 11 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94A3B8", fontSize: 11 }}
                  ticks={[0, 4000, 8000, 12000, 16000]}
                  domain={[0, 16000]}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="runs"
                  stroke="#6528D7"
                  strokeWidth={2.8}
                  fillOpacity={1}
                  fill="url(#violetSuperadminGradient)"
                  dot={{ r: 3.5, fill: "#FFFFFF", stroke: "#6528D7", strokeWidth: 2 }}
                  activeDot={{ r: 5.5, fill: "#6528D7", stroke: "#FFFFFF", strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* System Controls */}
        <div className="fv-card fv-quick-actions-card">
          <div className="fv-card-header">
            <div className="card-title-group">
              <span className="card-title-icon">
                <SidebarIcon name="crown" size={18} color="#8B5CF6" />
              </span>
              <h2 className="card-title-text">System Controls</h2>
            </div>
          </div>

          <div className="quick-actions-list">
            <button
              type="button"
              className="quick-action-row"
              onClick={() => navigate("/admin?tab=roles")}
            >
              <div className="qa-icon-box qa-amber">
                <SidebarIcon name="key" size={16} color="#F59E0B" />
              </div>
              <span className="qa-label">Roles &amp; Permission Matrix</span>
              <SidebarIcon name="chevron-right" size={14} color="#94A3B8" />
            </button>

            <button
              type="button"
              className="quick-action-row"
              onClick={() => navigate("/admin?tab=scoring")}
            >
              <div className="qa-icon-box qa-violet">
                <SidebarIcon name="scale" size={16} color="#8B5CF6" />
              </div>
              <span className="qa-label">Scoring Engine Tuning</span>
              <SidebarIcon name="chevron-right" size={14} color="#94A3B8" />
            </button>

            <button
              type="button"
              className="quick-action-row"
              onClick={() => navigate("/admin?tab=logs")}
            >
              <div className="qa-icon-box qa-cyan">
                <SidebarIcon name="file-text" size={16} color="#06B6D4" />
              </div>
              <span className="qa-label">Audit &amp; System Logs</span>
              <SidebarIcon name="chevron-right" size={14} color="#94A3B8" />
            </button>

            <button
              type="button"
              className="quick-action-row"
              onClick={() => navigate("/admin?tab=features")}
            >
              <div className="qa-icon-box qa-emerald">
                <SidebarIcon name="database" size={16} color="#10B981" />
              </div>
              <span className="qa-label">Feature Management</span>
              <SidebarIcon name="chevron-right" size={14} color="#94A3B8" />
            </button>
          </div>
        </div>
      </section>

      {/* 4. BOTTOM ROW: AUDIT TRAIL + CLUSTER HEALTH */}
      <section className="fv-bottom-dashboard-grid">
        <div className="fv-card fv-recent-ideas-card">
          <div className="fv-card-header space-between">
            <div className="card-title-group">
              <span className="card-title-icon">
                <SidebarIcon name="shield" size={18} color="#8B5CF6" />
              </span>
              <h2 className="card-title-text">Platform Audit Trail</h2>
            </div>

            <button
              type="button"
              className="fv-view-all-link"
              onClick={() => navigate("/admin?tab=logs")}
            >
              <span>View All Logs</span>
              <SidebarIcon name="arrow-right" size={13} />
            </button>
          </div>

          <div className="fv-table-responsive-wrapper">
            <table className="fv-recent-ideas-table">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Actor</th>
                  <th>Action</th>
                  <th>Target</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {AUDIT_LOGS_SAMPLE.map((log) => (
                  <tr key={log.id} className="fv-table-row-hover">
                    <td className="cell-muted">{log.time}</td>
                    <td className="cell-title">
                      <strong>{log.actor}</strong>
                    </td>
                    <td className="cell-muted">{log.action}</td>
                    <td className="cell-muted">{log.target}</td>
                    <td>
                      <span className={`fv-status-pill ${log.statusClass}`}>
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Cluster Telemetry */}
        <div className="fv-card fv-platform-growth-card">
          <div className="fv-card-header">
            <div className="card-title-group">
              <span className="card-title-icon">
                <SidebarIcon name="activity" size={18} color="#8B5CF6" />
              </span>
              <h2 className="card-title-text">Cluster Telemetry</h2>
            </div>
          </div>

          <div className="growth-content-body">
            <div className="growth-kpi-row">
              <h3 className="growth-number">99.98%</h3>
              <span className="growth-pill-badge">
                <span className="growth-arrow">⚡</span> Optimal
              </span>
            </div>
            <p className="growth-label">Node Load &amp; AI Engine</p>

            <div className="growth-visual-stage">
              <div className="growth-bars-cluster">
                <div className="growth-bar" style={{ height: "40px" }} />
                <div className="growth-bar" style={{ height: "55px" }} />
                <div className="growth-bar" style={{ height: "60px" }} />
                <div className="growth-bar" style={{ height: "78px" }} />
                <div className="growth-bar" style={{ height: "92px" }} />
                <div className="growth-bar active-last" style={{ height: "114px" }} />
              </div>

              <div className="growth-rocket-wrap">
                <img
                  src="/assets/founderverse/rocket-launch.png"
                  alt="Platform accelerating into orbit"
                  className="growth-rocket-img"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
