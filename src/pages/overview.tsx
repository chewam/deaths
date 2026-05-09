import { useEffect, useMemo, useState } from "react"
import { useIntl } from "react-intl"
import { useRouter } from "next/router"

import Year, { type YearData, type YearLabels } from "@/components/views/Year"
import { EVENTS_RAW, type YearEvent } from "@/data/events"
import useFilters from "@/services/filters"
import useYears from "@/services/years"
import useRawDeaths from "@/services/raw-deaths"
import { getYearPopulation, sumArray } from "@/utils/index"
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

const Page = () => {
  const router = useRouter()
  const intl = useIntl()
  const [years] = useYears()
  const [deaths] = useRawDeaths()
  const [filters] = useFilters()
  const partialYear = new Date().getFullYear()

  const data: YearData[] = useMemo(() => {
    const monthlyByYear = computeFilteredMonthly(deaths, filters)
    const allAgesByYear = computeFilteredMonthly(deaths, undefined)
    const yearsList = Object.keys(years || {})
    return yearsList.map((yearStr, i) => {
      const year = Number(yearStr)
      const pop = getYearPopulation(year) || 0
      const monthly = monthlyByYear[i] ?? []
      const totalDeaths = sumArray(monthly)
      // Rate stays the all-ages all-genders rate so the TrendChart curve
      // stays inside TREND_RATE_DOMAIN (0.8–1.05) under any filter.
      const totalAllAges = sumArray(allAgesByYear[i] ?? [])
      // Partial-year deaths over full-year population would understate
      // the rate, dragging the trend curve toward 0.
      const isPartial = year === partialYear
      return {
        year,
        rate: !isPartial && pop > 0 ? (totalAllAges * 100) / pop : 0,
        deaths: totalDeaths,
        pop,
        monthly,
      }
    })
  }, [years, deaths, filters, partialYear])

  const lastFullYearData = data
    .filter((y) => y.year !== partialYear)
    .slice(-1)[0]
  const defaultYear = lastFullYearData?.year ?? data[data.length - 1]?.year

  const queryYear = Number(router.query.year)
  const initialActiveYear =
    Number.isFinite(queryYear) && queryYear > 0 ? queryYear : defaultYear

  const [activeYear, setActiveYear] = useState<number>(initialActiveYear ?? 0)

  useEffect(() => {
    if (!router.isReady) return
    const fromQuery = Number(router.query.year)
    if (Number.isFinite(fromQuery) && fromQuery > 0) {
      setActiveYear(fromQuery)
    } else if (defaultYear) {
      setActiveYear(defaultYear)
    }
  }, [router.isReady, router.query.year, defaultYear])

  const handleActiveYearChange = (year: number) => {
    setActiveYear(year)
    router.replace(
      { pathname: router.pathname, query: { ...router.query, year } },
      undefined,
      { shallow: true }
    )
  }

  const labels: YearLabels = {
    mortalityRate: intl.formatMessage({ id: "Mortality rate" }),
    deathsCount: intl.formatMessage({ id: "Deaths count" }),
    population: intl.formatMessage({ id: "Total population" }),
    yearOverYear: intl.formatMessage({ id: "Year-over-year" }),
    partial: intl.formatMessage({ id: "Partial" }),
    sinceAvg: intl.formatMessage({ id: "since avg" }),
    trend: intl.formatMessage({ id: "Trend" }),
    trendSubtitle: intl.formatMessage({ id: "Mortality rate trend subtitle" }),
    rateMin: intl.formatMessage({ id: "Rate min" }),
    rateMax: intl.formatMessage({ id: "Rate max" }),
    avgLabel: intl.formatMessage({ id: "AVG" }),
    monthlyDeaths: intl.formatMessage({ id: "Monthly deaths" }),
    monthlySubtitle: intl.formatMessage({ id: "Monthly subtitle" }),
    peak: intl.formatMessage({ id: "Peak" }),
    months: monthKeys.map((m) => intl.formatMessage({ id: m }).slice(0, 3)),
    monthsLong: monthKeys.map((m) => intl.formatMessage({ id: m })),
    notableEvents: intl.formatMessage({ id: "Notable events" }),
    yearLabel: intl.formatMessage({ id: "Year" }),
  }

  const events: YearEvent[] = EVENTS_RAW.map((e) => ({
    year: e.year,
    month: e.month,
    label: intl.formatMessage({ id: e.labelKey }),
    desc: intl.formatMessage({ id: e.descKey }),
  }))

  if (!data.length || !activeYear || !deaths) return null

  return (
    <div className="container mx-auto px-6">
      <Year
        years={data}
        activeYear={activeYear}
        onActiveYearChange={handleActiveYearChange}
        events={events}
        labels={labels}
        locale={router.locale || "en"}
        partialYear={partialYear}
      />
    </div>
  )
}

export default Page
