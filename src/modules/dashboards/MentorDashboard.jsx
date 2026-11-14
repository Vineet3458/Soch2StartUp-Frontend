import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
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

const MENTEE_LIFT_DATA = [
  { session: "Session 1", avgScore: 54 },
  { session: "Session 2", avgScore: 63 },
  { session: "Session 3", avgScore: 71 },
  { session: "Session 4", avgScore: 78 },
  { session: "Session 5", avgScore: 82 },
  { session: "Session 6", avgScore: 86 },
];

const MENTEE_FUNNEL = [
  { label: "Intake & Discovery", count: 14, gradient: "linear-gradient(135deg, #6528D7 0%, #8B5CF6 100%)", width: "100%" },
  { label: "GTM Strategy & Positioning", count: 9, gradient: "linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)", width: "86%" },
  { label: "Unit Economics & Traction", count: 5, gradient: "linear-gradient(135deg, #06B6D4 0%, #22D3EE 100%)", width: "72%" },
  { label: "Investor Pitch Ready", count: 3, gradient: "linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)", width: "58%" },
];

export default function MentorDashboard({ ideas = [], onViewAll = null, onEvaluate = null }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const roleParam = searchParams.get("role");
  const roleQuery = roleParam ? `&role=${roleParam}` : "";
  const [period, setPeriod] = useState("Cohorts 2026");

  // Sample or live ideas assigned to mentor
  const assignedStartups = ideas.length > 0 ? ideas : [
    {
      _id: "m-1",
      title: "KiranaFlow – Hyperlocal B2B Restocking",
      user: { name: "Aarav Patel" },
      industry: "Retail / B2B",
      status: "In Progress",
      statusClass: "status-in-review",
    },
    {
      _id: "m-2",
      title: "KrishiMitra AI – Smart Crop Advisory",
      user: { name: "Aarav Patel" },
      industry: "AgriTech",
      status: "Guidance Submitted",
      statusClass: "status-validated",
    },
    {
      _id: "m-3",
      title: "HealthTrack Wearable",
      user: { name: "Aman Gupta" },
      industry: "Healthcare",
      status: "Review Requested",
      statusClass: "status-needs-improvement",
    },
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="trend-custom-tooltip">
          <span>{payload[0].value} Avg Score</span>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="founderverse-overview-root role-mentor-dashboard">
      {/* 1. PANORAMIC MENTOR BANNER */}
      <section className="cosmic-welcome-banner">
        <div className="banner-glow-overlay" />
        <div className="banner-content-col">
          <h1 className="banner-title">Welcome back, {user?.name || "Mentor"} 🎓</h1>
          <p className="banner-subtitle">
            Guide high-potential startups, review founder submissions, and conduct strategic advisory sessions.
          </p>

          <div className="banner-actions-group">
            <button
              type="button"
              className="banner-btn-primary"
              onClick={() => navigate(`/dashboard?tab=assignments${roleQuery}`)}
            >
              👥 Assigned Startups
            </button>
            <button
              type="button"
              className="banner-btn-glass"
              onClick={() => navigate(`/dashboard?tab=guidance${roleQuery}`)}
            >
              💬 Provide Guidance
            </button>
            <button
              type="button"
              className="banner-btn-glass"
              onClick={() => navigate(`/dashboard?tab=best-practices${roleQuery}`)}
            >
              📚 Mentor Playbooks
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

      {/* 2. 4 MENTOR KPI STAT CARDS */}
      <section className="fv-stat-cards-grid">
        <div className="fv-kpi-card">
          <div className="kpi-icon-wrap kpi-icon-violet">
            <SidebarIcon name="rocket" size={22} color="#8B5CF6" />
          </div>
          <div className="kpi-info-block">
            <h3 className="kpi-value">{assignedStartups.length}</h3>
            <span className="kpi-label">Assigned Startups</span>
            <span className="kpi-growth-pill">
              <span className="growth-arrow">●</span> 2 Needs Review
            </span>
          </div>
        </div>

        <div className="fv-kpi-card">
          <div className="kpi-icon-wrap kpi-icon-amber">
            <SidebarIcon name="message-circle" size={22} color="#F59E0B" />
          </div>
          <div className="kpi-info-block">
            <h3 className="kpi-value">38</h3>
            <span className="kpi-label">Guidance Notes</span>
            <span className="kpi-growth-pill">
              <span className="growth-arrow">↑</span> +6 this week
            </span>
          </div>
        </div>

        <div className="fv-kpi-card">
          <div className="kpi-icon-wrap kpi-icon-cyan">
            <SidebarIcon name="trending-up" size={22} color="#06B6D4" />
          </div>
          <div className="kpi-info-block">
            <h3 className="kpi-value">+18.4%</h3>
            <span className="kpi-label">Mentee Score Lift</span>
            <span className="kpi-growth-pill">
              <span className="growth-arrow">★</span> High Impact
            </span>
          </div>
        </div>

        <div className="fv-kpi-card">
          <div className="kpi-icon-wrap kpi-icon-emerald">
            <SidebarIcon name="calendar" size={22} color="#10B981" />
          </div>
          <div className="kpi-info-block">
            <h3 className="kpi-value">5</h3>
            <span className="kpi-label">Advisory Sessions</span>
            <span className="kpi-growth-pill">
              <span className="growth-arrow">⏰</span> 2 Scheduled Today
            </span>
          </div>
        </div>
      </section>

      {/* 3. MIDDLE ROW: READINESS FUNNEL + IMPACT CHART + QUICK ACTIONS */}
      <section className="fv-middle-dashboard-grid">
        {/* Mentee Readiness Funnel */}
        <div className="fv-card fv-funnel-card">
          <div className="fv-card-header">
            <div className="card-title-group">
              <span className="card-title-icon">
                <SidebarIcon name="graduation" size={18} color="#8B5CF6" />
              </span>
              <h2 className="card-title-text">Mentee Readiness Funnel</h2>
            </div>
          </div>

          <div className="funnel-container">
            {MENTEE_FUNNEL.map((tier, idx) => (
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

        {/* Mentee Score Lift Chart */}
        <div className="fv-card fv-trend-card">
          <div className="fv-card-header">
            <div className="card-title-group">
              <span className="card-title-icon">
                <SidebarIcon name="chart-bar" size={18} color="#8B5CF6" />
              </span>
              <h2 className="card-title-text">Mentee Score Lift</h2>
            </div>

            <div className="trend-period-dropdown-wrap">
              <button type="button" className="trend-period-pill">
                <span>{period}</span>
                <SidebarIcon name="chevron-down" size={12} color="#64748B" />
              </button>
            </div>
          </div>

          <div className="trend-chart-stage">
            <div className="trend-pin-callout" style={{ left: "70%", top: "8%" }}>
              <span>+28pts Lift</span>
            </div>

            <ResponsiveContainer width="100%" height={175}>
              <AreaChart
                data={MENTEE_LIFT_DATA}
                margin={{ top: 15, right: 15, left: -25, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="violetMentorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6528D7" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6528D7" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="session"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94A3B8", fontSize: 11 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94A3B8", fontSize: 11 }}
                  ticks={[0, 25, 50, 75, 100]}
                  domain={[0, 100]}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="avgScore"
                  stroke="#6528D7"
                  strokeWidth={2.8}
                  fillOpacity={1}
                  fill="url(#violetMentorGradient)"
                  dot={{ r: 3.5, fill: "#FFFFFF", stroke: "#6528D7", strokeWidth: 2 }}
                  activeDot={{ r: 5.5, fill: "#6528D7", stroke: "#FFFFFF", strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Mentor Quick Actions */}
        <div className="fv-card fv-quick-actions-card">
          <div className="fv-card-header">
            <div className="card-title-group">
              <span className="card-title-icon">
                <SidebarIcon name="zap" size={18} color="#8B5CF6" />
              </span>
              <h2 className="card-title-text">Mentor Actions</h2>
            </div>
          </div>

          <div className="quick-actions-list">
            <button
              type="button"
              className="quick-action-row"
              onClick={() => navigate(`/dashboard?tab=guidance${roleQuery}`)}
            >
              <div className="qa-icon-box qa-amber">
                <SidebarIcon name="message-circle" size={16} color="#F59E0B" />
              </div>
              <span className="qa-label">Provide Guidance Comment</span>
              <SidebarIcon name="chevron-right" size={14} color="#94A3B8" />
            </button>

            <button
              type="button"
              className="quick-action-row"
              onClick={() => navigate(`/dashboard?tab=schedule${roleQuery}`)}
            >
              <div className="qa-icon-box qa-violet">
                <SidebarIcon name="calendar" size={16} color="#8B5CF6" />
              </div>
              <span className="qa-label">Schedule 1-on-1 Office Hour</span>
              <SidebarIcon name="chevron-right" size={14} color="#94A3B8" />
            </button>

            <button
              type="button"
              className="quick-action-row"
              onClick={() => navigate(`/dashboard?tab=knowledge${roleQuery}`)}
            >
              <div className="qa-icon-box qa-cyan">
                <SidebarIcon name="file-text" size={16} color="#06B6D4" />
              </div>
              <span className="qa-label">Mentor Knowledge Base</span>
              <SidebarIcon name="chevron-right" size={14} color="#94A3B8" />
            </button>

            <button
              type="button"
              className="quick-action-row"
              onClick={() => navigate(`/dashboard?tab=best-practices${roleQuery}`)}
            >
              <div className="qa-icon-box qa-emerald">
                <SidebarIcon name="book-open" size={16} color="#10B981" />
              </div>
              <span className="qa-label">Mentorship Playbooks</span>
              <SidebarIcon name="chevron-right" size={14} color="#94A3B8" />
            </button>
          </div>
        </div>
      </section>

      {/* 4. BOTTOM ROW: ASSIGNED STARTUPS + MENTOR IMPACT */}
      <section className="fv-bottom-dashboard-grid">
        <div className="fv-card fv-recent-ideas-card">
          <div className="fv-card-header space-between">
            <div className="card-title-group">
              <span className="card-title-icon">
                <SidebarIcon name="rocket" size={18} color="#8B5CF6" />
              </span>
              <h2 className="card-title-text">Assigned Startups Requiring Guidance</h2>
            </div>

            <button
              type="button"
              className="fv-view-all-link"
              onClick={() => {
                if (onViewAll) onViewAll();
                else navigate(`/dashboard?tab=assignments${roleQuery}`);
              }}
            >
              <span>View All</span>
              <SidebarIcon name="arrow-right" size={13} />
            </button>
          </div>

          <div className="fv-table-responsive-wrapper">
            <table className="fv-recent-ideas-table">
              <thead>
                <tr>
                  <th>Startup Idea</th>
                  <th>Founder</th>
                  <th>Domain</th>
                  <th>Status</th>
                  <th style={{ textAlign: "right" }}></th>
                </tr>
              </thead>
              <tbody>
                {assignedStartups.map((s, idx) => (
                  <tr key={s._id || idx} className="fv-table-row-hover">
                    <td className="cell-title">
                      <strong>{s.title}</strong>
                    </td>
                    <td className="cell-muted">{s.user?.name || "Aarav Patel"}</td>
                    <td className="cell-muted">{s.industry}</td>
                    <td>
                      <span className={`fv-status-pill ${s.statusClass || "status-in-review"}`}>
                        {s.status || "In Review"}
                      </span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <button
                        type="button"
                        className="btn btn-outline btn-sm"
                        onClick={() => {
                          if (onEvaluate) onEvaluate(s);
                          else navigate(`/ideas/${s._id}`);
                        }}
                      >
                        Give Guidance →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mentor Rating Card */}
        <div className="fv-card fv-platform-growth-card">
          <div className="fv-card-header">
            <div className="card-title-group">
              <span className="card-title-icon">
                <SidebarIcon name="activity" size={18} color="#8B5CF6" />
              </span>
              <h2 className="card-title-text">Mentor Satisfaction</h2>
            </div>
          </div>

          <div className="growth-content-body">
            <div className="growth-kpi-row">
              <h3 className="growth-number">4.9</h3>
              <span className="growth-pill-badge">
                <span className="growth-arrow">★</span> Top 5% Mentor
              </span>
            </div>
            <p className="growth-label">Founder Feedback Score</p>

            <div className="growth-visual-stage">
              <div className="growth-bars-cluster">
                <div className="growth-bar" style={{ height: "35px" }} />
                <div className="growth-bar" style={{ height: "50px" }} />
                <div className="growth-bar" style={{ height: "70px" }} />
                <div className="growth-bar" style={{ height: "85px" }} />
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
