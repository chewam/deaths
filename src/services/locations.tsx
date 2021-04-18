import useSWR from "swr"

const useLocations = (): [Locations | undefined, (data: Locations) => void] => {
  const { data, mutate } = useSWR("locations", null, {
    initialData: [] as Locations,
    revalidateOnFocus: false,
  })

  const setData = (data: Locations) => {
    mutate(data, false)
  }

  return [data, setData]
}

export default useLocations
