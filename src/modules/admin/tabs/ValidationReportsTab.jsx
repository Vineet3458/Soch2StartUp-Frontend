import React, { useState, useMemo } from "react";
import {
  AdminPageHeader,
  AdminMetricCards,
  AdminCard,
  AdminFilterBar,
  AdminBadge,
  AdminBanner,
  matchesDateRange,
} from "../AdminSharedComponents.jsx";

const METRICS = [
  {
    title: "Reports Generated",
    value: "287",
    sub: "All-time reports",
    subType: "green",
    iconColor: "purple",
  },
  {
    title: "Reviewed",
    value: "214",
    sub: "74.6% reviewed",
    subType: "green",
    iconColor: "green",
  },
  {
    title: "In Progress",
    value: "38",
    sub: "Awaiting completion",
    subType: "green",
    iconColor: "orange",
  },
  {
    title: "Flagged Reports",
    value: "12",
    sub: "Require attention",
    subType: "red",
    iconColor: "red",
  },
];

const INITIAL_REPORTS = [
  {
    reportId: "SVR-2026-0287",
    idea: "Smart Hostel Marketplace",
    score: "86 / 100",
    generated: "14 Nov 2026",
    status: "Completed",
  },
  {
    reportId: "SVR-2026-0286",
    idea: "AI Travel Assistant",
    score: "79 / 100",
    generated: "13 Nov 2026",
    status: "Completed",
  },
  {
    reportId: "SVR-2026-0285",
    idea: "FarmLink Network",
    score: "—",
    generated: "12 Nov 2026",
    status: "In Review",
  },
  {
    reportId: "SVR-2026-0284",
    idea: "SkillBridge",
    score: "72 / 100",
    generated: "11 Nov 2026",
    status: "Completed",
  },
  {
    reportId: "SVR-2026-0283",
    idea: "GreenCart",
    score: "—",
    generated: "09 Nov 2026",
    status: "Flagged",
  },
  {
    reportId: "SVR-2026-0282",
    idea: "CareConnect",
    score: "81 / 100",
    generated: "08 Nov 2026",
    status: "Completed",
  },
];

export default function ValidationReportsTab() {
  const [reports] = useState(INITIAL_REPORTS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [dateFilter, setDateFilter] = useState("ALL");
  const [selectedReport, setSelectedReport] = useState(null);

  const filtered = useMemo(() => {
    return reports.filter((r) => {
      const q = search.toLowerCase().trim();
      const matchSearch =
        !q ||
        r.reportId.toLowerCase().includes(q) ||
        r.idea.toLowerCase().includes(q);
      const matchStatus =
        statusFilter === "ALL" ||
        r.status.toLowerCase() === statusFilter.toLowerCase();
      const matchDate = matchesDateRange(r.generated, dateFilter);
      return matchSearch && matchStatus && matchDate;
    });
  }, [reports, search, statusFilter, dateFilter]);

  const handleExport = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["REPORT ID,STARTUP IDEA,SCORE,GENERATED,STATUS"]
        .concat(
          filtered.map(
            (r) =>
              `"${r.reportId}","${r.idea}","${r.score}","${r.generated}","${r.status}"`
          )
        )
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "validation_reports_registry.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="admin-tab-reports-root">
      <AdminPageHeader
        title="Validation Reports"
        subtitle="Monitor AI-generated validation reports, review outcomes and report quality."
      />

      <AdminMetricCards cards={METRICS} />

      <AdminCard
        title="Validation report registry"
        subtitle="Track report generation, review status and linked startup ideas."
      >
        <AdminFilterBar
          searchPlaceholder="Search report ID or idea"
          searchValue={search}
          onSearchChange={setSearch}
          filters={[
            {
              value: statusFilter,
              onChange: setStatusFilter,
              options: [
                { value: "ALL", label: "Report status ▾" },
                { value: "Completed", label: "Completed" },
                { value: "In Review", label: "In Review" },
                { value: "Flagged", label: "Flagged" },
              ],
            },
            {
              value: dateFilter,
              onChange: setDateFilter,
              options: [
                { value: "ALL", label: "Date range ▾" },
                { value: "7d", label: "Last 7 days" },
                { value: "30d", label: "Last 30 days" },
                { value: "month", label: "This month" },
              ],
            },
          ]}
          actionButtonText="Export reports"
          onActionClick={handleExport}
        />

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>REPORT ID</th>
                <th>STARTUP IDEA</th>
                <th>SCORE</th>
                <th>GENERATED</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item, idx) => (
                <tr
                  key={idx}
                  style={{ cursor: "pointer" }}
                  onClick={() => setSelectedReport(item)}
                  title="Click to view report details"
                >
                  <td style={{ fontWeight: 600, color: "#7c3aed" }}>
                    {item.reportId}
                  </td>
                  <td style={{ fontWeight: 500 }}>{item.idea}</td>
                  <td>{item.score}</td>
                  <td>{item.generated}</td>
                  <td>
                    <AdminBadge status={item.status} />
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", padding: "32px", color: "#94a3b8" }}>
                    No validation reports found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <AdminBanner text="Scores and report status are illustrative; use verified analysis outputs in production." />
      </AdminCard>

      {/* Report Modal */}
      {selectedReport && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "16px",
          }}
          onClick={() => setSelectedReport(null)}
        >
          <div
            style={{
              background: "#ffffff",
              borderRadius: "16px",
              padding: "24px 28px",
              width: "100%",
              maxWidth: "480px",
              boxShadow: "0 20px 40px rgba(15, 23, 42, 0.2)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ margin: "0 0 6px 0", fontSize: "18px", color: "#0f172a" }}>
              Report: {selectedReport.reportId}
            </h3>
            <p style={{ fontSize: "13px", color: "#64748b", margin: "0 0 16px 0" }}>
              Linked Startup Idea: <strong>{selectedReport.idea}</strong>
            </p>
            <div style={{ background: "#f8fafc", padding: "14px", borderRadius: "10px", marginBottom: "18px" }}>
              <div style={{ fontSize: "13px", marginBottom: "6px" }}>
                <strong>Validation Score:</strong> {selectedReport.score}
              </div>
              <div style={{ fontSize: "13px", marginBottom: "6px" }}>
                <strong>Generated Date:</strong> {selectedReport.generated}
              </div>
              <div style={{ fontSize: "13px" }}>
                <strong>Report Status:</strong> <AdminBadge status={selectedReport.status} />
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                type="button"
                style={{ padding: "8px 18px", borderRadius: "8px", border: "1px solid #cbd5e1", background: "none", cursor: "pointer" }}
                onClick={() => setSelectedReport(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
