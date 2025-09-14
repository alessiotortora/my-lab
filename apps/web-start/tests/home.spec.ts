import { expect, test } from "@playwright/test";

test("home page loads", async ({ page }) => {
	await page.goto("/");
	await expect(page).toHaveTitle(/TanStack Start Starter/i);
});
