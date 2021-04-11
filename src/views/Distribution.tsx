import hexToRgba from "hex-to-rgba"
import palette from "google-palette"
import Chart from "@/components/Chart"
import Panel from "@/components/Panel"
import { useTheme } from "@/services/themes"
import useMortality from "@/services/mortality"
import { ChartDataSets, ChartOptions } from "chart.js"
// import { AnnotationOptions } from "chartjs-plugin-annotation"

const Distribution = (): JSX.Element => {
  const { values: theme = {} } = useTheme()
  const [mortality] = useMortality()
  const { labels, data, ageGroups } = mortality as Mortality
  // const max = Math.max(...ratio)
  const defaultColor = "#ffffff"

  const colors = palette("cb-Set3", data.length, 0, 0.5).map(
    (color: string) => `#${color}`
  )

  const totals = data.reduce(
    (acc, ageGroup) => (ageGroup.forEach((value, i) => (acc[i] += value)), acc),
    new Array((data[0] || []).length).fill(0)
  )

  console.log("totals", totals)

  const bars = data.map((ageGroup, i) => {
    console.log("ageGroup", ageGroup)
    const total = ageGroup.reduce((a, b) => a + b)
    console.log("total", total)
    const ageGroupRatios = ageGroup.map((group, j) => (group * 100) / totals[j])
    console.log("ageGroupRatios", ageGroupRatios)
    // const total2 = ageGroupRatios.reduce((a, b) => a + b)
    // console.log("total2", total2)
    return {
      type: "bar",
      data: ageGroupRatios,
      borderWidth: 0,
      label: `bar-${i}`,
      yAxisID: "y-axis-1",
      borderColor: theme.surface,
      backgroundColor: colors[i],
      // backgroundColor: hexToRgba(theme.primary || defaultColor, 0.2),
      // min: 0,
      // max: 100,
    }
  })

  const datasets = [
    // {
    //   fill: false,
    //   data: ratio,
    //   type: "line",
    //   label: "Ratio",
    //   borderWidth: 3,
    //   pointRadius: 5,
    //   yAxisID: "y-axis-2",
    //   borderColor: theme.secondary,
    //   pointBorderColor: theme.secondary,
    //   pointBackgroundColor: theme.surface,
    //   // datalabels: {
    //   //   align: "end",
    //   //   anchor: "end",
    //   //   borderRadius: 4,
    //   //   color: theme["on-primary"],
    //   //   display: ({ dataIndex }: { dataIndex: number }) => dataIndex % 2,
    //   //   formatter: (value: number) => `${value.toFixed(2)}%`,
    //   //   backgroundColor: ({ active }: { active: boolean }) =>
    //   //     active
    //   //       ? hexToRgba(theme.secondary || defaultColor, 0.9)
    //   //       : hexToRgba(theme.secondary || defaultColor, 0.8),
    //   // },
    // },
    ...bars,
  ] as ChartDataSets[]

  const xAxes = [{ offset: true, stacked: true }]

  const yAxes = [
    {
      stacked: true,
      id: "y-axis-1",
      type: "linear",
      position: "left",
      display: false,
      // min: 0,
      // suggestedMin: 0,
      // max: 110,
      // suggestedMax: 110,
      ticks: {
        stepSize: 1,
      },
    },
    // {
    //   id: "y-axis-2",
    //   type: "linear",
    //   position: "right",
    //   gridLines: { drawOnChartArea: false },
    // },
  ]

  // const annotations = (max
  //   ? [
  //       {
  //         value: max,
  //         type: "line",
  //         borderWidth: 4,
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
    font: { size: 9, weight: "bold" },
    color: ({ active }: { active: boolean }) =>
      active ? theme["on-primary"] : theme.surface,
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
        : `${value.toFixed(1)}%\n(${ageGroups[datasetIndex]}-${
            ageGroups[datasetIndex] + 10
          })`,
    // : value > 1000
    // ? (value / 1000).toFixed() + "k"
    // : Math.round(value * 100) / 100,
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

export default Distribution
