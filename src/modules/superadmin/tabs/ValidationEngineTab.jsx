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
    title: "Validation Runs",
    value: "1,842",
    sub: "Last 30 days",
    subType: "green",
    iconColor: "purple",
  },
  {
    title: "Successful",
    value: "1,716",
    sub: "93.2% completion",
    subType: "green",
    iconColor: "green",
  },
  {
    title: "Queued",
    value: "38",
    sub: "Awaiting processing",
    subType: "green",
    iconColor: "orange",
  },
  {
    title: "Engine Version",
    value: "v2.4",
    sub: "Current release",
    subType: "green",
    iconColor: "cyan",
  },
];

const INITIAL_PIPELINE = [
  {
    stage: "Problem analysis",
    purpose: "Assess problem clarity",
    processing: "Automated",
    status: "Active",
    variant: "green",
  },
  {
    stage: "Market assessment",
    purpose: "Estimate market context",
    processing: "Automated",
    status: "Active",
    variant: "green",
  },
  {
    stage: "Competitor analysis",
    purpose: "Identify alternatives",
    processing: "Automated",
    status: "Active",
    variant: "green",
  },
  {
    stage: "Business model review",
    purpose: "Assess revenue logic",
    processing: "Hybrid",
    status: "Active",
    variant: "green",
  },
  {
    stage: "Risk assessment",
    purpose: "Highlight key risks",
    processing: "Automated",
    status: "Monitoring",
    variant: "orange",
  },
  {
    stage: "Report generation",
    purpose: "Compile validation output",
    processing: "Automated",
    status: "Active",
    variant: "green",
  },
];

const ENGINE_CONTROLS = [
  {
    label: "Model configuration",
    desc: "Select approved model and prompts",
    badge: "Managed",
    badgeVariant: "purple",
  },
  {
    label: "Queue monitoring",
    desc: "Track latency and failures",
    badge: "Live",
    badgeVariant: "green",
  },
  {
    label: "Human oversight",
    desc: "Review flagged validation outputs",
    badge: "Enabled",
    badgeVariant: "cyan",
  },
];

export default function ValidationEngineTab() {
  const [pipeline, setPipeline] = useState(INITIAL_PIPELINE);

  const toggleStageStatus = (index) => {
    setPipeline((prev) =>
      prev.map((item, idx) => {
        if (idx !== index) return item;
        const nextActive = item.status !== "Active";
        return {
          ...item,
          status: nextActive ? "Active" : "Monitoring",
          variant: nextActive ? "green" : "orange",
        };
      })
    );
  };

  const handleExport = () => {
    exportToCsv(
      "validation_pipeline",
      ["Stage", "Purpose", "Processing", "Status"],
      pipeline.map((p) => [p.stage, p.purpose, p.processing, p.status])
    );
  };

  return (
    <div className="superadmin-module-root">
      <AdminPageHeader
        title="Validation Engine"
        subtitle="Configure and monitor the automated startup idea validation workflow."
      />

      <AdminMetricCards cards={METRICS} />

      <div className="superadmin-layout-grid">
        {/* Left Column: Validation Pipeline */}
        <SuperAdminTableCard
          title="Validation pipeline"
          subtitle="Review records, configuration and current operational status."
          columns={["STAGE", "PURPOSE", "PROCESSING", "STATUS"]}
          onExport={handleExport}
          rows={pipeline.map((row, idx) => (
            <tr key={idx}>
              <td style={{ fontWeight: 600 }}>{row.stage}</td>
              <td style={{ color: "#334155" }}>{row.purpose}</td>
              <td style={{ color: "#64748b" }}>{row.processing}</td>
              <td>
                <SuperAdminBadge
                  status={row.status}
                  variant={row.variant}
                  onClick={() => toggleStageStatus(idx)}
                  title="Click to toggle stage status (Active / Monitoring)"
                />
              </td>
            </tr>
          ))}
        />

        {/* Right Column: Engine Controls */}
        <div className="superadmin-side-col">
          <SuperAdminControlsCard
            title="Engine controls"
            subtitle="Key controls and operational context"
            items={ENGINE_CONTROLS}
          />
        </div>
      </div>
    </div>
  );
}
