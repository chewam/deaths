import Year from "./Tile"
import useYears from "@/services/years"
import { sumArray } from "@/utils/index"
import useRawDeaths from "@/services/raw-deaths"
import { sumYears, getYearPopulation } from "@/utils/index"

const sumAgeGroups = (ageGroups: number[][][] = []): number[][] =>
  ageGroups.reduce(
    (data, group) => group.map((year, i) => sumYears([data[i] ?? [], year])),
    []
  )

const Dashboard = () => {
  const [years] = useYears()
  const previous: number[] = []
  const [deaths] = useRawDeaths()
  const { ageGroups } = deaths || {}
  const groups = sumAgeGroups(ageGroups)
  const yearsList = Object.keys(years || {})

  const average =
    groups
      ?.map(
        (group, i) =>
          (100 * group.reduce((a, b) => a + b, 0)) /
          getYearPopulation(Number(yearsList[i]))
      )
      .slice(0, groups.length - 1)
      .reduce((a, b) => a + b, 0) /
    (groups?.length - 1)

  const getDeaths = (groups: number[][], index: number): number => {
    const group = groups[index]
    return sumArray(group)
  }

  const getAgeGroups = (
    ageGroups: DeathsAgeGroups = [],
    index: number
  ): number[] => ageGroups.map((group) => sumArray(group[index]))

  const list = yearsList.map((year, i) => {
    const population = getYearPopulation(Number(year))
    const deaths = getDeaths(groups, i)
    const mortality = (deaths * 100) / population

    previous.push(mortality)

    return (
      <Year
        key={i}
        year={year}
        deaths={deaths}
        average={average}
        mortality={mortality}
        population={population}
        ageGroups={getAgeGroups(ageGroups, i)}
        trend={previous[i - 1] ? mortality <= previous[i - 1] : null}
      />
    )
  })

  return <>{list.reverse()}</>
}

export default Dashboard
