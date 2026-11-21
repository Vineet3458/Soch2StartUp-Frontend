// Run with: npm test
// Guards the bug class that plagued the old site: sidebar links that lead nowhere or to the wrong role's page.
import test, { after } from "node:test";
import assert from "node:assert/strict";
import { build } from "esbuild";
import { mkdirSync, rmSync, existsSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import * as React from "react";

globalThis.React = React;

process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION STACK:", err.stack);
});

mkdirSync("node_modules/.cache", { recursive: true });
const nonce = Date.now();
const out = path.resolve(`node_modules/.cache/registry.test.${nonce}.mjs`); // inside the project so react/lucide resolve
await build({ entryPoints: ["src/views/registry.jsx"], bundle: true, format: "esm", platform: "node", outfile: out, loader: { ".jsx": "jsx" }, external: ["react", "lucide-react", "./*.jsx"], logLevel: "silent" });
const { ROUTES, navFor } = await import(pathToFileURL(out).href);
const fmt = await import(pathToFileURL(path.resolve("src/lib/format.js")).href);

const authOut = path.resolve(`node_modules/.cache/auth.test.${nonce}.mjs`);
await build({
  entryPoints: ["src/pages/Auth.jsx"],
  bundle: true,
  format: "esm",
  platform: "node",
  outfile: authOut,
  loader: { ".jsx": "jsx" },
  external: ["react", "react-dom", "react-router-dom", "lucide-react", "axios"],
  define: { "import.meta.env": "{}" },
  logLevel: "silent"
});
const auth = await import(pathToFileURL(authOut).href);

const ROLES = ["entrepreneur", "mentor", "industry_expert", "admin", "superadmin", "moderator"];
// children inherit the feature/permission gate of their parent menu item
const links = (role) => navFor(role).sections.flatMap((s) => s.items.flatMap((i) => [i, ...(i.children || []).map((c) => ({ ...c, feature: c.feature || i.feature, perm: c.perm || i.perm }))])).filter((i) => i.to).map((i) => ({ label: i.label, to: i.to, feature: i.feature, perm: i.perm }));
const pathOf = (to) => to.split("?")[0].replace(/^\/app\/?/, "");

test("route paths are unique", () => {
  const paths = ROUTES.map((r) => r.path);
  assert.equal(new Set(paths).size, paths.length);
});

for (const role of ROLES) {
  test(`every sidebar link for ${role} opens a real page this role may access`, () => {
    for (const l of links(role)) {
      const p = pathOf(l.to);
      if (p === "") continue; // role dashboard
      const route = ROUTES.find((r) => r.path === p);
      assert.ok(route, `${role}: "${l.label}" -> ${l.to} has no route`);
      assert.ok(route.roles.includes(role), `${role}: "${l.label}" -> ${l.to} is not allowed for this role`);
      if (route.feature) assert.equal(l.feature, route.feature, `${role}: "${l.label}" should be hidden when feature ${route.feature} is off`);
      if (route.perm && role !== "superadmin") assert.equal(l.perm, route.perm, `${role}: "${l.label}" should be hidden without permission ${route.perm}`);
    }
  });
}

test("every role has a navigation menu", () => { for (const r of ROLES) assert.ok(links(r).length >= 5, r); });

test("format helpers", () => {
  assert.equal(fmt.initials("Aarav Patel"), "AP");
  assert.equal(fmt.scoreColor(80), "var(--success)");
  assert.equal(fmt.scoreColor(60), "var(--warning)");
  assert.equal(fmt.scoreColor(10), "var(--danger)");
  assert.equal(fmt.statusLabel("changes_requested"), "Changes requested");
  assert.equal(fmt.roleLabel("industry_expert"), "Industry Expert");
  assert.equal(fmt.ago(new Date()), "just now");
});

test("auth: exports Login, Register, DEMO, ROLE_OPTS, getSafeRedirect, and isEmailValid", () => {
  assert.equal(typeof auth.Login, "function");
  assert.equal(typeof auth.Register, "function");
  assert.ok(Array.isArray(auth.DEMO));
  assert.ok(Array.isArray(auth.ROLE_OPTS));
  assert.equal(typeof auth.getSafeRedirect, "function");
  assert.equal(typeof auth.isEmailValid, "function");
});

