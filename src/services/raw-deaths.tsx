import useSWR from "swr"
import { sumYears } from "@/utils/index"
import useDeaths from "@/services/deaths"
import useFilters from "@/services/filters"
import useOverview from "@/services/overview"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

const sumAgeGroups = (ageGroups: number[][][], start: number, end: number) =>
  ageGroups
    ?.slice(start, end)
    .reduce(
      (data, group) => group.map((year, i) => sumYears([data[i] ?? [], year])),
      []
    )

const filter = (data: DeathsRawData, { gender, ageGroup }: Filters): Deaths => {
  const filteredData =
    gender && ageGroup
      ? sumAgeGroups(data[gender].ageGroups, ageGroup[0] / 10, ageGroup[1] / 10)
      : gender
      ? data[gender].global
      : sumAgeGroups(data?.ageGroups, ageGroup[0] / 10, ageGroup[1] / 10)

  return { labels: data.labels, data: filteredData }
}

const useRawDeaths = (): DeathsRawData[] => {
  const [filters] = useFilters()
  const [, setDeaths] = useDeaths()
  const [, setOverview] = useOverview()
  const { data } = useSWR("/data/deaths.json", fetcher, {
    revalidateOnFocus: false,
  })

  if (data && filters) {
    const filteredData = filter(data, filters)
    setDeaths(filteredData)
    setOverview(filteredData)
  }

  return [data]
}

export default useRawDeaths
