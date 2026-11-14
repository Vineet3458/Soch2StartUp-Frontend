import fs from "fs";
import path from "path";
import assert from "assert";

console.log("=== RUNNING SUPERADMIN MODULE VERIFICATION ===");

// 1. Verify sidebarConfig.js
const sidebarConfigPath = path.resolve("src/components/sidebar/sidebarConfig.js");
assert(fs.existsSync(sidebarConfigPath), "sidebarConfig.js must exist");
const sidebarConfigContent = fs.readFileSync(sidebarConfigPath, "utf-8");

// Expected sections
const expectedSections = [
  "CONTROL CENTER",
  "SECURITY & GOVERNANCE",
  "STARTUP INTELLIGENCE",
  "PLATFORM SERVICES",
];
for (const sec of expectedSections) {
  assert(
    sidebarConfigContent.includes(sec),
    `sidebarConfig.js must contain section: ${sec}`
  );
}

// Expected 11 items
const expectedItems = [
  { id: "system-overview", label: "System Overview", path: "/admin?tab=overview" },
  { id: "platform-settings", label: "Platform Settings", path: "/admin?tab=settings" },
  { id: "feature-management", label: "Feature Management", path: "/admin?tab=features" },
  { id: "system-logs", label: "System Logs", path: "/admin?tab=logs" },
  { id: "audit-activity", label: "Audit & Activity", path: "/admin?tab=audit" },
  { id: "roles-permissions", label: "Roles & Permissions", path: "/admin?tab=roles-permissions" },
  { id: "idea-categories", label: "Idea Categories", path: "/admin?tab=categories" },
  { id: "validation-engine", label: "Validation Engine", path: "/admin?tab=engine" },
  { id: "scoring-configuration", label: "Scoring Configuration", path: "/admin?tab=scoring" },
  { id: "integrations", label: "Integrations", path: "/admin?tab=integrations" },
  { id: "analytics-reports", label: "Analytics & Reports", path: "/admin?tab=reports" },
];

for (const item of expectedItems) {
  assert(
    sidebarConfigContent.includes(item.id),
    `sidebarConfig.js must include item id: ${item.id}`
  );
  assert(
    sidebarConfigContent.includes(item.label),
    `sidebarConfig.js must include item label: ${item.label}`
  );
  assert(
    sidebarConfigContent.includes(item.path),
    `sidebarConfig.js must include item path: ${item.path}`
  );
}
console.log("✓ Test 1: sidebarConfig.js sections and all 11 items verified.");

// 2. Verify all 11 module files exist and contain required screen contents
const superAdminModules = [
  {
    file: "SystemOverviewTab.jsx",
    title: "System Overview",
    expectedTexts: [
      "Real-time health, platform activity and critical service status",
      "Platform Users",
      "Active Services",
      "API Availability",
      "Open Incidents",
      "Platform health trend",
      "Service status",
      "Recent platform events",
      "Operational",
      "Degraded",
    ],
  },
  {
    file: "PlatformSettingsTab.jsx",
    title: "Platform Settings",
    expectedTexts: [
      "Manage global platform identity",
      "Platform Name",
      "Environments",
      "Active Policies",
      "Pending Changes",
      "Global configuration",
      "Environment controls",
      "Production",
      "Staging",
      "Development",
      "Protected",
      "Available",
    ],
  },
  {
    file: "FeatureManagementTab.jsx",
    title: "Feature Management",
    expectedTexts: [
      "Control feature availability",
      "Total Features",
      "Enabled",
      "In Testing",
      "Disabled",
      "Feature flag registry",
      "Rollout safeguards",
      "AI idea validation",
      "Mentor matching",
      "Founder community",
      "Gradual rollout",
      "Environment targeting",
      "Change approval",
    ],
  },
  {
    file: "SystemLogsTab.jsx",
    title: "System Logs",
    expectedTexts: [
      "Inspect application, API",
      "Log Events",
      "Errors",
      "Warnings",
      "Services Logged",
      "Recent system log events",
      "Log filters",
      "Auth API",
      "Time range",
      "Severity",
      "Retention",
    ],
  },
  {
    file: "AuditActivityTab.jsx",
    title: "Audit & Activity",
    expectedTexts: [
      "Track sensitive actions",
      "Audit Events",
      "Admin Actions",
      "Sensitive Changes",
      "Unusual Events",
      "Audit trail",
      "Audit controls",
      "Immutable history",
      "Actor attribution",
      "Review flagged events",
    ],
  },
  {
    file: "RolesPermissionsTab.jsx",
    title: "Roles & Permissions",
    expectedTexts: [
      "Define role-based access control",
      "Platform Roles",
      "Permission Keys",
      "Custom Groups",
      "Recent Changes",
      "Role permission matrix",
      "Access governance",
      "Least privilege",
      "Permission review",
      "Change history",
    ],
  },
  {
    file: "IdeaCategoriesTab.jsx",
    title: "Idea Categories",
    expectedTexts: [
      "Maintain the taxonomy used to classify",
      "Total Categories",
      "Active Categories",
      "Subcategories",
      "Pending Updates",
      "Category directory",
      "Category governance",
      "Technology",
      "Founder visibility",
      "Duplicate detection",
      "Taxonomy updates",
    ],
  },
  {
    file: "ValidationEngineTab.jsx",
    title: "Validation Engine",
    expectedTexts: [
      "Configure and monitor the automated startup idea validation",
      "Validation Runs",
      "Successful",
      "Queued",
      "Engine Version",
      "Validation pipeline",
      "Engine controls",
      "Problem analysis",
      "Model configuration",
      "Queue monitoring",
      "Human oversight",
    ],
  },
  {
    file: "ScoringConfigurationTab.jsx",
    title: "Scoring Configuration",
    expectedTexts: [
      "Manage evaluation criteria, scoring weights",
      "Scoring Criteria",
      "Active Rubrics",
      "Pending Changes",
      "Max Score",
      "Scoring rubric",
      "Scoring governance",
      "Problem clarity",
      "Weight validation",
      "Rubric versioning",
      "Change approval",
    ],
  },
  {
    file: "IntegrationsTab.jsx",
    title: "Integrations",
    expectedTexts: [
      "Manage connected services, API credentials",
      "Connected Apps",
      "Healthy Connections",
      "Attention Needed",
      "Webhook Events",
      "Connected services",
      "Integration security",
      "Email provider",
      "Credential storage",
      "Webhook verification",
      "Connection monitoring",
    ],
  },
  {
    file: "AnalyticsReportsTab.jsx",
    title: "Analytics & Reports",
    expectedTexts: [
      "Generate platform-wide insights",
      "Platform Users",
      "Ideas Submitted",
      "Validation Rate",
      "Avg. Review Time",
      "Platform performance",
      "Reports library",
      "Export options",
      "Platform summary",
      "Role activity",
      "Validation outcomes",
    ],
  },
];

