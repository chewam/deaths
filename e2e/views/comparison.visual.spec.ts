import { test, expect } from "../fixtures"

test.describe("Comparison view — visual regression", () => {
  test("renders default state with sample data on /playground", async ({
    page,
  }) => {
    await page.goto("/playground")
    await page.waitForLoadState("networkidle")
    await page.evaluate(() => document.fonts.ready)

    await page.addStyleTag({
      content: "header { position: static !important; }",
    })

    const view = page.getByTestId("view-comparison")
    await expect(view).toBeVisible()

    await expect(view).toHaveScreenshot("comparison-default.png")
  })
})
