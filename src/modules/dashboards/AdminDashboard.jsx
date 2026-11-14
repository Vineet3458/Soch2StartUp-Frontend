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

const SUBMISSION_TREND_DATA = [
  { month: "Jun", count: 20 },
  { month: "Jul", count: 35 },
  { month: "Aug", count: 52 },
  { month: "Sep", count: 60 },
  { month: "Oct", count: 84 },
  { month: "Nov", count: 72 },
];

const FUNNEL_STAGES = [
  { label: "Submitted", count: 326, gradient: "linear-gradient(135deg, #6528D7 0%, #8B5CF6 100%)", width: "100%" },
  { label: "In Review", count: 184, gradient: "linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)", width: "86%" },
  { label: "Validated", count: 102, gradient: "linear-gradient(135deg, #06B6D4 0%, #22D3EE 100%)", width: "72%" },
  { label: "Launched", count: 28, gradient: "linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)", width: "58%" },
];

const RECENT_IDEAS_BLUEPRINT = [
  {
    id: 1,
    title: "Smart Hostel Marketplace",
    founder: "Rahul Sharma",
    domain: "Student Services",
    status: "In Review",
    statusClass: "status-in-review",
  },
  {
    id: 2,
    title: "AI Travel Assistant",
    founder: "Priya Verma",
    domain: "Travel & Tourism",
    status: "Validated",
    statusClass: "status-validated",
  },
  {
    id: 3,
    title: "HealthTrack Wearable",
    founder: "Aman Gupta",
    domain: "Healthcare",
    status: "Needs Improvement",
    statusClass: "status-needs-improvement",
  },
];

