import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

// Support running from repo root or soch2startup-frontend root
const baseDir = fs.existsSync("src") ? "." : "soch2startup-frontend";

test("Verify all 11 SuperAdmin module files exist", () => {
  const tabs = [
    "SystemOverviewTab.jsx",
    "PlatformSettingsTab.jsx",
    "FeatureManagementTab.jsx",
    "SystemLogsTab.jsx",
    "AuditActivityTab.jsx",
    "RolesPermissionsTab.jsx",
    "IdeaCategoriesTab.jsx",
    "ValidationEngineTab.jsx",
    "ScoringConfigurationTab.jsx",
    "IntegrationsTab.jsx",
    "AnalyticsReportsTab.jsx",
  ];

  for (const tab of tabs) {
    const full = path.join(baseDir, "src/modules/superadmin/tabs", tab);
    assert.equal(fs.existsSync(full), true, `Superadmin tab file ${tab} must exist`);
  }
});

test("Verify SuperAdminSharedComponents.jsx exports all required UI utilities", () => {
  const compPath = path.join(baseDir, "src/modules/superadmin/SuperAdminSharedComponents.jsx");
  assert.equal(fs.existsSync(compPath), true, "SuperAdminSharedComponents.jsx must exist");
  const code = fs.readFileSync(compPath, "utf-8");

  assert.equal(code.includes("export function SuperAdminBadge"), true);
  assert.equal(code.includes("export function SuperAdminControlsCard"), true);
  assert.equal(code.includes("export function SuperAdminTableCard"), true);
  assert.equal(code.includes("export function exportToCsv"), true);
});

test("Verify AdminPanel.jsx handles all 11 SuperAdmin tabs", () => {
  const adminPanelPath = path.join(baseDir, "src/pages/AdminPanel.jsx");
  const code = fs.readFileSync(adminPanelPath, "utf-8");

  const requiredTabs = [
    "overview",
    "settings",
    "features",
    "logs",
    "audit",
    "roles-permissions",
    "categories",
    "engine",
    "scoring",
    "integrations",
    "analytics-reports",
  ];

  for (const tab of requiredTabs) {
    assert.equal(
      code.includes(`case "${tab}":`),
      true,
      `AdminPanel must handle case "${tab}":`
    );
  }
});

test("Verify sidebarConfig.js contains paths for all 11 SuperAdmin modules across 4 sections", () => {
  const configPath = path.join(baseDir, "src/components/sidebar/sidebarConfig.js");
  const code = fs.readFileSync(configPath, "utf-8");

  const sections = [
    "CONTROL CENTER",
    "SECURITY & GOVERNANCE",
    "STARTUP INTELLIGENCE",
    "PLATFORM SERVICES",
  ];

  for (const s of sections) {
    assert.equal(code.includes(s), true, `Must have section: ${s}`);
  }

  const items = [
    "/admin?tab=overview",
    "/admin?tab=settings",
    "/admin?tab=features",
    "/admin?tab=logs",
    "/admin?tab=audit",
    "/admin?tab=roles-permissions",
    "/admin?tab=categories",
    "/admin?tab=engine",
    "/admin?tab=scoring",
    "/admin?tab=integrations",
    "/admin?tab=reports",
  ];

  for (const item of items) {
    assert.equal(code.includes(item), true, `sidebarConfig must contain path ${item}`);
  }
});

test("Verify Screenshot 01: SystemOverviewTab UI elements", () => {
  const tabPath = path.join(baseDir, "src/modules/superadmin/tabs/SystemOverviewTab.jsx");
  const code = fs.readFileSync(tabPath, "utf-8");

  assert.equal(code.includes("System Overview"), true);
  assert.equal(code.includes("Platform Users"), true);
  assert.equal(code.includes("Active Services"), true);
  assert.equal(code.includes("API Availability"), true);
  assert.equal(code.includes("Open Incidents"), true);
  assert.equal(code.includes("Platform health trend"), true);
  assert.equal(code.includes("Service status"), true);
  assert.equal(code.includes("Recent platform events"), true);
});

test("Verify Screenshot 02: PlatformSettingsTab UI elements", () => {
  const tabPath = path.join(baseDir, "src/modules/superadmin/tabs/PlatformSettingsTab.jsx");
  const code = fs.readFileSync(tabPath, "utf-8");

  assert.equal(code.includes("Platform Settings"), true);
  assert.equal(code.includes("Global configuration"), true);
  assert.equal(code.includes("Environment controls"), true);
  assert.equal(code.includes("Production"), true);
  assert.equal(code.includes("Staging"), true);
  assert.equal(code.includes("Development"), true);
});

