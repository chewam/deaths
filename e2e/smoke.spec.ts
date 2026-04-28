import { test, expect } from "./fixtures"

test.describe("smoke", () => {
  test("home renders with 200 + non-empty title", async ({ page }) => {
    const response = await page.goto("/")
    expect(response?.status()).toBe(200)
    await expect(page).toHaveTitle(/.+/)
  })
})