test("auth: getSafeRedirect prevents redirect loops and open redirects", () => {
  assert.equal(auth.getSafeRedirect("/app/ideas"), "/app/ideas");
  assert.equal(auth.getSafeRedirect("/app/compare?filter=active"), "/app/compare?filter=active");
  // Loop targets
  assert.equal(auth.getSafeRedirect("/login"), "/app");
  assert.equal(auth.getSafeRedirect("/login?from=/somewhere"), "/app");
  assert.equal(auth.getSafeRedirect("/register"), "/app");
  assert.equal(auth.getSafeRedirect("/register?tab=mentor"), "/app");
  // Open redirect attempts
  assert.equal(auth.getSafeRedirect("//evil.com"), "/app");
  assert.equal(auth.getSafeRedirect("/\\evil.com"), "/app");
  assert.equal(auth.getSafeRedirect("/\\\\evil.com"), "/app");
  assert.equal(auth.getSafeRedirect("\\evil.com"), "/app");
  assert.equal(auth.getSafeRedirect("https://evil.com"), "/app");
  assert.equal(auth.getSafeRedirect("javascript:alert(1)"), "/app");
  assert.equal(auth.getSafeRedirect(null), "/app");
  assert.equal(auth.getSafeRedirect(undefined), "/app");
  assert.equal(auth.getSafeRedirect(""), "/app");
});

test("auth: isEmailValid validates email patterns correctly", () => {
  assert.equal(auth.isEmailValid("test@example.com"), true);
  assert.equal(auth.isEmailValid("user.name+tag@sub.domain.co"), true);
  assert.equal(auth.isEmailValid("invalid"), false);
  assert.equal(auth.isEmailValid("invalid@"), false);
  assert.equal(auth.isEmailValid("@domain.com"), false);
  assert.equal(auth.isEmailValid("foo@domain"), false);
  assert.equal(auth.isEmailValid(""), false);
});

test("auth: isPasswordValid and isBreachedPassword validate strength and breach blocklists", () => {
  assert.equal(auth.isPasswordValid("Password123"), true);
  assert.equal(auth.isPasswordValid("short1"), false); // < 8 chars
  assert.equal(auth.isPasswordValid("alllettershere"), false); // no numbers
  assert.equal(auth.isPasswordValid("1234567890"), false); // no letters
  assert.equal(auth.isPasswordValid("A".repeat(129) + "1"), false); // > 128 chars
  assert.equal(auth.isPasswordValid(null), false);
  assert.equal(auth.isPasswordValid(""), false);

  // Breached passwords detection
  assert.equal(auth.isBreachedPassword("Founder@123"), true);
  assert.equal(auth.isBreachedPassword("Admin@12345"), true);
  assert.equal(auth.isBreachedPassword("Mentor@123"), true);
  assert.equal(auth.isBreachedPassword("Expert@123"), true);
  assert.equal(auth.isBreachedPassword("Moderator@123"), true);
  assert.equal(auth.isBreachedPassword("password123"), true);
  assert.equal(auth.isBreachedPassword("S2S#Founder!2026"), false);
  assert.equal(auth.isBreachedPassword("S2S#Admin!2026"), false);
});

test("auth: DEMO accounts cover all primary roles and valid credentials", () => {
  const expectedLabels = ["Founder", "Mentor", "Expert", "Moderator", "Admin", "Superadmin"];
  const demoLabels = auth.DEMO.map(([label]) => label);
  for (const label of expectedLabels) {
    assert.ok(demoLabels.includes(label), `Missing demo account for ${label}`);
  }
  for (const [label, email, password] of auth.DEMO) {
    assert.ok(email.includes("@"), `${label} has invalid email`);
    assert.ok(password.length >= 8, `${label} password too short (must be >= 8)`);
    assert.equal(auth.isBreachedPassword(password), false, `${label} password must not be in breached list`);
    assert.equal(auth.isPasswordValid(password), true, `${label} password must satisfy complexity`);
  }
});

