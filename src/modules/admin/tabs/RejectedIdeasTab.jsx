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
    title: "Rejected Ideas",
    value: "28",
    sub: "Total rejected submissions",
    subType: "red",
    iconColor: "red",
  },
  {
    title: "This Month",
    value: "6",
    sub: "Rejected in November",
    subType: "green",
    iconColor: "orange",
  },
  {
    title: "Appeals / Queries",
    value: "4",
    sub: "Awaiting follow-up",
    subType: "green",
    iconColor: "cyan",
  },
  {
    title: "Eligible to Resubmit",
    value: "11",
    sub: "Can be revised and resubmitted",
    subType: "green",
    iconColor: "green",
  },
];

const INITIAL_REJECTED = [
  {
    title: "GreenCart",
    founder: "Ishita Rao",
    industry: "Commerce",
    submitted: "09 Nov 2026",
    status: "Rejected",
    reason: "Market viability & unit economics unsustainable",
  },
  {
    title: "QuickMeds",
    founder: "Ravi Kumar",
    industry: "Healthcare",
    submitted: "06 Nov 2026",
    status: "Rejected",
    reason: "Regulatory compliance & licensing barriers",
  },
  {
    title: "StudyBuddy",
    founder: "Pooja Das",
    industry: "Education",
    submitted: "04 Nov 2026",
    status: "Rejected",
    reason: "Saturated competitive landscape without clear moat",
  },
  {
    title: "CityCab Plus",
    founder: "Nikhil Jain",
    industry: "Mobility",
    submitted: "02 Nov 2026",
    status: "Rejected",
    reason: "Capital expenditure requirements exceed seed parameters",
  },
  {
    title: "FoodSaver",
    founder: "Tanya Roy",
    industry: "FoodTech",
    submitted: "31 Oct 2026",
    status: "Rejected",
    reason: "Logistics perishable supply-chain friction",
  },
  {
    title: "SkillLoop",
    founder: "Karan Shah",
    industry: "Commerce",
    submitted: "28 Oct 2026",
    status: "Rejected",
    reason: "Lacks defensible product differentiator in target market",
  },
];

export default function RejectedIdeasTab() {
  const [rejectedList] = useState(INITIAL_REJECTED);
  const [search, setSearch] = useState("");
  const [industryFilter, setIndustryFilter] = useState("ALL");
  const [dateFilter, setDateFilter] = useState("ALL");
  const [selectedRecord, setSelectedRecord] = useState(null);

  const filtered = useMemo(() => {
    return rejectedList.filter((item) => {
      const q = search.toLowerCase().trim();
      const matchSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.founder.toLowerCase().includes(q) ||
        item.industry.toLowerCase().includes(q);
      const matchIndustry =
        industryFilter === "ALL" ||
        item.industry.toLowerCase() === industryFilter.toLowerCase();
      const matchDate = matchesDateRange(item.submitted, dateFilter);
      return matchSearch && matchIndustry && matchDate;
    });
  }, [rejectedList, search, industryFilter, dateFilter]);

  const handleExport = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["STARTUP IDEA,FOUNDER,INDUSTRY,SUBMITTED,STATUS,REASON"]
        .concat(
          filtered.map(
            (r) =>
              `"${r.title}","${r.founder}","${r.industry}","${r.submitted}","${r.status}","${r.reason}"`
          )
        )
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "rejected_startup_ideas.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="admin-tab-rejected-root">
      <AdminPageHeader
        title="Rejected Ideas"
        subtitle="Review rejected submissions, decision reasons and resubmission eligibility."
      />

      <AdminMetricCards cards={METRICS} />

      <AdminCard
        title="Rejected submissions"
        subtitle="Review decision history, rejection reasons and resubmission eligibility."
      >
        <AdminFilterBar
          searchPlaceholder="Search by idea or founder"
          searchValue={search}
          onSearchChange={setSearch}
          filters={[
            {
              value: industryFilter,
              onChange: setIndustryFilter,
              options: [
                { value: "ALL", label: "Industry ▾" },
                { value: "Commerce", label: "Commerce" },
                { value: "Healthcare", label: "Healthcare" },
                { value: "Education", label: "Education" },
                { value: "Mobility", label: "Mobility" },
                { value: "FoodTech", label: "FoodTech" },
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
          actionButtonText="+ Export records"
          onActionClick={handleExport}
        />

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>STARTUP IDEA</th>
                <th>FOUNDER</th>
                <th>INDUSTRY</th>
                <th>SUBMITTED</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item, idx) => (
                <tr
                  key={idx}
                  style={{ cursor: "pointer" }}
                  onClick={() => setSelectedRecord(item)}
                  title="Click to view rejection reason"
                >
                  <td style={{ fontWeight: 600 }}>{item.title}</td>
                  <td>{item.founder}</td>
                  <td style={{ color: "#475569" }}>{item.industry}</td>
                  <td>{item.submitted}</td>
                  <td>
                    <AdminBadge status={item.status} />
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", padding: "32px", color: "#94a3b8" }}>
                    No rejected ideas found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <AdminBanner text="Show transparent decision reasons and whether the founder may revise and resubmit." />
      </AdminCard>

      {/* Rejection Detail Modal */}
      {selectedRecord && (
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
          onClick={() => setSelectedRecord(null)}
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
              Rejection Decision Record
            </h3>
            <p style={{ fontSize: "13px", color: "#64748b", margin: "0 0 16px 0" }}>
              Idea: <strong>{selectedRecord.title}</strong> by {selectedRecord.founder}
            </p>
            <div style={{ background: "#fef2f2", padding: "14px", borderRadius: "10px", marginBottom: "18px", border: "1px solid #fee2e2" }}>
              <div style={{ fontSize: "13px", marginBottom: "6px", color: "#991b1b" }}>
                <strong>Rejection Reason:</strong> {selectedRecord.reason}
              </div>
              <div style={{ fontSize: "13px", color: "#991b1b" }}>
                <strong>Resubmission:</strong> Eligible to revise and submit an updated business model after 30 days.
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                type="button"
                style={{ padding: "8px 18px", borderRadius: "8px", border: "1px solid #cbd5e1", background: "none", cursor: "pointer" }}
                onClick={() => setSelectedRecord(null)}
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
