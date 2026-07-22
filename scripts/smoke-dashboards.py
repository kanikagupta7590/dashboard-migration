"""Smoke test: load new role dashboards and assert no console/page errors.

Usage:  python3 scripts/smoke-dashboards.py
Env:    SMOKE_BASE_URL (default http://localhost:8080)
"""
import asyncio, os, sys
from playwright.async_api import async_playwright

BASE = os.environ.get("SMOKE_BASE_URL", "http://localhost:8080")
ROUTES = ["/dashboard/developer", "/dashboard/dev-manager", "/dashboard/promise-tracker"]

async def check(browser, path):
    ctx = await browser.new_context(viewport={"width": 1280, "height": 900})
    page = await ctx.new_page()
    errors = []
    page.on("console", lambda m: errors.append(m.text) if m.type == "error" else None)
    page.on("pageerror", lambda e: errors.append(str(e)))
    resp = await page.goto(BASE + path, wait_until="domcontentloaded", timeout=30000)
    try:
        await page.wait_for_load_state("networkidle", timeout=15000)
    except Exception:
        pass
    status = resp.status if resp else 0
    try:
        sidebar = await page.locator("aside").first.is_visible()
    except Exception:
        sidebar = False
    await ctx.close()
    return {"path": path, "status": status, "errors": errors, "sidebar": sidebar}

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        try:
            results = [await check(browser, r) for r in ROUTES]
        finally:
            await browser.close()
    failed = 0
    for r in results:
        ok = r["status"] == 200 and not r["errors"] and r["sidebar"]
        failed += 0 if ok else 1
        print(f"{'PASS' if ok else 'FAIL'}  {r['path']}  status={r['status']}  errors={len(r['errors'])}  sidebar={r['sidebar']}")
        for e in r["errors"]:
            print("   \u2022", e)
    sys.exit(1 if failed else 0)

asyncio.run(main())