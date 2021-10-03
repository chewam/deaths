import useSWR from "swr"

const useMortality = (): [Mortality | undefined, (data: Mortality) => void] => {
  const { data, mutate } = useSWR("mortality", null, {
    revalidateOnFocus: false,
    fallbackData: {
      labels: [],
      data: [],
      ratio: [],
      ageGroups: [],
    } as Mortality,
  })

  const setData = (data: Mortality) => {
    mutate(data, false)
  }

  return [data, setData]
}

export default useMortality
