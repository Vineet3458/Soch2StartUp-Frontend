import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FRONTEND_DIR = fs.existsSync(path.join(__dirname, "src"))
  ? path.join(__dirname, "src")
  : path.resolve("./soch2startup-frontend/src");

test("Verify all 12 Admin module files exist", () => {
  const tabs = [
    "RoleManagementTab.jsx",
    "AllUsersTab.jsx",
    "PendingVerificationTab.jsx",
    "BlockedUsersTab.jsx",
    "AllIdeasTab.jsx",
    "PendingReviewTab.jsx",
    "ApprovedIdeasTab.jsx",
    "RejectedIdeasTab.jsx",
    "ValidationReportsTab.jsx",
    "MentorsExpertsTab.jsx",
    "RequestsApprovalsTab.jsx",
    "AnalyticsInsightsTab.jsx",
  ];

  for (const tab of tabs) {
    const filePath = path.join(FRONTEND_DIR, "modules", "admin", "tabs", tab);
    assert.ok(fs.existsSync(filePath), `Tab file ${tab} must exist`);
    const content = fs.readFileSync(filePath, "utf-8");
    assert.ok(content.length > 200, `Tab file ${tab} must have substantial content`);
  }
});

test("Verify AdminSharedComponents.jsx exports all required shared UI components", () => {
  const sharedPath = path.join(FRONTEND_DIR, "modules", "admin", "AdminSharedComponents.jsx");
  assert.ok(fs.existsSync(sharedPath), "AdminSharedComponents.jsx must exist");
  const content = fs.readFileSync(sharedPath, "utf-8");

  assert.ok(content.includes("AdminMetricIcon"), "Must export AdminMetricIcon");
  assert.ok(content.includes("AdminPageHeader"), "Must export AdminPageHeader");
  assert.ok(content.includes("AdminMetricCards"), "Must export AdminMetricCards");
  assert.ok(content.includes("AdminCard"), "Must export AdminCard");
  assert.ok(content.includes("AdminFilterBar"), "Must export AdminFilterBar");
  assert.ok(content.includes("AdminBadge"), "Must export AdminBadge");
  assert.ok(content.includes("AdminBanner"), "Must export AdminBanner");
});

test("Verify AdminPanel.jsx handles all 12 tabs cleanly", () => {
  const panelPath = path.join(FRONTEND_DIR, "pages", "AdminPanel.jsx");
  assert.ok(fs.existsSync(panelPath), "AdminPanel.jsx must exist");
  const content = fs.readFileSync(panelPath, "utf-8");

  const requiredTabs = [
    "roles",
    "users",
    "pending",
    "blocked",
    "ideas",
    "review",
    "approved",
    "rejected",
    "reports",
    "mentors",
    "requests",
    "analytics",
  ];

  for (const t of requiredTabs) {
    assert.ok(
      content.includes(`case "${t}":`),
      `AdminPanel must handle case "${t}"`
    );
  }
});

test("Verify sidebarConfig.js contains paths for all Admin tabs", () => {
  const configPath = path.join(FRONTEND_DIR, "components", "sidebar", "sidebarConfig.js");
  const content = fs.readFileSync(configPath, "utf-8");

  const requiredPaths = [
    "/admin?tab=users",
    "/admin?tab=pending",
    "/admin?tab=roles",
    "/admin?tab=blocked",
    "/admin?tab=ideas",
    "/admin?tab=review",
    "/admin?tab=approved",
    "/admin?tab=rejected",
    "/admin?tab=reports",
    "/admin?tab=mentors",
    "/admin?tab=requests",
    "/admin?tab=analytics",
  ];

  for (const p of requiredPaths) {
    assert.ok(content.includes(p), `sidebarConfig.js must contain path ${p}`);
  }
});

test("Verify RoleManagementTab UI elements against Screenshot 1", () => {
  const content = fs.readFileSync(
    path.join(FRONTEND_DIR, "modules", "admin", "tabs", "RoleManagementTab.jsx"),
    "utf-8"
  );
  assert.ok(content.includes("Role Management"));
  assert.ok(content.includes("Configure platform roles and control access through permissions."));
  assert.ok(content.includes("Total roles"));
  assert.ok(content.includes("Active permissions"));
  assert.ok(content.includes("Custom role groups"));
  assert.ok(content.includes("Recent changes"));
  assert.ok(content.includes("Superadmin"));
  assert.ok(content.includes("Admin"));
  assert.ok(content.includes("Entrepreneur"));
  assert.ok(content.includes("Mentor"));
  assert.ok(content.includes("Evaluator"));
  assert.ok(content.includes("Permission matrix"));
});

test("Verify AllUsersTab UI elements against Screenshot 2", () => {
  const content = fs.readFileSync(
    path.join(FRONTEND_DIR, "modules", "admin", "tabs", "AllUsersTab.jsx"),
    "utf-8"
  );
  assert.ok(content.includes("All Users"));
  assert.ok(content.includes("User directory"));
  assert.ok(content.includes("Aarav Mehta"));
  assert.ok(content.includes("Riya Sharma"));
  assert.ok(content.includes("Kabir Singh"));
  assert.ok(content.includes("Ananya Rao"));
  assert.ok(content.includes("Dev Patel"));
  assert.ok(content.includes("Ishita Gupta"));
  assert.ok(content.includes("+ Add user"));
});

