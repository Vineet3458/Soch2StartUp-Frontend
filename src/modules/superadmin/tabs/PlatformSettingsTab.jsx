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
    title: "Platform Name",
    value: "Soch2Startup",
    sub: "Brand configuration",
    subType: "green",
    iconColor: "purple",
  },
  {
    title: "Environments",
    value: "3",
    sub: "Dev • Staging • Prod",
    subType: "green",
    iconColor: "cyan",
  },
  {
    title: "Active Policies",
    value: "14",
    sub: "Global policies",
    subType: "green",
    iconColor: "green",
  },
  {
    title: "Pending Changes",
    value: "2",
    sub: "Awaiting publish",
    subType: "green",
    iconColor: "orange",
  },
];

const INITIAL_SETTINGS = [
  {
    setting: "Platform name",
    currentValue: "Soch2Startup",
    scope: "Global",
    status: "Active",
    variant: "green",
  },
  {
    setting: "Default timezone",
    currentValue: "Asia/Kolkata",
    scope: "Global",
    status: "Active",
    variant: "green",
  },
  {
    setting: "Default language",
    currentValue: "English",
    scope: "Global",
    status: "Active",
    variant: "green",
  },
  {
    setting: "Session timeout",
    currentValue: "30 minutes",
    scope: "Security",
    status: "Active",
    variant: "green",
  },
  {
    setting: "Maintenance mode",
    currentValue: "Disabled",
    scope: "Production",
    status: "Off",
    variant: "cyan",
  },
  {
    setting: "Email notifications",
    currentValue: "Enabled",
    scope: "Global",
    status: "Active",
    variant: "green",
  },
];

const ENVIRONMENT_CONTROLS = [
  {
    label: "Production",
    desc: "Live user-facing environment",
    badge: "Protected",
    badgeVariant: "green",
  },
  {
    label: "Staging",
    desc: "Pre-release verification",
    badge: "Available",
    badgeVariant: "cyan",
  },
  {
    label: "Development",
    desc: "Internal testing environment",
    badge: "Available",
    badgeVariant: "cyan",
  },
];

export default function PlatformSettingsTab() {
  const [settings, setSettings] = useState(INITIAL_SETTINGS);

  const toggleSetting = (index) => {
    setSettings((prev) =>
      prev.map((s, idx) => {
        if (idx !== index) return s;
        if (s.setting === "Maintenance mode") {
          const isOff = s.status === "Off";
          return {
            ...s,
            currentValue: isOff ? "Enabled" : "Disabled",
            status: isOff ? "Active" : "Off",
            variant: isOff ? "green" : "cyan",
          };
        }
        if (s.setting === "Email notifications") {
          const isActive = s.status === "Active";
          return {
            ...s,
            currentValue: isActive ? "Disabled" : "Enabled",
            status: isActive ? "Off" : "Active",
            variant: isActive ? "cyan" : "green",
          };
        }
        return s;
      })
    );
  };

  const handleExport = () => {
    exportToCsv(
      "platform_settings",
      ["Setting", "Current Value", "Scope", "Status"],
      settings.map((s) => [s.setting, s.currentValue, s.scope, s.status])
    );
  };

  return (
    <div className="superadmin-module-root">
      <AdminPageHeader
        title="Platform Settings"
        subtitle="Manage global platform identity, defaults, security policies and environment preferences."
      />

      <AdminMetricCards cards={METRICS} />

      <div className="superadmin-layout-grid">
        {/* Left Column: Global Configuration Table */}
        <SuperAdminTableCard
          title="Global configuration"
          subtitle="Review records, configuration and current operational status."
          columns={["SETTING", "CURRENT VALUE", "SCOPE", "STATUS"]}
          onExport={handleExport}
          rows={settings.map((row, idx) => {
            const isToggleable =
              row.setting === "Maintenance mode" ||
              row.setting === "Email notifications";
            return (
              <tr key={idx}>
                <td style={{ fontWeight: 600 }}>{row.setting}</td>
                <td style={{ color: "#334155" }}>{row.currentValue}</td>
                <td style={{ color: "#64748b" }}>{row.scope}</td>
                <td>
                  <SuperAdminBadge
                    status={row.status}
                    variant={row.variant}
                    onClick={isToggleable ? () => toggleSetting(idx) : undefined}
                    title={isToggleable ? "Click to toggle setting" : undefined}
                  />
                </td>
              </tr>
            );
          })}
        />

        {/* Right Column: Environment Controls */}
        <div className="superadmin-side-col">
          <SuperAdminControlsCard
            title="Environment controls"
            subtitle="Key controls and operational context"
            items={ENVIRONMENT_CONTROLS}
          />
        </div>
      </div>
    </div>
  );
}
