import { useState } from "react";
import ReportViewer from "./components/ReportViewer.jsx";
import ScoreGauge from "../../components/ScoreGauge.jsx";
import SwotGrid from "../../components/SwotGrid.jsx";
import MetricsBreakdown from "./components/MetricsBreakdown.jsx";
import CompetitorList from "./components/CompetitorList.jsx";

export default function ValidationReportModule({ idea }) {
  const [activeTab, setActiveTab] = useState("all");

  if (!idea) {
    return (
      <div className="card center empty-state-box">
        <h3>Report Not Found</h3>
        <p className="muted">The requested validation report is not available.</p>
      </div>
    );
  }

  const { report } = idea;

  return (
    <div className="validation-report-module">
      <div className="report-sub-tabs no-print">
        <button
          type="button"
          className={`filter-tab-pill ${activeTab === "all" ? "active" : ""}`}
          onClick={() => setActiveTab("all")}
        >
          Comprehensive Report
        </button>
        <button
          type="button"
          className={`filter-tab-pill ${activeTab === "metrics" ? "active" : ""}`}
          onClick={() => setActiveTab("metrics")}
        >
          Metrics & Scorecard
        </button>
        <button
          type="button"
          className={`filter-tab-pill ${activeTab === "swot" ? "active" : ""}`}
          onClick={() => setActiveTab("swot")}
        >
          SWOT Analysis
        </button>
        <button
          type="button"
          className={`filter-tab-pill ${activeTab === "market" ? "active" : ""}`}
          onClick={() => setActiveTab("market")}
        >
          Market & Competitors
        </button>
      </div>

      {activeTab === "all" && <ReportViewer idea={idea} />}

      {activeTab === "metrics" && (
        <div className="grid grid-2">
          <div className="card center">
            <h3>Overall Score</h3>
            <ScoreGauge score={report?.score} verdict={report?.verdict} />
          </div>
          <MetricsBreakdown metrics={report?.metrics} />
        </div>
      )}

      {activeTab === "swot" && (
        <div className="card">
          <h3>Full SWOT Matrix</h3>
          <SwotGrid swot={report?.swot} />
        </div>
      )}

      {activeTab === "market" && (
        <div className="report-market-view">
          <div className="card">
            <h4>Market Research Insight</h4>
            <p>{report?.marketResearch}</p>
          </div>
          <CompetitorList
            targetCustomers={report?.targetCustomers}
            competitors={report?.competitors}
            risks={report?.risks}
            recommendations={report?.recommendations}
          />
        </div>
      )}
    </div>
  );
}
