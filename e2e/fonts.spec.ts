import { test, expect } from "./fixtures"

test.describe("fonts — Lot 2 / 2.1 next/font", () => {
  test("--display, --body, --mono CSS variables are exposed on :root", async ({
    page,
  }) => {
    await page.goto("/")

    const vars = await page.evaluate(() => {
      const cs = getComputedStyle(document.documentElement)
      return {
        display: cs.getPropertyValue("--display").trim(),
        body: cs.getPropertyValue("--body").trim(),
        mono: cs.getPropertyValue("--mono").trim(),
      }
    })

    expect(vars.display).not.toBe("")
    expect(vars.body).not.toBe("")
    expect(vars.mono).not.toBe("")

    // Resolved values: var() refs are substituted by next/font's
    // generated families (e.g. "'Inter Tight', 'Inter Tight Fallback'…").
    expect(vars.display).toMatch(/Inter Tight/i)
    expect(vars.body).toMatch(/Inter\b/i)
    expect(vars.mono).toMatch(/JetBrains Mono/i)
  })

  test("does not request fonts.googleapis.com / fonts.gstatic.com on page load", async ({
    page,
  }) => {
    const fontHostRequests: string[] = []
    page.on("request", (req) => {
      const url = req.url()
      if (
        url.includes("fonts.googleapis.com") ||
        url.includes("fonts.gstatic.com")
      ) {
        fontHostRequests.push(url)
      }
    })

    await page.goto("/")
    await page.waitForLoadState("networkidle")

    expect(fontHostRequests).toEqual([])
  })
})
