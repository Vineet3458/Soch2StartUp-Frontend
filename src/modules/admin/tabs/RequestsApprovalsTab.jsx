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
    title: "Open Requests",
    value: "24",
    sub: "Across the platform",
    subType: "green",
    iconColor: "purple",
  },
  {
    title: "Pending Approval",
    value: "12",
    sub: "Require admin action",
    subType: "green",
    iconColor: "orange",
  },
  {
    title: "Approved Today",
    value: "18",
    sub: "Decisions completed",
    subType: "green",
    iconColor: "green",
  },
  {
    title: "Rejected Today",
    value: "3",
    sub: "Decisions completed",
    subType: "green",
    iconColor: "red",
  },
];

const INITIAL_REQUESTS = [
  {
    request: "Mentor onboarding",
    submittedBy: "Rohit Verma",
    requestType: "Mentor access",
    submitted: "14 Nov 2026",
    status: "Pending",
  },
  {
    request: "Startup publication",
    submittedBy: "Neha Kapoor",
    requestType: "Content",
    submitted: "14 Nov 2026",
    status: "Pending",
  },
  {
    request: "Role change request",
    submittedBy: "Aarav Mehta",
    requestType: "Access",
    submitted: "13 Nov 2026",
    status: "In Review",
  },
  {
    request: "Resource submission",
    submittedBy: "Ishita Rao",
    requestType: "Resource",
    submitted: "12 Nov 2026",
    status: "Approved",
  },
  {
    request: "Expert verification",
    submittedBy: "Sana Kapoor",
    requestType: "Verification",
    submitted: "11 Nov 2026",
    status: "Pending",
  },
  {
    request: "Profile correction",
    submittedBy: "Kabir Singh",
    requestType: "Account",
    submitted: "10 Nov 2026",
    status: "Rejected",
  },
];

export default function RequestsApprovalsTab() {
  const [requests, setRequests] = useState(INITIAL_REQUESTS);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedReq, setSelectedReq] = useState(null);

  const filtered = useMemo(() => {
    return requests.filter((r) => {
      const q = search.toLowerCase().trim();
      const matchSearch =
        !q ||
        r.request.toLowerCase().includes(q) ||
        r.submittedBy.toLowerCase().includes(q) ||
        r.requestType.toLowerCase().includes(q);
      const matchType =
        typeFilter === "ALL" ||
        r.requestType.toLowerCase() === typeFilter.toLowerCase();
      const matchStatus =
        statusFilter === "ALL" ||
        r.status.toLowerCase() === statusFilter.toLowerCase();
      return matchSearch && matchType && matchStatus;
    });
  }, [requests, search, typeFilter, statusFilter]);

  const handleDecision = (decision) => {
    if (!selectedReq) return;
    setRequests((prev) =>
      prev.map((item) =>
        item.request === selectedReq.request &&
        item.submittedBy === selectedReq.submittedBy
          ? {
              ...item,
              status: decision === "approve" ? "Approved" : "Rejected",
            }
          : item
      )
    );
    setSelectedReq(null);
  };

  return (
    <div className="admin-tab-requests-root">
      <AdminPageHeader
        title="Requests & Approvals"
        subtitle="Review platform requests, verify supporting information and record decisions."
      />

      <AdminMetricCards cards={METRICS} />

      <AdminCard
        title="Approval queue"
        subtitle="Prioritize pending requests and maintain a traceable decision history."
      >
        <AdminFilterBar
          searchPlaceholder="Search request or requester"
          searchValue={search}
          onSearchChange={setSearch}
          filters={[
            {
              value: typeFilter,
              onChange: setTypeFilter,
              options: [
                { value: "ALL", label: "Request type ▾" },
                { value: "Mentor access", label: "Mentor access" },
                { value: "Content", label: "Content" },
                { value: "Access", label: "Access" },
                { value: "Resource", label: "Resource" },
                { value: "Verification", label: "Verification" },
                { value: "Account", label: "Account" },
              ],
            },
            {
              value: statusFilter,
              onChange: setStatusFilter,
              options: [
                { value: "ALL", label: "Status ▾" },
                { value: "Pending", label: "Pending" },
                { value: "In Review", label: "In Review" },
                { value: "Approved", label: "Approved" },
                { value: "Rejected", label: "Rejected" },
              ],
            },
          ]}
          actionButtonText="Review queue"
          onActionClick={() => {
            const firstPending = filtered.find(
              (r) => r.status === "Pending" || r.status === "In Review"
            );
            if (firstPending) setSelectedReq(firstPending);
          }}
        />

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>REQUEST</th>
                <th>SUBMITTED BY</th>
                <th>REQUEST TYPE</th>
                <th>SUBMITTED</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item, idx) => (
                <tr
                  key={idx}
                  style={{ cursor: "pointer" }}
                  onClick={() => setSelectedReq(item)}
                  title="Click to process request"
                >
                  <td style={{ fontWeight: 600 }}>{item.request}</td>
                  <td>{item.submittedBy}</td>
                  <td style={{ color: "#475569" }}>{item.requestType}</td>
                  <td>{item.submitted}</td>
                  <td>
                    {item.status === "In Review" ? (
                      <span className="admin-badge in-review-cyan">
                        In Review
                      </span>
                    ) : (
                      <AdminBadge status={item.status} />
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", padding: "32px", color: "#94a3b8" }}>
                    No requests found matching current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <AdminBanner text="Record the reviewer, decision, timestamp and reason for every approval outcome." />
      </AdminCard>

      {/* Decision Modal */}
      {selectedReq && (
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
          onClick={() => setSelectedReq(null)}
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
              Process Request: {selectedReq.request}
            </h3>
            <p style={{ fontSize: "13px", color: "#64748b", margin: "0 0 16px 0" }}>
              Requester: <strong>{selectedReq.submittedBy}</strong> | Type: {selectedReq.requestType}
            </p>
            <div style={{ background: "#f8fafc", padding: "14px", borderRadius: "10px", marginBottom: "18px" }}>
              <div style={{ fontSize: "13px", marginBottom: "6px" }}>
                <strong>Current Status:</strong> {selectedReq.status}
              </div>
              <div style={{ fontSize: "13px", marginBottom: "6px" }}>
                <strong>Submitted:</strong> {selectedReq.submitted}
              </div>
              <div style={{ fontSize: "13px" }}>
                <strong>Compliance Check:</strong> Verified that request aligns with Soch2Startup operational guidelines.
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
              <button
                type="button"
                style={{ padding: "8px 16px", borderRadius: "8px", border: "1px solid #cbd5e1", background: "none", cursor: "pointer" }}
                onClick={() => setSelectedReq(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                style={{ padding: "8px 16px", borderRadius: "8px", border: "none", background: "#ef4444", color: "#fff", cursor: "pointer", fontWeight: 600 }}
                onClick={() => handleDecision("reject")}
              >
                Reject Request
              </button>
              <button
                type="button"
                style={{ padding: "8px 18px", borderRadius: "8px", border: "none", background: "#10b981", color: "#fff", cursor: "pointer", fontWeight: 600 }}
                onClick={() => handleDecision("approve")}
              >
                Approve Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
