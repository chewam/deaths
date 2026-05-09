import { useMemo, useState } from "react"
import { useIntl } from "react-intl"
import { useRouter } from "next/router"

import Distribution, {
  type DistributionViewLabels,
} from "@/components/views/Distribution"
import type { DistributionGender } from "@/components/charts/distribution-geometry"
import useFilters from "@/services/filters"
import useRawMortality from "@/services/raw-mortality"
import { computeFilteredAgeBuckets } from "@/utils/filters"

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
  const partialYear = new Date().getFullYear()

  const [hovered, setHovered] = useState<number | null>(null)

  const years = useMemo(
    () =>
      computeFilteredAgeBuckets(
        rawData as unknown as MortalityRawData | undefined,
        filters,
        partialYear
      ),
    [rawData, filters, partialYear]
  )

  if (!rawData || !years.length) return null

  const labels: DistributionViewLabels = {
    deathsByAge: intl.formatMessage({ id: "Deaths by age" }),
    subtitle: intl.formatMessage({ id: "distribution.subtitle" }),
    deathsCount: intl.formatMessage({ id: "Deaths count" }),
    mortalityRate: intl.formatMessage({ id: "Mortality rate" }),
    ageBuckets: [...AGE_BUCKETS],
  }

  return (
    <div className="container mx-auto flex min-h-0 flex-1 flex-col px-6">
      <Distribution
        years={years}
        gender={toViewGender(filters?.gender)}
        hovered={hovered}
        setHovered={setHovered}
        labels={labels}
        locale={router.locale || "en"}
        fillHeight
      />
    </div>
  )
}

export default Page