test("Verify Screenshot 03: FeatureManagementTab UI elements", () => {
  const tabPath = path.join(baseDir, "src/modules/superadmin/tabs/FeatureManagementTab.jsx");
  const code = fs.readFileSync(tabPath, "utf-8");

  assert.equal(code.includes("Feature Management"), true);
  assert.equal(code.includes("Feature flag registry"), true);
  assert.equal(code.includes("Rollout safeguards"), true);
  assert.equal(code.includes("AI idea validation"), true);
  assert.equal(code.includes("Mentor matching"), true);
});

test("Verify Screenshot 04: SystemLogsTab UI elements", () => {
  const tabPath = path.join(baseDir, "src/modules/superadmin/tabs/SystemLogsTab.jsx");
  const code = fs.readFileSync(tabPath, "utf-8");

  assert.equal(code.includes("System Logs"), true);
  assert.equal(code.includes("Recent system log events"), true);
  assert.equal(code.includes("Log filters"), true);
  assert.equal(code.includes("Auth API"), true);
  assert.equal(code.includes("Time range"), true);
  assert.equal(code.includes("Retention"), true);
});

test("Verify Screenshot 05: AuditActivityTab UI elements", () => {
  const tabPath = path.join(baseDir, "src/modules/superadmin/tabs/AuditActivityTab.jsx");
  const code = fs.readFileSync(tabPath, "utf-8");

  assert.equal(code.includes("Audit & Activity"), true);
  assert.equal(code.includes("Audit trail"), true);
  assert.equal(code.includes("Audit controls"), true);
  assert.equal(code.includes("Immutable history"), true);
  assert.equal(code.includes("Actor attribution"), true);
});

test("Verify Screenshot 06: RolesPermissionsTab UI elements", () => {
  const tabPath = path.join(baseDir, "src/modules/superadmin/tabs/RolesPermissionsTab.jsx");
  const code = fs.readFileSync(tabPath, "utf-8");

  assert.equal(code.includes("Roles & Permissions"), true);
  assert.equal(code.includes("Role permission matrix"), true);
  assert.equal(code.includes("Access governance"), true);
  assert.equal(code.includes("Manage platform settings"), true);
  assert.equal(code.includes("Least privilege"), true);
});

test("Verify Screenshot 07: IdeaCategoriesTab UI elements", () => {
  const tabPath = path.join(baseDir, "src/modules/superadmin/tabs/IdeaCategoriesTab.jsx");
  const code = fs.readFileSync(tabPath, "utf-8");

  assert.equal(code.includes("Idea Categories"), true);
  assert.equal(code.includes("Category directory"), true);
  assert.equal(code.includes("Category governance"), true);
  assert.equal(code.includes("Technology"), true);
  assert.equal(code.includes("Founder visibility"), true);
});

test("Verify Screenshot 08: ValidationEngineTab UI elements", () => {
  const tabPath = path.join(baseDir, "src/modules/superadmin/tabs/ValidationEngineTab.jsx");
  const code = fs.readFileSync(tabPath, "utf-8");

  assert.equal(code.includes("Validation Engine"), true);
  assert.equal(code.includes("Validation pipeline"), true);
  assert.equal(code.includes("Engine controls"), true);
  assert.equal(code.includes("Problem analysis"), true);
  assert.equal(code.includes("Model configuration"), true);
});

test("Verify Screenshot 09: ScoringConfigurationTab UI elements", () => {
  const tabPath = path.join(baseDir, "src/modules/superadmin/tabs/ScoringConfigurationTab.jsx");
  const code = fs.readFileSync(tabPath, "utf-8");

  assert.equal(code.includes("Scoring Configuration"), true);
  assert.equal(code.includes("Scoring rubric"), true);
  assert.equal(code.includes("Scoring governance"), true);
  assert.equal(code.includes("Problem clarity"), true);
  assert.equal(code.includes("Weight validation"), true);
});

test("Verify Screenshot 10: IntegrationsTab UI elements", () => {
  const tabPath = path.join(baseDir, "src/modules/superadmin/tabs/IntegrationsTab.jsx");
  const code = fs.readFileSync(tabPath, "utf-8");

  assert.equal(code.includes("Integrations"), true);
  assert.equal(code.includes("Connected services"), true);
  assert.equal(code.includes("Integration security"), true);
  assert.equal(code.includes("Email provider"), true);
  assert.equal(code.includes("Credential storage"), true);
});