export default function AdminDashboard({ ideas = [], onViewAll = null }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [trendPeriod, setTrendPeriod] = useState("Last 6 Months");

  // Custom Recharts Tooltip matching Image 3 Blueprint Callout
  const CustomTrendTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="trend-custom-tooltip">
          <span>{payload[0].value} Ideas</span>
        </div>
      );
    }
    return null;
  };

  // Combine blueprint ideas with live DB ideas
  const displayedIdeas = [
    ...RECENT_IDEAS_BLUEPRINT,
    ...ideas.slice(0, 3).map((idea, idx) => ({
      id: idx + 4,
      title: idea.title,
      founder: idea.user?.name || "Founder",
      domain: idea.industry || "Technology",
      status:
        idea.report?.verdict === "GO"
          ? "Validated"
          : idea.report?.verdict === "IMPROVE"
          ? "Needs Improvement"
          : "In Review",
      statusClass:
        idea.report?.verdict === "GO"
          ? "status-validated"
          : idea.report?.verdict === "IMPROVE"
          ? "status-needs-improvement"
          : "status-in-review",
      rawIdea: idea,
    })),
  ].slice(0, 3);

  return (
    <div className="founderverse-overview-root role-admin-dashboard">
      {/* 1. PANORAMIC COSMIC WELCOME BANNER (Image 3) */}
      <section className="cosmic-welcome-banner">
        <div className="banner-glow-overlay" />
        <div className="banner-content-col">
          <h1 className="banner-title">Welcome back, Admin 👋</h1>
          <p className="banner-subtitle">
            Manage the platform, users, ideas and accelerate innovation.
          </p>

          <div className="banner-actions-group">
            <button
              type="button"
              className="banner-btn-primary"
              onClick={() => navigate("/admin?tab=users")}
            >
              + Add New User
            </button>
            <button
              type="button"
              className="banner-btn-glass"
              onClick={() => navigate("/admin?tab=review")}
            >
              ✓ Review Ideas
            </button>
            <button
              type="button"
              className="banner-btn-glass"
              onClick={() => navigate("/dashboard?view=reports")}
            >
              📊 Generate Report
            </button>
          </div>
        </div>

        {/* Astronaut on Lunar Surface overlooking Planetary Horizon */}
        <div className="banner-astronaut-col">
          <img
            src="/assets/founderverse/astronaut-laptop.png"
            alt="Founderverse Astronaut exploring startup intelligence"
            className="banner-astronaut-img"
          />
        </div>
      </section>

      {/* 2. 4 TOP KPI STAT CARDS */}
      <section className="fv-stat-cards-grid">
        <div className="fv-kpi-card">
          <div className="kpi-icon-wrap kpi-icon-violet">
            <SidebarIcon name="users-group" size={22} color="#8B5CF6" />
          </div>
          <div className="kpi-info-block">
            <h3 className="kpi-value">1,248</h3>
            <span className="kpi-label">Total Users</span>
            <span className="kpi-growth-pill">
              <span className="growth-arrow">↑</span> +12% this month
            </span>
          </div>
        </div>

        <div className="fv-kpi-card">
          <div className="kpi-icon-wrap kpi-icon-amber">
            <SidebarIcon name="lightbulb" size={22} color="#F59E0B" />
          </div>
          <div className="kpi-info-block">
            <h3 className="kpi-value">326</h3>
            <span className="kpi-label">Startup Ideas</span>
            <span className="kpi-growth-pill">
              <span className="growth-arrow">↑</span> +18% this month
            </span>
          </div>
        </div>

        <div className="fv-kpi-card">
          <div className="kpi-icon-wrap kpi-icon-cyan">
            <SidebarIcon name="chart-bar" size={22} color="#06B6D4" />
          </div>
          <div className="kpi-info-block">
            <h3 className="kpi-value">287</h3>
            <span className="kpi-label">Validation Reports</span>
            <span className="kpi-growth-pill">
              <span className="growth-arrow">↑</span> +16% this month
            </span>
          </div>
        </div>

        <div className="fv-kpi-card">
          <div className="kpi-icon-wrap kpi-icon-emerald">
            <SidebarIcon name="graduation" size={22} color="#10B981" />
          </div>
          <div className="kpi-info-block">
            <h3 className="kpi-value">52</h3>
            <span className="kpi-label">Mentors &amp; Experts</span>
            <span className="kpi-growth-pill">
              <span className="growth-arrow">↑</span> +8% this month
            </span>
          </div>
        </div>
      </section>

      {/* 3. MIDDLE ROW: FUNNEL + TREND CHART + QUICK ACTIONS */}
      <section className="fv-middle-dashboard-grid">
        {/* Left: Idea Journey Funnel */}
        <div className="fv-card fv-funnel-card">
          <div className="fv-card-header">
            <div className="card-title-group">
              <span className="card-title-icon">
                <SidebarIcon name="rocket" size={18} color="#8B5CF6" />
              </span>
              <h2 className="card-title-text">Idea Journey Funnel</h2>
            </div>
          </div>

          <div className="funnel-container">
            {FUNNEL_STAGES.map((stage, idx) => (
              <div
                key={idx}
                className="funnel-tier"
                style={{ width: stage.width, background: stage.gradient }}
              >
                <span className="funnel-tier-label">{stage.label}</span>
                <span className="funnel-tier-count">{stage.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Center: Submission Trend Area Chart */}
        <div className="fv-card fv-trend-card">
          <div className="fv-card-header">
            <div className="card-title-group">
              <span className="card-title-icon">
                <SidebarIcon name="chart-bar" size={18} color="#8B5CF6" />
              </span>
              <h2 className="card-title-text">Submission Trend</h2>
            </div>

            <div className="trend-period-dropdown-wrap">
              <button type="button" className="trend-period-pill">
                <span>{trendPeriod}</span>
                <SidebarIcon name="chevron-down" size={12} color="#64748B" />
              </button>
            </div>
          </div>

          <div className="trend-chart-stage">
            <div className="trend-pin-callout" style={{ left: "68%", top: "8%" }}>
              <span>84 Ideas</span>
            </div>

            <ResponsiveContainer width="100%" height={175}>
              <AreaChart
                data={SUBMISSION_TREND_DATA}
                margin={{ top: 15, right: 15, left: -25, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="violetAdminGradient" x1="0" y1="0" x2="0" y2="1">
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
                  ticks={[0, 20, 40, 60, 80, 100]}
                  domain={[0, 100]}
                />
                <Tooltip content={<CustomTrendTooltip />} />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#6528D7"
                  strokeWidth={2.8}
                  fillOpacity={1}
                  fill="url(#violetAdminGradient)"
                  dot={{ r: 3.5, fill: "#FFFFFF", stroke: "#6528D7", strokeWidth: 2 }}
                  activeDot={{ r: 5.5, fill: "#6528D7", stroke: "#FFFFFF", strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Quick Actions */}
        <div className="fv-card fv-quick-actions-card">
          <div className="fv-card-header">
            <div className="card-title-group">
              <span className="card-title-icon">
                <SidebarIcon name="zap" size={18} color="#8B5CF6" />
              </span>
              <h2 className="card-title-text">Quick Actions</h2>
            </div>
          </div>

          <div className="quick-actions-list">
            <button
              type="button"
              className="quick-action-row"
              onClick={() => navigate("/admin?tab=review")}
            >
              <div className="qa-icon-box qa-amber">
                <SidebarIcon name="file-text" size={16} color="#F59E0B" />
              </div>
              <span className="qa-label">Review Pending Ideas</span>
              <SidebarIcon name="chevron-right" size={14} color="#94A3B8" />
            </button>

            <button
              type="button"
              className="quick-action-row"
              onClick={() => navigate("/admin?tab=mentors")}
            >
              <div className="qa-icon-box qa-violet">
                <SidebarIcon name="users-group" size={16} color="#8B5CF6" />
              </div>
              <span className="qa-label">Assign Mentor</span>
              <SidebarIcon name="chevron-right" size={14} color="#94A3B8" />
            </button>

            <button
              type="button"
              className="quick-action-row"
              onClick={() => navigate("/admin?tab=users")}
            >
              <div className="qa-icon-box qa-cyan">
                <SidebarIcon name="key" size={16} color="#06B6D4" />
              </div>
              <span className="qa-label">Manage Users</span>
              <SidebarIcon name="chevron-right" size={14} color="#94A3B8" />
            </button>

            <button
              type="button"
              className="quick-action-row"
              onClick={() => navigate("/dashboard?view=saved")}
            >
              <div className="qa-icon-box qa-emerald">
                <SidebarIcon name="book-open" size={16} color="#10B981" />
              </div>
              <span className="qa-label">Update Resources</span>
              <SidebarIcon name="chevron-right" size={14} color="#94A3B8" />
            </button>
          </div>
        </div>
      </section>

      {/* 4. BOTTOM ROW: RECENT STARTUP IDEAS + PLATFORM GROWTH */}
      <section className="fv-bottom-dashboard-grid">
        <div className="fv-card fv-recent-ideas-card">
          <div className="fv-card-header space-between">
            <div className="card-title-group">
              <span className="card-title-icon">
                <SidebarIcon name="lightbulb" size={18} color="#8B5CF6" />
              </span>
              <h2 className="card-title-text">Recent Startup Ideas</h2>
            </div>

            <button
              type="button"
              className="fv-view-all-link"
              onClick={() => {
                if (onViewAll) onViewAll();
                else navigate("/admin?tab=ideas");
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
                  <th style={{ width: "38px" }}>#</th>
                  <th>Idea Title</th>
                  <th>Founder</th>
                  <th>Domain</th>
                  <th>Status</th>
                  <th style={{ width: "36px", textAlign: "right" }}></th>
                </tr>
              </thead>
              <tbody>
                {displayedIdeas.map((idea) => (
                  <tr
                    key={idea.id}
                    className="fv-table-row-hover"
                    onClick={() => {
                      if (idea.rawIdea) {
                        navigate(`/ideas/${idea.rawIdea._id}`);
                      } else {
                        navigate("/admin?tab=ideas");
                      }
                    }}
                  >
                    <td className="cell-muted">{idea.id}</td>
                    <td className="cell-title">
                      <strong>{idea.title}</strong>
                    </td>
                    <td className="cell-muted">{idea.founder}</td>
                    <td className="cell-muted">{idea.domain}</td>
                    <td>
                      <span className={`fv-status-pill ${idea.statusClass}`}>
                        {idea.status}
                      </span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <button
                        type="button"
                        className="fv-table-options-btn"
                        title="Options"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate("/admin?tab=ideas");
                        }}
                      >
                        •••
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Platform Growth Card with Rocket Launch */}
        <div className="fv-card fv-platform-growth-card">
          <div className="fv-card-header">
            <div className="card-title-group">
              <span className="card-title-icon">
                <SidebarIcon name="activity" size={18} color="#8B5CF6" />
              </span>
              <h2 className="card-title-text">Platform Growth</h2>
            </div>
          </div>

          <div className="growth-content-body">
            <div className="growth-kpi-row">
              <h3 className="growth-number">1,248</h3>
              <span className="growth-pill-badge">
                <span className="growth-arrow">↑</span> +12%
              </span>
            </div>
            <p className="growth-label">Total Users</p>

            <div className="growth-visual-stage">
              <div className="growth-bars-cluster">
                <div className="growth-bar" style={{ height: "24px" }} />
                <div className="growth-bar" style={{ height: "38px" }} />
                <div className="growth-bar" style={{ height: "50px" }} />
                <div className="growth-bar" style={{ height: "66px" }} />
                <div className="growth-bar" style={{ height: "80px" }} />
                <div className="growth-bar" style={{ height: "96px" }} />
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
