import React from "react";

export default function StatCard({
  title,
  value,
  trend,
  icon,
  subtitle,
  color = "#6D28D9",
}) {
  return (
    <div className="card stat-card-widget">
      <div className="stat-card-widget-top">
        <span className="stat-widget-icon" style={{ backgroundColor: `${color}18`, color }}>
          {icon}
        </span>
        {trend && (
          <span className={`trend-badge ${trend.startsWith("+") ? "positive" : "neutral"}`}>
            {trend}
          </span>
        )}
      </div>

      <div className="stat-card-widget-body">
        <h3 className="stat-widget-number">{value}</h3>
        <p className="stat-widget-title">{title}</p>
        {subtitle && <small className="muted stat-widget-sub">{subtitle}</small>}
      </div>
    </div>
  );
}
