import { sumYears, getYearPopulation } from "@/utils/index"

const AGE_BUCKET_SPAN = 10
const VIEW_BUCKET_COUNT = 10

const ageIndices = (
  ageGroup: [number, number]
): { start: number; end: number } => ({
  start: Math.floor(ageGroup[0] / AGE_BUCKET_SPAN),
  end: Math.ceil(ageGroup[1] / AGE_BUCKET_SPAN),
})

export const computeFilteredMonthly = (
  data: DeathsRawData | undefined,
  filters: Filters | undefined
): number[][] => {
  if (!data) return []
  const { gender, ageGroup = [0, 110] } = filters ?? {}
  const { start, end } = ageIndices(ageGroup)
  const groups: DeathsAgeGroups = gender
    ? data[gender].ageGroups
    : data.ageGroups
  return groups
    .slice(start, end)
    .reduce<
      number[][]
    >((acc, group) => group.map((year, i) => sumYears([acc[i] ?? [], year])), [])
}

export type FilteredAgeBucketsYear = {
  year: number
  buckets: number[]
  rate: number
  m: number
  f: number
}

const sumColumnInRange = (
  groups: number[][],
  yearIndex: number,
  start: number,
  end: number
): number =>
  groups.slice(start, end).reduce((s, g) => s + (g[yearIndex] ?? 0), 0)

const collapseTo10Buckets = (
  raw: number[],
  start: number,
  end: number
): number[] => {
  const out = new Array<number>(VIEW_BUCKET_COUNT).fill(0)
  // Source has 11 buckets (0-9 .. 100+); view shows 10 by collapsing 90-99 + 100+ into 90+.
  for (let i = 0; i < raw.length; i++) {
    if (i < start || i >= end) continue
    const target = i >= VIEW_BUCKET_COUNT - 1 ? VIEW_BUCKET_COUNT - 1 : i
    out[target] += raw[i] ?? 0
  }
  return out
}

const FIRST_YEAR = 2000

export const computeFilteredAgeBuckets = (
  data: MortalityRawData | undefined,
  filters: Filters | undefined
): FilteredAgeBucketsYear[] => {
  if (!data) return []
  const yearCount = data.ageGroups[0]?.length ?? 0
  const { ageGroup = [0, 110] } = filters ?? {}
  const { start, end } = ageIndices(ageGroup)
  return Array.from({ length: yearCount }, (_, i) => {
    const year = FIRST_YEAR + i
    const rawBuckets = data.ageGroups.map((g) => g[i] ?? 0)
    const buckets = collapseTo10Buckets(rawBuckets, start, end)
    const totalDeaths = buckets.reduce((s, b) => s + b, 0)
    const population = getYearPopulation(year) || 0
    const rate = population > 0 ? (totalDeaths * 100) / population : 0
    return {
      year,
      buckets,
      rate,
      m: sumColumnInRange(data.male.ageGroups, i, start, end),
      f: sumColumnInRange(data.female.ageGroups, i, start, end),
    }
  })
}
