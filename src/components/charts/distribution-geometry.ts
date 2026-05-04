export type DistributionGender = "all" | "m" | "f"

export type DistributionYear = {
  year: number
  buckets: number[]
  rate: number
  m: number
  f: number
}

export const DISTRIBUTION_PADDING = {
  left: 64,
  right: 64,
  top: 24,
  bottom: 50,
} as const

export const DISTRIBUTION_RATE_DOMAIN = { min: 0.8, max: 1.05 } as const
export const DISTRIBUTION_RATE_TICKS = [0.85, 0.9, 0.95, 1.0] as const
export const DISTRIBUTION_TICK_COUNT = 4
export const DISTRIBUTION_BUCKET_COUNT = 10

const BAR_WIDTH_RATIO = 0.72
const NICE_MAX_STEP = 100_000
const DEFAULT_NICE_MAX = NICE_MAX_STEP
const MIN_INNER_WIDTH = 100

export const applyGenderFilter = (
  years: DistributionYear[],
  gender: DistributionGender
): DistributionYear[] => {
  if (gender === "all") return years
  return years.map((y) => {
    const total = y.m + y.f
    if (total === 0) return y
    const ratio = (gender === "m" ? y.m : y.f) / total
    return {
      ...y,
      buckets: y.buckets.map((b) => Math.round(b * ratio)),
    }
  })
}

export const computeDistributionDomainMax = (
  years: DistributionYear[]
): number => {
  if (years.length === 0) return DEFAULT_NICE_MAX
  const maxTotal = Math.max(
    ...years.map((y) => y.buckets.reduce((s, b) => s + b, 0))
  )
  if (maxTotal <= 0) return DEFAULT_NICE_MAX
  return Math.ceil(maxTotal / NICE_MAX_STEP) * NICE_MAX_STEP
}

export const computeDistributionYTicks = (niceMax: number): number[] => {
  const intervals = DISTRIBUTION_TICK_COUNT - 1
  return Array.from(
    { length: DISTRIBUTION_TICK_COUNT },
    (_, i) => (niceMax * i) / intervals
  )
}

export const projectDistributionValueY = (
  value: number,
  niceMax: number,
  innerH: number
): number => DISTRIBUTION_PADDING.top + innerH * (1 - value / niceMax)

export const projectDistributionRateY = (
  rate: number,
  innerH: number
): number => {
  const { min, max } = DISTRIBUTION_RATE_DOMAIN
  return DISTRIBUTION_PADDING.top + innerH * (1 - (rate - min) / (max - min))
}

export type DistributionBar = {
  bucketIndex: number
  value: number
  yTop: number
  yBot: number
}

export type DistributionSeries = {
  year: number
  total: number
  bars: DistributionBar[]
  rate: number
  rateY: number
  centerX: number
}

export type DistributionGeometry = {
  innerW: number
  innerH: number
  niceMax: number
  barW: number
  groupW: number
  xs: number[]
  centers: number[]
  yTicksLeft: number[]
  yTicksRight: readonly number[]
  series: DistributionSeries[]
  ratePath: string
}

export const buildDistributionGeometry = (
  years: DistributionYear[],
  width: number,
  height: number
): DistributionGeometry => {
  const {
    left: padL,
    right: padR,
    top: padT,
    bottom: padB,
  } = DISTRIBUTION_PADDING
  const innerW = Math.max(MIN_INNER_WIDTH, width - padL - padR)
  const innerH = height - padT - padB

  const niceMax = computeDistributionDomainMax(years)
  const yTicksLeft = computeDistributionYTicks(niceMax)

  const groupCount = years.length
  const groupW = groupCount > 0 ? innerW / groupCount : innerW
  const barW = groupCount > 0 ? groupW * BAR_WIDTH_RATIO : 0

  const xs: number[] = []
  const centers: number[] = []
  for (let i = 0; i < groupCount; i++) {
    const left = padL + groupW * i + (groupW - barW) / 2
    xs.push(left)
    centers.push(left + barW / 2)
  }

  const series: DistributionSeries[] = years.map((y, i) => {
    let cum = 0
    const bars: DistributionBar[] = y.buckets.map((value, bucketIndex) => {
      const yTop = projectDistributionValueY(cum + value, niceMax, innerH)
      const yBot = projectDistributionValueY(cum, niceMax, innerH)
      cum += value
      return { bucketIndex, value, yTop, yBot }
    })
    return {
      year: y.year,
      total: cum,
      bars,
      rate: y.rate,
      rateY: projectDistributionRateY(y.rate, innerH),
      centerX: centers[i] ?? padL,
    }
  })

  const ratePath = series
    .map(
      (s, i) =>
        `${i === 0 ? "M" : "L"} ${s.centerX.toFixed(2)} ${s.rateY.toFixed(2)}`
    )
    .join(" ")

  return {
    innerW,
    innerH,
    niceMax,
    barW,
    groupW,
    xs,
    centers,
    yTicksLeft,
    yTicksRight: DISTRIBUTION_RATE_TICKS,
    series,
    ratePath,
  }
}
