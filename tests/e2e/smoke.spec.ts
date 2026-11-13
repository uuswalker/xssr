import { test, expect } from "@playwright/test";

const ROUTES = [
  "/",
  "/wifi-solo/",
  "/wifi-surakarta/",
  "/wifi-sukoharjo/",
  "/wifi-karanganyar/",
  "/wifi-klaten/",
  "/wifi-boyolali/",
  "/area-layanan/",
  "/tes-kecepatan/",
  "/kebijakan-privasi/",
];

for (const route of ROUTES) {
  test(`halaman ${route} termuat dengan h1`, async ({ page }) => {
    const res = await page.goto(route);
    expect(res?.status()).toBe(200);
    await expect(page.locator("h1").first()).toBeVisible();
  });
}

test("beranda tidak menampilkan error JavaScript", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  expect(errors).toEqual([]);
});

test("tautan WhatsApp mengarah ke wa.me", async ({ page }) => {
  await page.goto("/");
  const hrefs = await page
    .locator('a[href*="wa.me"]')
    .evaluateAll((els) => els.map((e) => (e as HTMLAnchorElement).href));
  expect(hrefs.length).toBeGreaterThan(0);
  for (const href of hrefs) {
    expect(href).toMatch(/^https:\/\/wa\.me\//);
  }
});

test("robots.txt dan sitemap.xml tersedia", async ({ request }) => {
  for (const path of ["/robots.txt", "/sitemap.xml"]) {
    const res = await request.get(path);
    expect(res.status(), path).toBe(200);
  }
});
