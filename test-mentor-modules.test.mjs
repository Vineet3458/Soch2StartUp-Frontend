import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

// Support running from repo root or soch2startup-frontend root
const baseDir = fs.existsSync("src") ? "." : "soch2startup-frontend";

test("Verify all 11 Mentor module files exist", () => {
  const tabs = [
    "MyAssignmentsTab.jsx",
    "InProgressTab.jsx",
    "CompletedTab.jsx",
    "ArchivedTab.jsx",
    "ScheduleSessionTab.jsx",
    "SessionHistoryTab.jsx",
    "ProvideGuidanceTab.jsx",
    "MyFeedbackTab.jsx",
    "KnowledgeBaseTab.jsx",
    "TemplatesTab.jsx",
    "BestPracticesTab.jsx",
  ];

  for (const tab of tabs) {
    const full = path.join(baseDir, "src/modules/mentor/tabs", tab);
    assert.equal(fs.existsSync(full), true, `Mentor tab file ${tab} must exist`);
  }
});

test("Verify MentorSharedComponents.jsx exports all required UI utilities", () => {
  const compPath = path.join(baseDir, "src/modules/mentor/MentorSharedComponents.jsx");
  assert.equal(fs.existsSync(compPath), true, "MentorSharedComponents.jsx must exist");
  const code = fs.readFileSync(compPath, "utf-8");

  assert.equal(code.includes("export function MentorHeader"), true);
  assert.equal(code.includes("export function MentorMetricCards"), true);
  assert.equal(code.includes("export function MentorCard"), true);
  assert.equal(code.includes("export function exportToCsv"), true);
});

test("Verify modules/mentor/index.js exports all 11 tabs", () => {
  const indexPath = path.join(baseDir, "src/modules/mentor/index.js");
  assert.equal(fs.existsSync(indexPath), true, "index.js must exist");
  const code = fs.readFileSync(indexPath, "utf-8");

  assert.equal(code.includes("MyAssignmentsTab"), true);
  assert.equal(code.includes("InProgressTab"), true);
  assert.equal(code.includes("CompletedTab"), true);
  assert.equal(code.includes("ArchivedTab"), true);
  assert.equal(code.includes("ScheduleSessionTab"), true);
  assert.equal(code.includes("SessionHistoryTab"), true);
  assert.equal(code.includes("ProvideGuidanceTab"), true);
  assert.equal(code.includes("MyFeedbackTab"), true);
  assert.equal(code.includes("KnowledgeBaseTab"), true);
  assert.equal(code.includes("TemplatesTab"), true);
  assert.equal(code.includes("BestPracticesTab"), true);
});

test("Verify Dashboard.jsx routes all mentor tabs cleanly", () => {
  const dashPath = path.join(baseDir, "src/pages/Dashboard.jsx");
  const code = fs.readFileSync(dashPath, "utf-8");

  assert.equal(code.includes("effectiveRole === \"mentor\""), true);
  assert.equal(code.includes("<MyAssignmentsTab"), true);
  assert.equal(code.includes("<InProgressTab"), true);
  assert.equal(code.includes("<CompletedTab"), true);
  assert.equal(code.includes("<ArchivedTab"), true);
  assert.equal(code.includes("<ScheduleSessionTab"), true);
  assert.equal(code.includes("<SessionHistoryTab"), true);
  assert.equal(code.includes("<ProvideGuidanceTab"), true);
  assert.equal(code.includes("<MyFeedbackTab"), true);
  assert.equal(code.includes("<KnowledgeBaseTab"), true);
  assert.equal(code.includes("<TemplatesTab"), true);
  assert.equal(code.includes("<BestPracticesTab"), true);
});

