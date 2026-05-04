import { useEffect, useMemo, useState } from "react"
import { useIntl } from "react-intl"
import { useRouter } from "next/router"

import Year, { type YearData, type YearLabels } from "@/components/views/Year"
import { EVENTS_RAW, type YearEvent } from "@/data/events"
import useYears from "@/services/years"
import useRawDeaths from "@/services/raw-deaths"
import { getYearPopulation, sumArray, sumYears } from "@/utils/index"

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
  const partialYear = new Date().getFullYear()

  const data: YearData[] = useMemo(() => {
    const ageGroups = deaths?.ageGroups ?? []
    const yearsList = Object.keys(years || {})
    return yearsList.map((yearStr, i) => {
      const year = Number(yearStr)
      const pop = getYearPopulation(year) || 0
      const yearAgeTotals = ageGroups.map((group) => sumArray(group[i] || []))
      const totalDeaths = sumArray(yearAgeTotals)
      const monthly = sumYears(ageGroups.map((group) => group[i] || []))
      return {
        year,
        rate: pop > 0 ? (totalDeaths * 100) / pop : 0,
        deaths: totalDeaths,
        pop,
        monthly,
      }
    })
  }, [years, deaths])

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
