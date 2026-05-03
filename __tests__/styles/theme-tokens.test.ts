import { readFileSync } from "node:fs"
import path from "node:path"

const CSS_PATH = path.resolve(__dirname, "../../src/styles/tailwind.css")

function parseThemeBlock(css: string): Record<string, string> {
  const match = css.match(/@theme\s*\{([\s\S]*?)\n\}/)
  if (!match) throw new Error("@theme block not found in tailwind.css")
  const body = match[1]
  const tokens: Record<string, string> = {}
  for (const decl of body.split(";")) {
    const trimmed = decl.trim()
    if (!trimmed) continue
    const sep = trimmed.indexOf(":")
    if (sep === -1) continue
    const name = trimmed.slice(0, sep).trim()
    const value = trimmed
      .slice(sep + 1)
      .trim()
      .replace(/\s+/g, " ")
    tokens[name] = value
  }
  return tokens
}

describe("@theme tokens (Graphite palette + modern typography)", () => {
  const css = readFileSync(CSS_PATH, "utf8")
  const tokens = parseThemeBlock(css)

  const graphite: Record<string, string> = {
    "--color-bg": "#FAFAF9",
    "--color-surface": "#FFFFFF",
    "--color-border": "#E7E5E4",
    "--color-text": "#0C0A09",
    "--color-text-dim": "#57534E",
    "--color-text-faint": "#A8A29E",
    "--color-accent": "#0C0A09",
    "--color-accent-soft": "#E7E5E4",
    "--color-male": "#3B82F6",
    "--color-female": "#EC4899",
    "--color-grid": "#F1EFEE",
    "--color-danger": "#DC2626",
    "--color-warn": "#D97706",
    "--color-mute": "#78716C",
  }

  for (const [name, expected] of Object.entries(graphite)) {
    test(`${name} = ${expected}`, () => {
      expect(tokens[name]?.toUpperCase()).toBe(expected.toUpperCase())
    })
  }

  test("--font-display references Inter Tight then Inter", () => {
    expect(tokens["--font-display"]).toBe(
      "var(--font-inter-tight), var(--font-inter), -apple-system, sans-serif"
    )
  })

  test("--font-body references Inter", () => {
    expect(tokens["--font-body"]).toBe(
      "var(--font-inter), -apple-system, sans-serif"
    )
  })

  test("--font-mono references JetBrains Mono", () => {
    expect(tokens["--font-mono"]).toBe(
      "var(--font-jetbrains-mono), ui-monospace, monospace"
    )
  })

  test("--tracking-display matches modern preset (-0.04em)", () => {
    expect(tokens["--tracking-display"]).toBe("-0.04em")
  })

  test("Roboto residue is gone from @theme", () => {
    expect(tokens["--font-roboto"]).toBeUndefined()
  })
})
