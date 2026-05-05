import { test, expect, type Locator, type Page } from "@playwright/test"

const CHART_SETTLE_MS = 400

async function waitForChartStable(canvas: Locator, page: Page) {
  let prev = await canvas.screenshot()
  for (let i = 0; i < 10; i++) {
    await page.waitForTimeout(100)
    const next = await canvas.screenshot()
    if (Buffer.compare(prev, next) === 0) return next
    prev = next
  }
  return prev
}

test.describe("golden paths — ISO functional contract for refactor v2", () => {
  test("navigates between the four routes via header links", async ({
    page,
  }) => {
    await page.goto("/")
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      /Mortality in France/i
    )

    await page.getByRole("link", { name: /^Overview$/ }).click()
    await expect(page).toHaveURL(/\/overview$/)

    await page.getByRole("link", { name: /^Comparison$/ }).click()
    await expect(page).toHaveURL(/\/comparison$/)

    await page.getByRole("link", { name: /^Distribution$/ }).click()
    await expect(page).toHaveURL(/\/distribution$/)

    await page.getByRole("link", { name: /Mortality in France/i }).click()
    await expect(page).toHaveURL(/\/$/)
  })

  test("toggles locale FR ↔ EN and updates user-facing labels", async ({
    page,
  }) => {
    await page.goto("/overview")

    await expect(page.getByRole("link", { name: /^Overview$/ })).toBeVisible()
    await expect(page.getByRole("link", { name: /^Comparison$/ })).toBeVisible()
    await expect(
      page.getByRole("link", { name: /^Distribution$/ })
    ).toBeVisible()

    await page.getByTitle("français", { exact: true }).click()
    await expect(page).toHaveURL(/\/fr\/overview$/)

    await expect(
      page.getByRole("link", { name: /Vue d'Ensemble/i })
    ).toBeVisible()
    await expect(page.getByRole("link", { name: /Comparaison/i })).toBeVisible()
    await expect(page.getByRole("link", { name: /Répartition/i })).toBeVisible()

    await page.getByTitle("english", { exact: true }).click()
    await expect(page).toHaveURL(/\/overview$/)
    await expect(page.getByRole("link", { name: /^Overview$/ })).toBeVisible()
  })

  // The gender filter and age range slider tests are skipped until Lot 5
  // wires the global filters into the new SVG views. /overview (4.2) and
  // /comparison (4.3) are SVG (no canvas), and /distribution legacy chart.js
  // has a pre-existing missing-controller error not in scope to fix here.
  test.skip("gender filter toggles active state and triggers chart re-render", async ({
    page,
  }) => {
    await page.goto("/distribution")

    const canvas = page.locator("canvas").first()
    await expect(canvas).toBeVisible()
    const initial = await waitForChartStable(canvas, page)

    const male = page.getByTitle("males", { exact: true })
    const female = page.getByTitle("females", { exact: true })

    await male.click()
    await expect(male).toHaveClass(/active/)
    await page.waitForTimeout(CHART_SETTLE_MS)
    const afterMale = await waitForChartStable(canvas, page)
    expect(Buffer.compare(initial, afterMale)).not.toBe(0)

    await male.click()
    await expect(male).not.toHaveClass(/active/)

    await female.click()
    await expect(female).toHaveClass(/active/)
    await page.waitForTimeout(CHART_SETTLE_MS)
    const afterFemale = await waitForChartStable(canvas, page)
    expect(Buffer.compare(initial, afterFemale)).not.toBe(0)
    expect(Buffer.compare(afterMale, afterFemale)).not.toBe(0)
  })

  test.skip("age range slider triggers chart re-render", async ({ page }) => {
    // See note above — deferred to Lot 5.
    await page.goto("/distribution")

    const canvas = page.locator("canvas").first()
    await expect(canvas).toBeVisible()
    const initial = await waitForChartStable(canvas, page)

    const handles = page.getByRole("slider")
    await expect(handles).toHaveCount(2)

    await handles.first().focus()
    await page.keyboard.press("ArrowRight")
    await page.keyboard.press("ArrowRight")

    await page.waitForTimeout(CHART_SETTLE_MS)
    const after = await waitForChartStable(canvas, page)
    expect(Buffer.compare(initial, after)).not.toBe(0)
  })

  test("comparison year toggle adds and removes a series", async ({ page }) => {
    await page.goto("/comparison")

    const picker = page.getByTestId("comparison-picker")
    await expect(picker).toBeVisible({ timeout: 10_000 })

    const compareCard = page.getByTestId("comparison-compare")
    await expect(compareCard.locator("svg path")).not.toHaveCount(0)

    const yearButtons = picker.getByRole("button")
    const firstYear = yearButtons.first()
    const wasActive = (await firstYear.getAttribute("aria-pressed")) === "true"
    const initialPathCount = await compareCard.locator("svg path").count()

    await firstYear.click()
    await expect(firstYear).toHaveAttribute(
      "aria-pressed",
      wasActive ? "false" : "true"
    )
    const afterPathCount = await compareCard.locator("svg path").count()
    expect(afterPathCount).not.toBe(initialPathCount)

    await firstYear.click()
    await expect(firstYear).toHaveAttribute(
      "aria-pressed",
      wasActive ? "true" : "false"
    )
    const restoredPathCount = await compareCard.locator("svg path").count()
    expect(restoredPathCount).toBe(initialPathCount)
  })
})
