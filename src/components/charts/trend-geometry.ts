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

  const avg = years.length
    ? years.reduce((s, y) => s + y.rate, 0) / years.length
    : 0
  const avgY = projectRate(avg)

  const linePath = xs
    .map((x, i) => `${i === 0 ? "M" : "L"} ${x.toFixed(2)} ${ys[i].toFixed(2)}`)
    .join(" ")

  const last = xs.length - 1
  const baseY = padT + innerH
  const areaPath =
    xs.length > 0
      ? `${linePath} L ${xs[last]} ${baseY} L ${xs[0]} ${baseY} Z`
      : ""

  return { innerW, innerH, xs, ys, avg, avgY, linePath, areaPath }
}
