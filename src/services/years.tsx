import useSWR from "swr"
import YearsData from "@/data/years.json"

const defaultYears = {
  "2020": true,
  "2017": true,
  "2003": true,
}

// const fetcher = (url: string) => fetch(url).then((res) => res.json())

// const fetcher = (url: string) =>
//   fetch(url).then(async (res) => ({
//     ...(await res.json()),
//     ...defaultYears,
//   }))

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
