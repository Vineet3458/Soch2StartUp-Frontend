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

const INCIDENT_TREND = [
  { month: "Jun", flags: 42 },
  { month: "Jul", flags: 31 },
  { month: "Aug", flags: 24 },
  { month: "Sep", flags: 16 },
  { month: "Oct", flags: 8 },
  { month: "Nov", flags: 3 },
];

const MOD_FUNNEL = [
  { label: "Reports Received", count: 28, gradient: "linear-gradient(135deg, #6528D7 0%, #8B5CF6 100%)", width: "100%" },
  { label: "Under Investigation", count: 12, gradient: "linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)", width: "86%" },
  { label: "Enforcement Applied", count: 7, gradient: "linear-gradient(135deg, #06B6D4 0%, #22D3EE 100%)", width: "72%" },
  { label: "Resolved & Closed", count: 24, gradient: "linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)", width: "58%" },
];

const MOD_TICKETS = [
  {
    id: 1,
    title: "QuickCoin – Unregulated Crypto Bot",
    reporter: "Community User",
    reason: "Promising Guaranteed Return / VDA Risk",
    severity: "High",
    severityClass: "status-needs-improvement",
  },
  {
    id: 2,
    title: "Comment on KiranaFlow",
    reporter: "Founder",
    reason: "Aggressive or Unconstructive Tone",
    severity: "Medium",
    severityClass: "status-in-review",
  },
  {
    id: 3,
    title: "Account Verification Check",
    reporter: "System Flag",
    reason: "Repeated disposable email domain",
    severity: "Low",
    severityClass: "status-validated",
  },
];

