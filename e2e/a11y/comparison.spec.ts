import { expect, test } from "@playwright/test"

import { expectNoBlockingA11yViolations } from "./_helpers"

test.describe("a11y — /comparison", () => {
  test("axe-core: no serious/critical violations", async ({ page }) => {
    await page.goto("/comparison")
    await expect(page.getByTestId("comparison-picker")).toBeVisible({
      timeout: 10_000,
    })
    await expect(page.getByTestId("comparison-compare")).toBeVisible()
    await expectNoBlockingA11yViolations(page)
  })
})
