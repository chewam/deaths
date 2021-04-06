import useSWR from "swr"
import { sumYears } from "@/utils/index"
import useDeaths from "@/services/deaths"
// import useMonths from "@/services/months"
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

// const getMonthsData = (ageGroups: number[][][], start: number, end: number) =>
//   console.log("ageGroups", ageGroups) ||
//   ageGroups?.slice(start, end).reduce(
//     (data, group) => (
//       // data.push([].concat.apply([], group).slice(-12).reverse()), data
//       console.log("group", group) ||
//         data.push([].concat(group).slice(-12).reverse()),
//       data
//     ),
//     []
//   )

// const filterMonths = (data: RawData, { gender, ageGroup }: Filters): Data => {
//   const d =
//     gender && ageGroup
//       ? getMonthsData(
//           data[gender].ageGroups,
//           ageGroup[0] / 10,
//           ageGroup[1] / 10
//         )
//       : // : gender
//         // ? getMonthsData(data[gender].global, ageGroup[0] / 10, ageGroup[1] / 10)
//         getMonthsData(data?.ageGroups, ageGroup[0] / 10, ageGroup[1] / 10)

//   return { labels: data.labels, data: d }
// }

const filter = (data: DeathsRawData, { gender, ageGroup }: Filters): Deaths => {
  const d =
    gender && ageGroup
      ? sumAgeGroups(data[gender].ageGroups, ageGroup[0] / 10, ageGroup[1] / 10)
      : gender
      ? data[gender].global
      : sumAgeGroups(data?.ageGroups, ageGroup[0] / 10, ageGroup[1] / 10)

  return { labels: data.labels, data: d }
}

const useRawDeaths = (): Deaths[] => {
  const [filters] = useFilters()
  const [, setDeaths] = useDeaths()
  // const [, setMonths] = useMonths()
  const [, setOverview] = useOverview()
  const { data } = useSWR("/data/deaths.json", fetcher, {
    revalidateOnFocus: false,
  })

  if (data && filters) {
    const filteredData = filter(data, filters)
    // const filteredData2 = filterMonths(data, filters)
    setDeaths(filteredData)
    // setMonths(filteredData2)
    setOverview(filteredData)
  }

  return [data]
}

export default useRawDeaths
