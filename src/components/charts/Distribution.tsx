import hexToRgba from "hex-to-rgba"
import { Bar } from "react-chartjs-2"
import { ChartOptions } from "chart.js"
import { useTheme } from "@/services/themes"
import useMortality from "@/services/mortality"
import useRawMortality from "@/services/raw-mortality"
import ChartDataLabels, { Context } from "chartjs-plugin-datalabels"

const Distribution = (): JSX.Element => {
  useRawMortality()
  const [mortality] = useMortality()
  const { values: theme = {} } = useTheme()
  const { labels, data, ratio, ageGroups } = mortality as Mortality

  const defaultColor = "#ffffff"

  const bars = data.map((ageGroup, i) => ({
    type: "bar",
    yAxisID: "y",
    data: ageGroup,
    label: `bar-${i}`,
    borderColor: theme.surface,
    borderWidth: { top: 2, right: 0, bottom: 2, left: 0 },
    backgroundColor: hexToRgba(theme.primary || defaultColor, 0.8),
    datalabels: {
      // offset: 3,
      // clamp: true,
      // align: "end",
      // anchor: "end",
      // display: "auto",
      // borderRadius: 4,
      textAlign: "center",
      // font: { weight: "bold" },
      color: theme["on-primary"],
      // backgroundColor: theme.secondary,
      // padding: { top: 4, right: 5, bottom: 4, left: 5 },
      // formatter: (value: number) => (value / 1000).toFixed() + "K",
      display: ({ active, dataset: { data }, dataIndex, chart }: Context) => {
        const { scales } = chart as ChartOptions
        const s = scales as Record<string, Record<string, number>>
        const end = s["y"].end
        const value = (data || [])[dataIndex] || 0
        return active ? true : value > end * 0.05 ? "auto" : false
      },
      formatter: (
        value: number,
        { active, dataIndex, datasetIndex }: Context
      ) =>
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
    },
  }))

  const datasets = [
    {
      data: ratio,
      type: "line",
      yAxisID: "y2",
      label: "Ratio",
      borderWidth: 3,
      pointRadius: 5,
      borderColor: theme.secondary,
      pointBorderColor: theme.secondary,
      pointBackgroundColor: theme["on-primary"],
      datalabels: {
        offset: 3,
        clamp: true,
        align: "end",
        anchor: "end",
        borderRadius: 4,
        textAlign: "center",
        font: { weight: "bold" },
        color: theme["on-primary"],
        backgroundColor: theme.secondary,
        padding: { top: 4, right: 5, bottom: 4, left: 5 },
        formatter: (value: number) => value.toFixed(2) + "%",
        display: ({ active }: Context) => (active ? true : "auto"),
      },
    },
    ...bars,
  ]

  const chartData = { labels, datasets }

  const plugins = [ChartDataLabels]

  const options = {
    respnsive: true,
    maintainAspectRatio: false,
    animation: { duration: 0 },
    interaction: { mode: "nearest" },
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
    scales: {
      x: {
        // offset: true,
        stacked: true,
        grid: { display: false },
        ticks: {
          color: theme.muted,
        },
        // gridLines: { display: false },
        // ticks: {
        // padding: 5,
        // },
      },
      y: {
        type: "linear",
        stacked: true,
        ticks: {
          padding: 10,
          color: theme.muted,
        },
        grid: {
          lineWidth: 1,
          drawTicks: false,
          drawBorder: false,
          borderDash: [3, 3],
          color: theme.muted,
          zeroLineColor: theme.muted,
        },
      },
      y2: {
        type: "linear",
        position: "right",
        ticks: {
          padding: 10,
          stepSize: 0.1,
          color: theme.muted,
        },
        grid: { display: false, zeroLineColor: theme.surface },
      },
    },
  } as ChartOptions

  return <Bar type="bar" data={chartData} options={options} plugins={plugins} />
}

export default Distribution