test("Verify Screenshot 01: MyAssignmentsTab UI elements", () => {
  const p = path.join(baseDir, "src/modules/mentor/tabs/MyAssignmentsTab.jsx");
  const code = fs.readFileSync(p, "utf-8");

  assert.equal(code.includes('title="My Assignments"'), true);
  assert.equal(code.includes('subtitle="Startups assigned to you for mentoring"'), true);
  assert.equal(code.includes('title="Assigned startup portfolio"'), true);

  // Check 4 metric cards
  assert.equal(code.includes("TOTAL ASSIGNMENTS"), true);
  assert.equal(code.includes('"12"'), true);
  assert.equal(code.includes("ACTIVE"), true);
  assert.equal(code.includes('"7"'), true);
  assert.equal(code.includes("PENDING REVIEW"), true);
  assert.equal(code.includes('"3"'), true);
  assert.equal(code.includes("COMPLETED"), true);
  assert.equal(code.includes('"2"'), true);

  // Check table headers
  assert.equal(code.includes("STARTUP / FOUNDER"), true);
  assert.equal(code.includes("STAGE"), true);
  assert.equal(code.includes("LAST ACTIVITY"), true);
  assert.equal(code.includes("PRIORITY"), true);
  assert.equal(code.includes("STATUS"), true);

  // Check data rows
  assert.equal(code.includes("GreenCart"), true);
  assert.equal(code.includes("MedRoute"), true);
  assert.equal(code.includes("SkillBridge"), true);
  assert.equal(code.includes("FarmLink"), true);
  assert.equal(code.includes("AquaSense"), true);
});

test("Verify Screenshot 02: InProgressTab UI elements", () => {
  const p = path.join(baseDir, "src/modules/mentor/tabs/InProgressTab.jsx");
  const code = fs.readFileSync(p, "utf-8");

  assert.equal(code.includes('title="In Progress"'), true);
  assert.equal(code.includes('subtitle="Track active mentoring engagements and next milestones"'), true);
  assert.equal(code.includes('title="Active mentoring tracker"'), true);

  // Check 4 metric cards
  assert.equal(code.includes("IN PROGRESS"), true);
  assert.equal(code.includes('"7"'), true);
  assert.equal(code.includes("SESSIONS THIS WEEK"), true);
  assert.equal(code.includes('"5"'), true);
  assert.equal(code.includes("MILESTONES DUE"), true);
  assert.equal(code.includes('"3"'), true);
  assert.equal(code.includes("AT RISK"), true);
  assert.equal(code.includes('"1"'), true);

  // Check table headers
  assert.equal(code.includes("STARTUP"), true);
  assert.equal(code.includes("CURRENT FOCUS"), true);
  assert.equal(code.includes("NEXT MILESTONE"), true);
  assert.equal(code.includes("DUE DATE"), true);
  assert.equal(code.includes("PROGRESS"), true);

  // Check data rows
  assert.equal(code.includes("Customer discovery"), true);
  assert.equal(code.includes("Interview insights"), true);
  assert.equal(code.includes("Nov 18"), true);
  assert.equal(code.includes("68"), true);
});

test("Verify Screenshot 03: CompletedTab UI elements", () => {
  const p = path.join(baseDir, "src/modules/mentor/tabs/CompletedTab.jsx");
  const code = fs.readFileSync(p, "utf-8");

  assert.equal(code.includes('title="Completed"'), true);
  assert.equal(code.includes('subtitle="Review completed mentorship assignments and outcomes"'), true);
  assert.equal(code.includes('title="Completed assignments"'), true);

  // Check 4 metric cards
  assert.equal(code.includes("COMPLETED"), true);
  assert.equal(code.includes('"8"'), true);
  assert.equal(code.includes("THIS QUARTER"), true);
  assert.equal(code.includes('"2"'), true);
  assert.equal(code.includes("AVG. DURATION"), true);
  assert.equal(code.includes('"6 weeks"'), true);
  assert.equal(code.includes("FOLLOW-UP OPEN"), true);
  assert.equal(code.includes('"1"'), true);

  // Check table headers
  assert.equal(code.includes("STARTUP"), true);
  assert.equal(code.includes("FOCUS AREA"), true);
  assert.equal(code.includes("COMPLETED ON"), true);
  assert.equal(code.includes("OUTCOME"), true);
  assert.equal(code.includes("REPORT"), true);

  // Check rows
  assert.equal(code.includes("LocalLoop"), true);
  assert.equal(code.includes("Validation ready"), true);
  assert.equal(code.includes("EduSpark"), true);
  assert.equal(code.includes("CareNest"), true);
  assert.equal(code.includes("ReFarm"), true);
  assert.equal(code.includes("TripMint"), true);
});

