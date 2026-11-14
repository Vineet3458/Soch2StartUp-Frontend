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
    title: "Log Events",
    value: "18.4K",
    sub: "Last 24 hours",
    subType: "green",
    iconColor: "purple",
  },
  {
    title: "Errors",
    value: "23",
    sub: "Across services",
    subType: "green",
    iconColor: "red",
  },
  {
    title: "Warnings",
    value: "146",
    sub: "Needs monitoring",
    subType: "green",
    iconColor: "orange",
  },
  {
    title: "Services Logged",
    value: "18",
    sub: "Connected sources",
    subType: "green",
    iconColor: "cyan",
  },
];

const INITIAL_LOGS = [
  {
    timestamp: "14 Nov 09:42",
    service: "Auth API",
    event: "Token refresh completed",
    level: "Info",
    variant: "green",
  },
  {
    timestamp: "14 Nov 09:39",
    service: "Validation",
    event: "Queue processing delayed",
    level: "Warning",
    variant: "orange",
  },
  {
    timestamp: "14 Nov 09:35",
    service: "User service",
    event: "Profile update failed",
    level: "Error",
    variant: "red",
  },
  {
    timestamp: "14 Nov 09:31",
    service: "Database",
    event: "Connection pool healthy",
    level: "Info",
    variant: "green",
  },
  {
    timestamp: "14 Nov 09:25",
    service: "Notifications",
    event: "Email delivery retried",
    level: "Warning",
    variant: "orange",
  },
  {
    timestamp: "14 Nov 09:18",
    service: "Scheduler",
    event: "Daily cleanup completed",
    level: "Info",
    variant: "green",
  },
];

const LOG_FILTERS = [
  {
    label: "Time range",
    desc: "Last 24 hours",
    badge: "Selected",
    badgeVariant: "purple",
  },
  {
    label: "Severity",
    desc: "Info, warning, error",
    badge: "All levels",
    badgeVariant: "cyan",
  },
  {
    label: "Retention",
    desc: "30-day searchable history",
    badge: "Configured",
    badgeVariant: "green",
  },
];

export default function SystemLogsTab() {
  const [logs] = useState(INITIAL_LOGS);

  const handleExport = () => {
    exportToCsv(
      "system_logs",
      ["Timestamp", "Service", "Event", "Level"],
      logs.map((l) => [l.timestamp, l.service, l.event, l.level])
    );
  };

  return (
    <div className="superadmin-module-root">
      <AdminPageHeader
        title="System Logs"
        subtitle="Inspect application, API, authentication and background-job logs for troubleshooting."
      />

      <AdminMetricCards cards={METRICS} />

      <div className="superadmin-layout-grid">
        {/* Left Column: Recent System Log Events */}
        <SuperAdminTableCard
          title="Recent system log events"
          subtitle="Review records, configuration and current operational status."
          columns={["TIMESTAMP", "SERVICE", "EVENT", "LEVEL"]}
          onExport={handleExport}
          rows={logs.map((row, idx) => (
            <tr key={idx}>
              <td style={{ color: "#64748b", whiteSpace: "nowrap" }}>
                {row.timestamp}
              </td>
              <td style={{ fontWeight: 600 }}>{row.service}</td>
              <td style={{ color: "#334155" }}>{row.event}</td>
              <td>
                <SuperAdminBadge status={row.level} variant={row.variant} />
              </td>
            </tr>
          ))}
        />

        {/* Right Column: Log Filters */}
        <div className="superadmin-side-col">
          <SuperAdminControlsCard
            title="Log filters"
            subtitle="Key controls and operational context"
            items={LOG_FILTERS}
          />
        </div>
      </div>
    </div>
  );
}
