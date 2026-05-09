import { useEffect, useMemo, useState } from "react"
import { useIntl } from "react-intl"
import { useRouter } from "next/router"

import type { MonthlyEvent } from "@/components/charts/monthly-geometry"
import Comparison, {
  type ComparisonLabels,
  type ComparisonYearData,
} from "@/components/views/Comparison"
import { EVENTS_RAW } from "@/data/events"
import useFilters from "@/services/filters"
import useRawDeaths from "@/services/raw-deaths"
import useYears from "@/services/years"
import { computeFilteredMonthly } from "@/utils/filters"

const monthKeys = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const

const MAX_SELECTED = 7

const parseYearsParam = (raw: string | string[] | undefined): number[] => {
  if (!raw) return []
  const value = Array.isArray(raw) ? raw[0] : raw
  if (!value) return []
  return value
    .split(",")
    .map((s) => Number(s.trim()))
    .filter((n) => Number.isFinite(n) && n > 0)
}

const Page = () => {
  const router = useRouter()
  const intl = useIntl()
  const [years] = useYears()
  const [deaths] = useRawDeaths()
  const [filters] = useFilters()

  const data: ComparisonYearData[] = useMemo(() => {
    const monthlyByYear = computeFilteredMonthly(deaths, filters)
    const yearsList = Object.keys(years || {})
    return yearsList.map((yearStr, i) => ({
      year: Number(yearStr),
      monthly: monthlyByYear[i] ?? [],
    }))
  }, [years, deaths, filters])

  const sortedYears = useMemo(
    () => [...data].sort((a, b) => a.year - b.year),
    [data]
  )

  // Curated default selection — years that surface notable events in the
  // chart (heatwave 2003, COVID 2020, summer 2022, recent baseline).
  // Mirrors NEW_VERSION/app.jsx initial compareYears.
  const defaultSelectedKey = useMemo(() => {
    const preferred = [2003, 2020, 2022, 2024, 2025]
    const available = new Set(sortedYears.map((y) => y.year))
    const present = preferred.filter((y) => available.has(y))
    return present.length > 0
      ? present.join(",")
      : sortedYears
          .slice(-3)
          .map((y) => y.year)
          .join(",")
  }, [sortedYears])

  // null = not yet initialized from URL/defaults (initial render before
  // router.isReady). Empty array = user-emptied selection, still rendered.
  const [selected, setSelected] = useState<number[] | null>(null)

  useEffect(() => {
    if (!router.isReady) return
    const fromQuery = parseYearsParam(router.query.years)
    if (fromQuery.length > 0) {
      setSelected(fromQuery.slice(0, MAX_SELECTED))
      return
    }
    if (selected !== null) return
    const next = defaultSelectedKey
      ? defaultSelectedKey.split(",").map(Number)
      : []
    setSelected(next)
    // selected is intentionally omitted: we only auto-fill the default once,
    // when no URL param drives the selection.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady, router.query.years, defaultSelectedKey])

  const handleSelectedChange = (next: number[]) => {
    setSelected(next)
    router.replace(
      {
        pathname: router.pathname,
        query: { ...router.query, years: next.join(",") },
      },
      undefined,
      { shallow: true }
    )
  }

  if (!data.length || !deaths || selected === null) return null

  const labels: ComparisonLabels = {
    monthlyDeaths: intl.formatMessage({ id: "Monthly deaths" }),
    comparison: intl.formatMessage({ id: "comparison" }),
    selectYears: intl.formatMessage({ id: "Select years" }),
    selectedSubtitle: intl.formatMessage(
      { id: "comparison.selectedSubtitle" },
      { n: selected.length, max: MAX_SELECTED }
    ),
    months: monthKeys.map((m) => intl.formatMessage({ id: m }).slice(0, 3)),
    monthsLong: monthKeys.map((m) => intl.formatMessage({ id: m })),
    deathsCount: intl.formatMessage({ id: "Deaths count" }),
  }

  const events: MonthlyEvent[] = EVENTS_RAW.filter((e) =>
    selected.includes(e.year)
  ).map((e) => ({
    year: e.year,
    month: e.month,
    label: intl.formatMessage({ id: e.labelKey }),
  }))

  return (
    <div className="container mx-auto flex min-h-0 flex-1 flex-col px-6">
      <Comparison
        years={sortedYears}
        selected={selected}
        onSelectedChange={handleSelectedChange}
        events={events}
        labels={labels}
        locale={router.locale || "en"}
        maxSelected={MAX_SELECTED}
        fillHeight
      />
    </div>
  )
}

export default Page