test("Verify Screenshot 04: ArchivedTab UI elements", () => {
  const p = path.join(baseDir, "src/modules/mentor/tabs/ArchivedTab.jsx");
  const code = fs.readFileSync(p, "utf-8");

  assert.equal(code.includes('title="Archived"'), true);
  assert.equal(code.includes('subtitle="Past or inactive mentoring assignments"'), true);
  assert.equal(code.includes('title="Archived portfolio"'), true);

  // Check 4 metric cards
  assert.equal(code.includes("ARCHIVED"), true);
  assert.equal(code.includes('"4"'), true);
  assert.equal(code.includes("REOPEN REQUESTS"), true);
  assert.equal(code.includes('"1"'), true);
  assert.equal(code.includes("LAST ARCHIVED"), true);
  assert.equal(code.includes('"Oct 21"'), true);
  assert.equal(code.includes("DOCUMENTS"), true);
  assert.equal(code.includes('"16"'), true);

  // Check table headers
  assert.equal(code.includes("STARTUP"), true);
  assert.equal(code.includes("ARCHIVED DATE"), true);
  assert.equal(code.includes("REASON"), true);
  assert.equal(code.includes("LAST STAGE"), true);
  assert.equal(code.includes("ACTION"), true);

  // Check rows
  assert.equal(code.includes("ByteBloom"), true);
  assert.equal(code.includes("Founder paused"), true);
  assert.equal(code.includes("WellNest"), true);
  assert.equal(code.includes("CraftCloud"), true);
  assert.equal(code.includes("UrbanSprout"), true);
  assert.equal(code.includes("NovaLearn"), true);
});

test("Verify Screenshot 05: ScheduleSessionTab UI elements", () => {
  const p = path.join(baseDir, "src/modules/mentor/tabs/ScheduleSessionTab.jsx");
  const code = fs.readFileSync(p, "utf-8");

  assert.equal(code.includes('title="Schedule Session"'), true);
  assert.equal(code.includes('subtitle="Plan a mentoring session with an assigned startup"'), true);
  assert.equal(code.includes('title="Session planner"'), true);

  // Check 4 metric cards
  assert.equal(code.includes("UPCOMING SESSIONS"), true);
  assert.equal(code.includes('"4"'), true);
  assert.equal(code.includes("HOURS THIS MONTH"), true);
  assert.equal(code.includes('"9.5"'), true);
  assert.equal(code.includes("REQUESTS"), true);
  assert.equal(code.includes('"2"'), true);
  assert.equal(code.includes("AVAILABLE SLOTS"), true);
  assert.equal(code.includes('"6"'), true);

  // Check table headers
  assert.equal(code.includes("STARTUP"), true);
  assert.equal(code.includes("SESSION TYPE"), true);
  assert.equal(code.includes("DATE"), true);
  assert.equal(code.includes("TIME"), true);
  assert.equal(code.includes("STATUS"), true);

  // Check rows
  assert.equal(code.includes("Progress review"), true);
  assert.equal(code.includes("Nov 16"), true);
  assert.equal(code.includes("10:30 AM"), true);
  assert.equal(code.includes("Scheduled"), true);
  assert.equal(code.includes("MVP consultation"), true);
});

test("Verify Screenshot 06: SessionHistoryTab UI elements", () => {
  const p = path.join(baseDir, "src/modules/mentor/tabs/SessionHistoryTab.jsx");
  const code = fs.readFileSync(p, "utf-8");

  assert.equal(code.includes('title="Session History"'), true);
  assert.equal(code.includes('subtitle="A record of past mentoring sessions and action items"'), true);
  assert.equal(code.includes('title="Session archive"'), true);

  // Check 4 metric cards
  assert.equal(code.includes("TOTAL SESSIONS"), true);
  assert.equal(code.includes('"28"'), true);
  assert.equal(code.includes("COMPLETED"), true);
  assert.equal(code.includes('"24"'), true);
  assert.equal(code.includes("CANCELLED"), true);
  assert.equal(code.includes('"2"'), true);
  assert.equal(code.includes("FOLLOW-UPS"), true);
  assert.equal(code.includes('"3"'), true);

  // Check table headers
  assert.equal(code.includes("STARTUP"), true);
  assert.equal(code.includes("SESSION DATE"), true);
  assert.equal(code.includes("TOPIC"), true);
  assert.equal(code.includes("DURATION"), true);
  assert.equal(code.includes("OUTCOME"), true);

  // Check rows
  assert.equal(code.includes("Customer discovery"), true);
  assert.equal(code.includes("45 min"), true);
  assert.equal(code.includes("Action plan"), true);
});

