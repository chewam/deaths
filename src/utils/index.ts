import Population from "@/data/population.json"

export const sumObjects = (
  a: Record<string, number> = {},
  b: Record<string, number> = {}
): Record<string, number> => ({
  ...a,
  ...b,
  ...Object.keys(a).reduce(
    (acc, key) => ((acc[key] = (a[key] || 0) + (b[key] || 0)), acc),
    {} as Record<string, number>
  ),
})

export const sumYears = (years: number[][]): number[] =>
  years.reduce((r, a) => a?.map((b, i) => (r[i] || 0) + b), [])

export const getYearPopulation = (year: number): number => {
  const p = Population as Population
  return p[year]
}
