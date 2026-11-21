import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const WCAG_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"];

for (const theme of ["light", "dark"] as const) {
  test.describe(`accessibility (${theme} theme)`, () => {
    test.beforeEach(async ({ page }) => {
      // Same key as the theme toggle; the inline script applies it before first paint.
      await page.addInitScript((value) => localStorage.setItem("estante:theme", value), theme);
    });

    test("home has no WCAG A/AA violations", async ({ page }) => {
      await page.goto("/");
      await expect(page.locator("article").first()).toBeVisible();

      const results = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();

      expect(results.violations).toEqual([]);
    });

    test("book page has no WCAG A/AA violations", async ({ page }) => {
      await page.goto("/");
      await page.locator("article h3 a").first().click();
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

      const results = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();

      expect(results.violations).toEqual([]);
    });
  });
}
