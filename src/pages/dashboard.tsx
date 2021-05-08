import Panel from "@/components/Panel"
import useYears from "@/services/years"
import Container from "@/components/Container"
import Population from "@/data/population.json"
import ChartDataLabels from "chartjs-plugin-datalabels"
import useRawDeaths, { sumAgeGroups } from "@/services/raw-deaths"

import { ImArrowDownRight, ImArrowUpRight } from "react-icons/im"

import { Doughnut } from "react-chartjs-2"
import type { ChartOptions } from "chart.js"
import { useTheme } from "@/services/themes"

const Chart = ({ ageGroups }): JSX.Element => {
  const { values: theme = {} } = useTheme()

  const groups = [
    ageGroups.slice(0, 7).reduce((a, b) => a + b, 0),
    ...ageGroups.slice(7, ageGroups.length),
  ]

  const plugins = [ChartDataLabels]
  const data = {
    labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
    datasets: [
      {
        label: "# of Votes",
        data: groups,
        backgroundColor: [
          // "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: [
          // "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  }
  const options = {
    cutout: "30%",
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 0 },
    layout: {
      padding: { top: 1, right: 1, bottom: 1, left: 1 },
    },
    plugins: {
      legend: { display: false },
      datalabels: {
        color: theme.color,
        labels: {
          title: {
            align: "top",
            font: { weight: "bold" },
            display: ({ dataIndex }) => {
              return groups[dataIndex] > 20000 ? true : false
            },
            formatter: (value, { dataIndex }) => {
              return `${(groups[dataIndex] / 1000).toFixed(0)}K`
            },
          },
          ageGroup: {
            align: "bottom",
            display: ({ dataIndex }) => {
              return groups[dataIndex] > 20000 ? true : false
            },
            formatter: (value, { dataIndex }) => {
              return `${(dataIndex + 6) * 10}-${(dataIndex + 6) * 10 + 9}`
            },
          },
        },
      },
    },
  } as ChartOptions
  return <Doughnut data={data} options={options} plugins={plugins} />
}

const Year = ({
  year,
  trend,
  deaths,
  average,
  mortality,
  ageGroups,
  population,
}): JSX.Element => {
  const { values: theme = {} } = useTheme()

  return (
    <div className="wrapper">
      <Panel>
        <div className="left">
          <div className="top">
            <div className="year">{year}</div>
            <div className="trend">
              {trend ? (
                <ImArrowDownRight size={24} color={theme.secondary} />
              ) : (
                <ImArrowUpRight size={24} color={theme.important} />
              )}
            </div>
          </div>
          <div className="mortality">
            <div
              className="value"
              style={{
                color: mortality > average ? theme.important : theme.secondary,
              }}
            >
              {mortality}%
            </div>
            <div className="label">Taux de mortalité</div>
          </div>
          <div className="deaths">
            <div className="value">{deaths}</div>
            <div className="label">Nombre de décès</div>
          </div>
          <div className="population">
            <div className="value">{population}</div>
            <div className="label">Poulation totale</div>
          </div>
        </div>
        <div className="right">
          <Chart ageGroups={ageGroups} />
        </div>
      </Panel>
    </div>
  )
}

const Years = (): JSX.Element => {
  const previous = {}
  const [years] = useYears()
  const yearsList = Object.keys(years)
  const [{ ageGroups } = {}] = useRawDeaths()
  const groups = sumAgeGroups(ageGroups)
  console.log("years", ageGroups, groups)

  const average =
    groups
      ?.map(
        (group, i) =>
          (100 * group.reduce((a, b) => a + b, 0)) / Population[yearsList[i]]
      )
      .slice(0, groups.length - 1)
      .reduce((a, b) => a + b, 0) /
    (groups?.length - 1)

  const getDeaths = (groups = [], year): number =>
    groups[year - 2000]?.reduce((a, b) => a + b, 0)

  const getAgeGroups = (ageGroups = [], year): number[] =>
    ageGroups.map((group) => group[year - 2000].reduce((a, b) => a + b, 0))

  const list = yearsList.map((year, i) => {
    const population = Population[year]
    const deaths = getDeaths(groups, year)
    const mortality = ((deaths * 100) / population).toFixed(3)

    previous[year] = { population, deaths, mortality }

    // const previousPopulation = year > 2000 ? Population[year - 1] : 0
    // const previousDeaths = year > 2000 ? getDeaths(groups, year - 1) : 0
    // const previousMortality =
    //   year > 2000
    //     ? ((previousDeaths * 100) / previousPopulation).toFixed(2)
    //     : 0

    console.log("PREVIOUS", previous)

    return (
      <Year
        key={i}
        year={year}
        deaths={deaths}
        average={average}
        mortality={mortality}
        population={population}
        trend={
          console.log(
            "previous",
            year,
            mortality,
            year + 1,
            previous[parseInt(year, 10) - 1]
          ) || previous[Number(year) - 1]
            ? mortality <= previous[Number(year) - 1].mortality
            : null
        }
        ageGroups={getAgeGroups(ageGroups, year)}
      />
    )
  })

  return <>{list.reverse()}</>
}

const Page = (): JSX.Element => {
  return (
    <Container className="dashboard">
      <Years />
    </Container>
  )
}

export default Page
