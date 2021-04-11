import useSWR from "swr"
import { sumYears } from "@/utils/index"
import useFilters from "@/services/filters"
import useMortality from "@/services/mortality"
import { getYearPopulation } from "../utils"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

const filter = (
  data: MortalityRawData,
  { gender, ageGroup }: Filters
): Mortality => {
  const ageGroups = gender ? data[gender].ageGroups : data.ageGroups
  const d = ageGroups.slice(ageGroup[0] / 10, ageGroup[1] / 10)

  return {
    data: d,
    ageGroups: d.map((ags, i) => i * 10 + ageGroup[0]),
    labels: data.ageGroups[0].map((group, i) => (2000 + i).toString()),
    ratio: sumYears(d).map(
      (count, i) => (count * 100) / getYearPopulation(2000 + i)
    ),
  }
}

const useRawMortality = (): Mortality[] => {
  const [filters] = useFilters()
  const [, setMortality] = useMortality()
  const { data } = useSWR("/data/mortality.json", fetcher, {
    revalidateOnFocus: false,
  })

  if (data && filters) {
    const filteredData = filter(data, filters)
    setMortality(filteredData)
  }

  return [data]
}

export default useRawMortality
