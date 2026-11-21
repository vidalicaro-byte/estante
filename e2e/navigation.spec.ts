import { expect, test } from "@playwright/test";
import { gotoHydrated } from "./helpers";

test.describe("navigation", () => {
  test("clicking a card opens the book page", async ({ page }) => {
    await gotoHydrated(page, "/");

    const link = page.locator("article h3 a").first();
    const title = (await link.textContent())?.trim();
    await link.click();

    await expect(page).toHaveURL(/\/livros\/OL\d+W$/);
    await expect(page.getByRole("heading", { level: 1, name: title })).toBeVisible();
  });

  test("a genre chip opens the genre page", async ({ page }) => {
    await gotoHydrated(page, "/");

    await page.getByRole("link", { name: "Clássicos" }).click();

    await expect(page).toHaveURL("/generos/classicos");
    await expect(page.getByRole("heading", { level: 1, name: "Clássicos" })).toBeVisible();
    await expect(page.getByRole("heading", { level: 2, name: "Homero" })).toBeVisible();
  });

  test("the skip link moves focus to the main content", async ({ page }) => {
    await gotoHydrated(page, "/");

    await page.keyboard.press("Tab");
    const skip = page.getByRole("link", { name: "Pular para o conteúdo" });
    await expect(skip).toBeFocused();

    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/#conteudo$/);
  });
});