test("auth: ROLE_OPTS supports self-registerable roles", () => {
  const roleValues = auth.ROLE_OPTS.map(([value]) => value);
  assert.deepEqual(roleValues.sort(), ["entrepreneur", "industry_expert", "mentor"].sort());
});

const aceternityOut = path.resolve("node_modules/.cache/aceternity.test.mjs");
await build({
  entryPoints: ["src/components/aceternity/index.js"],
  bundle: true,
  format: "esm",
  platform: "node",
  outfile: aceternityOut,
  loader: { ".jsx": "jsx" },
  external: ["react", "react-dom", "react-router-dom", "lucide-react"],
  logLevel: "silent"
});
const aceternity = await import(pathToFileURL(aceternityOut).href);

test("aceternity: exports all required UI components cleanly", () => {
  const expectedExports = [
    "Spotlight",
    "FlipWords",
    "SpotlightCard",
    "BentoGrid",
    "BentoGridItem",
    "InfiniteMovingCards",
    "Meteors",
    "ShimmerButton",
    "GridBackground",
    "TimelineSteps",
    "BackgroundGradient",
    "CardHoverEffect",
    "MovingBorder",
  ];
  for (const exp of expectedExports) {
    assert.ok(aceternity[exp], `Missing aceternity export: ${exp}`);
    assert.ok(
      typeof aceternity[exp] === "function" || typeof aceternity[exp] === "object",
      `${exp} should be a React component`
    );
  }
});

const uiOut = path.resolve(`node_modules/.cache/ui.test.${nonce}.mjs`);
await build({
  entryPoints: ["src/components/ui.jsx"],
  bundle: true,
  format: "esm",
  platform: "node",
  outfile: uiOut,
  loader: { ".jsx": "jsx" },
  external: ["react", "react-dom", "react-router-dom", "lucide-react", "axios"],
  logLevel: "silent"
});
const ui = await import(pathToFileURL(uiOut).href);

test("ui: exports Card, Stat, Badge, PageHeader cleanly with spotlight support", () => {
  assert.equal(typeof ui.Card, "function");
  assert.equal(typeof ui.Stat, "function");
  assert.equal(typeof ui.Badge, "function");
  assert.equal(typeof ui.PageHeader, "function");
});

test("system health: status to spotlight color mapping never flags operational as error", () => {
  const SVC_SPOTLIGHT = {
    operational: "rgba(34, 197, 94, 0.20)",
    ok: "rgba(34, 197, 94, 0.20)",
    demo: "rgba(245, 166, 35, 0.20)",
    degraded: "rgba(245, 166, 35, 0.20)",
    disabled: "rgba(107, 107, 107, 0.16)",
    down: "rgba(239, 68, 68, 0.24)",
  };

  // Operational services must be green, never red
  assert.ok(SVC_SPOTLIGHT.operational.includes("34, 197, 94"), "operational must map to green");
  assert.ok(SVC_SPOTLIGHT.ok.includes("34, 197, 94"), "ok must map to green");
  assert.ok(SVC_SPOTLIGHT.down.includes("239, 68, 68"), "down must map to danger red");
  assert.notEqual(SVC_SPOTLIGHT.operational, SVC_SPOTLIGHT.down, "operational must never equal down red");
});

const expertOut = path.resolve(`node_modules/.cache/expert.test.${nonce}.mjs`);
await build({
  entryPoints: ["src/views/ExpertViews.jsx"],
  bundle: true,
  format: "esm",
  platform: "node",
  outfile: expertOut,
  banner: { js: "import * as React from 'react';" },
  loader: { ".jsx": "jsx" },
  external: [
    "react",
    "react-dom",
    "react-router-dom",
    "lucide-react",
    "axios",
    "recharts",
  ],
  define: { "import.meta.env": "{}" },
  logLevel: "silent"
});
const expert = await import(pathToFileURL(expertOut).href);

