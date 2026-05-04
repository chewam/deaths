import { useIntl } from "react-intl"
import { useRouter } from "next/router"

import OverviewGrid, {
  type OverviewGridLabels,
  type OverviewYear,
} from "@/components/views/OverviewGrid"
import useYears from "@/services/years"
import useRawDeaths from "@/services/raw-deaths"
import { sumArray, getYearPopulation } from "@/utils/index"

const PARTIAL_YEAR = new Date().getFullYear()

const Page = () => {
  const router = useRouter()
  const intl = useIntl()
  const [years] = useYears()
  const [deaths] = useRawDeaths()

  const ageGroups = deaths?.ageGroups ?? []
  const yearsList = Object.keys(years || {})

  const data: OverviewYear[] = yearsList.map((yearStr, i) => {
    const year = Number(yearStr)
    const pop = getYearPopulation(year) || 0
    const yearAgeGroups = ageGroups.map((group) => sumArray(group[i] || []))
    const totalDeaths = sumArray(yearAgeGroups)
    // Source data has 11 age groups (0-9 … 100+); OverviewGrid renders 10
    // by collapsing 90-99 + 100+ into a single 90+ bucket.
    const buckets = [
      ...yearAgeGroups.slice(0, 9),
      sumArray(yearAgeGroups.slice(9)),
    ]
    return {
      year,
      rate: pop > 0 ? (totalDeaths * 100) / pop : 0,
      deaths: totalDeaths,
      pop,
      buckets,
    }
  })

  const labels: OverviewGridLabels = {
    mortalityRate: intl.formatMessage({ id: "Mortality rate" }),
    deathsCount: intl.formatMessage({ id: "Deaths count" }),
    population: intl.formatMessage({ id: "Total population" }),
    partial: intl.formatMessage({ id: "Partial" }),
  }

  const handleSelectYear = (year: number) => {
    router.push({ pathname: "/overview", query: { year } })
  }

  return (
    <OverviewGrid
      years={data}
      labels={labels}
      locale={router.locale || "en"}
      partialYear={PARTIAL_YEAR}
      onSelectYear={handleSelectYear}
    />
  )
}

export default Page
