import useSWR from "swr"

const fallbackData: Filters = {
  ageGroup: [0, 110],
  gender: null,
}

const useFilters = (): [Filters | undefined, (filters: Filters) => void] => {
  const { data: filters, mutate } = useSWR("filters", null, {
    fallbackData,
  })

  const setFilters = (filters: Filters): void => {
    mutate(filters)
  }

  return [filters, setFilters]
}

export default useFilters
