import { useIntl } from "react-intl"
import { useRouter } from "next/router"

import OverviewGrid, {
  type OverviewGridLabels,
  type OverviewYear,
} from "@/components/views/OverviewGrid"
import useYears from "@/services/years"
import useFilters from "@/services/filters"
import useRawDeaths from "@/services/raw-deaths"
import { sumArray, getYearPopulation } from "@/utils/index"

const Page = () => {
  const router = useRouter()
  const intl = useIntl()
  const [years] = useYears()
  const [deaths] = useRawDeaths()
  const [filters] = useFilters()
  const partialYear = new Date().getFullYear()

  const { gender, ageGroup = [0, 110] } = filters ?? {}
  const ageStart = Math.floor(ageGroup[0] / 10)
  const ageEnd = Math.ceil(ageGroup[1] / 10)
  // Donut shows the gender-aware distribution across all ages — independent
  // of the age range filter (would empty the donut otherwise).
  const ageGroupsForBuckets = gender
    ? deaths?.[gender]?.ageGroups
    : deaths?.ageGroups
  // Stat cards use both filters: gender + age range.
  const ageGroupsForStats = (ageGroupsForBuckets ?? []).slice(ageStart, ageEnd)
  const yearsList = Object.keys(years || {})

  const data: OverviewYear[] = yearsList.map((yearStr, i) => {
    const year = Number(yearStr)
    const pop = getYearPopulation(year) || 0
    const yearAgeStats = ageGroupsForStats.map((group) =>
      sumArray(group[i] || [])
    )
    const totalDeaths = sumArray(yearAgeStats)
    const yearAgeBuckets = (ageGroupsForBuckets ?? []).map((group) =>
      sumArray(group[i] || [])
    )
    // Source data has 11 age groups (0-9 … 100+); OverviewGrid renders 10
    // by collapsing 90-99 + 100+ into a single 90+ bucket.
    const buckets = [
      ...yearAgeBuckets.slice(0, 9),
      sumArray(yearAgeBuckets.slice(9)),
    ]
    // Partial year deaths divided by full-year population would understate
    // the rate; mask it so charts/badges treat the year as having no rate.
    const isPartial = year === partialYear
    return {
      year,
      rate: !isPartial && pop > 0 ? (totalDeaths * 100) / pop : 0,
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
      partialYear={partialYear}
      onSelectYear={handleSelectYear}
    />
  )
}

export default Page
