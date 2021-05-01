import Genders from "./Genders"
import AgeGroups from "./AgeGroups"
import Panel from "@/components/Panel"
import useFilters from "@/services/filters"

const Filters = (): JSX.Element => {
  const [filters, setFilters] = useFilters()

  const { ageGroup, gender } = filters as Filters

  const handleGenderChange = (gender: Gender) =>
    setFilters({ ageGroup, gender })

  const handleAgeGroupChange = (newValue: [number, number]) =>
    setFilters({ ageGroup: newValue, gender })

  return (
    <Panel className="filters">
      <AgeGroups onChange={handleAgeGroupChange} />
      <Genders onChange={handleGenderChange} />
    </Panel>
  )
}

export default Filters