test("Verify Screenshot 07: ProvideGuidanceTab UI elements", () => {
  const p = path.join(baseDir, "src/modules/mentor/tabs/ProvideGuidanceTab.jsx");
  const code = fs.readFileSync(p, "utf-8");

  assert.equal(code.includes('title="Provide Guidance"'), true);
  assert.equal(code.includes('subtitle="Share structured recommendations with assigned founders"'), true);
  assert.equal(code.includes('title="Guidance activity"'), true);

  // Check 4 metric cards
  assert.equal(code.includes("GUIDANCE SHARED"), true);
  assert.equal(code.includes('"19"'), true);
  assert.equal(code.includes("DRAFTS"), true);
  assert.equal(code.includes('"2"'), true);
  assert.equal(code.includes("ACKNOWLEDGED"), true);
  assert.equal(code.includes('"15"'), true);
  assert.equal(code.includes("FOLLOW-UP DUE"), true);
  assert.equal(code.includes('"3"'), true);

  // Check table headers
  assert.equal(code.includes("STARTUP"), true);
  assert.equal(code.includes("GUIDANCE TOPIC"), true);
  assert.equal(code.includes("SHARED ON"), true);
  assert.equal(code.includes("FOUNDER RESPONSE"), true);
  assert.equal(code.includes("STATUS"), true);

  // Check rows
  assert.equal(code.includes("Customer interviews"), true);
  assert.equal(code.includes("Viewed"), true);
  assert.equal(code.includes("Published"), true);
});

test("Verify Screenshot 08: MyFeedbackTab UI elements", () => {
  const p = path.join(baseDir, "src/modules/mentor/tabs/MyFeedbackTab.jsx");
  const code = fs.readFileSync(p, "utf-8");

  assert.equal(code.includes('title="My Feedback"'), true);
  assert.equal(code.includes('subtitle="View feedback received from founders and program coordinators"'), true);
  assert.equal(code.includes('title="Feedback inbox"'), true);

  // Check 4 metric cards
  assert.equal(code.includes("FEEDBACK RECEIVED"), true);
  assert.equal(code.includes('"14"'), true);
  assert.equal(code.includes("AVERAGE RATING"), true);
  assert.equal(code.includes('"4.8 / 5"'), true);
  assert.equal(code.includes("RESPONSES"), true);
  assert.equal(code.includes('"11"'), true);
  assert.equal(code.includes("PENDING"), true);
  assert.equal(code.includes('"2"'), true);

  // Check table headers
  assert.equal(code.includes("FROM"), true);
  assert.equal(code.includes("STARTUP / PROGRAM"), true);
  assert.equal(code.includes("DATE"), true);
  assert.equal(code.includes("RATING"), true);
  assert.equal(code.includes("FEEDBACK"), true);

  // Check rows
  assert.equal(code.includes("Founder - GreenCart"), true);
  assert.equal(code.includes("Founder - MedRoute"), true);
  assert.equal(code.includes("Program Lead"), true);
});

