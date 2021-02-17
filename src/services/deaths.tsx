import useSWR from "swr"
import Deaths from "@/data/deaths.json"
import { sumYears } from "@/utils/index"

const sumAgeGroups = (ageGroups: number[][][], start: number, end: number) =>
  ageGroups
    .slice(start, end)
    .reduce(
      (data, group, i) =>
        group.map((year, i) => sumYears([data[i] ?? [], year])),
      []
    )

const getData = ({
  gender,
  ageGroup,
}: Filters): { labels: string[]; data: number[][] } => {
  const data =
    gender && ageGroup
      ? sumAgeGroups(
          Deaths[gender].ageGroups,
          ageGroup[0] / 10,
          ageGroup[1] / 10
        )
      : gender
      ? Deaths[gender].global
      : sumAgeGroups(Deaths.ageGroups, ageGroup[0] / 10, ageGroup[1] / 10)

  return { labels: Deaths.labels, data }
}

const initialData = getData({ gender: null, ageGroup: [0, 110] })

const useDeaths = () => {
  const { data, mutate } = useSWR("deaths", null, {
    initialData,
    revalidateOnFocus: false,
  })

  const applyFilters = (filters: Filters) => {
    const data = getData(filters)
    mutate(data)
    return data
  }

  return [data, applyFilters] as const
}

export default useDeaths
