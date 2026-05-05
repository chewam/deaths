import { useEffect, useMemo, useState } from "react"
import { useIntl } from "react-intl"
import { useRouter } from "next/router"

import type { MonthlyEvent } from "@/components/charts/monthly-geometry"
import Comparison, {
  type ComparisonLabels,
  type ComparisonYearData,
} from "@/components/views/Comparison"
import { EVENTS_RAW } from "@/data/events"
import useRawDeaths from "@/services/raw-deaths"
import useYears from "@/services/years"
import { sumYears } from "@/utils/index"

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
  const partialYear = new Date().getFullYear()

  const data: ComparisonYearData[] = useMemo(() => {
    const ageGroups = deaths?.ageGroups ?? []
    const yearsList = Object.keys(years || {})
    return yearsList.map((yearStr, i) => ({
      year: Number(yearStr),
      monthly: sumYears(ageGroups.map((group) => group[i] || [])),
    }))
  }, [years, deaths])

  const sortedYears = useMemo(
    () => [...data].sort((a, b) => a.year - b.year),
    [data]
  )

  const fullYears = useMemo(
    () => sortedYears.filter((y) => y.year !== partialYear),
    [sortedYears, partialYear]
  )

  const defaultSelectedKey = useMemo(
    () =>
      fullYears
        .slice(-3)
        .map((y) => y.year)
        .join(","),
    [fullYears]
  )

  const [selected, setSelected] = useState<number[]>([])

  useEffect(() => {
    if (!router.isReady) return
    const fromQuery = parseYearsParam(router.query.years)
    if (fromQuery.length > 0) {
      setSelected(fromQuery.slice(0, MAX_SELECTED))
      return
    }
    const next = defaultSelectedKey
      ? defaultSelectedKey.split(",").map(Number)
      : []
    if (next.length > 0) setSelected(next)
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

  if (!data.length || !deaths || selected.length === 0) return null

  return (
    <div className="container mx-auto px-6">
      <Comparison
        years={fullYears}
        selected={selected}
        onSelectedChange={handleSelectedChange}
        events={events}
        labels={labels}
        locale={router.locale || "en"}
        maxSelected={MAX_SELECTED}
      />
    </div>
  )
}

export default Page
