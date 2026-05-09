export type TrendYear = {
  year: number
  rate: number
  deaths: number
  pop: number
}

export const TREND_PADDING = {
  left: 56,
  right: 24,
  top: 24,
  bottom: 36,
} as const

export const TREND_RATE_DOMAIN = { min: 0.8, max: 1.05 } as const

const MIN_INNER_WIDTH = 100

export type TrendGeometry = {
  innerW: number
  innerH: number
  xs: number[]
  ys: number[]
  avg: number
  avgY: number
  linePath: string
  areaPath: string
}

export const buildTrendGeometry = (
  years: TrendYear[],
  width: number,
  height: number
): TrendGeometry => {
  const { left: padL, right: padR, top: padT, bottom: padB } = TREND_PADDING
  const { min: minRate, max: maxRate } = TREND_RATE_DOMAIN

  const innerW = Math.max(MIN_INNER_WIDTH, width - padL - padR)
  const innerH = height - padT - padB

  const span = maxRate - minRate
  const projectRate = (rate: number): number =>
    padT + innerH * (1 - (rate - minRate) / span)

  const xs = years.map(
    (_y, i) => padL + (innerW * i) / Math.max(1, years.length - 1)
  )
  const ys = years.map((y) => projectRate(y.rate))

  // Partial / unavailable years carry rate = 0; exclude them from path,
  // average and area so the curve doesn't plunge to the bottom of the chart.
  const validIdx = years
    .map((y, i) => (Number.isFinite(y.rate) && y.rate > 0 ? i : -1))
    .filter((i) => i >= 0)

  const avg = validIdx.length
    ? validIdx.reduce((s, i) => s + years[i].rate, 0) / validIdx.length
    : 0
  const avgY = projectRate(avg)

  const linePath = validIdx
    .map(
      (i, k) => `${k === 0 ? "M" : "L"} ${xs[i].toFixed(2)} ${ys[i].toFixed(2)}`
    )
    .join(" ")

  const baseY = padT + innerH
  const areaPath =
    validIdx.length > 0
      ? `${linePath} L ${xs[validIdx[validIdx.length - 1]]} ${baseY} L ${xs[validIdx[0]]} ${baseY} Z`
      : ""

  return { innerW, innerH, xs, ys, avg, avgY, linePath, areaPath }
}
