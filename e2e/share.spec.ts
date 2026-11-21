import { expect, test } from "@playwright/test";
import { gotoHydrated } from "./helpers";

test.describe("share", () => {
  test.use({ permissions: ["clipboard-read", "clipboard-write"] });

  test("copies the clean link of the book page", async ({ page }) => {
    await gotoHydrated(page, "/");
    await page.locator("article h3 a").first().click();
    await expect(page).toHaveURL(/\/livros\/OL\d+W$/);

    // Extra query string and hash must not end up in the shared link.
    const { origin, pathname } = new URL(page.url());
    await gotoHydrated(page, `${pathname}?utm_source=teste#topo`);

    await page.getByRole("button", { name: "Compartilhar" }).click();

    await expect(page.getByRole("status")).toHaveText("Link copiado");
    const copied = await page.evaluate(() => navigator.clipboard.readText());
    expect(copied).toBe(`${origin}${pathname}`);
  });
});
