import React, { useState } from "react";
import { Modal } from "../../components/common/index.jsx";

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
 * Standard Header for Mentor Modules matching reference PDF screenshots
 * Includes breadcrumb: "Mentor Portal / {title}", page title, subtitle, and top right icons
 */
export function MentorHeader({ title, subtitle, portalSection = "Mentor Portal" }) {
  const [showHelp, setShowHelp] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [quickNote, setQuickNote] = useState("");
  const [savedNotes, setSavedNotes] = useState([
    "Review GreenCart customer interview recordings by Nov 16",
    "Prepare MedRoute MVP feature matrix discussion",
  ]);

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!quickNote.trim()) return;
    setSavedNotes([quickNote.trim(), ...savedNotes]);
    setQuickNote("");
  };

  return (
    <>
      <div className="mentor-header-bar">
        <nav className="mentor-breadcrumb" aria-label="Breadcrumb">
          <span className="breadcrumb-portal">{portalSection}</span>
          <span className="breadcrumb-sep">/</span>
          <span className="breadcrumb-current">{title}</span>
        </nav>

        <div className="mentor-header-icons">
          <button
            type="button"
            className="mentor-icon-btn"
            title="Mentor Quick Notebook"
            onClick={() => setShowNotes(true)}
            aria-label="Mentor Notes"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
          </button>
          <button
            type="button"
            className="mentor-icon-btn"
            title="Help & Guidelines"
            onClick={() => setShowHelp(true)}
            aria-label="Help"
          >
            ?
          </button>
        </div>
      </div>

      <div className="mentor-title-block">
        <h1 className="mentor-page-title">{title}</h1>
        {subtitle && <p className="mentor-page-subtitle">{subtitle}</p>}
      </div>

      {/* Help Modal */}
      {showHelp && (
        <Modal
          isOpen={showHelp}
          onClose={() => setShowHelp(false)}
          title={`Mentor Guidelines – ${title}`}
          maxWidth={540}
        >
          <div className="mentor-modal-body">
            <p style={{ fontSize: "14px", lineHeight: "1.6", color: "#334155" }}>
              Welcome to the <strong>{title}</strong> workspace. As a certified mentor on Founderverse / Soch2Startup:
            </p>
            <ul style={{ paddingLeft: "20px", fontSize: "13.5px", color: "#475569", lineHeight: "1.7" }}>
              <li>Provide constructive, evidence-based feedback on founder deliverables.</li>
              <li>Track progress against agreed milestones before validating next stage transitions.</li>
              <li>Record session notes and outcomes within 24 hours of each mentoring meeting.</li>
              <li>Reach out to program coordinators for cohort-level escalations.</li>
            </ul>
            <div style={{ marginTop: "12px", textAlign: "right" }}>
              <button
                type="button"
                className="mentor-btn-primary"
                onClick={() => setShowHelp(false)}
              >
                Understood
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Quick Notes Modal */}
      {showNotes && (
        <Modal
          isOpen={showNotes}
          onClose={() => setShowNotes(false)}
          title="Mentor Quick Notebook"
          maxWidth={540}
        >
          <div className="mentor-modal-body">
            <form onSubmit={handleAddNote} style={{ display: "flex", gap: "8px" }}>
              <input
                type="text"
                className="mentor-search-input"
                style={{ flex: 1 }}
                placeholder="Jot down a quick mentoring reminder..."
                value={quickNote}
                onChange={(e) => setQuickNote(e.target.value)}
              />
              <button type="submit" className="mentor-btn-primary">
                Add
              </button>
            </form>
            <div style={{ marginTop: "12px", display: "flex", flexDirection: "column", gap: "8px" }}>
              {savedNotes.map((n, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: "10px 14px",
                    background: "#F8FAFC",
                    border: "1px solid #E2E8F0",
                    borderRadius: "8px",
                    fontSize: "13.5px",
                    color: "#1E293B",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span>{n}</span>
                  <button
                    type="button"
                    style={{ background: "none", border: "none", color: "#94A3B8", cursor: "pointer", fontSize: "16px" }}
                    onClick={() => setSavedNotes(savedNotes.filter((_, i) => i !== idx))}
                    title="Remove note"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}

/**
 * Top 4 Metric Cards Grid
 * @param {Array<{ label: string, value: string|number, sub: string }>} cards
 */
export function MentorMetricCards({ cards = [] }) {
  return (
    <div className="mentor-metrics-grid">
      {cards.map((c, i) => (
        <div key={i} className="mentor-metric-card">
          <span className="mentor-metric-label">{c.label}</span>
          <span className="mentor-metric-value">{c.value}</span>
          <span className="mentor-metric-sub">{c.sub}</span>
        </div>
      ))}
    </div>
  );
}

/**
 * Main Content Card Container
 */
export function MentorCard({
  title,
  children,
  searchTerm = "",
  onSearchChange = null,
  searchPlaceholder = "Search...",
  filterValue = "",
  onFilterChange = null,
  filterOptions = [],
  actionBtn = null,
  onExport = null,
}) {
  return (
    <div className="mentor-card">
      <div className="mentor-card-header">
        <h2 className="mentor-card-title">{title}</h2>
        <div className="mentor-card-actions">
          {onSearchChange && (
            <input
              type="text"
              className="mentor-search-input"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          )}

          {onFilterChange && filterOptions.length > 0 && (
            <select
              className="mentor-filter-select"
              value={filterValue}
              onChange={(e) => onFilterChange(e.target.value)}
            >
              {filterOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          )}

          {onExport && (
            <button
              type="button"
              className="mentor-subnav-btn"
              style={{ border: "1px solid #E2E8F0" }}
              onClick={onExport}
              title="Export as CSV"
            >
              Export CSV
            </button>
          )}

          {actionBtn}
        </div>
      </div>
      {children}
    </div>
  );
}
