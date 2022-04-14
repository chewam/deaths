import { useRouter } from "next/router"

import useFilters from "@/services/filters"
import Genders from "@/components/filters/Genders"
import AgeGroups from "@/components/filters/AgeGroups"

const Filters = (): JSX.Element => {
  const { route } = useRouter()
  const [filters, setFilters] = useFilters()

  const { ageGroup, gender } = filters as Filters

  const handleGenderChange = (gender: Gender) =>
    setFilters({ ageGroup, gender })

  const handleAgeGroupChange = (ageGroup: [number, number]) =>
    setFilters({ ageGroup, gender })

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

export default Filters
