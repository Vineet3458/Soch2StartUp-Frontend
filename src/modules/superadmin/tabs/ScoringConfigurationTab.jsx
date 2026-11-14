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
    title: "Scoring Criteria",
    value: "8",
    sub: "Configured dimensions",
    subType: "green",
    iconColor: "purple",
  },
  {
    title: "Active Rubrics",
    value: "3",
    sub: "Published versions",
    subType: "green",
    iconColor: "green",
  },
  {
    title: "Pending Changes",
    value: "2",
    sub: "Need approval",
    subType: "green",
    iconColor: "orange",
  },
  {
    title: "Max Score",
    value: "100",
    sub: "Normalized scale",
    subType: "green",
    iconColor: "cyan",
  },
];

const INITIAL_RUBRIC = [
  {
    criterion: "Problem clarity",
    weight: "15%",
    maxScore: 15,
    status: "Active",
    variant: "green",
  },
  {
    criterion: "Market opportunity",
    weight: "20%",
    maxScore: 20,
    status: "Active",
    variant: "green",
  },
  {
    criterion: "Solution feasibility",
    weight: "15%",
    maxScore: 15,
    status: "Active",
    variant: "green",
  },
  {
    criterion: "Innovation",
    weight: "15%",
    maxScore: 15,
    status: "Active",
    variant: "green",
  },
  {
    criterion: "Business model",
    weight: "15%",
    maxScore: 15,
    status: "Active",
    variant: "green",
  },
  {
    criterion: "Execution readiness",
    weight: "20%",
    maxScore: 20,
    status: "Active",
    variant: "green",
  },
];

const SCORING_GOVERNANCE = [
  {
    label: "Weight validation",
    desc: "Weights must total 100%",
    badge: "Validated",
    badgeVariant: "green",
  },
  {
    label: "Rubric versioning",
    desc: "Retain previous scoring versions",
    badge: "Enabled",
    badgeVariant: "green",
  },
  {
    label: "Change approval",
    desc: "Approve rubric before activation",
    badge: "Required",
    badgeVariant: "orange",
  },
];

export default function ScoringConfigurationTab() {
  const [rubric, setRubric] = useState(INITIAL_RUBRIC);

  const toggleRubricStatus = (index) => {
    setRubric((prev) =>
      prev.map((item, idx) => {
        if (idx !== index) return item;
        const isActive = item.status === "Active";
        return {
          ...item,
          status: isActive ? "Review" : "Active",
          variant: isActive ? "orange" : "green",
        };
      })
    );
  };

  const handleExport = () => {
    exportToCsv(
      "scoring_rubric",
      ["Criterion", "Weight", "Max Score", "Status"],
      rubric.map((r) => [r.criterion, r.weight, r.maxScore, r.status])
    );
  };

  return (
    <div className="superadmin-module-root">
      <AdminPageHeader
        title="Scoring Configuration"
        subtitle="Manage evaluation criteria, scoring weights, score bands and rubric versions."
      />

      <AdminMetricCards cards={METRICS} />

      <div className="superadmin-layout-grid">
        {/* Left Column: Scoring Rubric Table */}
        <SuperAdminTableCard
          title="Scoring rubric"
          subtitle="Review records, configuration and current operational status."
          columns={["CRITERION", "WEIGHT", "MAX SCORE", "STATUS"]}
          onExport={handleExport}
          rows={rubric.map((row, idx) => (
            <tr key={idx}>
              <td style={{ fontWeight: 600 }}>{row.criterion}</td>
              <td style={{ color: "#334155" }}>{row.weight}</td>
              <td style={{ color: "#64748b" }}>{row.maxScore}</td>
              <td>
                <SuperAdminBadge
                  status={row.status}
                  variant={row.variant}
                  onClick={() => toggleRubricStatus(idx)}
                  title="Click to toggle criterion status"
                />
              </td>
            </tr>
          ))}
        />

        {/* Right Column: Scoring Governance */}
        <div className="superadmin-side-col">
          <SuperAdminControlsCard
            title="Scoring governance"
            subtitle="Key controls and operational context"
            items={SCORING_GOVERNANCE}
          />
        </div>
      </div>
    </div>
  );
}