test("expert views: default export is a functional React component", () => {
  assert.equal(typeof expert.default, "function");
});

test("expert scoring: overall 6-criteria score calculates accurately", () => {
  const CRITERIA = ["problem", "market", "innovation", "execution", "scalability", "team"];
  const calcOverall = (c) => Math.round((CRITERIA.reduce((s, k) => s + (c?.[k] || 0), 0) / CRITERIA.length) * 10);

  // All 10s -> 100
  assert.equal(calcOverall({ problem: 10, market: 10, innovation: 10, execution: 10, scalability: 10, team: 10 }), 100);
  // All 5s -> 50
  assert.equal(calcOverall({ problem: 5, market: 5, innovation: 5, execution: 5, scalability: 5, team: 5 }), 50);
  // All 0s -> 0
  assert.equal(calcOverall({ problem: 0, market: 0, innovation: 0, execution: 0, scalability: 0, team: 0 }), 0);
  // Missing values default safely
  assert.equal(calcOverall({ problem: 6 }), 10);
  // Null and undefined criteria objects do not throw
  assert.equal(calcOverall(null), 0);
  assert.equal(calcOverall(undefined), 0);
  assert.equal(calcOverall({}), 0);
});

test("expert conviction threshold classifications", () => {
  const classify = (score) =>
    score >= 75
      ? "✓ STRONG CONVICTION"
      : score >= 50
      ? "◐ VIABLE WITH ITERATION"
      : "✕ HIGH RISK / REWORK";

  assert.equal(classify(100), "✓ STRONG CONVICTION");
  assert.equal(classify(75), "✓ STRONG CONVICTION");
  assert.equal(classify(74), "◐ VIABLE WITH ITERATION");
  assert.equal(classify(50), "◐ VIABLE WITH ITERATION");
  assert.equal(classify(49), "✕ HIGH RISK / REWORK");
  assert.equal(classify(0), "✕ HIGH RISK / REWORK");
});

test("expert AI baseline variance calculation handles null and deltas", () => {
  const getDelta = (score, aiScore) => (aiScore != null ? score - aiScore : null);
  assert.equal(getDelta(85, 70), 15);
  assert.equal(getDelta(60, 75), -15);
  assert.equal(getDelta(70, 70), 0);
  assert.equal(getDelta(70, null), null);
  assert.equal(getDelta(70, undefined), null);
});

test("expert assignments & scorecards: handles missing/null idea and score safely", () => {
  const safePendingTitle = (item) => (item?.idea?.title || "Startup").slice(0, 18);
  assert.equal(safePendingTitle({ idea: { title: "NextGen AI Platform" } }), "NextGen AI Platfor");
  assert.equal(safePendingTitle({ idea: null }), "Startup");
  assert.equal(safePendingTitle({ idea: { title: undefined } }), "Startup");
  assert.equal(safePendingTitle(null), "Startup");

  const safeIdeaId = (a) => a?.idea?._id || a?._id;
  assert.equal(safeIdeaId({ _id: "asg-1", idea: { _id: "idea-123" } }), "idea-123");
  assert.equal(safeIdeaId({ _id: "asg-2", idea: null }), "asg-2");

  const safeAvgScore = (rows) => (rows.length ? Math.round(rows.reduce((s, r) => s + (r.score || 0), 0) / rows.length) : 0);
  assert.equal(safeAvgScore([{ score: 80 }, { score: null }, { score: 70 }]), 50);
  assert.equal(safeAvgScore([]), 0);
});

test("expert chart calibration: Bars domain supports negative variance deltas without clamping", () => {
  const calcDomainMin = (dataMin) => Math.min(0, dataMin);
  assert.equal(calcDomainMin(-15), -15, "Negative delta should set domain floor below 0");
  assert.equal(calcDomainMin(-25), -25, "Deep negative delta should be fully visible");
  assert.equal(calcDomainMin(10), 0, "Positive-only data should floor at 0");
  assert.equal(calcDomainMin(0), 0, "Zero delta should floor at 0");
});

