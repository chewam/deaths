import type { ReactNode } from "react"

export type OverviewYear = {
  year: number
  rate: number
  deaths: number
  pop: number
  buckets: number[]
}

export type OverviewGridLabels = {
  mortalityRate: string
  deathsCount: string
  population: string
  partial: string
}

export type OverviewGridProps = {
  years: OverviewYear[]
  labels: OverviewGridLabels
  locale: string
  partialYear?: number
  onSelectYear?: (year: number) => void
  compact?: boolean
}

const TREND_THRESHOLD = 0.01
const DONUT_BUCKET_COUNT = 10

const BUCKET_OPACITY_PERCENT = [6, 10, 15, 20, 27, 35, 45, 58, 74, 100] as const

const fmtNumber = (n: number, locale: string): string =>
  new Intl.NumberFormat(locale).format(n)

const fmtRate = (rate: number): string => `${rate.toFixed(3)}%`

const fillForBucket = (i: number): string =>
  `color-mix(in srgb, var(--color-accent) ${BUCKET_OPACITY_PERCENT[i] ?? 0}%, transparent)`

const OverviewGrid = ({
  years,
  labels,
  locale,
  partialYear,
  onSelectYear,
  compact = false,
}: OverviewGridProps) => {
  const sorted = [...years].sort((a, b) => b.year - a.year)
  const yearMap = new Map(years.map((y) => [y.year, y]))
  const padding = compact ? 18 : 22
  const minHeight = compact ? 180 : 220
  const donutSize = compact ? 130 : 150

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
        gap: 1,
        background: "var(--color-border)",
        border: "1px solid var(--color-border)",
      }}
    >
      {sorted.map((y) => {
        const prev = yearMap.get(y.year - 1)
        const isPartial = y.year === partialYear
        const trend = prev ? (y.rate - prev.rate) / prev.rate : 0
        const trendUp = !isPartial && trend > TREND_THRESHOLD
        const trendDown = !isPartial && trend < -TREND_THRESHOLD

        return (
          <button
            key={y.year}
            data-year={y.year}
            type="button"
            onClick={() => onSelectYear?.(y.year)}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--color-accent-soft)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "var(--color-surface)"
            }}
            style={{
              all: "unset",
              cursor: "pointer",
              background: "var(--color-surface)",
              padding,
              minHeight,
              display: "flex",
              flexDirection: "column",
              gap: 10,
              transition: "background 140ms",
              position: "relative",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "stretch",
                gap: 14,
                flex: 1,
              }}
            >
              <div
                style={{
                  flex: 1,
                  minWidth: 0,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div
                    className="tracking-display text-text font-mono"
                    style={{
                      fontSize: 26,
                      lineHeight: 1,
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {y.year}
                  </div>
                  {trendUp && (
                    <TrendBadge
                      direction="up"
                      label={`+${(trend * 100).toFixed(1)}%`}
                    />
                  )}
                  {trendDown && (
                    <TrendBadge
                      direction="down"
                      label={`${(trend * 100).toFixed(1)}%`}
                    />
                  )}
                </div>
                {isPartial && (
                  <div
                    data-partial="true"
                    className="font-mono text-text-faint uppercase"
                    style={{
                      fontSize: 9,
                      letterSpacing: "0.08em",
                      marginTop: 2,
                    }}
                  >
                    {labels.partial}
                  </div>
                )}

                <div
                  style={{
                    marginTop: "auto",
                    paddingTop: 12,
                    display: "flex",
                    flexDirection: "column",
                    gap: 6,
                  }}
                >
                  <div>
                    <div
                      className="font-mono text-text"
                      style={{
                        fontSize: 17,
                        fontWeight: 600,
                        lineHeight: 1.1,
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {isPartial ? "—" : fmtRate(y.rate)}
                    </div>
                    <Label>{labels.mortalityRate}</Label>
                  </div>
                  <div>
                    <div
                      className="font-mono text-text"
                      style={{
                        fontSize: 13,
                        lineHeight: 1.2,
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {fmtNumber(y.deaths, locale)}
                    </div>
                    <Label>{labels.deathsCount}</Label>
                  </div>
                  <div>
                    <div
                      className="font-mono text-text-dim"
                      style={{
                        fontSize: 11,
                        lineHeight: 1.2,
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {fmtNumber(y.pop, locale)}
                    </div>
                    <Label>{labels.population}</Label>
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <MiniDonut buckets={y.buckets} size={donutSize} />
              </div>
            </div>
          </button>
        )
      })}
    </div>
  )
}

const Label = ({ children }: { children: ReactNode }) => (
  <div
    className="font-mono text-text-faint uppercase"
    style={{ fontSize: 10, letterSpacing: "0.1em" }}
  >
    {children}
  </div>
)

const TrendBadge = ({
  direction,
  label,
}: {
  direction: "up" | "down"
  label: string
}) => {
  const color =
    direction === "up" ? "var(--color-danger)" : "var(--color-success)"
  const path =
    direction === "up" ? (
      <>
        <path d="M6 18 L18 6" />
        <path d="M9 6 L18 6 L18 15" />
      </>
    ) : (
      <>
        <path d="M6 6 L18 18" />
        <path d="M18 9 L18 18 L9 18" />
      </>
    )
  return (
    <div
      data-trend={direction}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        padding: "3px 7px",
        background: `color-mix(in srgb, ${color} 8%, transparent)`,
        border: `1px solid color-mix(in srgb, ${color} 25%, transparent)`,
        borderRadius: 3,
      }}
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {path}
      </svg>
      <span
        className="font-mono"
        style={{
          fontSize: 11,
          fontWeight: 600,
          color,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {label}
      </span>
    </div>
  )
}

const DONUT_LABELS = [
  "0-9",
  "10-19",
  "20-29",
  "30-39",
  "40-49",
  "50-59",
  "60-69",
  "70-79",
  "80-89",
  "90+",
] as const

const MiniDonut = ({
  buckets,
  size = 130,
}: {
  buckets: number[]
  size?: number
}) => {
  const cx = size / 2
  const cy = size / 2
  const r = size / 2 - 4
  const ir = r * 0.55
  const total = buckets.reduce((a, b) => a + b, 0)

  const safeTotal = total > 0 ? total : 1

  let cum = 0
  const arcs = Array.from({ length: DONUT_BUCKET_COUNT }, (_, i) => {
    const v = buckets[i] ?? 0
    const startA = (cum / safeTotal) * Math.PI * 2 - Math.PI / 2
    cum += v
    const endA = (cum / safeTotal) * Math.PI * 2 - Math.PI / 2
    const large = endA - startA > Math.PI ? 1 : 0
    const x1 = cx + r * Math.cos(startA)
    const y1 = cy + r * Math.sin(startA)
    const x2 = cx + r * Math.cos(endA)
    const y2 = cy + r * Math.sin(endA)
    const x3 = cx + ir * Math.cos(endA)
    const y3 = cy + ir * Math.sin(endA)
    const x4 = cx + ir * Math.cos(startA)
    const y4 = cy + ir * Math.sin(startA)
    const d = `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} L ${x3} ${y3} A ${ir} ${ir} 0 ${large} 0 ${x4} ${y4} Z`
    return { d, fill: fillForBucket(i), bucketIndex: i, value: v }
  })

  const ranked = buckets.map((v, i) => ({ v, i })).sort((a, b) => b.v - a.v)
  const topIdxs = new Set(
    [ranked[0]?.i, ranked[1]?.i].filter(
      (i): i is number => typeof i === "number"
    )
  )

  let cum2 = 0
  const annotations = Array.from({ length: DONUT_BUCKET_COUNT }, (_, i) => {
    const v = buckets[i] ?? 0
    const start = cum2 / safeTotal
    cum2 += v
    const mid = (start + cum2 / safeTotal) / 2
    if (!topIdxs.has(i)) return null
    const a = mid * Math.PI * 2 - Math.PI / 2
    const lr = (r + ir) / 2
    const lx = cx + lr * Math.cos(a)
    const ly = cy + lr * Math.sin(a)
    // Last 3 buckets ride a darker accent fill → switch text to surface for readability.
    const onDarkFill = i >= 7
    return {
      x: lx,
      y: ly,
      label: DONUT_LABELS[i] ?? "",
      color: onDarkFill ? "var(--color-surface)" : "var(--color-text)",
    }
  }).filter((a): a is NonNullable<typeof a> => a !== null)

  return (
    <svg width={size} height={size} style={{ flexShrink: 0 }}>
      {arcs.map((a) => (
        <path
          key={`arc-${a.bucketIndex}`}
          d={a.d}
          fill={a.fill}
          data-bucket={a.bucketIndex}
        />
      ))}
      {annotations.map((ann, i) => (
        <text
          key={`ann-${i}`}
          x={ann.x}
          y={ann.y + 2}
          textAnchor="middle"
          fontSize={size > 110 ? "10" : "8"}
          className="font-mono"
          fill={ann.color}
          letterSpacing="0.02em"
        >
          {ann.label}
        </text>
      ))}
    </svg>
  )
}

export default OverviewGrid
