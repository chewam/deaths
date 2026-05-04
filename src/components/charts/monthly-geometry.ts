export type MonthlyYear = {
  year: number
  monthly: number[]
}

export type MonthlyEvent = {
  year: number
  month: number
  label: string
}

export type MonthlyHover = {
  year: number
  month: number
}

export const MONTHLY_PADDING = {
  left: 56,
  right: 24,
  top: 32,
  bottom: 50,
} as const

export const MONTHLY_DEFAULT_DOMAIN_MAX = 80_000
export const MONTHLY_TICK_COUNT = 5

const MIN_INNER_WIDTH = 100
const DOMAIN_STEP = 10_000

export const computeMonthlyDomainMax = (years: MonthlyYear[]): number => {
  const all = years.flatMap((y) => y.monthly)
  if (all.length === 0) return MONTHLY_DEFAULT_DOMAIN_MAX
  const max = Math.max(...all)
  return Math.max(
    MONTHLY_DEFAULT_DOMAIN_MAX,
    Math.ceil(max / DOMAIN_STEP) * DOMAIN_STEP
  )
}

export const computeMonthlyYTicks = (maxV: number): number[] => {
  const intervals = MONTHLY_TICK_COUNT - 1
  return Array.from(
    { length: MONTHLY_TICK_COUNT },
    (_, i) => (maxV * i) / intervals
  )
}

export type MonthlySeries = {
  year: number
  values: number[]
  ys: number[]
  linePath: string
}

export type MonthlyGeometry = {
  innerW: number
  innerH: number
  maxV: number
  xs: number[]
  yTicks: number[]
  series: MonthlySeries[]
}

export const buildMonthlyGeometry = (
  years: MonthlyYear[],
  width: number,
  height: number
): MonthlyGeometry => {
  const { left: padL, right: padR, top: padT, bottom: padB } = MONTHLY_PADDING
  const innerW = Math.max(MIN_INNER_WIDTH, width - padL - padR)
  const innerH = height - padT - padB

  const maxV = computeMonthlyDomainMax(years)
  const projectY = (v: number): number => padT + innerH * (1 - v / maxV)

  const xs = Array.from({ length: 12 }, (_, m) => padL + (innerW * m) / 11)
  const yTicks = computeMonthlyYTicks(maxV)

  const series: MonthlySeries[] = years.map((y) => {
    const values = y.monthly
    const ys = values.map(projectY)
    const linePath = xs
      .map(
        (x, m) => `${m === 0 ? "M" : "L"} ${x.toFixed(2)} ${ys[m]!.toFixed(2)}`
      )
      .join(" ")
    return { year: y.year, values, ys, linePath }
  })

  return { innerW, innerH, maxV, xs, yTicks, series }
}

export const projectMonthlyTickY = (
  tick: number,
  maxV: number,
  innerH: number
): number => MONTHLY_PADDING.top + innerH * (1 - tick / maxV)
