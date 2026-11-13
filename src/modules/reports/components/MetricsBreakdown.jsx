import React from "react";

export default function MetricsBreakdown({ metrics = {} }) {
  const metricConfigs = [
    { key: "marketDemand", label: "Market Demand", weight: "30%", color: "#6D28D9", desc: "Customer need & willingness to pay" },
    { key: "feasibility", label: "Feasibility", weight: "20%", color: "#2563EB", desc: "Technical & operational execution ease" },
    { key: "financial", label: "Financial Viability", weight: "20%", color: "#059669", desc: "Unit economics & margin potential" },
    { key: "competition", label: "Competitive Advantage", weight: "15%", color: "#D97706", desc: "Moat against incumbents" },
    { key: "risk", label: "Low Risk Index", weight: "15%", color: "#10B981", desc: "Regulatory & execution safety" },
  ];

  return (
    <div className="metrics-breakdown-card card">
      <h4>📈 Validation Metrics Breakdown</h4>
      <p className="muted small">Weighted AI scoring across 5 key viability pillars.</p>

      <div className="metrics-list-wrap">
        {metricConfigs.map((m) => {
          const val = metrics[m.key] || 0;
          return (
            <div className="metric-row-item" key={m.key}>
              <div className="metric-header-sub">
                <div>
                  <strong>{m.label}</strong>
                  <small className="muted"> · Weight {m.weight}</small>
                </div>
                <strong className="metric-val-number">{val}/100</strong>
              </div>

              <div className="metric-track">
                <div
                  className="metric-fill"
                  style={{
                    width: `${val}%`,
                    backgroundColor: m.color,
                  }}
                />
              </div>
              <small className="muted metric-desc">{m.desc}</small>
            </div>
          );
        })}
      </div>
    </div>
  );
}