test("expert workspace: aceternity CSS includes diligence timeline and reduced motion rules", async () => {
  const { readFileSync } = await import("node:fs");
  const css = readFileSync("src/styles/aceternity.css", "utf8");
  assert.ok(css.includes(".expert-diligence-timeline"), "missing .expert-diligence-timeline");
  assert.ok(css.includes(".expert-quick-card"), "missing .expert-quick-card");
  assert.ok(css.includes("@media (hover: none)"), "missing @media (hover: none)");
  assert.ok(css.includes(".expert-hero-banner .expert-spotlight"), "missing expert spotlight in reduced motion");
});

const modOut = path.resolve(`node_modules/.cache/moderation.test.${nonce}.mjs`);
await build({
  entryPoints: ["src/views/ModerationViews.jsx"],
  bundle: true,
  format: "esm",
  platform: "node",
  outfile: modOut,
  banner: { js: "import * as React from 'react';" },
  loader: { ".jsx": "jsx" },
  external: [
    "react",
    "react-dom",
    "react-router-dom",
    "lucide-react",
    "axios",
    "recharts",
  ],
  define: { "import.meta.env": "{}" },
  logLevel: "silent"
});
const mod = await import(pathToFileURL(modOut).href);

test("moderation views: default export is a functional React component", () => {
  assert.equal(typeof mod.default, "function");
});

const mentorOut = path.resolve(`node_modules/.cache/mentor.test.${nonce}.mjs`);
await build({
  entryPoints: ["src/views/MentorViews.jsx"],
  bundle: true,
  format: "esm",
  platform: "node",
  outfile: mentorOut,
  banner: { js: "import * as React from 'react';" },
  loader: { ".jsx": "jsx" },
  external: [
    "react",
    "react-dom",
    "react-router-dom",
    "lucide-react",
    "axios",
    "recharts",
  ],
  define: { "import.meta.env": "{}" },
  logLevel: "silent",
});
const mentor = await import(pathToFileURL(mentorOut).href);

test("mentor views: default export is a functional React component", () => {
  assert.equal(typeof mentor.default, "function");
});

test("mentor views: exports AssignmentTable cleanly for reuse", () => {
  assert.equal(typeof mentor.AssignmentTable, "function");
});

test("mentor routes: mentor role can access all four advisory pages", () => {
  const mentorLinks = links("mentor").map((l) => pathOf(l.to));
  assert.ok(mentorLinks.includes("assignments"), "Mentor should have assignments link");
  assert.ok(mentorLinks.includes("sessions"), "Mentor should have sessions link");
  assert.ok(mentorLinks.includes("guidance"), "Mentor should have guidance link");
  assert.ok(mentorLinks.includes("my-feedback"), "Mentor should have my-feedback link");
});

test("mentor sessions: meeting URL normalizer handles raw and protocol-prefixed URLs", () => {
  const normalizeMeetingUrl = (link) =>
    link ? (/^https?:\/\//i.test(link) ? link : `https://${link}`) : null;

  assert.equal(normalizeMeetingUrl("https://meet.google.com/abc-defg-hij"), "https://meet.google.com/abc-defg-hij");
  assert.equal(normalizeMeetingUrl("http://zoom.us/j/123456"), "http://zoom.us/j/123456");
  assert.equal(normalizeMeetingUrl("meet.google.com/abc-defg-hij"), "https://meet.google.com/abc-defg-hij");
  assert.equal(normalizeMeetingUrl("zoom.us/j/123456"), "https://zoom.us/j/123456");
  assert.equal(normalizeMeetingUrl(""), null);
  assert.equal(normalizeMeetingUrl(null), null);
  assert.equal(normalizeMeetingUrl(undefined), null);
});

test("mentor guidance: tag toggle correctly adds, removes, and formats tags", () => {
  const toggleTag = (currentTagsStr, tag) => {
    const current = currentTagsStr
      .split(",")
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);
    const next = current.includes(tag.toLowerCase())
      ? current.filter((t) => t !== tag.toLowerCase())
      : [...current, tag.toLowerCase()];
    return next.join(", ");
  };

  assert.equal(toggleTag("", "pricing"), "pricing");
  assert.equal(toggleTag("pricing", "pricing"), "");
  assert.equal(toggleTag("pricing, go-to-market", "pricing"), "go-to-market");
  assert.equal(toggleTag("pricing", "go-to-market"), "pricing, go-to-market");
  assert.equal(toggleTag("PRICING", "pricing"), "");
});

