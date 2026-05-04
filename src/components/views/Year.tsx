import { useMemo, useState } from "react"

import { Card, Label, Mini, Stat } from "@/components/atoms"
import Monthly, { type MonthlyLabels } from "@/components/charts/Monthly"
import type {
  MonthlyEvent,
  MonthlyHover,
  MonthlyYear,
} from "@/components/charts/monthly-geometry"
import Trend, { type TrendChartType } from "@/components/charts/Trend"
import type { TrendYear } from "@/components/charts/trend-geometry"
import type { YearEvent } from "@/data/events"

export type YearData = {
  year: number
  rate: number
  deaths: number
  pop: number
  monthly: number[]
}

export type YearLabels = {
  // Headline strip
  mortalityRate: string
  deathsCount: string
  population: string
  yearOverYear: string
  partial: string
  sinceAvg: string
  // Trend card
  trend: string
  trendSubtitle: string
  rateMin: string
  rateMax: string
  avgLabel: string
  // Monthly card
  monthlyDeaths: string
  monthlySubtitle: string
  peak: string
  months: string[]
  monthsLong: string[]
  // Events card
  notableEvents: string
  // Scrubber
  yearLabel: string
}

export type YearProps = {
  years: YearData[]
  activeYear: number
  onActiveYearChange: (year: number) => void
  events: YearEvent[]
  labels: YearLabels
  locale: string
  partialYear?: number
  chartType?: TrendChartType
  compact?: boolean
}

const fmtNumber = (n: number, locale: string): string =>
  new Intl.NumberFormat(locale).format(n)

