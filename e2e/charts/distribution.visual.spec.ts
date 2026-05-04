import { test, expect } from "../fixtures"

test.describe("DistributionChart — visual regression", () => {
  test("renders default state (gender=all, no hover) on /playground", async ({
    page,
  }) => {
    await page.goto("/playground")
    await page.waitForLoadState("networkidle")
    await page.evaluate(() => document.fonts.ready)

    const chart = page.getByTestId("chart-distribution")
    await expect(chart).toBeVisible()

    await expect(chart).toHaveScreenshot("distribution-default.png")
  })
})
