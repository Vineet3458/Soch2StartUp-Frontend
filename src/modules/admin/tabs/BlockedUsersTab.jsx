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
    title: "Blocked accounts",
    value: "18",
    sub: "Currently restricted",
    subType: "red",
    iconColor: "red",
  },
  {
    title: "Blocked this month",
    value: "7",
    sub: "New restrictions",
    subType: "green",
    iconColor: "orange",
  },
  {
    title: "Appeals pending",
    value: "4",
    sub: "Awaiting admin review",
    subType: "green",
    iconColor: "cyan",
  },
  {
    title: "Reinstated",
    value: "12",
    sub: "Restored this month",
    subType: "green",
    iconColor: "green",
  },
];

const INITIAL_RESTRICTED = [
  {
    user: "Dev Patel",
    email: "dev.p@example.com",
    reason: "Policy violation",
    date: "12 Nov 2026",
    status: "Blocked",
  },
  {
    user: "Nikhil Jain",
    email: "nikhil.j@example.com",
    reason: "Suspicious activity",
    date: "10 Nov 2026",
    status: "Blocked",
  },
  {
    user: "Pooja Das",
    email: "pooja.d@example.com",
    reason: "Repeated abuse",
    date: "08 Nov 2026",
    status: "Appeal pending",
  },
  {
    user: "Karan Shah",
    email: "karan.s@example.com",
    reason: "False information",
    date: "06 Nov 2026",
    status: "Blocked",
  },
  {
    user: "Tanya Roy",
    email: "tanya.r@example.com",
    reason: "Appeal accepted",
    date: "02 Nov 2026",
    status: "Reinstated",
  },
];

export default function BlockedUsersTab() {
  const [restricted, setRestricted] = useState(INITIAL_RESTRICTED);
  const [search, setSearch] = useState("");
  const [reasonFilter, setReasonFilter] = useState("ALL");
  const [dateFilter, setDateFilter] = useState("ALL");
  const [selectedItem, setSelectedItem] = useState(null);

  const filtered = useMemo(() => {
    return restricted.filter((r) => {
      const q = search.toLowerCase().trim();
      const matchSearch =
        !q ||
        r.user.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        r.reason.toLowerCase().includes(q);
      const matchReason =
        reasonFilter === "ALL" ||
        r.reason.toLowerCase() === reasonFilter.toLowerCase();
      const matchDate = matchesDateRange(r.date, dateFilter);
      return matchSearch && matchReason && matchDate;
    });
  }, [restricted, search, reasonFilter, dateFilter]);

  const handleReinstate = (user) => {
    setRestricted((prev) =>
      prev.map((item) =>
        item.user === user ? { ...item, status: "Reinstated" } : item
      )
    );
    setSelectedItem(null);
  };

  return (
    <div className="admin-tab-blocked-root">
      <AdminPageHeader
        title="Blocked Users"
        subtitle="Review restricted accounts, reasons and account reinstatement requests."
      />

      <AdminMetricCards cards={METRICS} />

      <AdminCard
        title="Restricted account directory"
        subtitle="Review restriction history and take appropriate account actions."
      >
        <AdminFilterBar
          searchPlaceholder="Search blocked account"
          searchValue={search}
          onSearchChange={setSearch}
          filters={[
            {
              value: reasonFilter,
              onChange: setReasonFilter,
              options: [
                { value: "ALL", label: "Reason ▾" },
                { value: "Policy violation", label: "Policy violation" },
                { value: "Suspicious activity", label: "Suspicious activity" },
                { value: "Repeated abuse", label: "Repeated abuse" },
                { value: "False information", label: "False information" },
                { value: "Appeal accepted", label: "Appeal accepted" },
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
        />

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>USER</th>
                <th>EMAIL</th>
                <th>RESTRICTION REASON</th>
                <th>DATE</th>
                <th>ACCOUNT STATUS</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, idx) => (
                <tr
                  key={idx}
                  style={{ cursor: "pointer" }}
                  onClick={() => setSelectedItem(r)}
                  title="Click to view details / reinstate"
                >
                  <td style={{ fontWeight: 600 }}>{r.user}</td>
                  <td style={{ color: "#475569" }}>{r.email}</td>
                  <td>{r.reason}</td>
                  <td>{r.date}</td>
                  <td>
                    <AdminBadge status={r.status} />
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", padding: "32px", color: "#94a3b8" }}>
                    No restricted user records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <AdminBanner
          variant="amber"
          text="Account restrictions should be documented; review appeals before reinstating access."
        />
      </AdminCard>

      {/* Reinstatement dialog */}
      {selectedItem && (
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
          onClick={() => setSelectedItem(null)}
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
              Account Restriction Details
            </h3>
            <p style={{ fontSize: "13px", color: "#64748b", margin: "0 0 16px 0" }}>
              Managing restriction for <strong>{selectedItem.user}</strong> ({selectedItem.email})
            </p>
            <div style={{ background: "#fffbeb", padding: "14px", borderRadius: "10px", marginBottom: "18px", border: "1px solid #fef3c7" }}>
              <div style={{ fontSize: "13px", marginBottom: "6px", color: "#92400e" }}>
                <strong>Restriction Reason:</strong> {selectedItem.reason}
              </div>
              <div style={{ fontSize: "13px", marginBottom: "6px", color: "#92400e" }}>
                <strong>Restriction Date:</strong> {selectedItem.date}
              </div>
              <div style={{ fontSize: "13px", color: "#92400e" }}>
                <strong>Current Status:</strong> {selectedItem.status}
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
              <button
                type="button"
                style={{ padding: "8px 16px", borderRadius: "8px", border: "1px solid #cbd5e1", background: "none", cursor: "pointer" }}
                onClick={() => setSelectedItem(null)}
              >
                Close
              </button>
              {selectedItem.status !== "Reinstated" && (
                <button
                  type="button"
                  style={{ padding: "8px 18px", borderRadius: "8px", border: "none", background: "#10b981", color: "#fff", cursor: "pointer", fontWeight: 600 }}
                  onClick={() => handleReinstate(selectedItem.user)}
                >
                  Reinstate Account
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
