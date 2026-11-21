import { expect, test } from "@playwright/test";
import { gotoHydrated } from "./helpers";

// Cards link to the book page through a stretched link. The heart sits above it and
// must only toggle the favorite, never navigate. This regressed twice during development.
test.describe("favorites", () => {
  test("the heart on a card favorites the book without leaving the page", async ({ page }) => {
    await gotoHydrated(page, "/");

    const heart = page.getByRole("button", { name: /^Favoritar / }).first();
    await expect(heart).toHaveAttribute("aria-pressed", "false");

    await heart.click();

    await expect(page).toHaveURL("/");
    await expect(heart).toHaveAttribute("aria-pressed", "true");
    await expect(page.getByRole("link", { name: "Favoritos (1)" }).first()).toBeVisible();
  });

  test("favorites survive a reload and show up on the favorites page", async ({ page }) => {
    await gotoHydrated(page, "/");
    await page
      .getByRole("button", { name: /^Favoritar / })
      .first()
      .click();

    await page.goto("/favoritos");
    await expect(page.getByText("1 livro salvo")).toBeVisible();

    await page.reload();
    await expect(page.getByText("1 livro salvo")).toBeVisible();
  });

  test("a favorite can be removed", async ({ page }) => {
    await gotoHydrated(page, "/");
    const heart = page.getByRole("button", { name: /^Favoritar / }).first();
    await heart.click();
    await expect(heart).toHaveAttribute("aria-pressed", "true");

    await heart.click();

    await expect(heart).toHaveAttribute("aria-pressed", "false");
    await page.goto("/favoritos");
    await expect(page.getByText("Sua estante está vazia")).toBeVisible();
  });
});
