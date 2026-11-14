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
    title: "Awaiting Review",
    value: "84",
    sub: "Require admin attention",
    subType: "green",
    iconColor: "orange",
  },
  {
    title: "Submitted Today",
    value: "12",
    sub: "New submissions",
    subType: "green",
    iconColor: "cyan",
  },
  {
    title: "Reviewed This Week",
    value: "46",
    sub: "Review activity",
    subType: "green",
    iconColor: "green",
  },
  {
    title: "Overdue Reviews",
    value: "9",
    sub: "Past target review time",
    subType: "red",
    iconColor: "red",
  },
];

const INITIAL_QUEUE = [
  {
    title: "Smart Hostel Marketplace",
    founder: "Rahul Sharma",
    industry: "Student Services",
    submitted: "14 Nov 2026",
    status: "Pending",
  },
  {
    title: "FarmLink Network",
    founder: "Aman Gupta",
    industry: "Agritech",
    submitted: "12 Nov 2026",
    status: "Pending",
  },
  {
    title: "CareConnect",
    founder: "Dev Malhotra",
    industry: "Healthcare",
    submitted: "11 Nov 2026",
    status: "Pending",
  },
  {
    title: "LocalLoop",
    founder: "Aisha Khan",
    industry: "Commerce",
    submitted: "10 Nov 2026",
    status: "Pending",
  },
  {
    title: "SkillTrack AI",
    founder: "Karan Shah",
    industry: "Education",
    submitted: "09 Nov 2026",
    status: "Pending",
  },
  {
    title: "CleanRoute",
    founder: "Tarun Roy",
    industry: "Sustainability",
    submitted: "08 Nov 2026",
    status: "Pending",
  },
];

export default function PendingReviewTab() {
  const [queue, setQueue] = useState(INITIAL_QUEUE);
  const [search, setSearch] = useState("");
  const [industryFilter, setIndustryFilter] = useState("ALL");
  const [dateFilter, setDateFilter] = useState("ALL");
  const [selectedReview, setSelectedReview] = useState(null);

  const filtered = useMemo(() => {
    return queue.filter((item) => {
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
  }, [queue, search, industryFilter, dateFilter]);

  const handleDecision = (decision) => {
    if (!selectedReview) return;
    setQueue((prev) =>
      prev.map((item) =>
        item.title === selectedReview.title
          ? { ...item, status: decision === "approve" ? "Approved" : "Rejected" }
          : item
      )
    );
    setSelectedReview(null);
  };

  return (
    <div className="admin-tab-review-root">
      <AdminPageHeader
        title="Pending Review"
        subtitle="Assess new submissions and record clear review decisions."
      />

      <AdminMetricCards cards={METRICS} />

      <AdminCard
        title="Pending review queue"
        subtitle="Prioritize submissions, inspect details and assign review outcomes."
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
                { value: "Agritech", label: "Agritech" },
                { value: "Healthcare", label: "Healthcare" },
                { value: "Commerce", label: "Commerce" },
                { value: "Education", label: "Education" },
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
          actionButtonText="+ Review selected"
          onActionClick={() => {
            if (filtered.length > 0) setSelectedReview(filtered[0]);
          }}
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
                  onClick={() => setSelectedReview(item)}
                  title="Click to assess and record review decision"
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
                    No pending review submissions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <AdminBanner text="Open a submission to review its problem, solution, target market and supporting details." />
      </AdminCard>

      {/* Review Modal */}
      {selectedReview && (
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
          onClick={() => setSelectedReview(null)}
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
            <h3 style={{ margin: "0 0 6px 0", fontSize: "18px", color: "#0f172a" }}>
              Review Submission: {selectedReview.title}
            </h3>
            <p style={{ fontSize: "13px", color: "#64748b", margin: "0 0 16px 0" }}>
              Founder: <strong>{selectedReview.founder}</strong> | Industry: {selectedReview.industry}
            </p>
            <div style={{ background: "#f8fafc", padding: "14px", borderRadius: "10px", marginBottom: "18px" }}>
              <div style={{ fontSize: "13px", marginBottom: "6px" }}>
                <strong>Current Status:</strong> <AdminBadge status={selectedReview.status} />
              </div>
              <div style={{ fontSize: "13px", marginBottom: "6px" }}>
                <strong>Submission Date:</strong> {selectedReview.submitted}
              </div>
              <div style={{ fontSize: "13px" }}>
                <strong>Review Guidance:</strong> Verify value proposition, target customer validation, feasibility score and market readiness.
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
              <button
                type="button"
                style={{ padding: "8px 16px", borderRadius: "8px", border: "1px solid #cbd5e1", background: "none", cursor: "pointer" }}
                onClick={() => setSelectedReview(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                style={{ padding: "8px 16px", borderRadius: "8px", border: "none", background: "#ef4444", color: "#fff", cursor: "pointer", fontWeight: 600 }}
                onClick={() => handleDecision("reject")}
              >
                Reject Idea
              </button>
              <button
                type="button"
                style={{ padding: "8px 18px", borderRadius: "8px", border: "none", background: "#10b981", color: "#fff", cursor: "pointer", fontWeight: 600 }}
                onClick={() => handleDecision("approve")}
              >
                Approve Idea
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
