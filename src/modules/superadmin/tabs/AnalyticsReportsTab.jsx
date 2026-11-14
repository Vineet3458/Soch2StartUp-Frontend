import React, { useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import {
  AdminPageHeader,
  AdminMetricCards,
  SuperAdminBadge,
  exportToCsv,
} from "../SuperAdminSharedComponents.jsx";

const METRICS = [
  {
    title: "Platform Users",
    value: "1,248",
    sub: "+12% this month",
    subType: "green",
    iconColor: "purple",
  },
  {
    title: "Ideas Submitted",
    value: "326",
    sub: "+18% this month",
    subType: "green",
    iconColor: "cyan",
  },
  {
    title: "Validation Rate",
    value: "31.3%",
    sub: "+4.2% this month",
    subType: "green",
    iconColor: "green",
  },
  {
    title: "Avg. Review Time",
    value: "2.4 days",
    sub: "-0.6 days",
    subType: "green",
    iconColor: "orange",
  },
];

const PERFORMANCE_DATA = [
  { period: "P1", value: 16 },
  { period: "P2", value: 24 },
  { period: "P3", value: 21 },
  { period: "P4", value: 30 },
  { period: "P5", value: 27 },
  { period: "P6", value: 36 },
  { period: "P7", value: 38 },
  { period: "P8", value: 35 },
  { period: "P9", value: 43 },
  { period: "P10", value: 49 },
  { period: "P11", value: 46 },
  { period: "P12", value: 55 },
];

const REPORTS_LIBRARY = [
  { report: "Platform overview", period: "November", status: "Ready", variant: "green" },
  { report: "Startup pipeline", period: "November", status: "Ready", variant: "green" },
  { report: "User engagement", period: "October", status: "Ready", variant: "green" },
  { report: "Validation quality", period: "October", status: "Queued", variant: "orange" },
];

const EXPORT_OPTIONS = [
  {
    label: "Platform summary",
    formats: ["PDF", "CSV"],
  },
  {
    label: "Role activity",
    formats: ["CSV", "XLSX"],
  },
  {
    label: "Validation outcomes",
    formats: ["PDF", "XLSX"],
  },
];

export default function AnalyticsReportsTab() {
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleExportOption = (reportName, format) => {
    const slug = reportName.toLowerCase().replace(/\s+/g, "_");

    if (format === "CSV") {
      exportToCsv(
        `${slug}_report`,
        ["Metric", "Value", "Status"],
        [
          ["Total Records", "1248", "Active"],
          ["Platform Engagement", "84%", "Optimal"],
          ["Export Timestamp", new Date().toISOString(), "Completed"],
        ]
      );
      showToast(`Exported ${reportName} (CSV) successfully!`);
    } else if (format === "XLSX") {
      // Generate clean tabular XML-based Excel download
      const xmlData = `<?xml version="1.0"?><Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"><Worksheet ss:Name="Report"><Table><Row><Cell><Data ss:Type="String">Metric</Data></Cell><Cell><Data ss:Type="String">Value</Data></Cell><Cell><Data ss:Type="String">Status</Data></Cell></Row><Row><Cell><Data ss:Type="String">Total Records</Data></Cell><Cell><Data ss:Type="Number">1248</Data></Cell><Cell><Data ss:Type="String">Active</Data></Cell></Row><Row><Cell><Data ss:Type="String">Platform Engagement</Data></Cell><Cell><Data ss:Type="String">84%</Data></Cell><Cell><Data ss:Type="String">Optimal</Data></Cell></Row></Table></Worksheet></Workbook>`;
      const blob = new Blob([xmlData], { type: "application/vnd.ms-excel" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${slug}_report.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showToast(`Exported ${reportName} (XLSX) successfully!`);
    } else if (format === "PDF") {
      // Generate structured report summary document download
      const summaryText = `SOCH2STARTUP SUPERADMIN CONSOLE REPORT\r\nReport: ${reportName}\r\nGenerated: ${new Date().toLocaleString()}\r\nStatus: Verified\r\n\r\nSummary:\r\n- Platform Users: 1,248 (+12% this month)\r\n- Ideas Submitted: 326 (+18% this month)\r\n- Validation Rate: 31.3% (+4.2% this month)\r\n- Avg. Review Time: 2.4 days (-0.6 days)\r\n`;
      const blob = new Blob([summaryText], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${slug}_report.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showToast(`Exported ${reportName} (PDF) successfully!`);
    }
  };

  return (
    <div className="superadmin-module-root">
      <AdminPageHeader
        title="Analytics & Reports"
        subtitle="Generate platform-wide insights, operational summaries and exportable reports."
      />

      <AdminMetricCards cards={METRICS} />

      <div className="superadmin-layout-grid">
        {/* Left Column: Platform Performance Trend Chart */}
        <div className="superadmin-main-card">
          <div className="superadmin-card-header-row">
            <div>
              <h2 className="superadmin-card-title">Platform performance</h2>
              <p className="superadmin-card-subtitle">
                Illustrative activity trend across recent reporting periods
              </p>
            </div>
          </div>

          <div style={{ width: "100%", height: 340, marginTop: "24px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={PERFORMANCE_DATA}
                margin={{ top: 20, right: 24, left: -20, bottom: 10 }}
              >
                <CartesianGrid stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="period" hide />
                <YAxis domain={[10, 60]} hide />
                <Tooltip
                  formatter={(val) => [val, "Activity Score"]}
                  contentStyle={{
                    background: "#0f172a",
                    border: "none",
                    borderRadius: "8px",
                    color: "#fff",
                    fontSize: "12px",
                  }}
                  itemStyle={{ color: "#c4b5fd" }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#7c3aed"
                  strokeWidth={3}
                  dot={{ r: 4.5, fill: "#ffffff", stroke: "#7c3aed", strokeWidth: 2.5 }}
                  activeDot={{ r: 6, fill: "#7c3aed", stroke: "#ffffff", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Column: Reports Library & Export Options */}
        <div className="superadmin-side-col">
          {/* Card 1: Reports library */}
          <div className="superadmin-side-card">
            <h3 className="superadmin-side-card-title">Reports library</h3>
            <p className="superadmin-side-card-sub">
              Recently generated platform reports
            </p>

            <div className="superadmin-table-wrap">
              <table className="superadmin-table">
                <thead>
                  <tr>
                    <th>REPORT</th>
                    <th>PERIOD</th>
                    <th>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {REPORTS_LIBRARY.map((r, idx) => (
                    <tr key={idx}>
                      <td style={{ fontWeight: 600 }}>{r.report}</td>
                      <td style={{ color: "#64748b" }}>{r.period}</td>
                      <td>
                        <SuperAdminBadge status={r.status} variant={r.variant} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Card 2: Export options */}
          <div className="superadmin-side-card">
            <h3 className="superadmin-side-card-title">Export options</h3>
            <p className="superadmin-side-card-sub">Choose a report scope and format</p>

            <div className="superadmin-export-options-list">
              {EXPORT_OPTIONS.map((opt, idx) => (
                <div key={idx} className="superadmin-export-option-row">
                  <span className="superadmin-export-option-label">
                    {opt.label}
                  </span>
                  <div className="superadmin-export-option-links">
                    {opt.formats.map((fmt, fIdx) => (
                      <React.Fragment key={fIdx}>
                        {fIdx > 0 && <span style={{ color: "#94a3b8" }}>/</span>}
                        <button
                          type="button"
                          className="superadmin-export-link-btn"
                          onClick={() => handleExportOption(opt.label, fmt)}
                        >
                          {fmt}
                        </button>
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {toastMessage && (
        <div className="superadmin-toast-banner" role="status">
          <span className="toast-icon">✓</span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
