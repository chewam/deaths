import { test, expect } from "../fixtures"

test.describe("OverviewGrid — visual regression", () => {
  test("renders default state with sample data on /playground", async ({
    page,
  }) => {
    await page.goto("/playground")
    await page.waitForLoadState("networkidle")
    await page.evaluate(() => document.fonts.ready)

    // The grid is taller than the viewport, so Playwright stitches the
    // screenshot across multiple scroll positions. Strip the sticky header so
    // it does not bleed into the captured frames.
    await page.addStyleTag({
      content: "header { position: static !important; }",
    })

    const view = page.getByTestId("view-overview-grid")
    await expect(view).toBeVisible()

    await expect(view).toHaveScreenshot("overview-grid-default.png")
  })
})
