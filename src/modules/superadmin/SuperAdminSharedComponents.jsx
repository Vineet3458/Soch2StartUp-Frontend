import React from "react";
import {
  AdminPageHeader,
  AdminMetricCards,
} from "../admin/AdminSharedComponents.jsx";

/**
 * Downloads tabular data as a clean CSV file
 */
export function exportToCsv(filename, headers, rows) {
  const escapeVal = (val) => {
    if (val === null || val === undefined) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const headerLine = headers.map(escapeVal).join(",");
  const dataLines = rows.map((r) => r.map(escapeVal).join(","));
  const csvContent = [headerLine, ...dataLines].join("\r\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * SuperAdmin Solid Pill Badge matching exact reference screenshot styles
 */
export function SuperAdminBadge({
  status,
  variant = null,
  onClick = null,
  interactive = false,
  title = null,
}) {
  const norm = (status || "").toLowerCase().trim();

  let color = variant;
  if (!color) {
    if (
      [
        "active",
        "operational",
        "enabled",
        "protected",
        "connected",
        "configured",
        "recommended",
        "logged",
        "ready",
        "validated",
        "full",
        "live",
      ].includes(norm)
    ) {
      color = "green";
    } else if (
      [
        "testing",
        "available",
        "all levels",
        "quarterly",
        "controlled",
        "off",
        "own only",
      ].includes(norm)
    ) {
      color = "cyan";
    } else if (
      [
        "degraded",
        "disabled",
        "warning",
        "review",
        "required",
        "5 open",
        "3 flagged",
        "queued",
        "monitoring",
        "need approval",
        "limited",
        "scoped",
      ].includes(norm)
    ) {
      color = "orange";
    } else if (["error", "no", "blocked", "rejected"].includes(norm)) {
      color = "red";
    } else if (["selected", "managed"].includes(norm)) {
      color = "purple";
    } else {
      color = "green";
    }
  }

  const isInteractive = interactive || Boolean(onClick);
  const classes = [
    "sa-badge",
    `sa-badge-${color}`,
    isInteractive ? "sa-badge-interactive" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span
      className={classes}
      onClick={onClick}
      role={isInteractive ? "button" : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      onKeyDown={
        isInteractive && onClick
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
      title={title || (isInteractive ? "Click to toggle" : undefined)}
    >
      {status}
    </span>
  );
}

/**
 * Reusable Right-Hand "Controls" Card matching screenshots 02-10
 */
export function SuperAdminControlsCard({
  title,
  subtitle = "Key controls and operational context",
  items = [],
}) {
  return (
    <div className="superadmin-side-card">
      <h3 className="superadmin-side-card-title">{title}</h3>
      <p className="superadmin-side-card-sub">{subtitle}</p>

      <div className="superadmin-controls-list">
        {items.map((item, idx) => (
          <div key={idx} className="superadmin-control-item">
            <div className="superadmin-control-label">{item.label}</div>
            <div className="superadmin-control-desc">{item.desc}</div>
            <SuperAdminBadge
              status={item.badge}
              variant={item.badgeVariant}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Reusable Left Main Table Card with Solid Purple Export Button
 */
export function SuperAdminTableCard({
  title,
  subtitle = "Review records, configuration and current operational status.",
  columns = [],
  rows = [],
  onExport,
  children,
}) {
  return (
    <div className="superadmin-main-card">
      <div className="superadmin-card-header-row">
        <div>
          <h2 className="superadmin-card-title">{title}</h2>
          <p className="superadmin-card-subtitle">{subtitle}</p>
        </div>
        {onExport && (
          <button
            type="button"
            className="superadmin-export-btn"
            onClick={onExport}
            title="Export as CSV"
          >
            Export
          </button>
        )}
      </div>

      {children ? (
        children
      ) : (
        <div className="superadmin-table-wrap">
          <table className="superadmin-table">
            <thead>
              <tr>
                {columns.map((col, idx) => (
                  <th key={idx}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>{rows}</tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export { AdminPageHeader, AdminMetricCards };
