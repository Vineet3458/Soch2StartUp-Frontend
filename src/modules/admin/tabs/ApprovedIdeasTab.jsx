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
    title: "Approved Ideas",
    value: "102",
    sub: "Approved submissions",
    subType: "green",
    iconColor: "green",
  },
  {
    title: "This Month",
    value: "24",
    sub: "Approved in November",
    subType: "green",
    iconColor: "cyan",
  },
  {
    title: "Ready for Validation",
    value: "38",
    sub: "Next workflow stage",
    subType: "green",
    iconColor: "purple",
  },
  {
    title: "Published",
    value: "61",
    sub: "Visible in founder workspace",
    subType: "green",
    iconColor: "purple",
  },
];

const INITIAL_APPROVED = [
  {
    title: "AI Travel Assistant",
    founder: "Priya Verma",
    industry: "Travel & Tourism",
    submitted: "13 Nov 2026",
    status: "Approved",
  },
  {
    title: "SkillBridge",
    founder: "Neha Kapoor",
    industry: "Education",
    submitted: "11 Nov 2026",
    status: "Approved",
  },
  {
    title: "FarmFresh Direct",
    founder: "Rohan Das",
    industry: "Agritech",
    submitted: "07 Nov 2026",
    status: "Approved",
  },
  {
    title: "FitCircle",
    founder: "Meera Joshi",
    industry: "Health & Fitness",
    submitted: "05 Nov 2026",
    status: "Approved",
  },
  {
    title: "RentMate",
    founder: "Arjun Nair",
    industry: "Real Estate",
    submitted: "03 Nov 2026",
    status: "Approved",
  },
  {
    title: "EcoTrack",
    founder: "Sana Kapoor",
    industry: "Sustainability",
    submitted: "01 Nov 2026",
    status: "Approved",
  },
];

export default function ApprovedIdeasTab() {
  const [approvedList] = useState(INITIAL_APPROVED);
  const [search, setSearch] = useState("");
  const [industryFilter, setIndustryFilter] = useState("ALL");
  const [dateFilter, setDateFilter] = useState("ALL");
  const [selectedIdea, setSelectedIdea] = useState(null);

  const filtered = useMemo(() => {
    return approvedList.filter((item) => {
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
  }, [approvedList, search, industryFilter, dateFilter]);

  const handleExport = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["STARTUP IDEA,FOUNDER,INDUSTRY,SUBMITTED,STATUS"]
        .concat(
          filtered.map(
            (r) =>
              `"${r.title}","${r.founder}","${r.industry}","${r.submitted}","${r.status}"`
          )
        )
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "approved_startup_ideas.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="admin-tab-approved-root">
      <AdminPageHeader
        title="Approved Ideas"
        subtitle="Browse ideas approved to proceed to the next stage."
      />

      <AdminMetricCards cards={METRICS} />

      <AdminCard
        title="Approved startup ideas"
        subtitle="Track accepted submissions and their readiness for subsequent workflows."
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
                { value: "Travel & Tourism", label: "Travel & Tourism" },
                { value: "Education", label: "Education" },
                { value: "Agritech", label: "Agritech" },
                { value: "Health & Fitness", label: "Health & Fitness" },
                { value: "Real Estate", label: "Real Estate" },
                { value: "Sustainability", label: "Sustainability" },
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
          actionButtonText="+ Export approved"
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
                  onClick={() => setSelectedIdea(item)}
                  title="Click to view approved idea summary"
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
                    No approved ideas found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <AdminBanner text="Approval confirms the submission can proceed; it does not guarantee market success." />
      </AdminCard>

      {/* Approved Idea Modal */}
      {selectedIdea && (
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
          onClick={() => setSelectedIdea(null)}
        >
          <div
            style={{
              background: "#ffffff",
              borderRadius: "16px",
              padding: "24px 28px",
              width: "100%",
              maxWidth: "500px",
              boxShadow: "0 20px 40px rgba(15, 23, 42, 0.2)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ margin: "0 0 4px 0", fontSize: "18px", color: "#0f172a" }}>
              {selectedIdea.title}
            </h3>
            <p style={{ fontSize: "12.5px", color: "#64748b", margin: "0 0 16px 0" }}>
              Approved submission by <strong>{selectedIdea.founder}</strong> on {selectedIdea.submitted}
            </p>
            <div style={{ background: "#f8fafc", padding: "14px", borderRadius: "10px", marginBottom: "18px" }}>
              <div style={{ fontSize: "13px", marginBottom: "6px" }}>
                <strong>Industry Category:</strong> {selectedIdea.industry}
              </div>
              <div style={{ fontSize: "13px", marginBottom: "6px" }}>
                <strong>Current Pipeline Stage:</strong> Ready for Validation / Mentorship
              </div>
              <div style={{ fontSize: "13px" }}>
                <strong>Approval Status:</strong> Verified & Published
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                type="button"
                className="admin-btn-primary"
                onClick={() => setSelectedIdea(null)}
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
