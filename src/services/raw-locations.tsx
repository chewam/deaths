import useSWR from "swr"
import { sumObjects } from "@/utils/index"
import useFilters from "@/services/filters"
import useLocations from "@/services/locations"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

const filter = (
  data: LocationsRawData,
  { gender, ageGroup }: Filters
): Locations => {
  const { ageGroups } = gender ? data[gender] : data

  return ageGroups
    .slice(ageGroup[0] / 10, ageGroup[1] / 10)
    .reduce(
      (locations: Locations, group) => (
        (locations = group.map((year, i) => sumObjects(year, locations[i]))),
        locations
      ),
      []
    )
}

const useRawLocations = (): Locations[] => {
  const [filters] = useFilters()
  const [, setLocations] = useLocations()
  const { data } = useSWR("/data/locations.json", fetcher, {
    revalidateOnFocus: false,
  })

  if (data && filters) {
    const filteredData = filter(data, filters)
    setLocations(filteredData)
  }

  return [data]
}

export default useRawLocations
