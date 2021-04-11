import useSWR from "swr"
// import useDeaths from "@/services/deaths"
// import useOverview from "@/services/overview"
// import useMortality from "@/services/mortality"
// import useLocations from "@/services/locations"

const initialData: Filters = {
  ageGroup: [0, 110],
  gender: null,
}

const useFilters = (): [Filters | undefined, (filters: Filters) => void] => {
  // const [, setOverview] = useOverview()
  // const [, applyDeathsFilters] = useDeaths()
  // const [, applyMortalityFilters] = useMortality()
  // const [, applyLocationsFilters] = useLocations()

  const { data: filters, mutate } = useSWR("filters", null, {
    initialData,
  })

  const setFilters = (filters: Filters): void => {
    mutate(filters)
    // const deaths = await applyDeathsFilters(filters)
    // deaths && setOverview(deaths)
    // applyMortalityFilters(filters)
    // applyLocationsFilters(filters)
  }

  return [filters, setFilters]
}

export default useFilters