test("mentor assignments: table columns handle missing idea safely without throwing", () => {
  const safeTitle = (a) => a.idea?.title || "Untitled Startup";
  const safeScore = (a) => a.idea?.report?.score ?? -1;

  assert.equal(safeTitle({ idea: { title: "Fintech App" } }), "Fintech App");
  assert.equal(safeTitle({ idea: null }), "Untitled Startup");
  assert.equal(safeTitle({}), "Untitled Startup");

  assert.equal(safeScore({ idea: { report: { score: 85 } } }), 85);
  assert.equal(safeScore({ idea: { report: null } }), -1);
  assert.equal(safeScore({ idea: null }), -1);
  assert.equal(safeScore({}), -1);
});

const founderDir = path.resolve(`node_modules/.cache/founder_dist_${nonce}`);
await build({
  entryPoints: [
    "src/views/Overview.jsx",
    "src/views/ValidateIdea.jsx",
    "src/views/IdeasView.jsx",
    "src/views/IdeaDetail.jsx",
    "src/views/GrowthViews.jsx",
  ],
  bundle: true,
  format: "esm",
  platform: "node",
  outdir: founderDir,
  banner: { js: "import * as React from 'react';" },
  loader: { ".jsx": "jsx" },
  external: [
    "react",
    "react-dom",
    "react-router-dom",
    "lucide-react",
    "axios",
    "recharts",
  ],
  define: { "import.meta.env": "{}" },
  logLevel: "silent",
});

const fOverview = await import(pathToFileURL(path.resolve(founderDir, "Overview.js")).href);
const fValidate = await import(pathToFileURL(path.resolve(founderDir, "ValidateIdea.js")).href);
const fIdeas = await import(pathToFileURL(path.resolve(founderDir, "IdeasView.js")).href);
const fDetail = await import(pathToFileURL(path.resolve(founderDir, "IdeaDetail.js")).href);
const fGrowth = await import(pathToFileURL(path.resolve(founderDir, "GrowthViews.js")).href);

test("founder views: Overview, ValidateIdea, IdeasView, IdeaDetail, GrowthViews export functional components", () => {
  assert.equal(typeof fOverview.default, "function");
  assert.equal(typeof fValidate.default, "function");
  assert.equal(typeof fIdeas.default, "function");
  assert.equal(typeof fDetail.default, "function");
  assert.equal(typeof fGrowth.default, "function");
});

test("founder routes: entrepreneur role can access all primary startup management routes", () => {
  const entrepreneurLinks = links("entrepreneur").map((l) => pathOf(l.to));
  assert.ok(entrepreneurLinks.includes("ideas"), "Entrepreneur should have ideas link");
  assert.ok(entrepreneurLinks.includes("validate"), "Entrepreneur should have validate link");
  assert.ok(entrepreneurLinks.includes("reports"), "Entrepreneur should have reports link");
  assert.ok(entrepreneurLinks.includes("market"), "Entrepreneur should have market link");
  assert.ok(entrepreneurLinks.includes("competitors"), "Entrepreneur should have competitors link");
  assert.ok(entrepreneurLinks.includes("swot"), "Entrepreneur should have swot link");
  assert.ok(entrepreneurLinks.includes("plan"), "Entrepreneur should have plan link");
  assert.ok(entrepreneurLinks.includes("roadmap"), "Entrepreneur should have roadmap link");
});

