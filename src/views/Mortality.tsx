import hexToRgba from "hex-to-rgba"
import Chart from "@/components/Chart"
import Panel from "@/components/Panel"
import { useTheme } from "@/services/themes"
import useMortality from "@/services/mortality"
// import { ChartDataSets, ChartOptions, ChartScales } from "chart.js"
// import { AnnotationOptions } from "chartjs-plugin-annotation"
import { ChartDataSets, ChartOptions } from "chart.js"

// const average = (nums: [number]) => nums.reduce((a, b) => a + b) / nums.length

const Mortality = (): JSX.Element => {
  const { values: theme = {} } = useTheme()
  const [mortality] = useMortality()
  const { labels, data, ratio, ageGroups } = mortality as Mortality
  console.log("labels", labels, labels.length, ageGroups)

  // const max = Math.max(...ratio)
  const defaultColor = "#ffffff"

  const bars = data.map((ageGroup, i) => ({
    type: "bar",
    data: ageGroup,
    label: `bar-${i}`,
    yAxisID: "y-axis-1",
    borderWidth: { top: 2, right: 2, bottom: 0, left: 2 },
    backgroundColor: hexToRgba(theme.primary || defaultColor, 0.2),
    // datalabels: {
    //   align: "center",
    //   anchor: "center",
    // },
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
        color: theme["on-primary"],
        display: true,
        // display: ({ dataIndex }: { dataIndex: number }) => dataIndex % 2,
        formatter: (value: number) => `${value.toFixed(2)}%`,
        backgroundColor: ({ active }: { active: boolean }) =>
          active
            ? hexToRgba(theme.secondary || defaultColor, 0.9)
            : hexToRgba(theme.secondary || defaultColor, 0.8),
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
    // align: "right",
    // anchor: "start",
    textAlign: "center",
    font: { size: 9, weight: "bold" },
    color: ({ active }: { active: boolean }) =>
      active ? theme["on-primary"] : theme.primary,
    display: ({ active, dataset: { data }, dataIndex, chart }) => {
      const { scales } = chart as ChartOptions
      const s = scales as Record<string, Record<string, number>>
      const end = s["y-axis-1"].end
      const value = (data || [])[dataIndex] || 0
      return !!(active || value > end * 0.05)
    },
    backgroundColor: ({ active }) =>
      active
        ? hexToRgba(theme.primary || defaultColor, 0.9)
        : "rgba(0, 0, 0, 0)",
    formatter: (value, { active, datasetIndex }) =>
      active
        ? `${datasetIndex * 10}${
            datasetIndex > 10 ? "+" : `-${datasetIndex * 10 + 10}`
          }\n${value} décès`
        : value > 1000
        ? `${(value / 1000).toFixed()} k\n${ageGroups[datasetIndex - 1]}-${
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
