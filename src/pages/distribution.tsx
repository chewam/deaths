import { useMemo, useState } from "react"
import { useIntl } from "react-intl"
import { useRouter } from "next/router"

import Distribution, {
  type DistributionViewLabels,
} from "@/components/views/Distribution"
import type { DistributionGender } from "@/components/charts/distribution-geometry"
import useFilters from "@/services/filters"
import useRawMortality from "@/services/raw-mortality"
import { getYearPopulation } from "@/utils/index"

const AGE_BUCKETS = [
  "0-9",
  "10-19",
  "20-29",
  "30-39",
  "40-49",
  "50-59",
  "60-69",
  "70-79",
  "80-89",
  "90+",
] as const

const sumColumn = (groups: number[][], i: number): number =>
  groups.reduce((sum, group) => sum + (group[i] ?? 0), 0)

const toViewGender = (g: Filters["gender"]): DistributionGender => {
  if (g === "male") return "m"
  if (g === "female") return "f"
  return "all"
}

const Page = () => {
  const intl = useIntl()
  const router = useRouter()
  const [filters] = useFilters()
  const [rawData] = useRawMortality()

  const [hovered, setHovered] = useState<number | null>(null)

  const years = useMemo(() => {
    if (!rawData) return []
    const data = rawData as unknown as MortalityRawData
    return data.labels.map((yearStr, i) => {
      const year = Number(yearStr)
      const buckets = data.ageGroups.map((group) => group[i] ?? 0)
      const totalDeaths = buckets.reduce((s, b) => s + b, 0)
      const population = getYearPopulation(year) || 0
      const rate = population > 0 ? (totalDeaths * 100) / population : 0
      return {
        year,
        buckets,
        rate,
        m: sumColumn(data.male.ageGroups, i),
        f: sumColumn(data.female.ageGroups, i),
      }
    })
  }, [rawData])

  if (!rawData || !years.length) return null

  const labels: DistributionViewLabels = {
    deathsByAge: intl.formatMessage({ id: "Deaths by age" }),
    subtitle: intl.formatMessage({ id: "distribution.subtitle" }),
    deathsCount: intl.formatMessage({ id: "Deaths count" }),
    mortalityRate: intl.formatMessage({ id: "Mortality rate" }),
    ageBuckets: [...AGE_BUCKETS],
  }

  return (
    <div className="container mx-auto px-6">
      <Distribution
        years={years}
        gender={toViewGender(filters?.gender)}
        hovered={hovered}
        setHovered={setHovered}
        labels={labels}
        locale={router.locale || "en"}
      />
    </div>
  )
}

export default Page
