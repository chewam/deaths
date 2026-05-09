import AxeBuilder from "@axe-core/playwright"
import { expect, type Page } from "@playwright/test"

const BLOCKING_IMPACTS = new Set(["serious", "critical"])

export async function expectNoBlockingA11yViolations(
  page: Page
): Promise<void> {
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze()

  const blocking = results.violations.filter(
    (v) => v.impact && BLOCKING_IMPACTS.has(v.impact)
  )

  const summary = blocking
    .map(
      (v) =>
        `[${v.impact}] ${v.id}: ${v.help}\n  ${v.nodes
          .slice(0, 3)
          .map((n) => n.target.join(" "))
          .join("\n  ")}`
    )
    .join("\n\n")

  expect(blocking, `Blocking axe violations:\n${summary}`).toEqual([])
}
