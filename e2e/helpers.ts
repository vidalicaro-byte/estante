import type { Page } from "@playwright/test";

/**
 * Opens a page and waits for the network to settle. The pages are server-rendered, so
 * clicking right after navigation can happen before React hydrates and the click would
 * be lost, which makes tests flaky.
 */
export async function gotoHydrated(page: Page, url: string) {
  await page.goto(url);
  await page.waitForLoadState("networkidle");
}
