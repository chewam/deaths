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
        fontInter: cs.getPropertyValue("--font-inter").trim(),
        fontInterTight: cs.getPropertyValue("--font-inter-tight").trim(),
        fontFraunces: cs.getPropertyValue("--font-fraunces").trim(),
        fontJetBrainsMono: cs.getPropertyValue("--font-jetbrains-mono").trim(),
      }
    })

    // Semantic aliases are wired (the var() chain may or may not resolve at
    // computed-style time depending on the engine; non-empty is the contract).
    expect(vars.display).not.toBe("")
    expect(vars.body).not.toBe("")
    expect(vars.mono).not.toBe("")

    // next/font sets the leaf variables to literal font-family strings, so
    // these always carry the font name regardless of var() resolution behavior.
    expect(vars.fontInter).toMatch(/Inter\b/i)
    expect(vars.fontInterTight).toMatch(/Inter Tight/i)
    expect(vars.fontFraunces).toMatch(/Fraunces/i)
    expect(vars.fontJetBrainsMono).toMatch(/JetBrains Mono/i)
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
