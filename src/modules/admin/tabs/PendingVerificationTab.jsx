import React, { useState, useMemo } from "react";
import {
  AdminPageHeader,
  AdminMetricCards,
  AdminCard,
  AdminFilterBar,
  AdminBadge,
  AdminBanner,
} from "../AdminSharedComponents.jsx";

const METRICS = [
  {
    title: "Awaiting verification",
    value: "146",
    sub: "Accounts requiring review",
    subType: "green",
    iconColor: "orange",
  },
  {
    title: "Submitted today",
    value: "18",
    sub: "New verification requests",
    subType: "green",
    iconColor: "cyan",
  },
  {
    title: "Approved this week",
    value: "92",
    sub: "Successfully verified",
    subType: "green",
    iconColor: "green",
  },
  {
    title: "Rejected this week",
    value: "11",
    sub: "Did not meet requirements",
    subType: "red",
    iconColor: "red",
  },
];

const INITIAL_APPLICANTS = [
  {
    applicant: "Rohit Verma",
    type: "Mentor",
    expertise: "Business Strategy",
    submitted: "14 Nov 2026",
    status: "Pending",
  },
  {
    applicant: "Kabir Singh",
    type: "Evaluator",
    expertise: "Technology",
    submitted: "14 Nov 2026",
    status: "Pending",
  },
  {
    applicant: "Meera Nair",
    type: "Mentor",
    expertise: "Finance",
    submitted: "13 Nov 2026",
    status: "Pending",
  },
  {
    applicant: "Sana Kapoor",
    type: "Mentor",
    expertise: "Marketing",
    submitted: "12 Nov 2026",
    status: "Pending",
  },
  {
    applicant: "Arjun Malhotra",
    type: "Evaluator",
    expertise: "Product",
    submitted: "11 Nov 2026",
    status: "Pending",
  },
];

export default function PendingVerificationTab() {
  const [applicants, setApplicants] = useState(INITIAL_APPLICANTS);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [selectedApplicant, setSelectedApplicant] = useState(null);

  const filtered = useMemo(() => {
    return applicants.filter((a) => {
      const q = search.toLowerCase().trim();
      const matchSearch =
        !q ||
        a.applicant.toLowerCase().includes(q) ||
        a.expertise.toLowerCase().includes(q);
      const matchType =
        typeFilter === "ALL" ||
        a.type.toLowerCase() === typeFilter.toLowerCase();
      return matchSearch && matchType;
    });
  }, [applicants, search, typeFilter]);

  const handleDecision = (applicantName, decision) => {
    setApplicants((prev) =>
      prev.map((item) =>
        item.applicant === applicantName
          ? { ...item, status: decision === "approve" ? "Active" : "Rejected" }
          : item
      )
    );
    setSelectedApplicant(null);
  };

  return (
    <div className="admin-tab-pending-root">
      <AdminPageHeader
        title="Pending Verification"
        subtitle="Review identity and professional details before granting verified access."
      />

      <AdminMetricCards cards={METRICS} />

      <AdminCard
        title="Verification review queue"
        subtitle="Inspect submitted details and approve or reject each request."
      >
        <AdminFilterBar
          searchPlaceholder="Search applicant"
          searchValue={search}
          onSearchChange={setSearch}
          filters={[
            {
              value: typeFilter,
              onChange: setTypeFilter,
              options: [
                { value: "ALL", label: "Applicant type ▾" },
                { value: "Mentor", label: "Mentor" },
                { value: "Evaluator", label: "Evaluator" },
              ],
            },
          ]}
        />

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>APPLICANT</th>
                <th>TYPE</th>
                <th>EXPERTISE</th>
                <th>SUBMITTED</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a, idx) => (
                <tr
                  key={idx}
                  style={{ cursor: "pointer" }}
                  onClick={() => setSelectedApplicant(a)}
                  title="Click to review applicant"
                >
                  <td style={{ fontWeight: 600 }}>{a.applicant}</td>
                  <td>{a.type}</td>
                  <td style={{ color: "#475569" }}>{a.expertise}</td>
                  <td>{a.submitted}</td>
                  <td>
                    <AdminBadge status={a.status} />
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", padding: "32px", color: "#94a3b8" }}>
                    No pending verification applicants found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <AdminBanner text="Select an applicant to review documents, verify details and record a decision." />
      </AdminCard>

      {/* Review Modal */}
      {selectedApplicant && (
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
          onClick={() => setSelectedApplicant(null)}
        >
          <div
            style={{
              background: "#ffffff",
              borderRadius: "16px",
              padding: "24px 28px",
              width: "100%",
              maxWidth: "460px",
              boxShadow: "0 20px 40px rgba(15, 23, 42, 0.2)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ margin: "0 0 8px 0", fontSize: "18px", color: "#0f172a" }}>
              Applicant Verification Review
            </h3>
            <p style={{ fontSize: "13px", color: "#64748b", margin: "0 0 16px 0" }}>
              Review credentials for <strong>{selectedApplicant.applicant}</strong>
            </p>
            <div style={{ background: "#f8fafc", padding: "14px", borderRadius: "10px", marginBottom: "18px" }}>
              <div style={{ fontSize: "13px", marginBottom: "6px" }}>
                <strong>Role:</strong> {selectedApplicant.type}
              </div>
              <div style={{ fontSize: "13px", marginBottom: "6px" }}>
                <strong>Expertise:</strong> {selectedApplicant.expertise}
              </div>
              <div style={{ fontSize: "13px", marginBottom: "6px" }}>
                <strong>Submitted On:</strong> {selectedApplicant.submitted}
              </div>
              <div style={{ fontSize: "13px" }}>
                <strong>ID &amp; Documents:</strong> Verified valid identity proofs and portfolio credentials.
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
              <button
                type="button"
                style={{ padding: "8px 16px", borderRadius: "8px", border: "1px solid #cbd5e1", background: "none", cursor: "pointer" }}
                onClick={() => setSelectedApplicant(null)}
              >
                Close
              </button>
              <button
                type="button"
                style={{ padding: "8px 16px", borderRadius: "8px", border: "none", background: "#ef4444", color: "#fff", cursor: "pointer", fontWeight: 600 }}
                onClick={() => handleDecision(selectedApplicant.applicant, "reject")}
              >
                Reject
              </button>
              <button
                type="button"
                style={{ padding: "8px 18px", borderRadius: "8px", border: "none", background: "#10b981", color: "#fff", cursor: "pointer", fontWeight: 600 }}
                onClick={() => handleDecision(selectedApplicant.applicant, "approve")}
              >
                Approve &amp; Verify
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
