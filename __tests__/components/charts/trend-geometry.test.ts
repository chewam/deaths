import { describe, expect, test } from "vitest"

import {
  TREND_PADDING,
  TREND_RATE_DOMAIN,
  buildTrendGeometry,
  type TrendYear,
} from "@/components/charts/trend-geometry"

const sample: TrendYear[] = [
  { year: 2000, rate: 0.9, deaths: 540_000, pop: 60_000_000 },
  { year: 2001, rate: 0.95, deaths: 550_000, pop: 61_000_000 },
  { year: 2002, rate: 1.0, deaths: 560_000, pop: 62_000_000 },
]

describe("buildTrendGeometry", () => {
  test("inner box reflects width/height minus padding", () => {
    const g = buildTrendGeometry(sample, 800, 340)
    expect(g.innerW).toBe(800 - TREND_PADDING.left - TREND_PADDING.right)
    expect(g.innerH).toBe(340 - TREND_PADDING.top - TREND_PADDING.bottom)
  })

  test("xs span from padL to padL+innerW evenly", () => {
    const g = buildTrendGeometry(sample, 800, 340)
    expect(g.xs).toEqual([56, 416, 776])
  })

  test("ys map mortality rate onto the rate domain (0.80 → bottom, 1.05 → top)", () => {
    const g = buildTrendGeometry(sample, 800, 340)
    // domain 0.80–1.05, innerH=280, padT=24
    // rate=0.90 → 24 + 280*(1 - 0.40) = 192
    // rate=0.95 → 24 + 280*(1 - 0.60) = 136
    // rate=1.00 → 24 + 280*(1 - 0.80) =  80
    expect(g.ys[0]).toBeCloseTo(192, 5)
    expect(g.ys[1]).toBeCloseTo(136, 5)
    expect(g.ys[2]).toBeCloseTo(80, 5)
  })

  test("computes the long-term average and projects it onto y", () => {
    const g = buildTrendGeometry(sample, 800, 340)
    expect(g.avg).toBeCloseTo(0.95, 5)
    expect(g.avgY).toBeCloseTo(136, 5)
  })

  test("linePath starts with M, then L for each point, fixed to 2 decimals", () => {
    const g = buildTrendGeometry(sample, 800, 340)
    expect(g.linePath).toBe("M 56.00 192.00 L 416.00 136.00 L 776.00 80.00")
  })

  test("areaPath closes the line down to the bottom of the inner box", () => {
    const g = buildTrendGeometry(sample, 800, 340)
    // padT + innerH = 24 + 280 = 304
    expect(g.areaPath).toBe(
      "M 56.00 192.00 L 416.00 136.00 L 776.00 80.00 L 776 304 L 56 304 Z"
    )
  })

  test("clamps innerW to a sensible minimum on tiny containers", () => {
    const g = buildTrendGeometry(sample, 50, 340)
    expect(g.innerW).toBe(100)
  })

  test("guards against division by zero on a single-year dataset", () => {
    const single: TrendYear[] = [
      { year: 2000, rate: 0.92, deaths: 540_000, pop: 60_000_000 },
    ]
    const g = buildTrendGeometry(single, 800, 340)
    expect(Number.isFinite(g.xs[0])).toBe(true)
    expect(g.xs[0]).toBe(TREND_PADDING.left)
  })

  test("returns empty paths and finite avg for an empty dataset", () => {
    const g = buildTrendGeometry([], 800, 340)
    expect(g.xs).toEqual([])
    expect(g.ys).toEqual([])
    expect(g.linePath).toBe("")
    expect(g.areaPath).toBe("")
    expect(Number.isFinite(g.avg)).toBe(true)
  })

  test("rate domain matches the source spec (0.80 → 1.05)", () => {
    expect(TREND_RATE_DOMAIN).toEqual({ min: 0.8, max: 1.05 })
  })
})