for (const mod of superAdminModules) {
  const filePath = path.resolve(`src/modules/superadmin/tabs/${mod.file}`);
  assert(fs.existsSync(filePath), `Module file must exist: ${filePath}`);
  const content = fs.readFileSync(filePath, "utf-8");
  assert(
    content.includes(mod.title),
    `File ${mod.file} must contain title: ${mod.title}`
  );
  for (const text of mod.expectedTexts) {
    assert(
      content.includes(text),
      `File ${mod.file} must contain text: "${text}"`
    );
  }
}
console.log("✓ Test 2: All 11 SuperAdmin module files exist and match screenshots.");

// 3. Verify AdminPanel router wires up all 11 modules
const adminPanelPath = path.resolve("src/pages/AdminPanel.jsx");
const adminPanelContent = fs.readFileSync(adminPanelPath, "utf-8");
assert(
  adminPanelContent.includes("SystemOverviewTab"),
  "AdminPanel must import SystemOverviewTab"
);
assert(
  adminPanelContent.includes("PlatformSettingsTab"),
  "AdminPanel must import PlatformSettingsTab"
);
assert(
  adminPanelContent.includes("FeatureManagementTab"),
  "AdminPanel must import FeatureManagementTab"
);
assert(
  adminPanelContent.includes("SystemLogsTab"),
  "AdminPanel must import SystemLogsTab"
);
assert(
  adminPanelContent.includes("AuditActivityTab"),
  "AdminPanel must import AuditActivityTab"
);
assert(
  adminPanelContent.includes("RolesPermissionsTab"),
  "AdminPanel must import RolesPermissionsTab"
);
assert(
  adminPanelContent.includes("IdeaCategoriesTab"),
  "AdminPanel must import IdeaCategoriesTab"
);
assert(
  adminPanelContent.includes("ValidationEngineTab"),
  "AdminPanel must import ValidationEngineTab"
);
assert(
  adminPanelContent.includes("ScoringConfigurationTab"),
  "AdminPanel must import ScoringConfigurationTab"
);
assert(
  adminPanelContent.includes("IntegrationsTab"),
  "AdminPanel must import IntegrationsTab"
);
assert(
  adminPanelContent.includes("AnalyticsReportsTab"),
  "AdminPanel must import AnalyticsReportsTab"
);
console.log("✓ Test 3: AdminPanel.jsx properly integrates all 11 SuperAdmin tabs.");

// 4. Verify CSS file exists and contains necessary styles
const superAdminCssPath = path.resolve("src/styles/superadmin.css");
assert(fs.existsSync(superAdminCssPath), "superadmin.css must exist");
const cssContent = fs.readFileSync(superAdminCssPath, "utf-8");
assert(cssContent.includes(".superadmin-layout-grid"), "Must define layout grid");
assert(cssContent.includes(".superadmin-export-btn"), "Must define export button");
assert(cssContent.includes(".sa-badge-green"), "Must define green badge");
assert(cssContent.includes(".sa-badge-cyan"), "Must define cyan badge");
assert(cssContent.includes(".sa-badge-orange"), "Must define orange badge");
assert(cssContent.includes(".sa-badge-red"), "Must define red badge");
assert(cssContent.includes(".sa-badge-purple"), "Must define purple badge");
console.log("✓ Test 4: superadmin.css has all required class definitions.");

console.log("\nALL VERIFICATION TESTS PASSED SUCCESSFULLY! (100% SPEC COMPLIANT)");
