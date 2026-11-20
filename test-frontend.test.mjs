// Run with: npm test
// Guards the bug class that plagued the old site: sidebar links that lead nowhere or to the wrong role's page.
import test from "node:test";
import assert from "node:assert/strict";
import { build } from "esbuild";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

mkdirSync("node_modules/.cache", { recursive: true });
const out = path.resolve("node_modules/.cache/registry.test.mjs"); // inside the project so react/lucide resolve
await build({ entryPoints: ["src/views/registry.jsx"], bundle: true, format: "esm", platform: "node", outfile: out, loader: { ".jsx": "jsx" }, external: ["react", "lucide-react", "./*.jsx"], logLevel: "silent" });
const { ROUTES, navFor } = await import(pathToFileURL(out).href);
const fmt = await import(pathToFileURL(path.resolve("src/lib/format.js")).href);

const authOut = path.resolve("node_modules/.cache/auth.test.mjs");
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

test("auth: isPasswordValid validates password strength rules", () => {
  assert.equal(auth.isPasswordValid("Password123"), true);
  assert.equal(auth.isPasswordValid("short1"), false); // < 8 chars
  assert.equal(auth.isPasswordValid("alllettershere"), false); // no numbers
  assert.equal(auth.isPasswordValid("1234567890"), false); // no letters
  assert.equal(auth.isPasswordValid("A".repeat(129) + "1"), false); // > 128 chars
  assert.equal(auth.isPasswordValid(null), false);
  assert.equal(auth.isPasswordValid(""), false);
});

test("auth: DEMO accounts cover all primary roles and valid credentials", () => {
  const expectedLabels = ["Founder", "Mentor", "Expert", "Moderator", "Admin", "Superadmin"];
  const demoLabels = auth.DEMO.map(([label]) => label);
  for (const label of expectedLabels) {
    assert.ok(demoLabels.includes(label), `Missing demo account for ${label}`);
  }
  for (const [label, email, password] of auth.DEMO) {
    assert.ok(email.includes("@"), `${label} has invalid email`);
    assert.ok(password.length >= 6, `${label} password too short`);
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
  ];
  for (const exp of expectedExports) {
    assert.ok(aceternity[exp], `Missing aceternity export: ${exp}`);
    assert.ok(
      typeof aceternity[exp] === "function" || typeof aceternity[exp] === "object",
      `${exp} should be a React component`
    );
  }
});
