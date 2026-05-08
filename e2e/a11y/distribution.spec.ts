import { expect, test } from "@playwright/test"

import { expectNoBlockingA11yViolations } from "./_helpers"

test.describe("a11y — /distribution", () => {
  test("axe-core: no serious/critical violations", async ({ page }) => {
    await page.goto("/distribution")
    await expect(page.getByTestId("distribution-card")).toBeVisible({
      timeout: 10_000,
    })
    await expectNoBlockingA11yViolations(page)
  })

  test("AgeRange sliders: distinct labels + keyboard reachable", async ({
    page,
  }) => {
    await page.goto("/distribution")
    const handles = page.getByTestId("filter-age-range").getByRole("slider")
    await expect(handles).toHaveCount(2)

    const minLabel = await handles.first().getAttribute("aria-label")
    const maxLabel = await handles.last().getAttribute("aria-label")
    expect(minLabel ?? "").not.toBe("")
    expect(maxLabel ?? "").not.toBe("")
    expect(minLabel).not.toBe(maxLabel)

    await handles.first().focus()
    expect(
      await handles.first().evaluate((el) => el === document.activeElement)
    ).toBe(true)
  })
})
