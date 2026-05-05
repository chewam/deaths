import { useMemo, useState } from "react"

import { Card, Label, Pill } from "@/components/atoms"
import Monthly, { type MonthlyLabels } from "@/components/charts/Monthly"
import type {
  MonthlyEvent,
  MonthlyHover,
} from "@/components/charts/monthly-geometry"

export type ComparisonYearData = {
  year: number
  monthly: number[]
}

export type ComparisonLabels = {
  monthlyDeaths: string
  comparison: string
  selectYears: string
  selectedSubtitle: string
  months: string[]
  monthsLong: string[]
  deathsCount: string
}

export type ComparisonProps = {
  years: ComparisonYearData[]
  selected: number[]
  onSelectedChange: (years: number[]) => void
  events: MonthlyEvent[]
  labels: ComparisonLabels
  locale: string
  compact?: boolean
  maxSelected?: number
}

const fmtNumber = (n: number, locale: string): string =>
  new Intl.NumberFormat(locale).format(n)

const fmtCompact = (n: number, locale: string): string =>
  new Intl.NumberFormat(locale, {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(n)

const Comparison = ({
  years,
  selected,
  onSelectedChange,
  events,
  labels,
  locale,
  compact = false,
  maxSelected = 7,
}: ComparisonProps) => {
  const sorted = useMemo(
    () => [...years].sort((a, b) => a.year - b.year),
    [years]
  )

  const [monthlyHover, setMonthlyHover] = useState<MonthlyHover | null>(null)

  const toggleYear = (year: number) => {
    if (selected.includes(year)) {
      onSelectedChange(selected.filter((y) => y !== year))
      return
    }
    if (selected.length >= maxSelected) return
    onSelectedChange([...selected, year])
  }

  const sectionGap = compact ? 16 : 28

  const monthlyLabels: MonthlyLabels = {
    months: labels.months,
    monthsLong: labels.monthsLong,
    deathsCount: labels.deathsCount,
  }

  return (
    <div
      data-testid="view-comparison"
      style={{ display: "flex", flexDirection: "column", gap: sectionGap }}
    >
      <Card data-testid="comparison-compare">
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
              {labels.monthlyDeaths} · {labels.comparison}
            </Label>
            <div
              className="text-text-dim"
              style={{ fontSize: 12, marginTop: 4 }}
            >
              {labels.selectedSubtitle}
            </div>
          </div>
        </div>
        <Monthly
          years={sorted}
          mode="compare"
          selected={selected}
          events={events}
          hovered={monthlyHover}
          setHovered={setMonthlyHover}
          labels={monthlyLabels}
          formatNumber={(n) => fmtNumber(n, locale)}
          formatCompact={(n) => fmtCompact(n, locale)}
        />
      </Card>

      <Card data-testid="comparison-picker">
        <Label>{labels.selectYears}</Label>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 6,
            marginTop: 12,
          }}
        >
          {sorted.map((y) => {
            const isActive = selected.includes(y.year)
            const atCap = !isActive && selected.length >= maxSelected
            return (
              <Pill
                key={y.year}
                active={isActive}
                aria-pressed={isActive}
                aria-disabled={atCap || undefined}
                onClick={() => toggleYear(y.year)}
              >
                {y.year}
              </Pill>
            )
          })}
        </div>
      </Card>
    </div>
  )
}

export default Comparison
