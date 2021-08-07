import useSWR from "swr"

const initialData: Filters = {
  ageGroup: [0, 110],
  gender: null,
}

const useFilters = (): [Filters | undefined, (filters: Filters) => void] => {
  const { data: filters, mutate } = useSWR("filters", null, {
    initialData,
  })

  const setFilters = (filters: Filters): void => {
    mutate(filters)
  }

  return [filters, setFilters]
}

export default useFilters
