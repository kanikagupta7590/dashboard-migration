// Smoke test: load new role dashboards, assert no console/page errors.
// Usage: node scripts/smoke-dashboards.mjs
import { chromium } from "playwright";

const BASE = process.env.SMOKE_BASE_URL ?? "http://localhost:8080";
const ROUTES = ["/dashboard/developer", "/dashboard/dev-manager", "/dashboard/promise-tracker"];

const results = [];
const browser = await chromium.launch({ headless: true });
try {
  for (const path of ROUTES) {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const page = await ctx.newPage();
    const errors = [];
    page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
    page.on("pageerror", (e) => errors.push(String(e.message ?? e)));
    const resp = await page.goto(BASE + path, { waitUntil: "domcontentloaded", timeout: 30000 });
    await page.waitForLoadState("networkidle", { timeout: 15000 }).catch(() => {});
    const status = resp?.status() ?? 0;
    const hasSidebar = await page.locator('aside').first().isVisible().catch(() => false);
    results.push({ path, status, errors, hasSidebar });
    await ctx.close();
  }
} finally {
  await browser.close();
}

let failed = 0;
for (const r of results) {
  const ok = r.status === 200 && r.errors.length === 0 && r.hasSidebar;
  if (!ok) failed++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${r.path}  status=${r.status}  errors=${r.errors.length}  sidebar=${r.hasSidebar}`);
  for (const e of r.errors) console.log("   •", e);
}
process.exit(failed ? 1 : 0);