test("Verify Screenshot 09: KnowledgeBaseTab UI elements", () => {
  const p = path.join(baseDir, "src/modules/mentor/tabs/KnowledgeBaseTab.jsx");
  const code = fs.readFileSync(p, "utf-8");

  assert.equal(code.includes('title="Knowledge Base"'), true);
  assert.equal(code.includes('subtitle="Browse curated resources for startup mentoring"'), true);
  assert.equal(code.includes('title="Mentor resource library"'), true);

  // Check 4 metric cards
  assert.equal(code.includes("RESOURCES"), true);
  assert.equal(code.includes('"86"'), true);
  assert.equal(code.includes("CATEGORIES"), true);
  assert.equal(code.includes('"8"'), true);
  assert.equal(code.includes("NEW THIS MONTH"), true);
  assert.equal(code.includes('"12"'), true);
  assert.equal(code.includes("SAVED"), true);
  assert.equal(code.includes('"9"'), true);

  // Check table headers
  assert.equal(code.includes("RESOURCE"), true);
  assert.equal(code.includes("CATEGORY"), true);
  assert.equal(code.includes("FORMAT"), true);
  assert.equal(code.includes("UPDATED"), true);
  assert.equal(code.includes("ACCESS"), true);

  // Check rows
  assert.equal(code.includes("Customer Discovery Playbook"), true);
  assert.equal(code.includes("Lean Canvas Guide"), true);
  assert.equal(code.includes("TAM/SAM/SOM Primer"), true);
  assert.equal(code.includes("MVP Prioritization"), true);
  assert.equal(code.includes("Pitch Story Framework"), true);
});

test("Verify Screenshot 10: TemplatesTab UI elements", () => {
  const p = path.join(baseDir, "src/modules/mentor/tabs/TemplatesTab.jsx");
  const code = fs.readFileSync(p, "utf-8");

  assert.equal(code.includes('title="Templates"'), true);
  assert.equal(code.includes('subtitle="Reusable templates for sessions, reviews and founder guidance"'), true);
  assert.equal(code.includes('title="Mentor templates"'), true);

  // Check 4 metric cards
  assert.equal(code.includes("TEMPLATES"), true);
  assert.equal(code.includes('"24"'), true);
  assert.equal(code.includes("MY SAVED"), true);
  assert.equal(code.includes('"6"'), true);
  assert.equal(code.includes("RECENTLY USED"), true);
  assert.equal(code.includes('"4"'), true);
  assert.equal(code.includes("SHARED"), true);
  assert.equal(code.includes('"3"'), true);

  // Check table headers
  assert.equal(code.includes("TEMPLATE"), true);
  assert.equal(code.includes("PURPOSE"), true);
  assert.equal(code.includes("FORMAT"), true);
  assert.equal(code.includes("LAST USED"), true);
  assert.equal(code.includes("ACTION"), true);

  // Check rows
  assert.equal(code.includes("Mentor Session Notes"), true);
  assert.equal(code.includes("Startup Review"), true);
  assert.equal(code.includes("Action Plan"), true);
  assert.equal(code.includes("Customer Interview Plan"), true);
  assert.equal(code.includes("Pitch Feedback"), true);
});

test("Verify Screenshot 11: BestPracticesTab UI elements", () => {
  const p = path.join(baseDir, "src/modules/mentor/tabs/BestPracticesTab.jsx");
  const code = fs.readFileSync(p, "utf-8");

  assert.equal(code.includes('title="Best Practices"'), true);
  assert.equal(code.includes('subtitle="Practical mentoring principles and proven startup playbooks"'), true);
  assert.equal(code.includes('title="Mentor playbook library"'), true);

  // Check 4 metric cards
  assert.equal(code.includes("PLAYBOOKS"), true);
  assert.equal(code.includes('"18"'), true);
  assert.equal(code.includes("TOPICS"), true);
  assert.equal(code.includes('"7"'), true);
  assert.equal(code.includes("READING PROGRESS"), true);
  assert.equal(code.includes('"72%"'), true);
  assert.equal(code.includes("BOOKMARKED"), true);
  assert.equal(code.includes('"5"'), true);

  // Check table headers
  assert.equal(code.includes("PRACTICE"), true);
  assert.equal(code.includes("TOPIC"), true);
  assert.equal(code.includes("LEVEL"), true);
  assert.equal(code.includes("READ TIME"), true);
  assert.equal(code.includes("ACTION"), true);

  // Check rows
  assert.equal(code.includes("Ask before advising"), true);
  assert.equal(code.includes("Validate problems first"), true);
  assert.equal(code.includes("Use milestone-based goals"), true);
  assert.equal(code.includes("Give evidence-led feedback"), true);
  assert.equal(code.includes("Encourage small experiments"), true);
});

