import useSWR from "swr"
import Locations from "@/data/locations.json"
import { sumObjects } from "@/utils/index"

const getData = ({ ageGroup, gender }: Filters) => {
  const { ageGroups } = gender ? Locations[gender] : Locations

  return ageGroups
    .slice(ageGroup[0] / 10, ageGroup[1] / 10)
    .reduce(
      (locations, group) => (
        (locations = group.map((year, i) => sumObjects(year, locations[i]))),
        locations
      ),
      []
    )
}

const initialData = getData({ gender: null, ageGroup: [0, 110] })

const useLocations = () => {
  const { data, mutate } = useSWR("locations", null, {
    initialData,
    revalidateOnFocus: false,
  })

  const applyFilters = (filters: Filters) => {
    mutate(getData(filters))
  }

  return [data, applyFilters] as const
}

export default useLocations
