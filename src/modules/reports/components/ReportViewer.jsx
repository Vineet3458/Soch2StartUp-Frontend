import React from "react";
import ScoreGauge from "../../../components/ScoreGauge.jsx";
import VerdictBadge from "../../../components/VerdictBadge.jsx";
import SwotGrid from "../../../components/SwotGrid.jsx";
import MetricsBreakdown from "./MetricsBreakdown.jsx";
import CompetitorList from "./CompetitorList.jsx";

export default function ReportViewer({ idea }) {
  if (!idea) return null;

  const { report, title, description, industry, budget, teamSize, user } = idea;
  const score = report?.score || 0;
  const verdict = report?.verdict || "IMPROVE";

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="report-viewer-root">
      {/* 1. Header Overview Banner */}
      <div className="card report-hero-banner">
        <div className="report-hero-gauge">
          <ScoreGauge score={score} verdict={verdict} />
        </div>

        <div className="report-hero-info">
          <div className="report-verdict-row">
            <VerdictBadge verdict={verdict} />
            <span className="industry-pill">{industry}</span>
            {user && (
              <span className="founder-pill">
                👤 {user.name} ({user.email})
              </span>
            )}
          </div>

          <h2 className="report-main-title">{title}</h2>
          <p className="report-meta-sub">
            Budget: <strong>{budget || "Not specified"}</strong> · Team Size:{" "}
            <strong>{teamSize || "Not specified"}</strong> · Validated with Gemini AI
          </p>
          <p className="report-description-para">{description}</p>

          <div className="report-actions-row no-print">
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={handlePrint}
            >
              🖨️ Print / Save as PDF
            </button>
          </div>
        </div>
      </div>

      {/* 2. Market Research & Feasibility Note */}
      <div className="grid grid-2">
        <div className="card research-summary-card">
          <h4>📊 Market Research Analysis</h4>
          <p className="research-text">{report?.marketResearch}</p>
        </div>

        <div className="card research-summary-card">
          <h4>⚙️ Technical & Operational Feasibility</h4>
          <p className="research-text">{report?.feasibilityNote}</p>
        </div>
      </div>

      {/* 3. Metrics Breakdown & SWOT */}
      <div className="grid grid-2">
        <MetricsBreakdown metrics={report?.metrics} />

        <div className="card swot-container-card">
          <h4>🧩 SWOT Analysis</h4>
          <p className="muted small">Strengths, weaknesses, opportunities, threats.</p>
          <SwotGrid swot={report?.swot} />
        </div>
      </div>

      {/* 4. Target Customers, Competitors, Risks & Recommendations */}
      <CompetitorList
        targetCustomers={report?.targetCustomers}
        competitors={report?.competitors}
        risks={report?.risks}
        recommendations={report?.recommendations}
      />
    </div>
  );
}
