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
