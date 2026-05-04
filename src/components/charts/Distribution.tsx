import { useEffect, useRef, useState } from "react"

import {
  DISTRIBUTION_BUCKET_COUNT,
  DISTRIBUTION_PADDING,
  applyGenderFilter,
  buildDistributionGeometry,
  projectDistributionRateY,
  projectDistributionValueY,
  type DistributionGender,
  type DistributionYear,
} from "./distribution-geometry"

export type DistributionLabels = {
  deathsCount: string
  mortalityRate: string
  ageBuckets: string[]
}

export type DistributionProps = {
  years: DistributionYear[]
  gender: DistributionGender
  hovered: number | null
  setHovered: (year: number | null) => void
  labels: DistributionLabels
  height?: number
  formatCompact?: (n: number) => string
}

const BUCKET_OPACITY_PERCENT = [3, 6, 12, 19, 27, 35, 46, 58, 75, 100] as const

const VERTICAL_X_LABEL_THRESHOLD = 18
const X_LABEL_OFFSET = 20
const RATE_LABEL_OFFSET = 8
const RATE_LABEL_EVERY = 2
const VALUE_LABEL_MIN_RATIO = 0.05
const VALUE_LABEL_MIN_BAR_WIDTH = 18

const defaultFormatCompact = (n: number): string =>
  new Intl.NumberFormat(undefined, {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(n)

const fillForBucket = (i: number): string =>
  `color-mix(in srgb, var(--color-accent) ${BUCKET_OPACITY_PERCENT[i] ?? 0}%, transparent)`

const Distribution = ({
  years,
  gender,
  hovered,
  setHovered,
  labels,
  height = 460,
  formatCompact = defaultFormatCompact,
}: DistributionProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(900)

  useEffect(() => {
    const node = containerRef.current
    if (!node) return
    const ro = new ResizeObserver(([entry]) => {
      if (entry) setWidth(entry.contentRect.width)
    })
    ro.observe(node)
    return () => ro.disconnect()
  }, [])

  const filtered = applyGenderFilter(years, gender)
  const {
    innerW,
    innerH,
    barW,
    xs,
    yTicksLeft,
    yTicksRight,
    series,
    ratePath,
    niceMax,
  } = buildDistributionGeometry(filtered, width, height)
  const { left: padL, top: padT } = DISTRIBUTION_PADDING

  const useVerticalXLabels = series.length > VERTICAL_X_LABEL_THRESHOLD

  return (
    <div ref={containerRef} className="relative w-full">
      <svg
        width={width}
        height={height}
        style={{ display: "block", overflow: "visible" }}
      >
        {yTicksLeft.map((v) => {
          const y = projectDistributionValueY(v, niceMax, innerH)
          return (
            <g key={`ytl-${v}`}>
              <line
                x1={padL}
                y1={y}
                x2={padL + innerW}
                y2={y}
                stroke="var(--color-grid)"
                strokeWidth="1"
              />
              <text
                x={padL - 10}
                y={y + 3}
                textAnchor="end"
                fontSize="10"
                className="font-mono"
                fill="var(--color-text-faint)"
                letterSpacing="0.04em"
              >
                {formatCompact(v)}
              </text>
            </g>
          )
        })}

        {yTicksRight.map((v) => (
          <text
            key={`ytr-${v}`}
            x={padL + innerW + 10}
            y={projectDistributionRateY(v, innerH) + 3}
            fontSize="10"
            className="font-mono"
            fill="var(--color-text-faint)"
            letterSpacing="0.04em"
          >
            {v.toFixed(2)}%
          </text>
        ))}

        {series.map((s, i) => {
          const dimmed = hovered != null && hovered !== s.year
          return (
            <g
              key={`g-${s.year}`}
              data-year={s.year}
              onMouseEnter={() => setHovered(s.year)}
              onMouseLeave={() => setHovered(null)}
              style={{ cursor: "pointer" }}
            >
              <rect
                x={xs[i]}
                y={padT}
                width={barW}
                height={innerH}
                fill="transparent"
                pointerEvents="all"
              />
              {s.bars.map((b) => {
                const bh = Math.max(0, b.yBot - b.yTop)
                const isLarge = b.value > niceMax * VALUE_LABEL_MIN_RATIO
                const showLabel =
                  isLarge && barW > VALUE_LABEL_MIN_BAR_WIDTH && bh > 10
                return (
                  <g key={`b-${s.year}-${b.bucketIndex}`}>
                    <rect
                      x={xs[i]}
                      y={b.yTop}
                      width={barW}
                      height={bh}
                      fill={fillForBucket(b.bucketIndex)}
                      stroke="var(--color-surface)"
                      strokeWidth="0.5"
                      opacity={dimmed ? 0.4 : 1}
                    />
                    {showLabel && (
                      <text
                        x={xs[i]! + barW / 2}
                        y={(b.yTop + b.yBot) / 2 + 3}
                        textAnchor="middle"
                        fontSize="8.5"
                        className="font-mono"
                        fill={
                          b.bucketIndex >= 7
                            ? "var(--color-surface)"
                            : "var(--color-text-dim)"
                        }
                        style={{ pointerEvents: "none" }}
                      >
                        {formatCompact(b.value)}
                      </text>
                    )}
                  </g>
                )
              })}
            </g>
          )
        })}

        {series.length > 1 && (
          <path
            d={ratePath}
            fill="none"
            stroke="var(--color-danger)"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        )}

        {series.map((s, i) => {
          const showLabel = i % RATE_LABEL_EVERY === 0 || hovered === s.year
          return (
            <g key={`r-${s.year}`} style={{ pointerEvents: "none" }}>
              <circle
                cx={s.centerX}
                cy={s.rateY}
                r="3"
                fill="var(--color-surface)"
                stroke="var(--color-danger)"
                strokeWidth="1.5"
              />
              {showLabel && (
                <text
                  x={s.centerX}
                  y={s.rateY - RATE_LABEL_OFFSET}
                  textAnchor="middle"
                  fontSize="9"
                  className="font-mono"
                  fill="var(--color-danger)"
                  fontWeight="600"
                >
                  {s.rate.toFixed(2)}%
                </text>
              )}
            </g>
          )
        })}

        {series.map((s) => (
          <text
            key={`x-${s.year}`}
            x={s.centerX}
            y={padT + innerH + X_LABEL_OFFSET}
            textAnchor="middle"
            fontSize="10"
            className="font-mono"
            fill="var(--color-text-dim)"
            letterSpacing="0.04em"
            style={
              useVerticalXLabels
                ? { writingMode: "vertical-rl", textOrientation: "mixed" }
                : undefined
            }
          >
            {s.year}
          </text>
        ))}

        <text
          x={padL - 44}
          y={padT - 6}
          fontSize="9.5"
          className="font-mono uppercase"
          fill="var(--color-text-faint)"
          letterSpacing="0.08em"
        >
          {labels.deathsCount}
        </text>
        <text
          x={padL + innerW + 34}
          y={padT - 6}
          fontSize="9.5"
          className="font-mono uppercase"
          fill="var(--color-danger)"
          letterSpacing="0.08em"
        >
          {labels.mortalityRate}
        </text>
      </svg>

      <div
        className="font-mono text-text-dim flex flex-wrap"
        style={{
          gap: 14,
          marginTop: 8,
          paddingLeft: padL,
          fontSize: 10,
          letterSpacing: "0.04em",
        }}
      >
        {Array.from({ length: DISTRIBUTION_BUCKET_COUNT }, (_, i) => (
          <div
            key={`legend-${i}`}
            style={{ display: "flex", alignItems: "center", gap: 5 }}
          >
            <div
              style={{
                width: 10,
                height: 10,
                background: fillForBucket(i),
                border: "1px solid var(--color-border)",
              }}
            />
            <span>{labels.ageBuckets[i] ?? ""}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Distribution

export type {
  DistributionGender,
  DistributionYear,
} from "./distribution-geometry"
