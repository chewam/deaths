import { describe, expect, test } from "vitest"

import {
  DISTRIBUTION_BUCKET_COUNT,
  DISTRIBUTION_PADDING,
  DISTRIBUTION_RATE_DOMAIN,
  DISTRIBUTION_RATE_TICKS,
  DISTRIBUTION_TICK_COUNT,
  applyGenderFilter,
  buildDistributionGeometry,
  computeDistributionDomainMax,
  computeDistributionYTicks,
  projectDistributionRateY,
  projectDistributionValueY,
  type DistributionYear,
} from "@/components/charts/distribution-geometry"

const mkYear = (
  year: number,
  bucketValue: number,
  rate: number,
  m = 50,
  f = 50
): DistributionYear => ({
  year,
  buckets: Array.from({ length: DISTRIBUTION_BUCKET_COUNT }, () => bucketValue),
  rate,
  m,
  f,
})

const sample: DistributionYear[] = [
  mkYear(2018, 50_000, 0.91),
  mkYear(2019, 55_000, 0.92),
  mkYear(2020, 60_000, 0.99),
]

describe("applyGenderFilter", () => {
  test("returns the years unchanged when gender is 'all'", () => {
    const out = applyGenderFilter(sample, "all")
    expect(out).toEqual(sample)
    expect(out).toBe(sample)
  })

  test("scales each bucket by the male ratio when gender is 'm'", () => {
    const years: DistributionYear[] = [
      { year: 2020, buckets: [10, 20, 30], rate: 0.95, m: 20, f: 80 },
    ]
    const out = applyGenderFilter(years, "m")
    expect(out[0]!.buckets).toEqual([2, 4, 6])
  })

  test("scales each bucket by the female ratio when gender is 'f'", () => {
    const years: DistributionYear[] = [
      { year: 2020, buckets: [10, 20, 30], rate: 0.95, m: 20, f: 80 },
    ]
    const out = applyGenderFilter(years, "f")
    expect(out[0]!.buckets).toEqual([8, 16, 24])
  })

  test("rounds scaled bucket values", () => {
    const years: DistributionYear[] = [
      { year: 2020, buckets: [3, 7, 11], rate: 0.95, m: 1, f: 2 },
    ]
    const out = applyGenderFilter(years, "m")
    expect(out[0]!.buckets).toEqual([1, 2, 4])
  })

  test("returns the year unchanged when m+f is zero (no division by zero)", () => {
    const years: DistributionYear[] = [
      { year: 2020, buckets: [10, 20, 30], rate: 0.95, m: 0, f: 0 },
    ]
    const out = applyGenderFilter(years, "m")
    expect(out[0]).toBe(years[0])
  })

  test("does not mutate the input array or the per-year buckets", () => {
    const years: DistributionYear[] = [
      { year: 2020, buckets: [10, 20, 30], rate: 0.95, m: 20, f: 80 },
    ]
    const copy = [...years]
    const bucketCopy = [...years[0]!.buckets]
    applyGenderFilter(years, "m")
    expect(years).toEqual(copy)
    expect(years[0]!.buckets).toEqual(bucketCopy)
  })
})

describe("computeDistributionDomainMax", () => {
  test("rounds the max total up to the nearest 100k", () => {
    // Total per year = 50_000 * 10 = 500_000 ; 55_000 * 10 = 550_000 ; 60_000 * 10 = 600_000
    expect(computeDistributionDomainMax(sample)).toBe(600_000)
  })

  test("rounds 540k up to 600k", () => {
    const years: DistributionYear[] = [mkYear(2018, 54_000, 0.91)] // total 540_000
    expect(computeDistributionDomainMax(years)).toBe(600_000)
  })

  test("returns a sane default for an empty dataset", () => {
    expect(computeDistributionDomainMax([])).toBe(100_000)
  })

  test("returns the default when all totals are zero", () => {
    const years: DistributionYear[] = [
      { year: 2018, buckets: Array(10).fill(0), rate: 0.9, m: 50, f: 50 },
    ]
    expect(computeDistributionDomainMax(years)).toBe(100_000)
  })

  test("scales to 700k for a COVID-style peak", () => {
    const years: DistributionYear[] = [mkYear(2020, 67_000, 0.99)] // total 670_000
    expect(computeDistributionDomainMax(years)).toBe(700_000)
  })
})

describe("computeDistributionYTicks", () => {
  test("returns 4 evenly-spaced ticks from 0 to niceMax", () => {
    expect(computeDistributionYTicks(600_000)).toEqual([
      0, 200_000, 400_000, 600_000,
    ])
  })

  test("adapts to a 700k domain", () => {
    const ticks = computeDistributionYTicks(700_000)
    expect(ticks).toHaveLength(DISTRIBUTION_TICK_COUNT)
    expect(ticks[0]).toBe(0)
    expect(ticks[3]).toBe(700_000)
  })
})

