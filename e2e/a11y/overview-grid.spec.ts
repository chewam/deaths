import { expect, test } from "@playwright/test"

import { expectNoBlockingA11yViolations } from "./_helpers"

test.describe("a11y — / (OverviewGrid)", () => {
  test("axe-core: no serious/critical violations", async ({ page }) => {
    await page.goto("/")
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible()
    await expect(page.locator("[data-year]").first()).toBeVisible({
      timeout: 10_000,
    })
    await expectNoBlockingA11yViolations(page)
  })
})
