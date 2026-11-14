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
    title: "Total Features",
    value: "36",
    sub: "Configured features",
    subType: "green",
    iconColor: "purple",
  },
  {
    title: "Enabled",
    value: "29",
    sub: "Available to users",
    subType: "green",
    iconColor: "green",
  },
  {
    title: "In Testing",
    value: "4",
    sub: "Limited rollout",
    subType: "green",
    iconColor: "cyan",
  },
  {
    title: "Disabled",
    value: "3",
    sub: "Not currently active",
    subType: "green",
    iconColor: "orange",
  },
];

const INITIAL_FLAGS = [
  {
    feature: "AI idea validation",
    rollout: "100%",
    environment: "Production",
    status: "Enabled",
    variant: "green",
  },
  {
    feature: "Mentor matching",
    rollout: "50%",
    environment: "Staging",
    status: "Testing",
    variant: "cyan",
  },
  {
    feature: "Founder community",
    rollout: "0%",
    environment: "Production",
    status: "Disabled",
    variant: "orange",
  },
  {
    feature: "Advanced analytics",
    rollout: "25%",
    environment: "Staging",
    status: "Testing",
    variant: "cyan",
  },
  {
    feature: "Pitch deck assistant",
    rollout: "100%",
    environment: "Production",
    status: "Enabled",
    variant: "green",
  },
  {
    feature: "Bulk export",
    rollout: "0%",
    environment: "Development",
    status: "Disabled",
    variant: "orange",
  },
];

const ROLLOUT_SAFEGUARDS = [
  {
    label: "Gradual rollout",
    desc: "Release to selected user groups",
    badge: "Configured",
    badgeVariant: "green",
  },
  {
    label: "Environment targeting",
    desc: "Separate dev, staging and production",
    badge: "Enabled",
    badgeVariant: "green",
  },
  {
    label: "Change approval",
    desc: "Require review before production release",
    badge: "Required",
    badgeVariant: "orange",
  },
];

export default function FeatureManagementTab() {
  const [flags, setFlags] = useState(INITIAL_FLAGS);

  const toggleFlagStatus = (index) => {
    setFlags((prev) =>
      prev.map((item, idx) => {
        if (idx !== index) return item;
        if (item.status === "Enabled") {
          return { ...item, status: "Disabled", variant: "orange", rollout: "0%" };
        }
        if (item.status === "Disabled") {
          return { ...item, status: "Testing", variant: "cyan", rollout: "50%" };
        }
        return { ...item, status: "Enabled", variant: "green", rollout: "100%" };
      })
    );
  };

  const enabledCount = flags.filter((f) => f.status === "Enabled").length;
  const testingCount = flags.filter((f) => f.status === "Testing").length;
  const disabledCount = flags.filter((f) => f.status === "Disabled").length;

  const currentMetrics = [
    {
      title: "Total Features",
      value: "36",
      sub: "Configured features",
      subType: "green",
      iconColor: "purple",
    },
    {
      title: "Enabled",
      value: String(29 + (enabledCount - 2)),
      sub: "Available to users",
      subType: "green",
      iconColor: "green",
    },
    {
      title: "In Testing",
      value: String(4 + (testingCount - 2)),
      sub: "Limited rollout",
      subType: "green",
      iconColor: "cyan",
    },
    {
      title: "Disabled",
      value: String(3 + (disabledCount - 2)),
      sub: "Not currently active",
      subType: "green",
      iconColor: "orange",
    },
  ];

  const handleExport = () => {
    exportToCsv(
      "feature_flags",
      ["Feature", "Rollout", "Environment", "Status"],
      flags.map((f) => [f.feature, f.rollout, f.environment, f.status])
    );
  };

  return (
    <div className="superadmin-module-root">
      <AdminPageHeader
        title="Feature Management"
        subtitle="Control feature availability, rollout stages and feature flags across platform environments."
      />

      <AdminMetricCards cards={currentMetrics} />

      <div className="superadmin-layout-grid">
        {/* Left Column: Feature Flag Registry */}
        <SuperAdminTableCard
          title="Feature flag registry"
          subtitle="Review records, configuration and current operational status."
          columns={["FEATURE", "ROLLOUT", "ENVIRONMENT", "STATUS"]}
          onExport={handleExport}
          rows={flags.map((row, idx) => (
            <tr key={idx}>
              <td style={{ fontWeight: 600 }}>{row.feature}</td>
              <td style={{ color: "#334155" }}>{row.rollout}</td>
              <td style={{ color: "#64748b" }}>{row.environment}</td>
              <td>
                <SuperAdminBadge
                  status={row.status}
                  variant={row.variant}
                  onClick={() => toggleFlagStatus(idx)}
                  title="Click to cycle status (Enabled / Disabled / Testing)"
                />
              </td>
            </tr>
          ))}
        />

        {/* Right Column: Rollout Safeguards */}
        <div className="superadmin-side-col">
          <SuperAdminControlsCard
            title="Rollout safeguards"
            subtitle="Key controls and operational context"
            items={ROLLOUT_SAFEGUARDS}
          />
        </div>
      </div>
    </div>
  );
}