describe("rate projection", () => {
  test("min rate maps to the bottom of the inner box", () => {
    const innerH = 386
    expect(projectDistributionRateY(DISTRIBUTION_RATE_DOMAIN.min, innerH)).toBe(
      DISTRIBUTION_PADDING.top + innerH
    )
  })

  test("max rate maps to the top of the inner box", () => {
    const innerH = 386
    expect(projectDistributionRateY(DISTRIBUTION_RATE_DOMAIN.max, innerH)).toBe(
      DISTRIBUTION_PADDING.top
    )
  })

  test("a rate at midpoint projects halfway down the inner box", () => {
    const innerH = 386
    const mid =
      (DISTRIBUTION_RATE_DOMAIN.min + DISTRIBUTION_RATE_DOMAIN.max) / 2
    expect(projectDistributionRateY(mid, innerH)).toBeCloseTo(
      DISTRIBUTION_PADDING.top + innerH / 2,
      5
    )
  })

  test("rate ticks are 0.85, 0.90, 0.95, 1.00", () => {
    expect([...DISTRIBUTION_RATE_TICKS]).toEqual([0.85, 0.9, 0.95, 1.0])
  })
})

describe("value projection", () => {
  test("zero maps to the bottom of the inner box", () => {
    const innerH = 386
    expect(projectDistributionValueY(0, 600_000, innerH)).toBe(
      DISTRIBUTION_PADDING.top + innerH
    )
  })

  test("niceMax maps to the top of the inner box", () => {
    const innerH = 386
    expect(projectDistributionValueY(600_000, 600_000, innerH)).toBe(
      DISTRIBUTION_PADDING.top
    )
  })
})

describe("buildDistributionGeometry", () => {
  test("inner box reflects width/height minus padding", () => {
    const g = buildDistributionGeometry(sample, 900, 460)
    expect(g.innerW).toBe(
      900 - DISTRIBUTION_PADDING.left - DISTRIBUTION_PADDING.right
    )
    expect(g.innerH).toBe(
      460 - DISTRIBUTION_PADDING.top - DISTRIBUTION_PADDING.bottom
    )
  })

  test("clamps innerW to the minimum on tiny containers", () => {
    const g = buildDistributionGeometry(sample, 50, 460)
    expect(g.innerW).toBe(100)
  })

  test("xs and centers have one entry per year, evenly spaced", () => {
    const g = buildDistributionGeometry(sample, 900, 460)
    expect(g.xs).toHaveLength(3)
    expect(g.centers).toHaveLength(3)
    const groupW = g.innerW / 3
    expect(g.groupW).toBeCloseTo(groupW, 5)
    // First slot starts at padL + (groupW - barW) / 2
    const expectedFirstLeft = DISTRIBUTION_PADDING.left + (groupW - g.barW) / 2
    expect(g.xs[0]).toBeCloseTo(expectedFirstLeft, 5)
    // Center of first slot is at padL + groupW / 2
    expect(g.centers[0]).toBeCloseTo(DISTRIBUTION_PADDING.left + groupW / 2, 5)
    // Slots are spaced by groupW
    expect(g.centers[1]! - g.centers[0]!).toBeCloseTo(groupW, 5)
  })

  test("barW is 72% of the slot width", () => {
    const g = buildDistributionGeometry(sample, 900, 460)
    const groupW = g.innerW / 3
    expect(g.barW).toBeCloseTo(groupW * 0.72, 5)
  })

  test("series has one entry per year with 10 stacked bars", () => {
    const g = buildDistributionGeometry(sample, 900, 460)
    expect(g.series.map((s) => s.year)).toEqual([2018, 2019, 2020])
    for (const s of g.series) {
      expect(s.bars).toHaveLength(DISTRIBUTION_BUCKET_COUNT)
    }
  })

  test("stacked bars are contiguous: each bar's bottom matches the previous bar's top", () => {
    const g = buildDistributionGeometry(sample, 900, 460)
    const bars = g.series[0]!.bars
    for (let i = 1; i < bars.length; i++) {
      expect(bars[i]!.yBot).toBeCloseTo(bars[i - 1]!.yTop, 5)
    }
  })

  test("total per series equals the sum of its buckets", () => {
    const g = buildDistributionGeometry(sample, 900, 460)
    expect(g.series[0]!.total).toBe(50_000 * 10)
    expect(g.series[2]!.total).toBe(60_000 * 10)
  })

  test("rateY uses the [0.80, 1.05] domain over innerH", () => {
    const g = buildDistributionGeometry(sample, 900, 460)
    // 2018 rate=0.91 → (0.91 - 0.80) / 0.25 = 0.44
    // y = padT + innerH * (1 - 0.44) = 24 + 386 * 0.56 = 240.16
    expect(g.series[0]!.rateY).toBeCloseTo(240.16, 1)
  })

  test("ratePath starts with M then L commands at series centers", () => {
    const g = buildDistributionGeometry(sample, 900, 460)
    expect(g.ratePath.startsWith("M ")).toBe(true)
    expect(g.ratePath.split(" L ").length).toBe(g.series.length)
  })

  test("returns finite, non-empty geometry on an empty dataset", () => {
    const g = buildDistributionGeometry([], 900, 460)
    expect(g.series).toEqual([])
    expect(g.xs).toEqual([])
    expect(g.centers).toEqual([])
    expect(g.barW).toBe(0)
    expect(g.niceMax).toBe(100_000)
    expect(g.ratePath).toBe("")
  })

  test("yTicksLeft span [0, niceMax] in 4 evenly-spaced steps", () => {
    const g = buildDistributionGeometry(sample, 900, 460)
    expect(g.yTicksLeft).toEqual([0, 200_000, 400_000, 600_000])
  })

  test("yTicksRight reflect the fixed rate domain", () => {
    const g = buildDistributionGeometry(sample, 900, 460)
    expect([...g.yTicksRight]).toEqual([0.85, 0.9, 0.95, 1.0])
  })
})
