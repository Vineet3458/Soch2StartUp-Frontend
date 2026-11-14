import React, { useState } from "react";
import {
  AdminPageHeader,
  AdminMetricCards,
  SuperAdminBadge,
  SuperAdminControlsCard,
  SuperAdminTableCard,
  exportToCsv,
} from "../SuperAdminSharedComponents.jsx";

const METRICS = [
  {
    title: "Audit Events",
    value: "8,642",
    sub: "Last 30 days",
    subType: "green",
    iconColor: "purple",
  },
  {
    title: "Admin Actions",
    value: "316",
    sub: "Recorded actions",
    subType: "green",
    iconColor: "cyan",
  },
  {
    title: "Sensitive Changes",
    value: "42",
    sub: "Require attention",
    subType: "green",
    iconColor: "orange",
  },
  {
    title: "Unusual Events",
    value: "5",
    sub: "Flagged for review",
    subType: "green",
    iconColor: "red",
  },
];

const INITIAL_AUDIT = [
  {
    time: "14 Nov 09:42",
    actor: "Superadmin",
    action: "Updated platform policy",
    target: "Security settings",
  },
  {
    time: "14 Nov 09:20",
    actor: "Admin",
    action: "Approved mentor profile",
    target: "Rohit Verma",
  },
  {
    time: "13 Nov 17:10",
    actor: "Superadmin",
    action: "Changed feature rollout",
    target: "AI validation",
  },
  {
    time: "13 Nov 15:45",
    actor: "Admin",
    action: "Updated user role",
    target: "Aarav Mehta",
  },
  {
    time: "13 Nov 12:30",
    actor: "Superadmin",
    action: "Viewed access report",
    target: "Permissions",
  },
  {
    time: "12 Nov 18:05",
    actor: "Admin",
    action: "Published resource",
    target: "Founder guide",
  },
];

const AUDIT_CONTROLS = [
  {
    label: "Immutable history",
    desc: "Preserve action records and timestamps",
    badge: "Enabled",
    badgeVariant: "green",
  },
  {
    label: "Actor attribution",
    desc: "Capture user and role context",
    badge: "Enabled",
    badgeVariant: "green",
  },
  {
    label: "Review flagged events",
    desc: "Investigate unusual activity",
    badge: "5 open",
    badgeVariant: "orange",
  },
];

export default function AuditActivityTab() {
  const [auditList] = useState(INITIAL_AUDIT);

  const handleExport = () => {
    exportToCsv(
      "audit_trail",
      ["Time", "Actor", "Action", "Target"],
      auditList.map((a) => [a.time, a.actor, a.action, a.target])
    );
  };

  return (
    <div className="superadmin-module-root">
      <AdminPageHeader
        title="Audit & Activity"
        subtitle="Track sensitive actions, administrator changes and traceable activity across the platform."
      />

      <AdminMetricCards cards={METRICS} />

      <div className="superadmin-layout-grid">
        {/* Left Column: Audit Trail Table */}
        <SuperAdminTableCard
          title="Audit trail"
          subtitle="Review records, configuration and current operational status."
          columns={["TIME", "ACTOR", "ACTION", "TARGET"]}
          onExport={handleExport}
          rows={auditList.map((row, idx) => (
            <tr key={idx}>
              <td style={{ color: "#64748b", whiteSpace: "nowrap" }}>
                {row.time}
              </td>
              <td style={{ fontWeight: 600 }}>{row.actor}</td>
              <td style={{ color: "#334155" }}>{row.action}</td>
              <td style={{ color: "#64748b" }}>{row.target}</td>
            </tr>
          ))}
        />

        {/* Right Column: Audit Controls */}
        <div className="superadmin-side-col">
          <SuperAdminControlsCard
            title="Audit controls"
            subtitle="Key controls and operational context"
            items={AUDIT_CONTROLS}
          />
        </div>
      </div>
    </div>
  );
}
