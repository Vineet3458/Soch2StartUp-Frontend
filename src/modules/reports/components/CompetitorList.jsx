import React from "react";

export default function CompetitorList({
  competitors = [],
  targetCustomers = [],
  risks = [],
  recommendations = [],
}) {
  return (
    <div className="report-insights-quad-grid">
      {/* 1. Target Customers */}
      <div className="card insight-card">
        <h4>🎯 Target Customers</h4>
        <p className="muted small">Primary personas most likely to adopt.</p>
        <ul className="insight-bullet-list">
          {targetCustomers?.map((c, i) => (
            <li key={i}>{c}</li>
          ))}
          {(!targetCustomers || targetCustomers.length === 0) && (
            <li className="muted">Early adopters in target demographic</li>
          )}
        </ul>
      </div>

      {/* 2. Competitors */}
      <div className="card insight-card">
        <h4>🥊 Competitors & Alternatives</h4>
        <p className="muted small">Direct incumbents & indirect substitutes.</p>
        <ul className="insight-bullet-list">
          {competitors?.map((comp, i) => (
            <li key={i}>{comp}</li>
          ))}
          {(!competitors || competitors.length === 0) && (
            <li className="muted">Offline & established market players</li>
          )}
        </ul>
      </div>

      {/* 3. Key Risks */}
      <div className="card insight-card">
        <h4>⚠️ Key Risks</h4>
        <p className="muted small">Critical failure points to mitigate early.</p>
        <ul className="insight-bullet-list risk-bullets">
          {risks?.map((r, i) => (
            <li key={i}>{r}</li>
          ))}
          {(!risks || risks.length === 0) && (
            <li className="muted">Customer acquisition cost, unit economics</li>
          )}
        </ul>
      </div>

      {/* 4. AI Recommendations */}
      <div className="card insight-card highlight-card">
        <h4>💡 Strategic Recommendations</h4>
        <p className="muted small">Next actionable steps for validation.</p>
        <ul className="insight-bullet-list reco-bullets">
          {recommendations?.map((rec, i) => (
            <li key={i}>{rec}</li>
          ))}
          {(!recommendations || recommendations.length === 0) && (
            <li className="muted">Launch an MVP and interview 15 target users</li>
          )}
        </ul>
      </div>
    </div>
  );
}
