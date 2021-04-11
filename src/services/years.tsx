import useSWR from "swr"
import YearsData from "@/data/years.json"

const defaultYears = {
  "2020": true,
  "2017": true,
  "2003": true,
}

const useYears = (): [Years | undefined, (data: Years) => void] => {
  const { data, mutate } = useSWR("years", null, {
    revalidateOnFocus: false,
    initialData: { ...YearsData, ...defaultYears } as Years,
  })

  const setData = (data: Years) => {
    mutate(data, false)
  }

  return [data, setData]
}

export default useYears
