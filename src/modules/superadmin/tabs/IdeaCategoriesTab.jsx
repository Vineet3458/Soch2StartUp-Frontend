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
    title: "Total Categories",
    value: "18",
    sub: "Configured categories",
    subType: "green",
    iconColor: "purple",
  },
  {
    title: "Active Categories",
    value: "15",
    sub: "Visible to founders",
    subType: "green",
    iconColor: "green",
  },
  {
    title: "Subcategories",
    value: "42",
    sub: "Detailed classification",
    subType: "green",
    iconColor: "cyan",
  },
  {
    title: "Pending Updates",
    value: "3",
    sub: "Awaiting publish",
    subType: "green",
    iconColor: "orange",
  },
];

const INITIAL_CATEGORIES = [
  {
    category: "Technology",
    ideas: 82,
    subcategories: "AI, SaaS, IoT",
    status: "Active",
    variant: "green",
  },
  {
    category: "Education",
    ideas: 65,
    subcategories: "EdTech, Learning",
    status: "Active",
    variant: "green",
  },
  {
    category: "Healthcare",
    ideas: 48,
    subcategories: "HealthTech, Wellness",
    status: "Active",
    variant: "green",
  },
  {
    category: "Agriculture",
    ideas: 35,
    subcategories: "AgriTech, Supply",
    status: "Active",
    variant: "green",
  },
  {
    category: "Commerce",
    ideas: 28,
    subcategories: "Retail, Marketplaces",
    status: "Active",
    variant: "green",
  },
  {
    category: "Sustainability",
    ideas: 19,
    subcategories: "Climate, Energy",
    status: "Review",
    variant: "orange",
  },
];

const CATEGORY_GOVERNANCE = [
  {
    label: "Founder visibility",
    desc: "Control categories shown in idea forms",
    badge: "Enabled",
    badgeVariant: "green",
  },
  {
    label: "Duplicate detection",
    desc: "Review overlapping categories",
    badge: "3 flagged",
    badgeVariant: "orange",
  },
  {
    label: "Taxonomy updates",
    desc: "Publish approved category changes",
    badge: "Controlled",
    badgeVariant: "cyan",
  },
];

export default function IdeaCategoriesTab() {
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);

  const toggleCategoryStatus = (index) => {
    setCategories((prev) =>
      prev.map((cat, idx) => {
        if (idx !== index) return cat;
        const nextActive = cat.status !== "Active";
        return {
          ...cat,
          status: nextActive ? "Active" : "Review",
          variant: nextActive ? "green" : "orange",
        };
      })
    );
  };

  const handleExport = () => {
    exportToCsv(
      "idea_categories",
      ["Category", "Ideas", "Subcategories", "Status"],
      categories.map((c) => [c.category, c.ideas, c.subcategories, c.status])
    );
  };

  return (
    <div className="superadmin-module-root">
      <AdminPageHeader
        title="Idea Categories"
        subtitle="Maintain the taxonomy used to classify startup submissions and power discovery."
      />

      <AdminMetricCards cards={METRICS} />

      <div className="superadmin-layout-grid">
        {/* Left Column: Category Directory */}
        <SuperAdminTableCard
          title="Category directory"
          subtitle="Review records, configuration and current operational status."
          columns={["CATEGORY", "IDEAS", "SUBCATEGORIES", "STATUS"]}
          onExport={handleExport}
          rows={categories.map((row, idx) => (
            <tr key={idx}>
              <td style={{ fontWeight: 600 }}>{row.category}</td>
              <td style={{ color: "#334155" }}>{row.ideas}</td>
              <td style={{ color: "#64748b" }}>{row.subcategories}</td>
              <td>
                <SuperAdminBadge
                  status={row.status}
                  variant={row.variant}
                  onClick={() => toggleCategoryStatus(idx)}
                  title="Click to toggle category status (Active / Review)"
                />
              </td>
            </tr>
          ))}
        />

        {/* Right Column: Category Governance */}
        <div className="superadmin-side-col">
          <SuperAdminControlsCard
            title="Category governance"
            subtitle="Key controls and operational context"
            items={CATEGORY_GOVERNANCE}
          />
        </div>
      </div>
    </div>
  );
}
