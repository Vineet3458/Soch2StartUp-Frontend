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
    title: "Total Ideas",
    value: "326",
    sub: "Across all categories",
    subType: "green",
    iconColor: "purple",
  },
  {
    title: "Pending Review",
    value: "84",
    sub: "Awaiting decision",
    subType: "green",
    iconColor: "orange",
  },
  {
    title: "Approved Ideas",
    value: "102",
    sub: "Accepted submissions",
    subType: "green",
    iconColor: "green",
  },
  {
    title: "Rejected Ideas",
    value: "28",
    sub: "Decision recorded",
    subType: "red",
    iconColor: "red",
  },
];

const INITIAL_IDEAS = [
  {
    title: "Smart Hostel Marketplace",
    founder: "Rahul Sharma",
    industry: "Student Services",
    submitted: "14 Nov 2026",
    status: "In Review",
  },
  {
    title: "AI Travel Assistant",
    founder: "Priya Verma",
    industry: "Travel & Tourism",
    submitted: "13 Nov 2026",
    status: "Approved",
  },
  {
    title: "FarmLink Network",
    founder: "Aman Gupta",
    industry: "Agritech",
    submitted: "12 Nov 2026",
    status: "Pending",
  },
  {
    title: "SkillBridge",
    founder: "Neha Kapoor",
    industry: "Education",
    submitted: "11 Nov 2026",
    status: "Approved",
  },
  {
    title: "GreenCart",
    founder: "Ishita Rao",
    industry: "Commerce",
    submitted: "09 Nov 2026",
    status: "Rejected",
  },
  {
    title: "CareConnect",
    founder: "Dev Malhotra",
    industry: "Healthcare",
    submitted: "08 Nov 2026",
    status: "In Review",
  },
];

export default function AllIdeasTab() {
  const [ideas, setIdeas] = useState(INITIAL_IDEAS);
  const [search, setSearch] = useState("");
  const [industryFilter, setIndustryFilter] = useState("ALL");
  const [dateFilter, setDateFilter] = useState("ALL");
  const [selectedIdea, setSelectedIdea] = useState(null);

  const filtered = useMemo(() => {
    return ideas.filter((i) => {
      const q = search.toLowerCase().trim();
      const matchSearch =
        !q ||
        i.title.toLowerCase().includes(q) ||
        i.founder.toLowerCase().includes(q) ||
        i.industry.toLowerCase().includes(q);
      const matchIndustry =
        industryFilter === "ALL" ||
        i.industry.toLowerCase() === industryFilter.toLowerCase();
      const matchDate = matchesDateRange(i.submitted, dateFilter);
      return matchSearch && matchIndustry && matchDate;
    });
  }, [ideas, search, industryFilter, dateFilter]);

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
    link.setAttribute("download", "all_startup_ideas.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="admin-tab-ideas-root">
      <AdminPageHeader
        title="All Ideas"
        subtitle="Review, organize and manage startup ideas submitted across the platform."
      />

      <AdminMetricCards cards={METRICS} />

      <AdminCard
        title="All startup ideas"
        subtitle="Central directory of ideas submitted by entrepreneurs."
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
                { value: "Student Services", label: "Student Services" },
                { value: "Travel & Tourism", label: "Travel & Tourism" },
                { value: "Agritech", label: "Agritech" },
                { value: "Education", label: "Education" },
                { value: "Commerce", label: "Commerce" },
                { value: "Healthcare", label: "Healthcare" },
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
          actionButtonText="+ Export ideas"
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
                  title="Click to view idea details"
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
                    No startup ideas found matching filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <AdminBanner text="Use filters and idea details to inspect the complete submission before taking action." />
      </AdminCard>

      {/* Detail Modal */}
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
              Submitted by <strong>{selectedIdea.founder}</strong> on {selectedIdea.submitted}
            </p>
            <div style={{ background: "#f8fafc", padding: "14px", borderRadius: "10px", marginBottom: "18px" }}>
              <div style={{ fontSize: "13px", marginBottom: "6px" }}>
                <strong>Industry:</strong> {selectedIdea.industry}
              </div>
              <div style={{ fontSize: "13px", marginBottom: "6px" }}>
                <strong>Current Status:</strong> <AdminBadge status={selectedIdea.status} />
              </div>
              <div style={{ fontSize: "13px" }}>
                <strong>Summary:</strong> Full comprehensive startup submission with target market, customer persona, competitor differentiation, and revenue mechanics.
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
              <button
                type="button"
                style={{ padding: "8px 18px", borderRadius: "8px", border: "1px solid #cbd5e1", background: "none", cursor: "pointer" }}
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
