import test from "node:test";
import assert from "node:assert/strict";

// Test Status Badge Logic
function getBadgeVariant(status) {
  const norm = (status || "").toLowerCase().trim();
  if (["active", "approved", "completed", "reinstated"].includes(norm)) {
    return "active";
  } else if (norm === "appeal pending") {
    return "appeal-pending";
  } else if (norm === "pending") {
    return "pending";
  } else if (norm === "in review") {
    return "in-review";
  } else if (["blocked", "rejected", "flagged"].includes(norm)) {
    return "blocked";
  }
  return "active";
}

test("Badge variant classifier maps all status states accurately", () => {
  assert.equal(getBadgeVariant("Active"), "active");
  assert.equal(getBadgeVariant("Approved"), "active");
  assert.equal(getBadgeVariant("Completed"), "active");
  assert.equal(getBadgeVariant("Reinstated"), "active");
  assert.equal(getBadgeVariant("Pending"), "pending");
  assert.equal(getBadgeVariant("In Review"), "in-review");
  assert.equal(getBadgeVariant("Appeal pending"), "appeal-pending");
  assert.equal(getBadgeVariant("Blocked"), "blocked");
  assert.equal(getBadgeVariant("Rejected"), "blocked");
  assert.equal(getBadgeVariant("Flagged"), "blocked");
  // Edge cases: null, undefined, empty
  assert.equal(getBadgeVariant(null), "active");
  assert.equal(getBadgeVariant(undefined), "active");
  assert.equal(getBadgeVariant(""), "active");
});

// Test Search and Filter logic
const mockUsers = [
  { name: "Aarav Mehta", email: "aarav.m@example.com", role: "Entrepreneur", status: "Active" },
  { name: "Riya Sharma", email: "riya.s@example.com", role: "Mentor", status: "Active" },
  { name: "Kabir Singh", email: "kabir.s@example.com", role: "Evaluator", status: "Pending" },
  { name: "Dev Patel", email: "dev.p@example.com", role: "Admin", status: "Blocked" },
];

function filterUsers(users, search, roleFilter, statusFilter) {
  return users.filter((u) => {
    const q = (search || "").toLowerCase().trim();
    const matchSearch =
      !q ||
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q);
    const matchRole =
      !roleFilter ||
      roleFilter === "ALL" ||
      u.role.toLowerCase() === roleFilter.toLowerCase();
    const matchStatus =
      !statusFilter ||
      statusFilter === "ALL" ||
      u.status.toLowerCase() === statusFilter.toLowerCase();
    return matchSearch && matchRole && matchStatus;
  });
}

test("Filter users returns all when search and filters are empty", () => {
  const result = filterUsers(mockUsers, "", "ALL", "ALL");
  assert.equal(result.length, 4);
});

test("Filter users by search term matches name or email", () => {
  const byName = filterUsers(mockUsers, "riya", "ALL", "ALL");
  assert.equal(byName.length, 1);
  assert.equal(byName[0].name, "Riya Sharma");

  const byEmail = filterUsers(mockUsers, "dev.p", "ALL", "ALL");
  assert.equal(byEmail.length, 1);
  assert.equal(byEmail[0].name, "Dev Patel");

  const noMatch = filterUsers(mockUsers, "nonexistent", "ALL", "ALL");
  assert.equal(noMatch.length, 0);
});

test("Filter users by role", () => {
  const mentors = filterUsers(mockUsers, "", "Mentor", "ALL");
  assert.equal(mentors.length, 1);
  assert.equal(mentors[0].role, "Mentor");
});

test("Filter users by status", () => {
  const blocked = filterUsers(mockUsers, "", "ALL", "Blocked");
  assert.equal(blocked.length, 1);
  assert.equal(blocked[0].status, "Blocked");

  const pending = filterUsers(mockUsers, "", "ALL", "Pending");
  assert.equal(pending.length, 1);
  assert.equal(pending[0].status, "Pending");
});

// Test Idea filtering
const mockIdeas = [
  { title: "Smart Hostel Marketplace", founder: "Rahul Sharma", industry: "Student Services", status: "In Review" },
  { title: "AI Travel Assistant", founder: "Priya Verma", industry: "Travel & Tourism", status: "Approved" },
  { title: "FarmLink Network", founder: "Aman Gupta", industry: "Agritech", status: "Pending" },
  { title: "GreenCart", founder: "Ishita Rao", industry: "Commerce", status: "Rejected" },
];