test("Verify PendingVerificationTab UI elements against Screenshot 3", () => {
  const content = fs.readFileSync(
    path.join(FRONTEND_DIR, "modules", "admin", "tabs", "PendingVerificationTab.jsx"),
    "utf-8"
  );
  assert.ok(content.includes("Pending Verification"));
  assert.ok(content.includes("Verification review queue"));
  assert.ok(content.includes("Rohit Verma"));
  assert.ok(content.includes("Kabir Singh"));
  assert.ok(content.includes("Meera Nair"));
  assert.ok(content.includes("Sana Kapoor"));
  assert.ok(content.includes("Arjun Malhotra"));
  assert.ok(content.includes("Select an applicant to review documents"));
});

test("Verify BlockedUsersTab UI elements against Screenshot 4", () => {
  const content = fs.readFileSync(
    path.join(FRONTEND_DIR, "modules", "admin", "tabs", "BlockedUsersTab.jsx"),
    "utf-8"
  );
  assert.ok(content.includes("Blocked Users"));
  assert.ok(content.includes("Restricted account directory"));
  assert.ok(content.includes("Dev Patel"));
  assert.ok(content.includes("Nikhil Jain"));
  assert.ok(content.includes("Pooja Das"));
  assert.ok(content.includes("Karan Shah"));
  assert.ok(content.includes("Tanya Roy"));
  assert.ok(content.includes("Account restrictions should be documented"));
});

test("Verify AllIdeasTab UI elements against Screenshot 5", () => {
  const content = fs.readFileSync(
    path.join(FRONTEND_DIR, "modules", "admin", "tabs", "AllIdeasTab.jsx"),
    "utf-8"
  );
  assert.ok(content.includes("All Ideas"));
  assert.ok(content.includes("All startup ideas"));
  assert.ok(content.includes("Smart Hostel Marketplace"));
  assert.ok(content.includes("AI Travel Assistant"));
  assert.ok(content.includes("FarmLink Network"));
  assert.ok(content.includes("SkillBridge"));
  assert.ok(content.includes("GreenCart"));
  assert.ok(content.includes("CareConnect"));
  assert.ok(content.includes("+ Export ideas"));
});

test("Verify PendingReviewTab UI elements against Screenshot 6", () => {
  const content = fs.readFileSync(
    path.join(FRONTEND_DIR, "modules", "admin", "tabs", "PendingReviewTab.jsx"),
    "utf-8"
  );
  assert.ok(content.includes("Pending Review"));
  assert.ok(content.includes("Pending review queue"));
  assert.ok(content.includes("+ Review selected"));
  assert.ok(content.includes("Smart Hostel Marketplace"));
  assert.ok(content.includes("FarmLink Network"));
  assert.ok(content.includes("CareConnect"));
});

test("Verify ApprovedIdeasTab UI elements against Screenshot 7", () => {
  const content = fs.readFileSync(
    path.join(FRONTEND_DIR, "modules", "admin", "tabs", "ApprovedIdeasTab.jsx"),
    "utf-8"
  );
  assert.ok(content.includes("Approved Ideas"));
  assert.ok(content.includes("Approved startup ideas"));
  assert.ok(content.includes("+ Export approved"));
  assert.ok(content.includes("Approval confirms the submission can proceed"));
});

test("Verify RejectedIdeasTab UI elements against Screenshot 8", () => {
  const content = fs.readFileSync(
    path.join(FRONTEND_DIR, "modules", "admin", "tabs", "RejectedIdeasTab.jsx"),
    "utf-8"
  );
  assert.ok(content.includes("Rejected Ideas"));
  assert.ok(content.includes("Rejected submissions"));
  assert.ok(content.includes("+ Export records"));
  assert.ok(content.includes("Show transparent decision reasons"));
});

test("Verify ValidationReportsTab UI elements against Screenshot 9", () => {
  const content = fs.readFileSync(
    path.join(FRONTEND_DIR, "modules", "admin", "tabs", "ValidationReportsTab.jsx"),
    "utf-8"
  );
  assert.ok(content.includes("Validation Reports"));
  assert.ok(content.includes("Validation report registry"));
  assert.ok(content.includes("SVR-2026-0287"));
  assert.ok(content.includes("SVR-2026-0286"));
  assert.ok(content.includes("Export reports"));
});

test("Verify MentorsExpertsTab UI elements against Screenshot 10", () => {
  const content = fs.readFileSync(
    path.join(FRONTEND_DIR, "modules", "admin", "tabs", "MentorsExpertsTab.jsx"),
    "utf-8"
  );
  assert.ok(content.includes("Mentors & Experts"));
  assert.ok(content.includes("Mentor & expert directory"));
  assert.ok(content.includes("Dr. Meera Nair"));
  assert.ok(content.includes("Arjun Malhotra"));
  assert.ok(content.includes("+ Add Mentor"));
});

test("Verify RequestsApprovalsTab UI elements against Screenshot 11", () => {
  const content = fs.readFileSync(
    path.join(FRONTEND_DIR, "modules", "admin", "tabs", "RequestsApprovalsTab.jsx"),
    "utf-8"
  );
  assert.ok(content.includes("Requests & Approvals"));
  assert.ok(content.includes("Approval queue"));
  assert.ok(content.includes("Mentor onboarding"));
  assert.ok(content.includes("Review queue"));
});

test("Verify AnalyticsInsightsTab UI elements against Screenshot 12", () => {
  const content = fs.readFileSync(
    path.join(FRONTEND_DIR, "modules", "admin", "tabs", "AnalyticsInsightsTab.jsx"),
    "utf-8"
  );
  assert.ok(content.includes("Analytics & Insights"));
  assert.ok(content.includes("Platform activity trend"));
  assert.ok(content.includes("Startup idea categories"));
  assert.ok(content.includes("Technology"));
  assert.ok(content.includes("Education"));
  assert.ok(content.includes("Healthcare"));
});