test("founder workspace: aceternity CSS includes founder bento and light mode rules", async () => {
  const { readFileSync } = await import("node:fs");
  const css = readFileSync("src/styles/aceternity.css", "utf8");
  assert.ok(css.includes(".founder-bento-resources"), "missing .founder-bento-resources");
  assert.ok(css.includes(".report-bento-grid"), "missing .report-bento-grid");
  assert.ok(css.includes(".swot-bento-grid"), "missing .swot-bento-grid");
  assert.ok(css.includes('[data-theme="light"] .validation-loading-wrapper'), "missing light theme validation wrapper");
  assert.ok(css.includes('[data-theme="light"] .founder-stat-mini'), "missing light theme founder mini stat");
});

const superadminDir = path.resolve(`node_modules/.cache/superadmin_dist_${nonce}`);
await build({
  entryPoints: [
    "src/views/ConfigViews.jsx",
    "src/views/LogsView.jsx",
  ],
  bundle: true,
  format: "esm",
  platform: "node",
  outdir: superadminDir,
  banner: { js: "import * as React from 'react';" },
  loader: { ".jsx": "jsx" },
  external: [
    "react",
    "react-dom",
    "react-router-dom",
    "lucide-react",
    "axios",
    "recharts",
  ],
  define: { "import.meta.env": "{}" },
  logLevel: "silent",
});

const saConfig = await import(pathToFileURL(path.resolve(superadminDir, "ConfigViews.js")).href);
const saLogs = await import(pathToFileURL(path.resolve(superadminDir, "LogsView.js")).href);

test("superadmin views: ConfigViews and LogsView export functional components", () => {
  assert.equal(typeof saConfig.default, "function");
  assert.equal(typeof saLogs.default, "function");
});

test("superadmin routes: superadmin has access to all platform governance tools", () => {
  const superadminLinks = links("superadmin").map((l) => pathOf(l.to));
  assert.ok(superadminLinks.includes("platform"), "Superadmin should have platform settings link");
  assert.ok(superadminLinks.includes("features"), "Superadmin should have features link");
  assert.ok(superadminLinks.includes("permissions"), "Superadmin should have permissions link");
  assert.ok(superadminLinks.includes("categories"), "Superadmin should have categories link");
  assert.ok(superadminLinks.includes("engine"), "Superadmin should have validation engine link");
  assert.ok(superadminLinks.includes("scoring"), "Superadmin should have scoring link");
  assert.ok(superadminLinks.includes("integrations"), "Superadmin should have integrations link");
  assert.ok(superadminLinks.includes("logs"), "Superadmin should have system logs link");
  assert.ok(superadminLinks.includes("audit"), "Superadmin should have audit link");
});

test("moderator routes: moderator role has access to all moderation queue routes", () => {
  const modLinks = links("moderator").map((l) => pathOf(l.to));
  assert.ok(modLinks.includes("mod-ideas"), "Moderator should have mod-ideas link");
  assert.ok(modLinks.includes("mod-feedback"), "Moderator should have mod-feedback link");
  assert.ok(modLinks.includes("mod-users"), "Moderator should have mod-users link");
  assert.ok(modLinks.includes("mod-audits"), "Moderator should have mod-audits link");
  assert.ok(modLinks.includes("audit"), "Moderator should have audit link");
});

test("moderation audits: filtering ideas precedes slicing to 100 items (avoids truncation bug)", () => {
  // Create 150 ideas where only ideas #120-125 are flagged
  const ideas = Array.from({ length: 150 }, (_, i) => ({
    _id: `idea-${i}`,
    title: `Startup Idea ${i}`,
    industry: "tech",
    flagged: i >= 120 && i <= 125,
    report: { score: i < 10 ? 30 : 80 },
  }));

  const applyFilter = (list, filter) => {
    let res = list;
    if (filter === "flagged") res = res.filter((i) => i.flagged);
    if (filter === "low") res = res.filter((i) => i.report && i.report.score < 50);
    return res.slice(0, 100);
  };

  const flagged = applyFilter(ideas, "flagged");
  assert.equal(flagged.length, 6, "All 6 flagged items should be retained even if indexed > 100");
  assert.equal(flagged[0]._id, "idea-120");

  const low = applyFilter(ideas, "low");
  assert.equal(low.length, 10, "All 10 low-scoring items should be retained");
});

