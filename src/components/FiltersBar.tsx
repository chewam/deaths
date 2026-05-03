import { useRouter } from "next/router"
import { FormattedMessage as Trans } from "react-intl"

import useFilters from "@/services/filters"
import { Label } from "@/components/atoms"
import Genders from "@/components/filters/Genders"
import AgeGroups from "@/components/filters/AgeGroups"

const FiltersBar = () => {
  const { route } = useRouter()
  const [filters, setFilters] = useFilters()

  if (route === "/") return null

  const handleGenderChange = (gender: Gender) => {
    const { ageGroup } = filters as Filters
    setFilters({ ageGroup, gender })
  }

  const handleAgeGroupChange = (ageGroup: [number, number]) => {
    const { gender } = filters as Filters
    setFilters({ ageGroup, gender })
  }

  return (
    <div className="border-border border-b px-12 py-3.5 flex flex-wrap items-center gap-8">
      <div className="flex flex-col gap-1.5 min-w-[220px] flex-1">
        <Label>
          <Trans id="Age" />
        </Label>
        <AgeGroups onChange={handleAgeGroupChange} />
      </div>
      <div className="flex items-center gap-2">
        <Label>
          <Trans id="Gender" />
        </Label>
        <Genders onChange={handleGenderChange} />
      </div>
    </div>
  )
}

export default FiltersBar
