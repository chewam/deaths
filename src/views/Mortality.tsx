import hexToRgba from "hex-to-rgba"
import Chart from "@/components/Chart"
import Panel from "@/components/Panel"
import { useTheme } from "@/services/themes"
import useMortality from "@/services/mortality"
import { ChartDataSets, ChartOptions } from "chart.js"
import { getYearPopulation } from "../utils"

const Mortality = (): JSX.Element => {
  const { values: theme = {} } = useTheme()
  const [mortality] = useMortality()
  const { labels, data, ratio, ageGroups } = mortality as Mortality

  const defaultColor = "#ffffff"

  const bars = data.map((ageGroup, i) => ({
    type: "bar",
    data: ageGroup,
    label: `bar-${i}`,
    yAxisID: "y-axis-1",
    borderColor: theme.surface,
    borderWidth: { top: 2, right: 0, bottom: 2, left: 0 },
    backgroundColor: hexToRgba(theme.primary || defaultColor, 0.35),
  }))

  const datasets = [
    {
      fill: false,
      data: ratio,
      type: "line",
      label: "Ratio",
      borderWidth: 3,
      pointRadius: 5,
      yAxisID: "y-axis-2",
      borderColor: theme.secondary,
      pointBorderColor: theme.secondary,
      pointBackgroundColor: theme.surface,
      datalabels: {
        align: "end",
        anchor: "end",
        borderRadius: 4,
        borderWidth: 2,
        borderColor: theme.surface,
        color: theme["on-primary"],
        display: ({ active }) => (active ? true : "auto"),
        formatter: (value: number, { active, dataIndex }) =>
          active
            ? `${2000 + dataIndex}\nTaux de mortalité: ${value.toFixed(
                2
              )}%\nPopulation totale: ${getYearPopulation(2000 + dataIndex)}`
            : `${value.toFixed(2)}%`,
        backgroundColor: theme.secondary,
      },
    },
    ...bars,
  ] as ChartDataSets[]

  const xAxes = [{ offset: true, stacked: true }]

  const yAxes = [
    {
      stacked: true,
      id: "y-axis-1",
      type: "linear",
      position: "left",
      ticks: {
        callback: (value: number) => (value ? `${value / 1000}K` : 0),
      },
    },
    {
      id: "y-axis-2",
      type: "linear",
      position: "right",
      gridLines: { drawOnChartArea: false },
      ticks: {
        stepSize: 0.05,
        callback: (value: number) => `${value.toFixed(2)}%`,
      },
    },
  ]

  // const annotations = (max
  //   ? [
  //       {
  //         value: max,
  //         type: "line",
  //         borderWidth: 2,
  //         mode: "horizontal",
  //         borderDash: [6, 3],
  //         scaleID: "y-axis-2",
  //         borderColor: theme.secondary,
  //         drawTime: "afterDatasetsDraw",
  //         label: {
  //           enabled: true,
  //           fontColor: theme["on-primary"],
  //           backgroundColor: theme.secondary,
  //           content: `${labels[ratio.indexOf(max)]}: ${max.toFixed(2)}% décès`,
  //         },
  //       },
  //     ]
  //   : []) as AnnotationOptions[]

  const datalabels = {
    textAlign: "center",
    color: theme["on-primary"],
    font: { size: 11, weight: "bold" },
    display: ({ active, dataset: { data }, dataIndex, chart }) => {
      const { scales } = chart as ChartOptions
      const s = scales as Record<string, Record<string, number>>
      const end = s["y-axis-1"].end
      const value = (data || [])[dataIndex] || 0
      return active ? true : value > end * 0.05 ? "auto" : false
    },
    borderRadius: 4,
    backgroundColor: ({ active }) =>
      active
        ? hexToRgba(theme.primary || defaultColor, 0.9)
        : "rgba(0, 0, 0, 0)",
    formatter: (value, { active, dataIndex, datasetIndex }) =>
      active
        ? `${dataIndex + 2000}\nNombe de décès: ${value}\nTranche d'âge: ${
            ageGroups[datasetIndex - 1]
          }${
            datasetIndex > 10
              ? "+"
              : ` à ${ageGroups[datasetIndex - 1] + 9} ans`
          }`
        : value > 1000
        ? `${(value / 1000).toFixed()}K\n${ageGroups[datasetIndex - 1]}-${
            ageGroups[datasetIndex - 1] + 10
          }`
        : Math.round(value),
  } as ChartDataSets["datalabels"]

  return (
    <Panel className="mortality">
      <div style={{ flex: 1 }}>
        <Chart
          xAxes={xAxes}
          yAxes={yAxes}
          labels={labels}
          datasets={datasets}
          datalabels={datalabels}
          // annotations={annotations}
        />
      </div>
    </Panel>
  )
}

export default Mortality
