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
    title: "Connected Apps",
    value: "8",
    sub: "External services",
    subType: "green",
    iconColor: "purple",
  },
  {
    title: "Healthy Connections",
    value: "7",
    sub: "Operational",
    subType: "green",
    iconColor: "green",
  },
  {
    title: "Attention Needed",
    value: "1",
    sub: "Requires review",
    subType: "green",
    iconColor: "orange",
  },
  {
    title: "Webhook Events",
    value: "12.6K",
    sub: "Last 30 days",
    subType: "green",
    iconColor: "cyan",
  },
];

const INITIAL_SERVICES = [
  {
    integration: "Email provider",
    purpose: "Transactional email",
    lastSync: "2 min ago",
    status: "Connected",
    variant: "green",
  },
  {
    integration: "Cloud storage",
    purpose: "Document storage",
    lastSync: "5 min ago",
    status: "Connected",
    variant: "green",
  },
  {
    integration: "AI provider",
    purpose: "Idea validation",
    lastSync: "1 min ago",
    status: "Connected",
    variant: "green",
  },
  {
    integration: "Analytics service",
    purpose: "Product events",
    lastSync: "4 min ago",
    status: "Connected",
    variant: "green",
  },
  {
    integration: "Payment gateway",
    purpose: "Future billing",
    lastSync: "—",
    status: "Disabled",
    variant: "orange",
  },
  {
    integration: "Webhook endpoint",
    purpose: "External event delivery",
    lastSync: "8 min ago",
    status: "Connected",
    variant: "green",
  },
];

const INTEGRATION_SECURITY = [
  {
    label: "Credential storage",
    desc: "Keep API secrets encrypted",
    badge: "Protected",
    badgeVariant: "green",
  },
  {
    label: "Webhook verification",
    desc: "Validate incoming signatures",
    badge: "Enabled",
    badgeVariant: "green",
  },
  {
    label: "Connection monitoring",
    desc: "Alert on repeated failures",
    badge: "Active",
    badgeVariant: "cyan",
  },
];

export default function IntegrationsTab() {
  const [services, setServices] = useState(INITIAL_SERVICES);

  const toggleServiceStatus = (index) => {
    setServices((prev) =>
      prev.map((item, idx) => {
        if (idx !== index) return item;
        const isConnected = item.status === "Connected";
        return {
          ...item,
          status: isConnected ? "Disabled" : "Connected",
          variant: isConnected ? "orange" : "green",
          lastSync: isConnected ? "—" : "Just now",
        };
      })
    );
  };

  const handleExport = () => {
    exportToCsv(
      "connected_services",
      ["Integration", "Purpose", "Last Sync", "Status"],
      services.map((s) => [s.integration, s.purpose, s.lastSync, s.status])
    );
  };

  return (
    <div className="superadmin-module-root">
      <AdminPageHeader
        title="Integrations"
        subtitle="Manage connected services, API credentials, webhooks and integration health."
      />

      <AdminMetricCards cards={METRICS} />

      <div className="superadmin-layout-grid">
        {/* Left Column: Connected Services Table */}
        <SuperAdminTableCard
          title="Connected services"
          subtitle="Review records, configuration and current operational status."
          columns={["INTEGRATION", "PURPOSE", "LAST SYNC", "STATUS"]}
          onExport={handleExport}
          rows={services.map((row, idx) => (
            <tr key={idx}>
              <td style={{ fontWeight: 600 }}>{row.integration}</td>
              <td style={{ color: "#334155" }}>{row.purpose}</td>
              <td style={{ color: "#64748b" }}>{row.lastSync}</td>
              <td>
                <SuperAdminBadge
                  status={row.status}
                  variant={row.variant}
                  onClick={() => toggleServiceStatus(idx)}
                  title="Click to toggle connection status"
                />
              </td>
            </tr>
          ))}
        />

        {/* Right Column: Integration Security */}
        <div className="superadmin-side-col">
          <SuperAdminControlsCard
            title="Integration security"
            subtitle="Key controls and operational context"
            items={INTEGRATION_SECURITY}
          />
        </div>
      </div>
    </div>
  );
}
