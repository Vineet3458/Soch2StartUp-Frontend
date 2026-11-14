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
    title: "Platform Roles",
    value: "5",
    sub: "Standard roles",
    subType: "green",
    iconColor: "purple",
  },
  {
    title: "Permission Keys",
    value: "42",
    sub: "Configured permissions",
    subType: "green",
    iconColor: "cyan",
  },
  {
    title: "Custom Groups",
    value: "2",
    sub: "Additional groups",
    subType: "green",
    iconColor: "green",
  },
  {
    title: "Recent Changes",
    value: "6",
    sub: "Last 30 days",
    subType: "green",
    iconColor: "orange",
  },
];

const INITIAL_MATRIX = [
  {
    permission: "Manage platform settings",
    superadmin: { text: "Full", variant: "green" },
    admin: { text: "No", variant: "red" },
    founder: { text: "No", variant: "red" },
  },
  {
    permission: "Manage users",
    superadmin: { text: "Full", variant: "green" },
    admin: { text: "Limited", variant: "orange" },
    founder: { text: "No", variant: "red" },
  },
  {
    permission: "Review startup ideas",
    superadmin: { text: "Full", variant: "green" },
    admin: { text: "Full", variant: "green" },
    founder: { text: "Own only", variant: "cyan" },
  },
  {
    permission: "Manage validation engine",
    superadmin: { text: "Full", variant: "green" },
    admin: { text: "No", variant: "red" },
    founder: { text: "No", variant: "red" },
  },
  {
    permission: "View analytics",
    superadmin: { text: "Full", variant: "green" },
    admin: { text: "Scoped", variant: "orange" },
    founder: { text: "Own only", variant: "cyan" },
  },
  {
    permission: "Manage integrations",
    superadmin: { text: "Full", variant: "green" },
    admin: { text: "No", variant: "red" },
    founder: { text: "No", variant: "red" },
  },
];

const ACCESS_GOVERNANCE = [
  {
    label: "Least privilege",
    desc: "Grant only required access",
    badge: "Recommended",
    badgeVariant: "green",
  },
  {
    label: "Permission review",
    desc: "Reconfirm access periodically",
    badge: "Quarterly",
    badgeVariant: "cyan",
  },
  {
    label: "Change history",
    desc: "Track role and permission edits",
    badge: "Logged",
    badgeVariant: "green",
  },
];

export default function RolesPermissionsTab() {
  const [matrix, setMatrix] = useState(INITIAL_MATRIX);

  const cycleRolePermission = (rowIdx, roleKey) => {
    setMatrix((prev) =>
      prev.map((row, idx) => {
        if (idx !== rowIdx) return row;
        const current = row[roleKey]?.text;
        let next = { text: "Full", variant: "green" };

        if (roleKey === "admin") {
          if (current === "Full") next = { text: "Limited", variant: "orange" };
          else if (current === "Limited") next = { text: "No", variant: "red" };
          else next = { text: "Full", variant: "green" };
        } else if (roleKey === "founder") {
          if (current === "No") next = { text: "Own only", variant: "cyan" };
          else if (current === "Own only") next = { text: "Full", variant: "green" };
          else next = { text: "No", variant: "red" };
        } else {
          if (current === "Full") next = { text: "Limited", variant: "orange" };
          else next = { text: "Full", variant: "green" };
        }

        return { ...row, [roleKey]: next };
      })
    );
  };

  const handleExport = () => {
    exportToCsv(
      "roles_permissions_matrix",
      ["Permission", "Superadmin", "Admin", "Founder"],
      matrix.map((m) => [
        m.permission,
        m.superadmin.text,
        m.admin.text,
        m.founder.text,
      ])
    );
  };

  return (
    <div className="superadmin-module-root">
      <AdminPageHeader
        title="Roles & Permissions"
        subtitle="Define role-based access control and review permissions across all user experiences."
      />

      <AdminMetricCards cards={METRICS} />

      <div className="superadmin-layout-grid">
        {/* Left Column: Role Permission Matrix */}
        <SuperAdminTableCard
          title="Role permission matrix"
          subtitle="Review records, configuration and current operational status."
          columns={["PERMISSION", "SUPERADMIN", "ADMIN", "FOUNDER"]}
          onExport={handleExport}
          rows={matrix.map((row, idx) => (
            <tr key={idx}>
              <td style={{ fontWeight: 600 }}>{row.permission}</td>
              <td>
                <SuperAdminBadge
                  status={row.superadmin.text}
                  variant={row.superadmin.variant}
                  onClick={() => cycleRolePermission(idx, "superadmin")}
                  title="Click to toggle permission"
                />
              </td>
              <td>
                <SuperAdminBadge
                  status={row.admin.text}
                  variant={row.admin.variant}
                  onClick={() => cycleRolePermission(idx, "admin")}
                  title="Click to toggle permission"
                />
              </td>
              <td>
                <SuperAdminBadge
                  status={row.founder.text}
                  variant={row.founder.variant}
                  onClick={() => cycleRolePermission(idx, "founder")}
                  title="Click to toggle permission"
                />
              </td>
            </tr>
          ))}
        />

        {/* Right Column: Access Governance */}
        <div className="superadmin-side-col">
          <SuperAdminControlsCard
            title="Access governance"
            subtitle="Key controls and operational context"
            items={ACCESS_GOVERNANCE}
          />
        </div>
      </div>
    </div>
  );
}