function filterIdeas(ideas, search, industryFilter) {
  return ideas.filter((i) => {
    const q = (search || "").toLowerCase().trim();
    const matchSearch =
      !q ||
      i.title.toLowerCase().includes(q) ||
      i.founder.toLowerCase().includes(q) ||
      i.industry.toLowerCase().includes(q);
    const matchIndustry =
      !industryFilter ||
      industryFilter === "ALL" ||
      i.industry.toLowerCase() === industryFilter.toLowerCase();
    return matchSearch && matchIndustry;
  });
}

test("Filter ideas by industry", () => {
  const agritech = filterIdeas(mockIdeas, "", "Agritech");
  assert.equal(agritech.length, 1);
  assert.equal(agritech[0].title, "FarmLink Network");
});

test("Filter ideas by combined search and industry", () => {
  const result = filterIdeas(mockIdeas, "Assistant", "Travel & Tourism");
  assert.equal(result.length, 1);
  assert.equal(result[0].title, "AI Travel Assistant");

  const mismatch = filterIdeas(mockIdeas, "Assistant", "Agritech");
  assert.equal(mismatch.length, 0);
});

// Test Date Range Filter logic
function matchesDateRange(dateStr, rangeKey) {
  if (!rangeKey || rangeKey === "ALL") return true;
  if (!dateStr) return false;

  const parsed = new Date(dateStr);
  if (isNaN(parsed.getTime())) return true;

  // Normalize dates to midnight local time for fair calendar day comparison
  const itemDate = new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());
  // Base reference date: 14 Nov 2026 (matching mock dataset timeline)
  const baseDate = new Date(2026, 10, 14); // month 10 = November

  const diffMs = baseDate.getTime() - itemDate.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (rangeKey === "7d") {
    return diffDays >= 0 && diffDays <= 7;
  }
  if (rangeKey === "30d") {
    return diffDays >= 0 && diffDays <= 30;
  }
  if (rangeKey === "month") {
    return (
      itemDate.getMonth() === baseDate.getMonth() &&
      itemDate.getFullYear() === baseDate.getFullYear()
    );
  }
  return true;
}

test("matchesDateRange correctly filters by 7d, 30d, month, and ALL", () => {
  // Reference date: 14 Nov 2026
  assert.equal(matchesDateRange("14 Nov 2026", "7d"), true);
  assert.equal(matchesDateRange("08 Nov 2026", "7d"), true);
  assert.equal(matchesDateRange("06 Nov 2026", "7d"), false); // 8 days ago
  assert.equal(matchesDateRange("31 Oct 2026", "7d"), false);

  assert.equal(matchesDateRange("06 Nov 2026", "30d"), true);
  assert.equal(matchesDateRange("31 Oct 2026", "30d"), true);
  assert.equal(matchesDateRange("01 Oct 2026", "30d"), false); // >40 days ago

  assert.equal(matchesDateRange("02 Nov 2026", "month"), true);
  assert.equal(matchesDateRange("31 Oct 2026", "month"), false); // October

  assert.equal(matchesDateRange("31 Oct 2026", "ALL"), true);
  assert.equal(matchesDateRange(null, "7d"), false);
  assert.equal(matchesDateRange(undefined, "ALL"), true);
});

const mockDatedItems = [
  { id: 1, title: "Item 1", date: "14 Nov 2026" },
  { id: 2, title: "Item 2", date: "10 Nov 2026" },
  { id: 3, title: "Item 3", date: "06 Nov 2026" },
  { id: 4, title: "Item 4", date: "31 Oct 2026" },
  { id: 5, title: "Item 5", date: "28 Oct 2026" },
];

test("Dataset date filtering correctly narrows records", () => {
  const last7 = mockDatedItems.filter((i) => matchesDateRange(i.date, "7d"));
  assert.equal(last7.length, 2); // 14 Nov and 10 Nov

  const thisMonth = mockDatedItems.filter((i) => matchesDateRange(i.date, "month"));
  assert.equal(thisMonth.length, 3); // 14, 10, 06 Nov

  const last30 = mockDatedItems.filter((i) => matchesDateRange(i.date, "30d"));
  assert.equal(last30.length, 5); // All 5 are within 30 days of Nov 14

  const all = mockDatedItems.filter((i) => matchesDateRange(i.date, "ALL"));
  assert.equal(all.length, 5);
});
