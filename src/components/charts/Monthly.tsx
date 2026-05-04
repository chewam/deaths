import { useEffect, useRef, useState } from "react"

import {
  MONTHLY_PADDING,
  buildMonthlyGeometry,
  projectMonthlyTickY,
  type MonthlyEvent,
  type MonthlyHover,
  type MonthlyYear,
} from "./monthly-geometry"

export type MonthlyMode = "single" | "compare"

export type MonthlyLabels = {
  months: string[]
  monthsLong: string[]
  deathsCount: string
}

export type MonthlyProps = {
  years: MonthlyYear[]
  mode: MonthlyMode
  selected: number[]
  events: MonthlyEvent[]
  hovered: MonthlyHover | null
  setHovered: (h: MonthlyHover | null) => void
  labels: MonthlyLabels
  height?: number
  formatNumber?: (n: number) => string
  formatCompact?: (n: number) => string
}

const COMPARE_COLORS = [
  "var(--color-accent)",
  "var(--color-male)",
  "var(--color-female)",
  "var(--color-warn)",
  "var(--color-danger)",
  "var(--color-text-dim)",
  "var(--color-text)",
] as const

const defaultFormatNumber = (n: number): string => n.toLocaleString("en-US")
const defaultFormatCompact = (n: number): string =>
  new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(n)

const Monthly = ({
  years,
  mode,
  selected,
  events,
  hovered,
  setHovered,
  labels,
  height = 420,
  formatNumber = defaultFormatNumber,
  formatCompact = defaultFormatCompact,
}: MonthlyProps) => {
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

  const { left: padL, top: padT } = MONTHLY_PADDING
  const { innerW, innerH, maxV, xs, yTicks, series } = buildMonthlyGeometry(
    years,
    width,
    height
  )

  const isSingle = mode === "single"

  const highlighted = isSingle
    ? series.slice(-1)
    : (selected
        .map((yr) => series.find((s) => s.year === yr))
        .filter(Boolean) as typeof series)

  const ghosts = isSingle ? series.slice(0, -1) : []

  const visibleEvents = isSingle
    ? events.filter((ev) => series.some((s) => s.year === ev.year))
    : []

  const colorFor = (idx: number) =>
    COMPARE_COLORS[idx % COMPARE_COLORS.length] as string

  const hoveredSeries =
    hovered == null
      ? null
      : (series.find((s) => s.year === hovered.year) ?? null)
  const hoveredX = hovered == null ? null : (xs[hovered.month] ?? null)
  const hoveredY =
    hoveredSeries == null || hovered == null
      ? null
      : (hoveredSeries.ys[hovered.month] ?? null)
  const hoveredValue =
    hoveredSeries == null || hovered == null
      ? null
      : (hoveredSeries.values[hovered.month] ?? null)

  return (
    <div ref={containerRef} className="relative w-full">
      <svg
        width={width}
        height={height}
        style={{ display: "block", overflow: "visible" }}
      >
        {yTicks.map((v) => {
          const y = projectMonthlyTickY(v, maxV, innerH)
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
                {formatCompact(v)}
              </text>
            </g>
          )
        })}

        {labels.months.map((m, i) => (
          <text
            key={i}
            x={xs[i]}
            y={padT + innerH + 22}
            textAnchor="middle"
            fontSize="10.5"
            className="font-mono uppercase"
            fill="var(--color-text-dim)"
            letterSpacing="0.05em"
          >
            {m}
          </text>
        ))}

        {ghosts.map((s) => (
          <path
            key={`ghost-${s.year}`}
            d={s.linePath}
            fill="none"
            stroke="var(--color-text-faint)"
            strokeWidth="1"
            opacity="0.18"
          />
        ))}

        {highlighted.map((s, idx) => {
          const color = isSingle ? "var(--color-accent)" : colorFor(idx)
          const strokeWidth = isSingle ? 2.2 : 1.8
          return (
            <g key={`series-${s.year}`}>
              <path
                d={s.linePath}
                fill="none"
                stroke={color}
                strokeWidth={strokeWidth}
                strokeLinejoin="round"
                strokeLinecap="round"
              />
              {s.ys.map((y, m) => {
                const isHover = hovered?.year === s.year && hovered.month === m
                return (
                  <g key={`pt-${s.year}-${m}`}>
                    <circle
                      cx={xs[m]}
                      cy={y}
                      r={isHover ? 5 : 2.5}
                      fill="var(--color-surface)"
                      stroke={color}
                      strokeWidth="1.5"
                    />
                    <circle
                      cx={xs[m]}
                      cy={y}
                      r={14}
                      fill="transparent"
                      style={{ cursor: "pointer" }}
                      onMouseEnter={() =>
                        setHovered({ year: s.year, month: m })
                      }
                      onMouseLeave={() => setHovered(null)}
                    />
                  </g>
                )
              })}
            </g>
          )
        })}

        {visibleEvents.map((ev, i) => {
          const s = series.find((ss) => ss.year === ev.year)
          if (!s) return null
          const yPx = s.ys[ev.month]
          const x = xs[ev.month]
          if (yPx == null || x == null) return null
          const labelY = padT + (i % 3) * 18 + 4
          const labelText = ev.label
          const labelW = labelText.length * 5.5 + 12
          return (
            <g key={`ev-${ev.year}-${ev.month}`}>
              <line
                x1={x}
                y1={yPx}
                x2={x}
                y2={labelY + 12}
                stroke="var(--color-warn)"
                strokeWidth="1"
                strokeDasharray="2 2"
                opacity="0.5"
              />
              <circle
                cx={x}
                cy={yPx}
                r="6"
                fill="none"
                stroke="var(--color-warn)"
                strokeWidth="1.5"
              />
              <rect
                x={x + 6}
                y={labelY}
                width={labelW}
                height={14}
                fill="var(--color-surface)"
                stroke="var(--color-warn)"
                strokeWidth="1"
                rx="2"
              />
              <text
                x={x + 12}
                y={labelY + 10}
                fontSize="9.5"
                className="font-mono"
                fill="var(--color-warn)"
                letterSpacing="0.03em"
              >
                {labelText}
              </text>
            </g>
          )
        })}

        {!isSingle && (
          <g transform={`translate(${padL}, ${padT - 18})`}>
            {highlighted.map((s, idx) => (
              <g
                key={`legend-${s.year}`}
                transform={`translate(${idx * 70}, 0)`}
              >
                <line
                  x1="0"
                  y1="0"
                  x2="14"
                  y2="0"
                  stroke={colorFor(idx)}
                  strokeWidth="2"
                />
                <text
                  x="20"
                  y="3"
                  fontSize="10.5"
                  className="font-mono"
                  fill="var(--color-text)"
                >
                  {s.year}
                </text>
              </g>
            ))}
          </g>
        )}
      </svg>

      {hovered != null &&
        hoveredSeries != null &&
        hoveredX != null &&
        hoveredY != null &&
        hoveredValue != null && (
          <div
            className="font-body bg-surface text-text pointer-events-none absolute"
            style={{
              left: Math.min(width - 220, Math.max(8, hoveredX + 12)),
              top: Math.max(8, hoveredY - 70),
              border: "1px solid var(--color-border)",
              padding: "10px 12px",
              fontSize: 11.5,
              lineHeight: 1.5,
              minWidth: 180,
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
              {labels.monthsLong[hovered.month]} {hovered.year}
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-text-dim">{labels.deathsCount}</span>
              <span className="font-mono font-semibold">
                {formatNumber(hoveredValue)}
              </span>
            </div>
          </div>
        )}
    </div>
  )
}

export default Monthly
