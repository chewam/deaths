import { test, expect } from "../fixtures"

test.describe("TrendChart — visual regression", () => {
  test("renders default state (area, no hover) on /playground", async ({
    page,
  }) => {
    await page.goto("/playground")
    await page.waitForLoadState("networkidle")
    await page.evaluate(() => document.fonts.ready)

    const chart = page.getByTestId("chart-trend")
    await expect(chart).toBeVisible()

    await expect(chart).toHaveScreenshot("trend-default.png")
  })
})