test("Verify Screenshot 11: AnalyticsReportsTab UI elements", () => {
  const tabPath = path.join(baseDir, "src/modules/superadmin/tabs/AnalyticsReportsTab.jsx");
  const code = fs.readFileSync(tabPath, "utf-8");

  assert.equal(code.includes("Analytics & Reports"), true);
  assert.equal(code.includes("Platform performance"), true);
  assert.equal(code.includes("Reports library"), true);
  assert.equal(code.includes("Export options"), true);
  assert.equal(code.includes("Platform overview"), true);
  // Verify non-blocking export behavior (no window.alert)
  assert.equal(code.includes("alert("), false, "AnalyticsReportsTab should not use blocking alert()");
  assert.equal(code.includes("showToast"), true, "Must provide toast feedback on export");
});

test("Verify SidebarItem.jsx handles superadmin aliases and active context", () => {
  const sidebarItemPath = path.join(baseDir, "src/components/sidebar/SidebarItem.jsx");
  const code = fs.readFileSync(sidebarItemPath, "utf-8");

  assert.equal(code.includes("tabsMatch"), true, "SidebarItem must have tabsMatch alias handler");
  assert.equal(code.includes("isSuperAdminContext"), true, "SidebarItem must check superadmin context");
  assert.equal(code.includes("analytics-reports"), true, "SidebarItem must recognize reports aliases");
});

test("Verify Sidebar.jsx preserves /superadmin and role=superadmin context", () => {
  const sidebarPath = path.join(baseDir, "src/components/sidebar/Sidebar.jsx");
  const code = fs.readFileSync(sidebarPath, "utf-8");

  assert.equal(code.includes("location.pathname.startsWith(\"/superadmin\")"), true);
  assert.equal(code.includes("target.replace(/^\\/admin/, \"/superadmin\")"), true);
  assert.equal(code.includes("effectiveRole === \"superadmin\""), true);
});

test("Verify DashboardTopbar.jsx contains all 11 SuperAdmin quick links", () => {
  const topbarPath = path.join(baseDir, "src/components/dashboard/DashboardTopbar.jsx");
  const code = fs.readFileSync(topbarPath, "utf-8");

  const requiredModules = [
    "System Overview",
    "Platform Settings",
    "Feature Management",
    "System Logs",
    "Audit & Activity",
    "Roles & Permissions",
    "Idea Categories",
    "Validation Engine",
    "Scoring Configuration",
    "Integrations",
    "Analytics & Reports",
  ];

  for (const m of requiredModules) {
    assert.equal(code.includes(m), true, `DashboardTopbar must contain quick link for ${m}`);
  }
});

test("Verify superadmin.css includes responsive grid blowout protection and pill badge consistency", () => {
  const cssPath = path.join(baseDir, "src/styles/superadmin.css");
  const code = fs.readFileSync(cssPath, "utf-8");

  assert.equal(code.includes(".superadmin-layout-grid > *"), true, "Grid children must be constrained");
  assert.equal(code.includes("min-width: 0"), true, "Must have min-width: 0 protection");
  assert.equal(code.includes("min-width: 86px"), true, "Badge must have consistent min-width");
  assert.equal(code.includes("sa-badge-interactive"), true, "Must support interactive badge state");
});

test("Verify interactive capabilities across SuperAdmin modules", () => {
  const fmPath = path.join(baseDir, "src/modules/superadmin/tabs/FeatureManagementTab.jsx");
  const fmCode = fs.readFileSync(fmPath, "utf-8");
  assert.equal(fmCode.includes("toggleFlagStatus"), true, "Feature flags must be toggleable");

  const psPath = path.join(baseDir, "src/modules/superadmin/tabs/PlatformSettingsTab.jsx");
  const psCode = fs.readFileSync(psPath, "utf-8");
  assert.equal(psCode.includes("toggleSetting"), true, "Platform settings must be toggleable");

  const rpPath = path.join(baseDir, "src/modules/superadmin/tabs/RolesPermissionsTab.jsx");
  const rpCode = fs.readFileSync(rpPath, "utf-8");
  assert.equal(rpCode.includes("cycleRolePermission"), true, "Role permissions must be cycleable");

  const icPath = path.join(baseDir, "src/modules/superadmin/tabs/IdeaCategoriesTab.jsx");
  const icCode = fs.readFileSync(icPath, "utf-8");
  assert.equal(icCode.includes("toggleCategoryStatus"), true, "Categories must be toggleable");

  const vePath = path.join(baseDir, "src/modules/superadmin/tabs/ValidationEngineTab.jsx");
  const veCode = fs.readFileSync(vePath, "utf-8");
  assert.equal(veCode.includes("toggleStageStatus"), true, "Pipeline stages must be toggleable");

  const intPath = path.join(baseDir, "src/modules/superadmin/tabs/IntegrationsTab.jsx");
  const intCode = fs.readFileSync(intPath, "utf-8");
  assert.equal(intCode.includes("toggleServiceStatus"), true, "Integration services must be toggleable");
});
