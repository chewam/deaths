import hexToRgba from "hex-to-rgba"
import useYears from "@/services/years"
import useDeaths from "@/services/deaths"
import { useTheme } from "@/services/themes"
import DefaultChart from "@/components/Chart"
import { ChartDataSets } from "chart.js"
import { AnnotationOptions } from "chartjs-plugin-annotation"
import Months from "@/data/months.json"

const average = (nums: number[]) => nums.reduce((a, b) => a + b) / nums.length

const getMaximum = (data: Deaths["data"]) => {
  if (!data) return {}
  const maximums = data.reduce((acc, year, i) => {
    const max = Math.max(...year)
    const index = year.indexOf(max)
    acc[max] = { year: 2000 + i, month: index + 1, value: max }
    return acc
  }, {} as { [key: number]: Record<string, number> })
  const keys = Object.keys(maximums).map(Number)
  const maxValue = Math.max(...keys)
  return maximums[maxValue]
}

const Chart = (): JSX.Element => {
  const [years] = useYears()
  const [deaths] = useDeaths()
  const { labels, data } = deaths as Deaths
  const { values: theme = {} } = useTheme()

  const max = getMaximum(data)

  const xAxes = [{}]

  const yAxes = [
    {
      ticks: {
        suggestedMax: max && max.value + (max.value * 5) / 100,
      },
    },
  ]

  const defaultColor = "#ffffff"

  // const gradient: [number, string][] = [
  //   [0, hexToRgba(theme.primary || defaultColor, 0.5)],
  //   [0.2, hexToRgba(theme.primary || defaultColor, 0.2)],
  //   [0.5, hexToRgba(theme.primary || defaultColor, 0)],
  // ]

  const datasets = Object.keys(years || {}).reduce(
    (datasets: Record<string, unknown>[], year) => (
      years &&
        years[year] &&
        datasets.push({
          label: year,
          pointRadius: 4,
          borderWidth: 2,
          borderColor: theme?.primary,
          pointBorderColor: theme.primary,
          data: (data || {})[+year - 2000],
          pointBackgroundColor: theme.surface,
          backgroundColor: hexToRgba(theme.primary || defaultColor, 0.1),
        }),
      datasets
    ),
    []
  )

  datasets &&
    datasets.map((dataset) => {
      dataset.datalabels = {
        align: "end",
        anchor: "end",
        textAlign: "center",
        color: theme["on-primary"],
        display: ({
          active,
          dataIndex,
          dataset: { data },
        }: {
          active: boolean
          dataIndex: number
          dataset: { data: number[] }
        }) =>
          active
            ? true
            : data[dataIndex] > average(data) * 0.9
            ? "auto"
            : false,
      }
    })

  const annotations = (max
    ? [
        {
          type: "line",
          borderWidth: 2,
          value: max.value,
          mode: "horizontal",
          borderDash: [6, 3],
          scaleID: "y-axis-0",
          borderColor: theme.secondary,
          drawTime: "beforeDatasetsDraw",
          label: {
            enabled: true,
            fontColor: theme["on-primary"],
            backgroundColor: theme.secondary,
            content: `${Months[max.month - 1]} ${max.year}: ${max.value} décès`,
          },
        },
      ]
    : []) as AnnotationOptions[]

  const datalabels = {
    padding: 6,
    color: "white",
    borderRadius: 4,
    // font: { weight: "bold" },
    backgroundColor: ({ active }: { active: boolean }) =>
      active
        ? hexToRgba(theme.primary || defaultColor, 0.9)
        : hexToRgba(theme.primary || defaultColor, 0.8),
    formatter: (
      value: number,
      {
        active,
        dataIndex,
        dataset: { label, data },
      }: {
        active: boolean
        dataIndex: number
        dataset: { label: string; data: number[] }
      }
    ) =>
      active
        ? `${Months[dataIndex]} ${label}\n${data[dataIndex]} décès`
        : value > 1000
        ? (value / 1000).toFixed() + "K"
        : value,
  } as ChartDataSets["datalabels"]

  return (
    <div className="chart">
      <DefaultChart
        xAxes={xAxes}
        yAxes={yAxes}
        labels={labels}
        datasets={datasets}
        // gradient={gradient}
        datalabels={datalabels}
        annotations={annotations}
      />
    </div>
  )
}

export default Chart
