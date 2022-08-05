import useSWR from "swr"
import YearsData from "@/data/years.json"

const defaultYears = {
  "2022": true,
  "2021": true,
  "2020": true,
  "2017": true,
}

const useYears = (): [Years | undefined, (data: Years) => void] => {
  const { data, mutate } = useSWR("years", null, {
    revalidateOnFocus: false,
    fallbackData: { ...YearsData, ...defaultYears } as Years,
  })

  const setData = (data: Years) => {
    mutate(data, false)
  }

  return [data, setData]
}

export default useYears
