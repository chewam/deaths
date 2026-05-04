import { test, expect } from "../fixtures"

test.describe("Year view — visual regression", () => {
  test("renders default state with sample data on /playground", async ({
    page,
  }) => {
    await page.goto("/playground")
    await page.waitForLoadState("networkidle")
    await page.evaluate(() => document.fonts.ready)

    // The view is taller than the viewport; strip the sticky header so it
    // does not bleed into stitched screenshot frames.
    await page.addStyleTag({
      content: "header { position: static !important; }",
    })

    const view = page.getByTestId("view-year")
    await expect(view).toBeVisible()

    await expect(view).toHaveScreenshot("year-default.png")
  })
})
