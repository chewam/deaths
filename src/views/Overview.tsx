import hexToRgba from "hex-to-rgba"
import Chart from "@/components/Chart"
import Panel from "@/components/Panel"
import { useTheme } from "@/services/themes"
import useOverview from "@/services/overview"
import { ChartDataSets } from "chart.js"
import { AnnotationOptions } from "chartjs-plugin-annotation"

const average = (nums: number[]): number =>
  nums.reduce((a, b) => a + b) / nums.length

const Overview = (): JSX.Element => {
  const [overview] = useOverview()
  const { values: theme = {} } = useTheme()
  const { labels, data } = overview as Overview
  console.log("data", data)

  const max = data.length ? Math.max(...data) : 0
  const xAxes = [{}]

  const yAxes = [
    {
      ticks: {
        // stepSize: 5000,
        suggestedMax: max && max + (max * 5) / 100,
      },
    },
  ]

  const defaultColor = "#ffffff"

  const datasets = [
    {
      data,
      label: "Décès",
      borderWidth: 2,
      borderColor: theme?.primary,
      pointBorderColor: theme.primary,
      pointBackgroundColor: theme.surface,
      backgroundColor: hexToRgba(theme.primary || defaultColor, 0.15),
      datalabels: {
        align: "end",
        anchor: "end",
        textAlign: "center",
        display: ({ active, dataIndex, dataset: { data } }) => {
          const d = data as number[]
          const avg = average(d)
          return active ? true : d[dataIndex] > avg + avg * 0.1 ? "auto" : false
        },
      },
    },
  ] as ChartDataSets[]

  // const gradient: [number, string][] = [
  //   [0, hexToRgba(theme.primary || defaultColor, 0.5)],
  //   [0.2, hexToRgba(theme.primary || defaultColor, 0.2)],
  //   [0.5, hexToRgba(theme.primary || defaultColor, 0)],
  // ]
  console.log("max", max)

  const annotations = (max
    ? [
        {
          value: max,
          type: "line",
          borderWidth: 2,
          mode: "horizontal",
          borderDash: [6, 3],
          scaleID: "y-axis-0",
          borderColor: theme.secondary,
          drawTime: "afterDatasetsDraw",
          label: {
            enabled: true,
            fontColor: theme["on-primary"],
            backgroundColor: theme.secondary,
            content: `${labels[data.indexOf(max)]}: ${max} décès`,
          },
        },
      ]
    : []) as AnnotationOptions[]

  const datalabels = {
    padding: 6,
    color: "white",
    borderRadius: 4,
    font: { weight: "bold" },
    backgroundColor: ({ active }) =>
      active
        ? hexToRgba(theme.primary || defaultColor, 0.9)
        : hexToRgba(theme.primary || defaultColor, 0.8),
    formatter: (value: number, { active, dataIndex, dataset: { data } }) =>
      active
        ? `${labels[dataIndex]}\n${data ? data[dataIndex] : ""} décès`
        : value > 1000
        ? (value / 1000).toFixed() + "K"
        : value,
  } as ChartDataSets["datalabels"]

  return (
    <Panel className="overview">
      <div style={{ flex: 1 }}>
        <Chart
          xAxes={xAxes}
          yAxes={yAxes}
          labels={labels}
          datasets={datasets}
          // gradient={gradient}
          datalabels={datalabels}
          annotations={annotations}
        />
      </div>
    </Panel>
  )
}

export default Overview
