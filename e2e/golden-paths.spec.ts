import { test, expect, type Locator, type Page } from "@playwright/test"

const CHART_SETTLE_MS = 400

async function waitForChartStable(target: Locator, page: Page) {
  let prev = await target.screenshot()
  for (let i = 0; i < 10; i++) {
    await page.waitForTimeout(100)
    const next = await target.screenshot()
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
    await page.goto("/distribution")

    const card = page.getByTestId("distribution-card")
    await expect(card).toBeVisible()
    const initial = await waitForChartStable(card, page)

    const all = page.getByTestId("filter-gender-all")
    const male = page.getByTestId("filter-gender-male")
    const female = page.getByTestId("filter-gender-female")

    await expect(all).toHaveAttribute("aria-pressed", "true")

    await male.click()
    await expect(male).toHaveAttribute("aria-pressed", "true")
    await expect(all).toHaveAttribute("aria-pressed", "false")
    await page.waitForTimeout(CHART_SETTLE_MS)
    const afterMale = await waitForChartStable(card, page)
    expect(Buffer.compare(initial, afterMale)).not.toBe(0)

    await female.click()
    await expect(female).toHaveAttribute("aria-pressed", "true")
    await expect(male).toHaveAttribute("aria-pressed", "false")
    await page.waitForTimeout(CHART_SETTLE_MS)
    const afterFemale = await waitForChartStable(card, page)
    expect(Buffer.compare(initial, afterFemale)).not.toBe(0)
    expect(Buffer.compare(afterMale, afterFemale)).not.toBe(0)
  })

  test("age range slider triggers chart re-render", async ({ page }) => {
    await page.goto("/distribution")

    const card = page.getByTestId("distribution-card")
    await expect(card).toBeVisible()
    const initial = await waitForChartStable(card, page)

    const handles = page.getByTestId("filter-age-range").getByRole("slider")
    await expect(handles).toHaveCount(2)

    await handles.first().focus()
    await page.keyboard.press("ArrowRight")
    await page.keyboard.press("ArrowRight")

    await page.waitForTimeout(CHART_SETTLE_MS)
    const after = await waitForChartStable(card, page)
    expect(Buffer.compare(initial, after)).not.toBe(0)
  })

  test("/overview renders the Year view against real data without a client-side crash", async ({
    page,
  }) => {
    const errors: string[] = []
    page.on("pageerror", (err) => errors.push(err.message))

    await page.goto("/overview")

    // The body must mount fully — Year.tsx renders these regions only after
    // the chart geometry is built without throwing.
    await expect(page.getByTestId("view-year")).toBeVisible({ timeout: 10_000 })
    await expect(page.getByTestId("year-trend")).toBeVisible()
    await expect(page.getByTestId("year-monthly")).toBeVisible()

    // Next.js's error boundary swaps the page for "Application error: …" when
    // a client-side render throws.
    await expect(page.getByText(/Application error/i)).toHaveCount(0)
    expect(errors, `unexpected pageerror(s):\n${errors.join("\n")}`).toEqual([])
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