const fmtCompact = (n: number, locale: string): string =>
  new Intl.NumberFormat(locale, {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(n)

const fmtRate = (rate: number): string => rate.toFixed(3)

const Year = ({
  years,
  activeYear,
  onActiveYearChange,
  events,
  labels,
  locale,
  partialYear,
  chartType = "area",
  compact = false,
}: YearProps) => {
  const sorted = useMemo(
    () => [...years].sort((a, b) => a.year - b.year),
    [years]
  )

  const active =
    sorted.find((y) => y.year === activeYear) ?? sorted[sorted.length - 1]

  const fullYears = useMemo(
    () => sorted.filter((y) => y.year !== partialYear),
    [sorted, partialYear]
  )

  const avgRate = useMemo(
    () =>
      fullYears.length > 0
        ? fullYears.reduce((s, y) => s + y.rate, 0) / fullYears.length
        : 0,
    [fullYears]
  )

  const rateMin = useMemo(
    () =>
      fullYears.length > 0 ? Math.min(...fullYears.map((y) => y.rate)) : 0,
    [fullYears]
  )

  const rateMax = useMemo(
    () =>
      fullYears.length > 0 ? Math.max(...fullYears.map((y) => y.rate)) : 0,
    [fullYears]
  )

  const yoyDelta = useMemo(() => {
    if (!active) return 0
    const idx = sorted.findIndex((y) => y.year === active.year)
    const prev = idx > 0 ? sorted[idx - 1] : null
    return prev ? ((active.rate - prev.rate) / prev.rate) * 100 : 0
  }, [active, sorted])

  const vsAvgDelta = useMemo(() => {
    if (!active || avgRate === 0) return 0
    return ((active.rate - avgRate) / avgRate) * 100
  }, [active, avgRate])

  const yearEvents = useMemo(
    () => (active ? events.filter((e) => e.year === active.year) : []),
    [events, active]
  )

  const isPartial = active?.year === partialYear

  // Adapt YearData → chart types
  const trendYears: TrendYear[] = useMemo(
    () =>
      sorted.map((y) => ({
        year: y.year,
        rate: y.rate,
        deaths: y.deaths,
        pop: y.pop,
      })),
    [sorted]
  )

  const monthlyYears: MonthlyYear[] = useMemo(
    () => sorted.map((y) => ({ year: y.year, monthly: y.monthly })),
    [sorted]
  )

  const monthlyEvents: MonthlyEvent[] = useMemo(
    () =>
      yearEvents.map((e) => ({ year: e.year, month: e.month, label: e.label })),
    [yearEvents]
  )

  const [monthlyHover, setMonthlyHover] = useState<MonthlyHover | null>(null)

  const peakValue = active ? Math.max(...active.monthly) : 0
  const peakMonthIdx = active ? active.monthly.indexOf(peakValue) : 0
  const peakLabel = `${fmtNumber(peakValue, locale)} · ${labels.monthsLong[peakMonthIdx] ?? ""}`

  const yoySign = yoyDelta >= 0 ? "+" : ""

  const yearStart = sorted[0]?.year ?? activeYear
  const yearEnd = sorted[sorted.length - 1]?.year ?? activeYear

  const sectionGap = compact ? 16 : 28

  return (
    <div
      data-testid="view-year"
      style={{ display: "flex", flexDirection: "column", gap: sectionGap }}
    >
      <Card
        data-testid="year-scrubber"
        data-partial={isPartial ? "true" : undefined}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
          }}
        >
          <Label>{labels.yearLabel}</Label>
          <span
            className="font-mono tabular-nums text-text"
            style={{ fontSize: 12, fontWeight: 600 }}
          >
            {active?.year ?? activeYear}
            {isPartial ? ` · ${labels.partial}` : ""}
          </span>
        </div>
        <input
          type="range"
          data-testid="year-scrubber-input"
          min={yearStart}
          max={yearEnd}
          value={active?.year ?? activeYear}
          onChange={(e) => onActiveYearChange(Number(e.target.value))}
          style={{ width: "100%", marginTop: 6 }}
        />
        <div
          className="font-mono text-text-faint uppercase"
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 10,
            letterSpacing: "0.1em",
            marginTop: 4,
          }}
        >
          <span>{yearStart}</span>
          <span>{yearEnd}</span>
        </div>
      </Card>

      <div
        data-testid="year-headline"
        style={{
          display: "grid",
          gridTemplateColumns: "1.5fr 1fr 1fr 1fr",
          gap: 1,
          background: "var(--color-border)",
          border: "1px solid var(--color-border)",
        }}
      >
        <Stat
          label={labels.mortalityRate}
          value={active ? fmtRate(active.rate) : "—"}
          unit="%"
          sub={
            active
              ? `${active.year}${isPartial ? ` · ${labels.partial}` : ""}`
              : undefined
          }
          delta={vsAvgDelta}
          deltaLabel={labels.sinceAvg}
          big
        />
        <Stat
          label={labels.deathsCount}
          value={active ? fmtNumber(active.deaths, locale) : "—"}
        />
        <Stat
          label={labels.population}
          value={active ? fmtCompact(active.pop, locale) : "—"}
        />
        <Stat
          label={labels.yearOverYear}
          value={`${yoySign}${yoyDelta.toFixed(2)}%`}
          colorize={yoyDelta}
        />
      </div>

      <Card data-testid="year-trend">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            marginBottom: 18,
          }}
        >
          <div>
            <Label>
              {labels.mortalityRate} · {labels.trend}
            </Label>
            <div
              className="text-text-dim"
              style={{ fontSize: 12, marginTop: 4 }}
            >
              {labels.trendSubtitle}
            </div>
          </div>
          <div style={{ display: "flex", gap: 24 }}>
            <Mini label={labels.rateMin} value={`${fmtRate(rateMin)}%`} />
            <Mini label={labels.rateMax} value={`${fmtRate(rateMax)}%`} />
            <Mini label={labels.avgLabel} value={`${fmtRate(avgRate)}%`} />
          </div>
        </div>
        <Trend
          years={trendYears}
          chartType={chartType}
          hoveredYear={active?.year ?? null}
          setHoveredYear={(y) => {
            if (y != null) onActiveYearChange(y)
          }}
          labels={{
            mortalityRate: labels.mortalityRate,
            deathsCount: labels.deathsCount,
            population: labels.population,
            avgLabel: labels.avgLabel,
          }}
        />
      </Card>

      <Card data-testid="year-monthly">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            marginBottom: 18,
          }}
        >
          <div>
            <Label>
              {labels.monthlyDeaths} · {active?.year ?? activeYear}
            </Label>
            <div
              className="text-text-dim"
              style={{ fontSize: 12, marginTop: 4 }}
            >
              {labels.monthlySubtitle}
            </div>
          </div>
          {active && <Mini label={labels.peak} value={peakLabel} />}
        </div>
        <Monthly
          years={monthlyYears}
          mode="single"
          selected={active ? [active.year] : []}
          events={monthlyEvents}
          hovered={monthlyHover}
          setHovered={setMonthlyHover}
          labels={
            {
              months: labels.months,
              monthsLong: labels.monthsLong,
              deathsCount: labels.deathsCount,
            } as MonthlyLabels
          }
        />
      </Card>

      {yearEvents.length > 0 && (
        <Card data-testid="year-events">
          <Label>
            {labels.notableEvents} · {active?.year ?? activeYear}
          </Label>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 12,
              marginTop: 14,
            }}
          >
            {yearEvents.map((ev) => (
              <div
                key={`${ev.year}-${ev.month}-${ev.label}`}
                data-event-month={ev.month}
                style={{
                  display: "flex",
                  gap: 16,
                  paddingBottom: 12,
                  borderBottom: "1px solid var(--color-border)",
                }}
              >
                <div
                  className="font-mono text-warn uppercase"
                  style={{
                    fontSize: 11,
                    letterSpacing: "0.06em",
                    minWidth: 110,
                  }}
                >
                  {labels.monthsLong[ev.month - 1] ?? ""} {ev.year}
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    className="text-text"
                    style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}
                  >
                    {ev.label}
                  </div>
                  <div className="text-text-dim" style={{ fontSize: 12 }}>
                    {ev.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}

export default Year
