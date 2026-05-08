import {
  computeFilteredMonthly,
  computeFilteredAgeBuckets,
} from "../../src/utils/filters"
import deaths from "../../public/data/deaths.json"
import mortality from "../../public/data/mortality.json"

const rawDeaths = deaths as DeathsRawData
const rawMortality = mortality as unknown as MortalityRawData

describe("computeFilteredMonthly()", () => {
  test("returns empty when data is undefined", () => {
    expect(
      computeFilteredMonthly(undefined, { gender: null, ageGroup: [0, 110] })
    ).toEqual([])
  })

  test("default filter = sum across all 11 age buckets per year, preserving month count", () => {
    const result = computeFilteredMonthly(rawDeaths, {
      gender: null,
      ageGroup: [0, 110],
    })
    expect(result).toHaveLength(rawDeaths.ageGroups[0].length)
    result.forEach((months, i) =>
      expect(months).toHaveLength(rawDeaths.ageGroups[0][i].length)
    )
  })

  test("gender=male yields strictly less deaths in 2000 than unfiltered", () => {
    const noFilter = computeFilteredMonthly(rawDeaths, {
      gender: null,
      ageGroup: [0, 110],
    })
    const maleOnly = computeFilteredMonthly(rawDeaths, {
      gender: "male",
      ageGroup: [0, 110],
    })
    const sum = (m: number[]) => m.reduce((a, b) => a + b, 0)
    expect(sum(maleOnly[0])).toBeLessThan(sum(noFilter[0]))
    expect(sum(maleOnly[0])).toBeGreaterThan(0)
  })

  test("ageGroup=[60,90] excludes buckets outside the range", () => {
    const wide = computeFilteredMonthly(rawDeaths, {
      gender: null,
      ageGroup: [0, 110],
    })
    const narrow = computeFilteredMonthly(rawDeaths, {
      gender: null,
      ageGroup: [60, 90],
    })
    const sum = (m: number[]) => m.reduce((a, b) => a + b, 0)
    expect(sum(narrow[0])).toBeLessThan(sum(wide[0]))
    expect(sum(narrow[0])).toBeGreaterThan(0)
  })

  test("matches male.global when gender=male and ageGroup covers all", () => {
    const filtered = computeFilteredMonthly(rawDeaths, {
      gender: "male",
      ageGroup: [0, 110],
    })
    const sum = (m: number[]) => m.reduce((a, b) => a + b, 0)
    const maleTotal2000 = sum(rawDeaths.male.global[0])
    expect(sum(filtered[0])).toBe(maleTotal2000)
  })
})

describe("computeFilteredAgeBuckets()", () => {
  test("returns 10 buckets per year (collapsing 90-99 + 100+ into 90+)", () => {
    const result = computeFilteredAgeBuckets(rawMortality, {
      gender: null,
      ageGroup: [0, 110],
    })
    expect(result.length).toBeGreaterThan(0)
    result.forEach((year) => expect(year.buckets).toHaveLength(10))
  })

  test("ageGroup=[60,90] zeroes buckets outside the range", () => {
    const filtered = computeFilteredAgeBuckets(rawMortality, {
      gender: null,
      ageGroup: [60, 90],
    })
    filtered.forEach(({ buckets }) => {
      buckets.slice(0, 6).forEach((b) => expect(b).toBe(0)) // 0-9 .. 50-59
      buckets.slice(9).forEach((b) => expect(b).toBe(0)) // 90+
      const inRange = buckets.slice(6, 9) // 60-69, 70-79, 80-89
      expect(inRange.some((b) => b > 0)).toBe(true)
    })
  })

  test("m + f totals reflect the age range, not the entire population", () => {
    const wide = computeFilteredAgeBuckets(rawMortality, {
      gender: null,
      ageGroup: [0, 110],
    })
    const narrow = computeFilteredAgeBuckets(rawMortality, {
      gender: null,
      ageGroup: [60, 90],
    })
    expect(narrow[0].m).toBeLessThan(wide[0].m)
    expect(narrow[0].f).toBeLessThan(wide[0].f)
    expect(narrow[0].m).toBeGreaterThan(0)
    expect(narrow[0].f).toBeGreaterThan(0)
  })

  test("rate stays the all-ages rate regardless of age filter (otherwise it would fall outside DISTRIBUTION_RATE_DOMAIN)", () => {
    const wide = computeFilteredAgeBuckets(rawMortality, {
      gender: null,
      ageGroup: [0, 110],
    })
    const narrow = computeFilteredAgeBuckets(rawMortality, {
      gender: null,
      ageGroup: [60, 90],
    })
    expect(narrow[0].rate).toBe(wide[0].rate)
    expect(narrow[0].rate).toBeGreaterThan(0)
  })
})
