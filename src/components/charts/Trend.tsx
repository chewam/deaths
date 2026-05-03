import { useEffect, useId, useRef, useState } from "react"

import {
  TREND_PADDING,
  buildTrendGeometry,
  type TrendYear,
} from "./trend-geometry"

export type TrendChartType = "line" | "area"

export type TrendLabels = {
  mortalityRate: string
  deathsCount: string
  population: string
}

export type TrendProps = {
  years: TrendYear[]
  chartType: TrendChartType
  hoveredYear: number | null
  setHoveredYear: (year: number | null) => void
  labels: TrendLabels
  height?: number
  formatRate?: (rate: number) => string
  formatDeaths?: (n: number) => string
  formatPopulation?: (n: number) => string
}

const Y_TICKS = [0.85, 0.9, 0.95, 1.0] as const
const X_LABEL_EVERY = 4

const defaultFormatRate = (rate: number): string => `${rate.toFixed(3)}%`
const defaultFormatNumber = (n: number): string => n.toLocaleString("en-US")
const defaultFormatCompact = (n: number): string =>
  new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(n)

const Trend = ({
  years,
  chartType,
  hoveredYear,
  setHoveredYear,
  labels,
  height = 340,
  formatRate = defaultFormatRate,
  formatDeaths = defaultFormatNumber,
  formatPopulation = defaultFormatCompact,
}: TrendProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(800)
  const gradientId = `trend-area-${useId().replace(/[:]/g, "")}`

  useEffect(() => {
    const node = containerRef.current
    if (!node) return
    const ro = new ResizeObserver(([entry]) => {
      if (entry) setWidth(entry.contentRect.width)
    })
    ro.observe(node)
    return () => ro.disconnect()
  }, [])

  const { left: padL, top: padT } = TREND_PADDING
  const { innerW, innerH, xs, ys, avg, avgY, linePath, areaPath } =
    buildTrendGeometry(years, width, height)

  const projectTickY = (rate: number): number => {
    const span = 1.05 - 0.8
    return padT + innerH * (1 - (rate - 0.8) / span)
  }

  const hoveredIndex =
    hoveredYear == null ? -1 : years.findIndex((y) => y.year === hoveredYear)
  const hovered = hoveredIndex >= 0 ? years[hoveredIndex] : null

  return (
    <div ref={containerRef} className="relative w-full">
      <svg
        width={width}
        height={height}
        style={{ display: "block", overflow: "visible" }}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="0%"
              style={{ stopColor: "var(--color-accent)", stopOpacity: 0.16 }}
            />
            <stop
              offset="100%"
              style={{ stopColor: "var(--color-accent)", stopOpacity: 0 }}
            />
          </linearGradient>
        </defs>

        {Y_TICKS.map((v) => {
          const y = projectTickY(v)
          return (
            <g key={v}>
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
                {v.toFixed(2)}
              </text>
            </g>
          )
        })}

        {years.length > 0 && (
          <>
            <line
              x1={padL}
              y1={avgY}
              x2={padL + innerW}
              y2={avgY}
              stroke="var(--color-text-faint)"
              strokeWidth="1"
              strokeDasharray="2 4"
              opacity="0.7"
            />
            <text
              x={padL + innerW}
              y={avgY - 4}
              textAnchor="end"
              fontSize="9.5"
              className="font-mono uppercase"
              fill="var(--color-text-dim)"
              letterSpacing="0.05em"
            >
              AVG {avg.toFixed(3)}
            </text>
          </>
        )}

        {chartType === "area" && years.length > 0 && (
          <path d={areaPath} fill={`url(#${gradientId})`} />
        )}

        {years.length > 0 && (
          <path
            d={linePath}
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth="2"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        )}

        {years.map((y, i) => {
          const isHover = hoveredYear === y.year
          return (
            <g key={`pt-${y.year}`}>
              <circle
                cx={xs[i]}
                cy={ys[i]}
                r={isHover ? 5 : 3}
                fill="var(--color-surface)"
                stroke="var(--color-accent)"
                strokeWidth="2"
              />
              <circle
                cx={xs[i]}
                cy={ys[i]}
                r={12}
                fill="transparent"
                style={{ cursor: "pointer" }}
                onMouseEnter={() => setHoveredYear(y.year)}
                onMouseLeave={() => setHoveredYear(null)}
              />
            </g>
          )
        })}

        {years.map((y, i) => {
          if (i % X_LABEL_EVERY !== 0 && i !== years.length - 1) return null
          return (
            <text
              key={`xlabel-${y.year}`}
              x={xs[i]}
              y={padT + innerH + 18}
              textAnchor="middle"
              fontSize="10.5"
              className="font-mono"
              fill="var(--color-text-dim)"
              letterSpacing="0.05em"
            >
              {y.year}
            </text>
          )
        })}

        {hovered && (
          <line
            x1={xs[hoveredIndex]}
            y1={padT}
            x2={xs[hoveredIndex]}
            y2={padT + innerH}
            stroke="var(--color-accent)"
            strokeWidth="1"
            strokeDasharray="2 3"
            opacity="0.4"
          />
        )}
      </svg>

      {hovered && (
        <div
          className="font-body bg-surface border-border text-text pointer-events-none absolute"
          style={{
            left: Math.min(width - 200, Math.max(8, xs[hoveredIndex] + 12)),
            top: Math.max(8, ys[hoveredIndex] - 70),
            border: "1px solid var(--color-border)",
            padding: "10px 12px",
            fontSize: 11.5,
            lineHeight: 1.5,
            minWidth: 160,
            boxShadow: "0 4px 12px rgb(0 0 0 / 0.06)",
          }}
        >
          <div
            className="font-mono uppercase"
            style={{
              fontSize: 10,
              letterSpacing: "0.08em",
              color: "var(--color-text-faint)",
              marginBottom: 4,
            }}
          >
            {hovered.year}
          </div>
          <TooltipRow
            label={labels.mortalityRate}
            value={formatRate(hovered.rate)}
            bold
          />
          <TooltipRow
            label={labels.deathsCount}
            value={formatDeaths(hovered.deaths)}
          />
          <TooltipRow
            label={labels.population}
            value={formatPopulation(hovered.pop)}
          />
        </div>
      )}
    </div>
  )
}

const TooltipRow = ({
  label,
  value,
  bold = false,
}: {
  label: string
  value: string
  bold?: boolean
}) => (
  <div className="flex justify-between gap-4">
    <span className="text-text-dim">{label}</span>
    <span className={`font-mono${bold ? " font-semibold" : ""}`}>{value}</span>
  </div>
)

export default Trend
