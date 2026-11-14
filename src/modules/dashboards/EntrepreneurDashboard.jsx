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

const FOUNDER_SCORE_TRAJECTORY = [
  { round: "V1 Intake", score: 41 },
  { round: "V2 Market", score: 56 },
  { round: "V3 SWOT", score: 68 },
  { round: "V4 Feedback", score: 79 },
  { round: "V5 MVP", score: 84 },
];

const FOUNDER_FUNNEL_STAGES = [
  { label: "Concept Drafts", count: 3, gradient: "linear-gradient(135deg, #6528D7 0%, #8B5CF6 100%)", width: "100%" },
  { label: "AI Validated", count: 3, gradient: "linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)", width: "86%" },
  { label: "Mentor Feedback", count: 2, gradient: "linear-gradient(135deg, #06B6D4 0%, #22D3EE 100%)", width: "72%" },
  { label: "Investor Ready", count: 1, gradient: "linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)", width: "58%" },
];

export default function EntrepreneurDashboard({ ideas = [], onViewAll = null }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [trendPeriod, setTrendPeriod] = useState("Iteration Rounds");

  // Founder's real ideas or default starter items
  const founderIdeas = ideas.length > 0 ? ideas : [
    {
      _id: "demo-1",
      title: "KrishiMitra AI – Smart Crop Advisory",
      industry: "AgriTech",
      budget: "₹8,00,000",
      report: { score: 79, verdict: "GO" },
      feedback: [{ byName: "Rohan Sharma", role: "mentor" }],
    },
    {
      _id: "demo-2",
      title: "KiranaFlow – Hyperlocal B2B Restocking",
      industry: "Retail / B2B",
      budget: "₹15,00,000",
      report: { score: 61, verdict: "IMPROVE" },
      feedback: [{ byName: "Rohan Sharma", role: "mentor" }],
    },
    {
      _id: "demo-3",
      title: "QuickCoin – Crypto Arbitrage Bot",
      industry: "FinTech / Crypto",
      budget: "₹3,00,000",
      report: { score: 41, verdict: "AVOID" },
      feedback: [],
    },
  ];

  const avgScore = Math.round(
    founderIdeas.reduce((acc, i) => acc + (i.report?.score || 50), 0) / founderIdeas.length
  );

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="trend-custom-tooltip">
          <span>Score: {payload[0].value}/100</span>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="founderverse-overview-root role-entrepreneur-dashboard">
      {/* 1. PANORAMIC FOUNDER BANNER */}
      <section className="cosmic-welcome-banner">
        <div className="banner-glow-overlay" />
        <div className="banner-content-col">
          <h1 className="banner-title">Welcome back, {user?.name || "Founder"} 🚀</h1>
          <p className="banner-subtitle">
            Validate your startup idea, test market feasibility, and prepare for investor launch.
          </p>

          <div className="banner-actions-group">
            <button
              type="button"
              className="banner-btn-primary"
              onClick={() => navigate("/validate")}
            >
              + Submit New Idea
            </button>
            <button
              type="button"
              className="banner-btn-glass"
              onClick={() => navigate("/dashboard?view=reports")}
            >
              📊 Validation Reports
            </button>
            <button
              type="button"
              className="banner-btn-glass"
              onClick={() => navigate("/dashboard?view=market")}
            >
              🌐 Market Insights
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

      {/* 2. 4 FOUNDER KPI STAT CARDS */}
      <section className="fv-stat-cards-grid">
        <div className="fv-kpi-card">
          <div className="kpi-icon-wrap kpi-icon-violet">
            <SidebarIcon name="lightbulb" size={22} color="#8B5CF6" />
          </div>
          <div className="kpi-info-block">
            <h3 className="kpi-value">{founderIdeas.length}</h3>
            <span className="kpi-label">My Startup Ideas</span>
            <span className="kpi-growth-pill">
              <span className="growth-arrow">↑</span> +1 this month
            </span>
          </div>
        </div>

        <div className="fv-kpi-card">
          <div className="kpi-icon-wrap kpi-icon-amber">
            <SidebarIcon name="chart-bar" size={22} color="#F59E0B" />
          </div>
          <div className="kpi-info-block">
            <h3 className="kpi-value">{avgScore} <small style={{ fontSize: "14px", color: "#64748B" }}>/100</small></h3>
            <span className="kpi-label">Avg Validation Score</span>
            <span className="kpi-growth-pill">
              <span className="growth-arrow">↑</span> High Potential
            </span>
          </div>
        </div>

        <div className="fv-kpi-card">
          <div className="kpi-icon-wrap kpi-icon-cyan">
            <SidebarIcon name="message-circle" size={22} color="#06B6D4" />
          </div>
          <div className="kpi-info-block">
            <h3 className="kpi-value">
              {founderIdeas.reduce((sum, i) => sum + (i.feedback?.length || 0), 0) || 3}
            </h3>
            <span className="kpi-label">Mentor Feedbacks</span>
            <span className="kpi-growth-pill">
              <span className="growth-arrow">↑</span> 2 Actionable
            </span>
          </div>
        </div>

        <div className="fv-kpi-card">
          <div className="kpi-icon-wrap kpi-icon-emerald">
            <SidebarIcon name="trending-up" size={22} color="#10B981" />
          </div>
          <div className="kpi-info-block">
            <h3 className="kpi-value">82%</h3>
            <span className="kpi-label">Market Viability</span>
            <span className="kpi-growth-pill">
              <span className="growth-arrow">↑</span> Low Risk Edge
            </span>
          </div>
        </div>
      </section>

      {/* 3. MIDDLE GRID: FOUNDER PROGRESSION + TRAJECTORY + QUICK ACTIONS */}
      <section className="fv-middle-dashboard-grid">
        {/* Funnel: Idea Progression */}
        <div className="fv-card fv-funnel-card">
          <div className="fv-card-header">
            <div className="card-title-group">
              <span className="card-title-icon">
                <SidebarIcon name="rocket" size={18} color="#8B5CF6" />
              </span>
              <h2 className="card-title-text">Idea Progression Funnel</h2>
            </div>
          </div>

          <div className="funnel-container">
            {FOUNDER_FUNNEL_STAGES.map((stage, idx) => (
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

        {/* Center: Validation Score Trajectory */}
        <div className="fv-card fv-trend-card">
          <div className="fv-card-header">
            <div className="card-title-group">
              <span className="card-title-icon">
                <SidebarIcon name="chart-bar" size={18} color="#8B5CF6" />
              </span>
              <h2 className="card-title-text">Validation Trajectory</h2>
            </div>

            <div className="trend-period-dropdown-wrap">
              <button type="button" className="trend-period-pill">
                <span>{trendPeriod}</span>
                <SidebarIcon name="chevron-down" size={12} color="#64748B" />
              </button>
            </div>
          </div>

          <div className="trend-chart-stage">
            <div className="trend-pin-callout" style={{ left: "76%", top: "8%" }}>
              <span>84 Score</span>
            </div>

            <ResponsiveContainer width="100%" height={175}>
              <AreaChart
                data={FOUNDER_SCORE_TRAJECTORY}
                margin={{ top: 15, right: 15, left: -25, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="violetFounderGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6528D7" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6528D7" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="round"
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
                  dataKey="score"
                  stroke="#6528D7"
                  strokeWidth={2.8}
                  fillOpacity={1}
                  fill="url(#violetFounderGradient)"
                  dot={{ r: 3.5, fill: "#FFFFFF", stroke: "#6528D7", strokeWidth: 2 }}
                  activeDot={{ r: 5.5, fill: "#6528D7", stroke: "#FFFFFF", strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Founder Quick Actions */}
        <div className="fv-card fv-quick-actions-card">
          <div className="fv-card-header">
            <div className="card-title-group">
              <span className="card-title-icon">
                <SidebarIcon name="zap" size={18} color="#8B5CF6" />
              </span>
              <h2 className="card-title-text">Founder Actions</h2>
            </div>
          </div>

          <div className="quick-actions-list">
            <button
              type="button"
              className="quick-action-row"
              onClick={() => navigate("/validate")}
            >
              <div className="qa-icon-box qa-amber">
                <SidebarIcon name="lightbulb" size={16} color="#F59E0B" />
              </div>
              <span className="qa-label">Submit New Idea</span>
              <SidebarIcon name="chevron-right" size={14} color="#94A3B8" />
            </button>

            <button
              type="button"
              className="quick-action-row"
              onClick={() => navigate("/dashboard?view=swot")}
            >
              <div className="qa-icon-box qa-violet">
                <SidebarIcon name="file-text" size={16} color="#8B5CF6" />
              </div>
              <span className="qa-label">Review SWOT Analysis</span>
              <SidebarIcon name="chevron-right" size={14} color="#94A3B8" />
            </button>

            <button
              type="button"
              className="quick-action-row"
              onClick={() => navigate("/dashboard?view=plan")}
            >
              <div className="qa-icon-box qa-cyan">
                <SidebarIcon name="book-open" size={16} color="#06B6D4" />
              </div>
              <span className="qa-label">Generate Business Plan</span>
              <SidebarIcon name="chevron-right" size={14} color="#94A3B8" />
            </button>

            <button
              type="button"
              className="quick-action-row"
              onClick={() => navigate("/dashboard?view=saved")}
            >
              <div className="qa-icon-box qa-emerald">
                <SidebarIcon name="bookmark" size={16} color="#10B981" />
              </div>
              <span className="qa-label">Saved Templates &amp; Guides</span>
              <SidebarIcon name="chevron-right" size={14} color="#94A3B8" />
            </button>
          </div>
        </div>
      </section>

      {/* 4. BOTTOM GRID: MY SUBMISSIONS + FOUNDER MILESTONES */}
      <section className="fv-bottom-dashboard-grid">
        {/* Left: My Ideas Table */}
        <div className="fv-card fv-recent-ideas-card">
          <div className="fv-card-header space-between">
            <div className="card-title-group">
              <span className="card-title-icon">
                <SidebarIcon name="lightbulb" size={18} color="#8B5CF6" />
              </span>
              <h2 className="card-title-text">My Startup Ideas</h2>
            </div>

            <button
              type="button"
              className="fv-view-all-link"
              onClick={() => {
                if (onViewAll) onViewAll();
                else navigate("/dashboard?tab=all");
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
                  <th>Idea Title</th>
                  <th>Industry</th>
                  <th>Budget</th>
                  <th>Score</th>
                  <th>Verdict</th>
                  <th style={{ textAlign: "right" }}></th>
                </tr>
              </thead>
              <tbody>
                {founderIdeas.map((idea) => {
                  const score = idea.report?.score || 65;
                  const verdict = idea.report?.verdict || "IMPROVE";
                  return (
                    <tr
                      key={idea._id}
                      className="fv-table-row-hover"
                      onClick={() => navigate(`/ideas/${idea._id}`)}
                    >
                      <td className="cell-title">
                        <strong>{idea.title}</strong>
                      </td>
                      <td className="cell-muted">{idea.industry}</td>
                      <td className="cell-muted">{idea.budget || "₹10,00,000"}</td>
                      <td>
                        <strong style={{ color: score >= 70 ? "#059669" : score >= 50 ? "#D97706" : "#DC2626" }}>
                          {score} / 100
                        </strong>
                      </td>
                      <td>
                        <span
                          className={`fv-status-pill ${
                            verdict === "GO"
                              ? "status-validated"
                              : verdict === "IMPROVE"
                              ? "status-needs-improvement"
                              : "status-in-review"
                          }`}
                        >
                          {verdict === "GO" ? "Validated (GO)" : verdict === "IMPROVE" ? "Needs Work" : "Avoid / Pivot"}
                        </span>
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <button
                          type="button"
                          className="btn btn-outline btn-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/ideas/${idea._id}`);
                          }}
                        >
                          Report →
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Founder Milestone Progress */}
        <div className="fv-card fv-platform-growth-card">
          <div className="fv-card-header">
            <div className="card-title-group">
              <span className="card-title-icon">
                <SidebarIcon name="activity" size={18} color="#8B5CF6" />
              </span>
              <h2 className="card-title-text">Founder Readiness</h2>
            </div>
          </div>

          <div className="growth-content-body">
            <div className="growth-kpi-row">
              <h3 className="growth-number">Level 3</h3>
              <span className="growth-pill-badge">
                <span className="growth-arrow">★</span> 75% Ready
              </span>
            </div>
            <p className="growth-label">MVP Preparation Track</p>

            <div className="growth-visual-stage">
              <div className="growth-bars-cluster">
                <div className="growth-bar" style={{ height: "30px" }} />
                <div className="growth-bar" style={{ height: "45px" }} />
                <div className="growth-bar" style={{ height: "65px" }} />
                <div className="growth-bar" style={{ height: "82px" }} />
                <div className="growth-bar" style={{ height: "98px" }} />
                <div className="growth-bar active-last" style={{ height: "114px" }} />
              </div>

              <div className="growth-rocket-wrap">
                <img
                  src="/assets/founderverse/rocket-launch.png"
                  alt="Founder accelerating into orbit"
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
