import { test, expect } from "../fixtures"

test.describe("MonthlyChart — visual regression", () => {
  test("renders default state (single mode, no hover) on /playground", async ({
    page,
  }) => {
    await page.goto("/playground")
    await page.waitForLoadState("networkidle")
    await page.evaluate(() => document.fonts.ready)

    const chart = page.getByTestId("chart-monthly")
    await expect(chart).toBeVisible()

    await expect(chart).toHaveScreenshot("monthly-default.png")
  })
})