export default function ModeratorDashboard({ ideas = [], onViewAll = null }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [period, setPeriod] = useState("Last 6 Months");

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="trend-custom-tooltip">
          <span>{payload[0].value} Flagged Cases</span>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="founderverse-overview-root role-moderator-dashboard">
      {/* 1. PANORAMIC MODERATOR BANNER */}
      <section className="cosmic-welcome-banner">
        <div className="banner-glow-overlay" />
        <div className="banner-content-col">
          <h1 className="banner-title">Welcome back, {user?.name || "Moderator"} 🛡️</h1>
          <p className="banner-subtitle">
            Review flagged submissions, enforce community guidelines, and maintain platform safety standards.
          </p>

          <div className="banner-actions-group">
            <button
              type="button"
              className="banner-btn-primary"
              onClick={() => navigate("/dashboard?tab=flagged")}
            >
              🚩 Moderation Queue
            </button>
            <button
              type="button"
              className="banner-btn-glass"
              onClick={() => navigate("/dashboard?tab=users")}
            >
              👥 User Reports
            </button>
            <button
              type="button"
              className="banner-btn-glass"
              onClick={() => navigate("/dashboard?view=saved")}
            >
              📖 Community Guidelines
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

      {/* 2. 4 MODERATOR KPI STAT CARDS */}
      <section className="fv-stat-cards-grid">
        <div className="fv-kpi-card">
          <div className="kpi-icon-wrap kpi-icon-amber">
            <SidebarIcon name="flag" size={22} color="#F59E0B" />
          </div>
          <div className="kpi-info-block">
            <h3 className="kpi-value">4</h3>
            <span className="kpi-label">Flagged Ideas</span>
            <span className="kpi-growth-pill">
              <span className="growth-arrow">●</span> 1 High Priority
            </span>
          </div>
        </div>

        <div className="fv-kpi-card">
          <div className="kpi-icon-wrap kpi-icon-violet">
            <SidebarIcon name="message-circle" size={22} color="#8B5CF6" />
          </div>
          <div className="kpi-info-block">
            <h3 className="kpi-value">6</h3>
            <span className="kpi-label">Reported Feedback</span>
            <span className="kpi-growth-pill">
              <span className="growth-arrow">●</span> Under Review
            </span>
          </div>
        </div>

        <div className="fv-kpi-card">
          <div className="kpi-icon-wrap kpi-icon-cyan">
            <SidebarIcon name="shield" size={22} color="#06B6D4" />
          </div>
          <div className="kpi-info-block">
            <h3 className="kpi-value">3</h3>
            <span className="kpi-label">Blocked Accounts</span>
            <span className="kpi-growth-pill">
              <span className="growth-arrow">✓</span> Restricted Access
            </span>
          </div>
        </div>

        <div className="fv-kpi-card">
          <div className="kpi-icon-wrap kpi-icon-emerald">
            <SidebarIcon name="check-circle" size={22} color="#10B981" />
          </div>
          <div className="kpi-info-block">
            <h3 className="kpi-value">99.2%</h3>
            <span className="kpi-label">Community Trust</span>
            <span className="kpi-growth-pill">
              <span className="growth-arrow">★</span> Healthy Platform
            </span>
          </div>
        </div>
      </section>

      {/* 3. MIDDLE ROW: TICKET FUNNEL + INCIDENT TREND + QUICK ACTIONS */}
      <section className="fv-middle-dashboard-grid">
        {/* Ticket Funnel */}
        <div className="fv-card fv-funnel-card">
          <div className="fv-card-header">
            <div className="card-title-group">
              <span className="card-title-icon">
                <SidebarIcon name="moderator" size={18} color="#8B5CF6" />
              </span>
              <h2 className="card-title-text">Moderation Ticket Funnel</h2>
            </div>
          </div>

          <div className="funnel-container">
            {MOD_FUNNEL.map((tier, idx) => (
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

        {/* Incident Trend Chart */}
        <div className="fv-card fv-trend-card">
          <div className="fv-card-header">
            <div className="card-title-group">
              <span className="card-title-icon">
                <SidebarIcon name="chart-bar" size={18} color="#8B5CF6" />
              </span>
              <h2 className="card-title-text">Incident Velocity (Flags)</h2>
            </div>

            <div className="trend-period-dropdown-wrap">
              <button type="button" className="trend-period-pill">
                <span>{period}</span>
                <SidebarIcon name="chevron-down" size={12} color="#64748B" />
              </button>
            </div>
          </div>

          <div className="trend-chart-stage">
            <div className="trend-pin-callout" style={{ left: "75%", top: "8%" }}>
              <span>3 Cases (Low)</span>
            </div>

            <ResponsiveContainer width="100%" height={175}>
              <AreaChart
                data={INCIDENT_TREND}
                margin={{ top: 15, right: 15, left: -25, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="violetModeratorGradient" x1="0" y1="0" x2="0" y2="1">
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
                  ticks={[0, 10, 20, 30, 40, 50]}
                  domain={[0, 50]}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="flags"
                  stroke="#6528D7"
                  strokeWidth={2.8}
                  fillOpacity={1}
                  fill="url(#violetModeratorGradient)"
                  dot={{ r: 3.5, fill: "#FFFFFF", stroke: "#6528D7", strokeWidth: 2 }}
                  activeDot={{ r: 5.5, fill: "#6528D7", stroke: "#FFFFFF", strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="fv-card fv-quick-actions-card">
          <div className="fv-card-header">
            <div className="card-title-group">
              <span className="card-title-icon">
                <SidebarIcon name="zap" size={18} color="#8B5CF6" />
              </span>
              <h2 className="card-title-text">Moderator Actions</h2>
            </div>
          </div>

          <div className="quick-actions-list">
            <button
              type="button"
              className="quick-action-row"
              onClick={() => navigate("/dashboard?tab=flagged")}
            >
              <div className="qa-icon-box qa-amber">
                <SidebarIcon name="flag" size={16} color="#F59E0B" />
              </div>
              <span className="qa-label">Review Flagged Ideas</span>
              <SidebarIcon name="chevron-right" size={14} color="#94A3B8" />
            </button>

            <button
              type="button"
              className="quick-action-row"
              onClick={() => navigate("/dashboard?tab=users")}
            >
              <div className="qa-icon-box qa-violet">
                <SidebarIcon name="users-group" size={16} color="#8B5CF6" />
              </div>
              <span className="qa-label">Audit Blocked Accounts</span>
              <SidebarIcon name="chevron-right" size={14} color="#94A3B8" />
            </button>

            <button
              type="button"
              className="quick-action-row"
              onClick={() => navigate("/dashboard?view=saved")}
            >
              <div className="qa-icon-box qa-cyan">
                <SidebarIcon name="book-open" size={16} color="#06B6D4" />
              </div>
              <span className="qa-label">Community Guidelines</span>
              <SidebarIcon name="chevron-right" size={14} color="#94A3B8" />
            </button>

            <button
              type="button"
              className="quick-action-row"
              onClick={() => navigate("/dashboard?view=reports")}
            >
              <div className="qa-icon-box qa-emerald">
                <SidebarIcon name="shield" size={16} color="#10B981" />
              </div>
              <span className="qa-label">Platform Content Audits</span>
              <SidebarIcon name="chevron-right" size={14} color="#94A3B8" />
            </button>
          </div>
        </div>
      </section>

      {/* 4. BOTTOM ROW: MODERATION TICKETS + TRUST METRICS */}
      <section className="fv-bottom-dashboard-grid">
        <div className="fv-card fv-recent-ideas-card">
          <div className="fv-card-header space-between">
            <div className="card-title-group">
              <span className="card-title-icon">
                <SidebarIcon name="flag" size={18} color="#8B5CF6" />
              </span>
              <h2 className="card-title-text">Active Moderation Tickets</h2>
            </div>

            <button
              type="button"
              className="fv-view-all-link"
              onClick={() => navigate("/dashboard?tab=flagged")}
            >
              <span>View All Flags</span>
              <SidebarIcon name="arrow-right" size={13} />
            </button>
          </div>

          <div className="fv-table-responsive-wrapper">
            <table className="fv-recent-ideas-table">
              <thead>
                <tr>
                  <th>Target Item</th>
                  <th>Reporter</th>
                  <th>Reason</th>
                  <th>Severity</th>
                  <th style={{ textAlign: "right" }}></th>
                </tr>
              </thead>
              <tbody>
                {MOD_TICKETS.map((ticket) => (
                  <tr key={ticket.id} className="fv-table-row-hover">
                    <td className="cell-title">
                      <strong>{ticket.title}</strong>
                    </td>
                    <td className="cell-muted">{ticket.reporter}</td>
                    <td className="cell-muted">{ticket.reason}</td>
                    <td>
                      <span className={`fv-status-pill ${ticket.severityClass}`}>
                        {ticket.severity}
                      </span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <button
                        type="button"
                        className="btn btn-outline btn-sm"
                        onClick={() => navigate("/dashboard?tab=flagged")}
                      >
                        Action →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Safety Score Card */}
        <div className="fv-card fv-platform-growth-card">
          <div className="fv-card-header">
            <div className="card-title-group">
              <span className="card-title-icon">
                <SidebarIcon name="activity" size={18} color="#8B5CF6" />
              </span>
              <h2 className="card-title-text">Platform Safety Score</h2>
            </div>
          </div>

          <div className="growth-content-body">
            <div className="growth-kpi-row">
              <h3 className="growth-number">99.2%</h3>
              <span className="growth-pill-badge">
                <span className="growth-arrow">★</span> Safe
              </span>
            </div>
            <p className="growth-label">Community Integrity Rating</p>

            <div className="growth-visual-stage">
              <div className="growth-bars-cluster">
                <div className="growth-bar" style={{ height: "42px" }} />
                <div className="growth-bar" style={{ height: "58px" }} />
                <div className="growth-bar" style={{ height: "74px" }} />
                <div className="growth-bar" style={{ height: "88px" }} />
                <div className="growth-bar" style={{ height: "100px" }} />
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