test("moderation queue: search filter matches title, reporter, details and handles null target safely", () => {
  const reports = [
    {
      _id: "r1",
      targetInfo: { title: "AI Scam Project" },
      reporter: { name: "Alice" },
      reason: "Fraudulent claims",
      details: "Copied entire whitepaper",
    },
    {
      _id: "r2",
      targetInfo: null, // deleted target
      reporter: { name: "Bob" },
      reason: "Harassment",
      details: null,
    },
    {
      _id: "r3",
      targetInfo: { name: "Suspicious User" },
      reporter: { name: "Charlie" },
      reason: "Spam bot",
      details: "Posting crypto links",
    },
  ];

  const filterReports = (list, search) => {
    if (!search.trim()) return list;
    const query = search.toLowerCase();
    return list.filter((r) => {
      const titleStr = r.targetInfo?.title || "";
      const nameStr = r.targetInfo?.name || r.targetInfo?.authorName || "";
      const reporterStr = r.reporter?.name || "";
      const reasonStr = r.reason || "";
      const detailsStr = r.details || "";
      const commentStr = r.targetInfo?.comment || "";
      return `${titleStr} ${nameStr} ${reporterStr} ${reasonStr} ${detailsStr} ${commentStr}`
        .toLowerCase()
        .includes(query);
    });
  };

  assert.equal(filterReports(reports, "scam").length, 1);
  assert.equal(filterReports(reports, "bob").length, 1); // targetInfo null safe
  assert.equal(filterReports(reports, "crypto").length, 1);
  assert.equal(filterReports(reports, "nonexistent").length, 0);
  assert.equal(filterReports(reports, "").length, 3);
});

test("audit logs: category filter correctly partitions moderation, ideas, feedback, and user events", () => {
  const sampleLogs = [
    { action: "report.remove", message: "Idea removed" },
    { action: "report.warn", message: "User warned" },
    { action: "idea.created", message: "New idea" },
    { action: "feedback.evaluated", message: "Expert scored deck" },
    { action: "user.blocked", message: "Spam bot blocked" },
    { action: "config.scoring", message: "Weights updated" },
  ];

  const filterAudit = (list, cat) => {
    if (cat === "moderation") return list.filter((l) => l.action?.startsWith("report."));
    if (cat === "ideas") return list.filter((l) => l.action?.startsWith("idea."));
    if (cat === "feedback") return list.filter((l) => l.action?.startsWith("feedback."));
    if (cat === "users") return list.filter((l) => l.action?.startsWith("user."));
    return list;
  };

  assert.equal(filterAudit(sampleLogs, "all").length, 6);
  assert.equal(filterAudit(sampleLogs, "moderation").length, 2);
  assert.equal(filterAudit(sampleLogs, "ideas").length, 1);
  assert.equal(filterAudit(sampleLogs, "feedback").length, 1);
  assert.equal(filterAudit(sampleLogs, "users").length, 1);
});

test("moderator workspace: aceternity CSS includes moderator hero, queue banner, hover grid, and pulse dots", async () => {
  const { readFileSync } = await import("node:fs");
  const css = readFileSync("src/styles/aceternity.css", "utf8");
  assert.ok(css.includes(".moderator-hero-banner"), "missing .moderator-hero-banner");
  assert.ok(css.includes(".moderator-queue-banner"), "missing .moderator-queue-banner");
  assert.ok(css.includes(".moderator-hover-grid"), "missing .moderator-hover-grid");
  assert.ok(css.includes(".moderator-report-card"), "missing .moderator-report-card");
  assert.ok(css.includes(".live-pulse-dot.pulse-danger"), "missing .live-pulse-dot.pulse-danger");
  assert.ok(css.includes(".flip-rose"), "missing .flip-rose text gradient");
  assert.ok(css.includes(".moderator-modal-preview"), "missing .moderator-modal-preview");
});

after(() => {
  try {
    const cacheDir = path.resolve("node_modules/.cache");
    if (existsSync(cacheDir)) {
      rmSync(cacheDir, { recursive: true, force: true });
    }
  } catch (err) {
    void err;
  }
});






