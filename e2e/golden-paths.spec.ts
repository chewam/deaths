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

  test("gender filter toggles active state and triggers chart re-render", async ({
    page,
  }) => {
    await page.goto("/overview")

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

  test("age range slider triggers chart re-render", async ({ page }) => {
    await page.goto("/overview")

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

    const yearButtons = page.locator("ul.years > li > button")
    await expect(yearButtons.first()).toBeVisible({ timeout: 10_000 })

    const canvas = page.locator("canvas").first()
    await expect(canvas).toBeVisible()
    const before = await waitForChartStable(canvas, page)

    const firstYear = yearButtons.first()
    const wasActive = ((await firstYear.getAttribute("class")) || "").includes(
      "active"
    )

    await firstYear.click()
    await page.waitForTimeout(CHART_SETTLE_MS)

    const newClass = (await firstYear.getAttribute("class")) || ""
    expect(newClass.includes("active")).toBe(!wasActive)

    const after = await waitForChartStable(canvas, page)
    expect(Buffer.compare(before, after)).not.toBe(0)

    await firstYear.click()
    await page.waitForTimeout(CHART_SETTLE_MS)
    const restored = (await firstYear.getAttribute("class")) || ""
    expect(restored.includes("active")).toBe(wasActive)
  })
})
