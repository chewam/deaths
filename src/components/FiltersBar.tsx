import { useRouter } from "next/router"

import useFilters from "@/services/filters"
import Genders from "@/components/filters/Genders"
import AgeGroups from "@/components/filters/AgeGroups"

const FiltersBar = () => {
  const { route } = useRouter()
  const [filters, setFilters] = useFilters()

  const handleGenderChange = (gender: Gender) => {
    const { ageGroup } = filters as Filters
    setFilters({ ageGroup, gender })
  }

  const handleAgeGroupChange = (ageGroup: [number, number]) => {
    const { gender } = filters as Filters
    setFilters({ ageGroup, gender })
  }

  return (
    <div className="container mx-auto mt-24 px-6">
      {route !== "/" && (
        <div className="filters">
          <AgeGroups onChange={handleAgeGroupChange} />
          <Genders onChange={handleGenderChange} />
        </div>
      )}
    </div>
  )
}

export default FiltersBar
