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

const SCORING_DISTRIBUTION = [
  { band: "0-40 Low", count: 4 },
  { band: "40-60 Moderate", count: 18 },
  { band: "60-75 Viable", count: 32 },
  { band: "75-85 High", count: 48 },
  { band: "85-100 Elite", count: 12 },
];

const EVAL_FUNNEL = [
  { label: "Queue Ingestion", count: 24, gradient: "linear-gradient(135deg, #6528D7 0%, #8B5CF6 100%)", width: "100%" },
  { label: "Rubric Scoring Active", count: 15, gradient: "linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)", width: "86%" },
  { label: "Peer Calibration", count: 8, gradient: "linear-gradient(135deg, #06B6D4 0%, #22D3EE 100%)", width: "72%" },
  { label: "Scorecards Finalized", count: 64, gradient: "linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)", width: "58%" },
];

export default function EvaluatorDashboard({ ideas = [], onViewAll = null, onEvaluate = null }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [period, setPeriod] = useState("Calibration 2026");

  const evalQueue = ideas.length > 0 ? ideas : [
    {
      _id: "ev-1",
      title: "Smart Hostel Marketplace",
      user: { name: "Rahul Sharma" },
      industry: "Student Services",
      status: "Scoring Pending",
      statusClass: "status-in-review",
    },
    {
      _id: "ev-2",
      title: "AI Travel Assistant",
      user: { name: "Priya Verma" },
      industry: "Travel & Tourism",
      status: "Scorecard Ready",
      statusClass: "status-validated",
    },
    {
      _id: "ev-3",
      title: "HealthTrack Wearable",
      user: { name: "Aman Gupta" },
      industry: "Healthcare",
      status: "Needs Calibration",
      statusClass: "status-needs-improvement",
    },
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="trend-custom-tooltip">
          <span>{payload[0].value} Submissions</span>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="founderverse-overview-root role-evaluator-dashboard">
      {/* 1. PANORAMIC EVALUATOR BANNER */}
      <section className="cosmic-welcome-banner">
        <div className="banner-glow-overlay" />
        <div className="banner-content-col">
          <h1 className="banner-title">Welcome back, {user?.name || "Evaluator"} 🏅</h1>
          <p className="banner-subtitle">
            Calibrate scoring rubrics, review evaluation queues, and submit objective feasibility scores.
          </p>

          <div className="banner-actions-group">
            <button
              type="button"
              className="banner-btn-primary"
              onClick={() => navigate("/dashboard?tab=submitted")}
            >
              ⭐ Evaluation Tasks
            </button>
            <button
              type="button"
              className="banner-btn-glass"
              onClick={() => navigate("/dashboard?tab=eval-form")}
            >
              📋 Scoring Rubrics
            </button>
            <button
              type="button"
              className="banner-btn-glass"
              onClick={() => navigate("/dashboard?view=market")}
            >
              📊 Quality Insights
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

      {/* 2. 4 EVALUATOR KPI STAT CARDS */}
      <section className="fv-stat-cards-grid">
        <div className="fv-kpi-card">
          <div className="kpi-icon-wrap kpi-icon-violet">
            <SidebarIcon name="clipboard-list" size={22} color="#8B5CF6" />
          </div>
          <div className="kpi-info-block">
            <h3 className="kpi-value">9</h3>
            <span className="kpi-label">Pending Evaluations</span>
            <span className="kpi-growth-pill">
              <span className="growth-arrow">●</span> 3 High Priority
            </span>
          </div>
        </div>

        <div className="fv-kpi-card">
          <div className="kpi-icon-wrap kpi-icon-amber">
            <SidebarIcon name="check-circle" size={22} color="#F59E0B" />
          </div>
          <div className="kpi-info-block">
            <h3 className="kpi-value">64</h3>
            <span className="kpi-label">Completed Scorecards</span>
            <span className="kpi-growth-pill">
              <span className="growth-arrow">✓</span> 100% On-Time
            </span>
          </div>
        </div>

        <div className="fv-kpi-card">
          <div className="kpi-icon-wrap kpi-icon-cyan">
            <SidebarIcon name="scale" size={22} color="#06B6D4" />
          </div>
          <div className="kpi-info-block">
            <h3 className="kpi-value">±2.1%</h3>
            <span className="kpi-label">Calibration Variance</span>
            <span className="kpi-growth-pill">
              <span className="growth-arrow">★</span> High Precision
            </span>
          </div>
        </div>

        <div className="fv-kpi-card">
          <div className="kpi-icon-wrap kpi-icon-emerald">
            <SidebarIcon name="activity" size={22} color="#10B981" />
          </div>
          <div className="kpi-info-block">
            <h3 className="kpi-value">18m</h3>
            <span className="kpi-label">Avg Scoring Duration</span>
            <span className="kpi-growth-pill">
              <span className="growth-arrow">⚡</span> -4m Faster
            </span>
          </div>
        </div>
      </section>

      {/* 3. MIDDLE ROW: EVALUATION PIPELINE + SCORE DISTRIBUTION + QUICK ACTIONS */}
      <section className="fv-middle-dashboard-grid">
        {/* Pipeline Funnel */}
        <div className="fv-card fv-funnel-card">
          <div className="fv-card-header">
            <div className="card-title-group">
              <span className="card-title-icon">
                <SidebarIcon name="medal" size={18} color="#8B5CF6" />
              </span>
              <h2 className="card-title-text">Evaluation Pipeline</h2>
            </div>
          </div>

          <div className="funnel-container">
            {EVAL_FUNNEL.map((tier, idx) => (
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

        {/* Scoring Distribution Curve */}
        <div className="fv-card fv-trend-card">
          <div className="fv-card-header">
            <div className="card-title-group">
              <span className="card-title-icon">
                <SidebarIcon name="chart-bar" size={18} color="#8B5CF6" />
              </span>
              <h2 className="card-title-text">Scoring Distribution</h2>
            </div>

            <div className="trend-period-dropdown-wrap">
              <button type="button" className="trend-period-pill">
                <span>{period}</span>
                <SidebarIcon name="chevron-down" size={12} color="#64748B" />
              </button>
            </div>
          </div>

          <div className="trend-chart-stage">
            <div className="trend-pin-callout" style={{ left: "62%", top: "8%" }}>
              <span>78.2 Mean</span>
            </div>

            <ResponsiveContainer width="100%" height={175}>
              <AreaChart
                data={SCORING_DISTRIBUTION}
                margin={{ top: 15, right: 15, left: -25, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="violetEvaluatorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6528D7" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6528D7" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="band"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94A3B8", fontSize: 10.5 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94A3B8", fontSize: 11 }}
                  ticks={[0, 15, 30, 45, 60]}
                  domain={[0, 60]}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#6528D7"
                  strokeWidth={2.8}
                  fillOpacity={1}
                  fill="url(#violetEvaluatorGradient)"
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
              <h2 className="card-title-text">Evaluation Actions</h2>
            </div>
          </div>

          <div className="quick-actions-list">
            <button
              type="button"
              className="quick-action-row"
              onClick={() => navigate("/dashboard?tab=submitted")}
            >
              <div className="qa-icon-box qa-amber">
                <SidebarIcon name="clipboard-list" size={16} color="#F59E0B" />
              </div>
              <span className="qa-label">Evaluate Next Submission</span>
              <SidebarIcon name="chevron-right" size={14} color="#94A3B8" />
            </button>

            <button
              type="button"
              className="quick-action-row"
              onClick={() => navigate("/dashboard?tab=eval-form")}
            >
              <div className="qa-icon-box qa-violet">
                <SidebarIcon name="scale" size={16} color="#8B5CF6" />
              </div>
              <span className="qa-label">Scoring Rubric Rules</span>
              <SidebarIcon name="chevron-right" size={14} color="#94A3B8" />
            </button>

            <button
              type="button"
              className="quick-action-row"
              onClick={() => navigate("/dashboard?tab=disputes")}
            >
              <div className="qa-icon-box qa-cyan">
                <SidebarIcon name="gavel" size={16} color="#06B6D4" />
              </div>
              <span className="qa-label">Disputes &amp; Calibration</span>
              <SidebarIcon name="chevron-right" size={14} color="#94A3B8" />
            </button>

            <button
              type="button"
              className="quick-action-row"
              onClick={() => navigate("/dashboard?view=reports")}
            >
              <div className="qa-icon-box qa-emerald">
                <SidebarIcon name="file-text" size={16} color="#10B981" />
              </div>
              <span className="qa-label">Generate Score Summary</span>
              <SidebarIcon name="chevron-right" size={14} color="#94A3B8" />
            </button>
          </div>
        </div>
      </section>

      {/* 4. BOTTOM ROW: EVALUATION QUEUE + CONSISTENCY */}
      <section className="fv-bottom-dashboard-grid">
        <div className="fv-card fv-recent-ideas-card">
          <div className="fv-card-header space-between">
            <div className="card-title-group">
              <span className="card-title-icon">
                <SidebarIcon name="clipboard-list" size={18} color="#8B5CF6" />
              </span>
              <h2 className="card-title-text">Priority Evaluation Queue</h2>
            </div>

            <button
              type="button"
              className="fv-view-all-link"
              onClick={() => {
                if (onViewAll) onViewAll();
                else navigate("/dashboard?tab=submitted");
              }}
            >
              <span>View All Tasks</span>
              <SidebarIcon name="arrow-right" size={13} />
            </button>
          </div>

          <div className="fv-table-responsive-wrapper">
            <table className="fv-recent-ideas-table">
              <thead>
                <tr>
                  <th>Submission</th>
                  <th>Domain</th>
                  <th>Founder</th>
                  <th>Status</th>
                  <th style={{ textAlign: "right" }}></th>
                </tr>
              </thead>
              <tbody>
                {evalQueue.map((item, idx) => (
                  <tr key={item._id || idx} className="fv-table-row-hover">
                    <td className="cell-title">
                      <strong>{item.title}</strong>
                    </td>
                    <td className="cell-muted">{item.industry}</td>
                    <td className="cell-muted">{item.user?.name || "Founder"}</td>
                    <td>
                      <span className={`fv-status-pill ${item.statusClass || "status-in-review"}`}>
                        {item.status || "Pending Rubric"}
                      </span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={() => {
                          if (onEvaluate) onEvaluate(item);
                          else navigate(`/ideas/${item._id}`);
                        }}
                      >
                        Score Now ★
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Consistency Index */}
        <div className="fv-card fv-platform-growth-card">
          <div className="fv-card-header">
            <div className="card-title-group">
              <span className="card-title-icon">
                <SidebarIcon name="activity" size={18} color="#8B5CF6" />
              </span>
              <h2 className="card-title-text">Scoring Consistency</h2>
            </div>
          </div>

          <div className="growth-content-body">
            <div className="growth-kpi-row">
              <h3 className="growth-number">98.4%</h3>
              <span className="growth-pill-badge">
                <span className="growth-arrow">★</span> Calibrated
              </span>
            </div>
            <p className="growth-label">Reliability &amp; Benchmark Index</p>

            <div className="growth-visual-stage">
              <div className="growth-bars-cluster">
                <div className="growth-bar" style={{ height: "38px" }} />
                <div className="growth-bar" style={{ height: "55px" }} />
                <div className="growth-bar" style={{ height: "72px" }} />
                <div className="growth-bar" style={{ height: "88px" }} />
                <div className="growth-bar" style={{ height: "102px" }} />
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
