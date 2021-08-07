import Population from "@/data/population.json"

export const palette = [
  "#2364aa",
  "#3da5d9",
  "#73bfb8",
  "#ea7317",
  "#004e64",
  "#00a5cf",
  "#25a18e",
  "#5e548e",
  "#9f86c0",
  "#be95c4",
  "#e0b1cb",
  "#c9cba3",
  "#e26d5c",
  "#d7263d",
  "#f46036",
  "#1b998b",
  "#c5d86d",
  "#fe938c",
  "#e6b89c",
  "#9cafb7",
  "#4281a4",
  "#d4afb9",
  "#d1cfe2",
  "#9cadce",
  "#7ec4cf",
  "#52b2cf",
]

export const sumArray = (arr: number[] = []): number =>
  arr.reduce((a, b) => a + b, 0)

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
