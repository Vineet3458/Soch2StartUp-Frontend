import React from "react";

/**
 * Helper to match item date against standard date filter ranges ("7d", "30d", "month", "ALL")
 * Base date is set to "14 Nov 2026" (mock data reference date)
 */
export function matchesDateRange(dateStr, rangeKey) {
  if (!rangeKey || rangeKey === "ALL") return true;
  if (!dateStr) return false;

  const parsed = new Date(dateStr);
  if (isNaN(parsed.getTime())) return true;

  // Normalize dates to midnight local time for fair calendar day comparison
  const itemDate = new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());
  // Base reference date: 14 Nov 2026 (matching mock dataset timeline)
  const baseDate = new Date(2026, 10, 14); // month 10 = November

  const diffMs = baseDate.getTime() - itemDate.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (rangeKey === "7d") {
    return diffDays >= 0 && diffDays <= 7;
  }
  if (rangeKey === "30d") {
    return diffDays >= 0 && diffDays <= 30;
  }
  if (rangeKey === "month") {
    return (
      itemDate.getMonth() === baseDate.getMonth() &&
      itemDate.getFullYear() === baseDate.getFullYear()
    );
  }
  return true;
}

/**
 * Concentric circular target ring icon used across all admin and superadmin metric cards
 * Matches reference UI screenshots exactly (hollow white ring)
 */
export function AdminMetricIcon({ colorClass = "purple" }) {
  return (
    <div className={`admin-metric-icon-box ${colorClass}`}>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="7" stroke="#ffffff" strokeWidth="3" />
      </svg>
    </div>
  );
}

/**
 * Page title and subtitle matching reference screenshots
 */
export function AdminPageHeader({ title, subtitle }) {
  return (
    <header className="admin-page-header">
      <h1 className="admin-page-title">{title}</h1>
      <p className="admin-page-subtitle">{subtitle}</p>
    </header>
  );
}

/**
 * Top 4 Metric Cards Grid
 * @param {Array<{ title: string, value: string|number, sub: string, subType?: 'green'|'red'|'muted', iconColor?: string }>} cards
 */
export function AdminMetricCards({ cards = [] }) {
  return (
    <div className="admin-metrics-grid">
      {cards.map((c, i) => (
        <div key={i} className="admin-metric-card">
          <AdminMetricIcon colorClass={c.iconColor || "purple"} />
          <div className="admin-metric-content">
            <span className="admin-metric-title">{c.title}</span>
            <span className="admin-metric-value">{c.value}</span>
            <span className={`admin-metric-sub ${c.subType || "green"}`}>
              {c.sub}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Content container card with optional title and subtitle
 */
export function AdminCard({ title, subtitle, children, className = "" }) {
  return (
    <section className={`admin-card ${className}`}>
      {title && (
        <div className="admin-card-header">
          <h2 className="admin-card-title">{title}</h2>
          {subtitle && <p className="admin-card-subtitle">{subtitle}</p>}
        </div>
      )}
      {children}
    </section>
  );
}

/**
 * Search and Filter bar with optional dropdowns and primary button
 */
export function AdminFilterBar({
  searchPlaceholder = "Search...",
  searchValue = "",
  onSearchChange,
  filters = [],
  actionButtonText = null,
  onActionClick = null,
}) {
  return (
    <div className="admin-filter-bar">
      <div className="admin-filter-left">
        <div className="admin-search-wrap">
          <span className="admin-search-icon">🔍</span>
          <input
            type="text"
            className="admin-search-input"
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
          />
        </div>

        {filters.map((f, idx) => (
          <select
            key={idx}
            className="admin-select"
            value={f.value}
            onChange={(e) => f.onChange && f.onChange(e.target.value)}
          >
            {f.options.map((opt, oIdx) => (
              <option key={oIdx} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        ))}
      </div>

      {actionButtonText && (
        <button
          type="button"
          className="admin-btn-primary"
          onClick={onActionClick}
        >
          {actionButtonText}
        </button>
      )}
    </div>
  );
}

/**
 * Solid pill badge for status columns
 */
export function AdminBadge({ status, color = null }) {
  const norm = (status || "").toLowerCase().trim();

  let variant = "active";
  if (color) {
    variant = color;
  } else if (["active", "approved", "completed", "reinstated"].includes(norm)) {
    variant = "active";
  } else if (norm === "appeal pending") {
    variant = "appeal-pending";
  } else if (norm === "pending") {
    variant = "pending";
  } else if (norm === "in review") {
    variant = "in-review";
  } else if (["blocked", "rejected", "flagged"].includes(norm)) {
    variant = "blocked";
  }

  return <span className={`admin-badge ${variant}`}>{status}</span>;
}

/**
 * Bottom hint banner
 */
export function AdminBanner({ text, variant = "purple" }) {
  return (
    <div className={`admin-hint-banner ${variant === "amber" ? "amber" : ""}`}>
      <span>{text}</span>
    </div>
  );
}
