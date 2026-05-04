import { describe, expect, test } from "vitest"

import {
  MONTHLY_DEFAULT_DOMAIN_MAX,
  MONTHLY_PADDING,
  MONTHLY_Y_TICKS,
  buildMonthlyGeometry,
  computeMonthlyDomainMax,
  type MonthlyYear,
} from "@/components/charts/monthly-geometry"

const constYear = (year: number, value: number): MonthlyYear => ({
  year,
  monthly: Array.from({ length: 12 }, () => value),
})

const sample: MonthlyYear[] = [
  constYear(2018, 50_000),
  constYear(2019, 60_000),
  // 2020 — varies month to month
  {
    year: 2020,
    monthly: [
      55_000, 50_000, 65_000, 75_000, 60_000, 50_000, 50_000, 50_000, 50_000,
      55_000, 60_000, 70_000,
    ],
  },
]

describe("computeMonthlyDomainMax", () => {
  test("returns the default 80k when all values are below it", () => {
    const years: MonthlyYear[] = [
      constYear(2018, 50_000),
      constYear(2019, 60_000),
    ]
    expect(computeMonthlyDomainMax(years)).toBe(MONTHLY_DEFAULT_DOMAIN_MAX)
    expect(MONTHLY_DEFAULT_DOMAIN_MAX).toBe(80_000)
  })

  test("rounds the max up to the nearest 10k when the data exceeds 80k", () => {
    const years: MonthlyYear[] = [constYear(2020, 81_500)]
    expect(computeMonthlyDomainMax(years)).toBe(90_000)
  })

  test("returns the default on an empty dataset", () => {
    expect(computeMonthlyDomainMax([])).toBe(MONTHLY_DEFAULT_DOMAIN_MAX)
  })

  test("is unaffected by years with very low monthly values", () => {
    const years: MonthlyYear[] = [
      constYear(2018, 30_000),
      constYear(2019, 25_000),
    ]
    expect(computeMonthlyDomainMax(years)).toBe(MONTHLY_DEFAULT_DOMAIN_MAX)
  })
})

describe("buildMonthlyGeometry", () => {
  test("inner box reflects width/height minus padding", () => {
    const g = buildMonthlyGeometry(sample, 900, 420)
    expect(g.innerW).toBe(900 - MONTHLY_PADDING.left - MONTHLY_PADDING.right)
    expect(g.innerH).toBe(420 - MONTHLY_PADDING.top - MONTHLY_PADDING.bottom)
  })

  test("xs has 12 month positions evenly spaced from padL to padL+innerW", () => {
    const g = buildMonthlyGeometry(sample, 900, 420)
    expect(g.xs).toHaveLength(12)
    expect(g.xs[0]).toBeCloseTo(MONTHLY_PADDING.left, 5)
    expect(g.xs[11]).toBeCloseTo(MONTHLY_PADDING.left + g.innerW, 5)
    // step is innerW / 11
    const step = g.innerW / 11
    expect(g.xs[6]! - g.xs[5]!).toBeCloseTo(step, 5)
  })

  test("clamps innerW to a sensible minimum on tiny containers", () => {
    const g = buildMonthlyGeometry(sample, 50, 420)
    expect(g.innerW).toBe(100)
  })

  test("series has one entry per year with values + ys + linePath", () => {
    const g = buildMonthlyGeometry(sample, 900, 420)
    expect(g.series.map((s) => s.year)).toEqual([2018, 2019, 2020])
    for (const s of g.series) {
      expect(s.values).toHaveLength(12)
      expect(s.ys).toHaveLength(12)
    }
  })

  test("ys project monthly values onto the [0, maxV] domain", () => {
    const years: MonthlyYear[] = [constYear(2018, 40_000)]
    const g = buildMonthlyGeometry(years, 900, 420)
    // padT=32, innerH=420-32-50=338, maxV=80000, value=40000
    // y = 32 + 338 * (1 - 40000/80000) = 32 + 169 = 201
    for (const y of g.series[0]!.ys) expect(y).toBeCloseTo(201, 5)
  })

  test("linePath starts with M and uses L for subsequent points, fixed to 2 decimals", () => {
    const years: MonthlyYear[] = [constYear(2018, 40_000)]
    const g = buildMonthlyGeometry(years, 900, 420)
    const expected = g.xs
      .map((x, m) => `${m === 0 ? "M" : "L"} ${x.toFixed(2)} 201.00`)
      .join(" ")
    expect(g.series[0]!.linePath).toBe(expected)
  })

  test("returns an empty series and finite domain on an empty dataset", () => {
    const g = buildMonthlyGeometry([], 900, 420)
    expect(g.series).toEqual([])
    expect(g.maxV).toBe(MONTHLY_DEFAULT_DOMAIN_MAX)
    expect(g.xs).toHaveLength(12)
  })

  test("ticks are five evenly-spaced steps from 0 to 80k", () => {
    expect(MONTHLY_Y_TICKS).toEqual([0, 20_000, 40_000, 60_000, 80_000])
  })
})
