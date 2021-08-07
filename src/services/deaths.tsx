import useSWR from "swr"

const useDeaths = (): [Deaths | undefined, (data: Deaths) => void] => {
  const { data, mutate } = useSWR("deaths", null, {
    revalidateOnFocus: false,
    initialData: { labels: [], data: [] } as Deaths,
  })

  const setData = (data: Deaths) => {
    mutate(data, false)
  }

  return [data, setData]
}

export default useDeaths
