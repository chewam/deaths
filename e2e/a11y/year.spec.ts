import { expect, test } from "@playwright/test"

import { expectNoBlockingA11yViolations } from "./_helpers"

test.describe("a11y — /overview (Year view)", () => {
  test("axe-core: no serious/critical violations", async ({ page }) => {
    await page.goto("/overview")
    await expect(page.getByTestId("view-year")).toBeVisible({ timeout: 10_000 })
    await expect(page.getByTestId("year-trend")).toBeVisible()
    await expect(page.getByTestId("year-monthly")).toBeVisible()
    await expectNoBlockingA11yViolations(page)
  })

  test("scrubber: keyboard-navigable range with accessible name", async ({
    page,
  }) => {
    await page.goto("/overview")
    const scrubber = page.getByTestId("year-scrubber-input")
    await expect(scrubber).toBeVisible({ timeout: 10_000 })

    // Accessible name must come from the input itself, not just an adjacent label.
    const ariaLabel = await scrubber.getAttribute("aria-label")
    expect(ariaLabel ?? "", "scrubber must expose an aria-label").not.toBe("")

    const initialValue = await scrubber.inputValue()
    await scrubber.focus()
    await page.keyboard.press("ArrowLeft")
    const afterLeft = await scrubber.inputValue()
    expect(afterLeft).not.toBe(initialValue)

    await page.keyboard.press("Home")
    const min = await scrubber.getAttribute("min")
    expect(await scrubber.inputValue()).toBe(min)

    await page.keyboard.press("End")
    const max = await scrubber.getAttribute("max")
    expect(await scrubber.inputValue()).toBe(max)
  })
})