test("Verify Sidebar remained untouched", () => {
  const sbConfig = path.join(baseDir, "src/components/sidebar/sidebarConfig.js");
  const code = fs.readFileSync(sbConfig, "utf-8");

  // Verify original mentor sidebar configuration is intact
  assert.equal(code.includes("mentor: {"), true);
  assert.equal(code.includes('title: "ADVISORY & STARTUPS"'), true);
  assert.equal(code.includes('id: "assigned-startups"'), true);
  assert.equal(code.includes('path: "/dashboard?tab=assignments"'), true);
  assert.equal(code.includes('path: "/dashboard?tab=in-progress"'), true);
  assert.equal(code.includes('path: "/dashboard?tab=completed"'), true);
  assert.equal(code.includes('path: "/dashboard?tab=archived"'), true);
  assert.equal(code.includes('path: "/dashboard?tab=schedule"'), true);
  assert.equal(code.includes('path: "/dashboard?tab=guidance"'), true);
  assert.equal(code.includes('path: "/dashboard?tab=my-feedback"'), true);
  assert.equal(code.includes('path: "/dashboard?view=saved"'), true);
});

test("Verify Dashboard.jsx handles /mentor path and preserves role query", () => {
  const dashPath = path.join(baseDir, "src/pages/Dashboard.jsx");
  const code = fs.readFileSync(dashPath, "utf-8");

  assert.equal(code.includes('location.pathname.startsWith("/mentor")'), true);
  assert.equal(code.includes("tab=assignments${mentorRoleQuery}"), true);
  assert.equal(code.includes("<BestPracticesTab"), true);
});

test("Verify DashboardTopbar.jsx contains all 11 Mentor quick links", () => {
  const topbarPath = path.join(baseDir, "src/components/dashboard/DashboardTopbar.jsx");
  const code = fs.readFileSync(topbarPath, "utf-8");

  assert.equal(code.includes('label: "My Assignments"'), true);
  assert.equal(code.includes('label: "In Progress Mentoring"'), true);
  assert.equal(code.includes('label: "Completed Assignments"'), true);
  assert.equal(code.includes('label: "Archived Mentoring"'), true);
  assert.equal(code.includes('label: "Schedule Mentor Session"'), true);
  assert.equal(code.includes('label: "Mentor Session History"'), true);
  assert.equal(code.includes('label: "Provide Guidance"'), true);
  assert.equal(code.includes('label: "Mentor Feedback Inbox"'), true);
  assert.equal(code.includes('label: "Mentor Knowledge Base"'), true);
  assert.equal(code.includes('label: "Mentor Templates"'), true);
  assert.equal(code.includes('label: "Mentor Best Practices"'), true);
});

test("Verify interactive row clicks across tabs", () => {
  const compTab = fs.readFileSync(path.join(baseDir, "src/modules/mentor/tabs/CompletedTab.jsx"), "utf-8");
  assert.equal(compTab.includes("setSelectedReport(item)"), true);
  assert.equal(compTab.includes('cursor: "pointer"'), true);

  const archTab = fs.readFileSync(path.join(baseDir, "src/modules/mentor/tabs/ArchivedTab.jsx"), "utf-8");
  assert.equal(archTab.includes("setSelectedItem(item)"), true);
  assert.equal(archTab.includes('cursor: "pointer"'), true);

  const kbTab = fs.readFileSync(path.join(baseDir, "src/modules/mentor/tabs/KnowledgeBaseTab.jsx"), "utf-8");
  assert.equal(kbTab.includes("setSelectedResource(item)"), true);
  assert.equal(kbTab.includes('cursor: "pointer"'), true);
  assert.equal(kbTab.includes('"Access"'), true);

  const tmplTab = fs.readFileSync(path.join(baseDir, "src/modules/mentor/tabs/TemplatesTab.jsx"), "utf-8");
  assert.equal(tmplTab.includes("setSelectedTemplate(item)"), true);
  assert.equal(tmplTab.includes('cursor: "pointer"'), true);

  const bpTab = fs.readFileSync(path.join(baseDir, "src/modules/mentor/tabs/BestPracticesTab.jsx"), "utf-8");
  assert.equal(bpTab.includes("setSelectedPractice(item)"), true);
  assert.equal(bpTab.includes('cursor: "pointer"'), true);
});
