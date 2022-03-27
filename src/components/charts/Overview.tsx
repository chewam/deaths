import { Chart } from "chart.js"
import hexToRgba from "hex-to-rgba"
import { useIntl } from "react-intl"
import { Line } from "react-chartjs-2"
// import { useTheme } from "@/services/themes"
import useOverview from "@/services/overview"
import useRawDeaths from "@/services/raw-deaths"
import ChartDataLabels from "chartjs-plugin-datalabels"
import type { ChartDataset, ChartOptions } from "chart.js"
import annotationPlugin, {
  LabelOptions,
  LineAnnotationOptions,
} from "chartjs-plugin-annotation"

const average = (nums: number[]): number =>
  nums.reduce((a, b) => a + b) / nums.length

const Overview = (): JSX.Element => {
  useRawDeaths()
  const defaultColor = "#ffffff"
  const [overview] = useOverview()
  // const { values: theme = {} } = useTheme()
  const { labels, data } = overview as Overview
  const max = data.length ? Math.max(...data) : 0
  const { formatMessage: fm, formatNumber: fn } = useIntl()

  Chart.register(ChartDataLabels)
  Chart.register(annotationPlugin)

  const theme = {
    base: "#60a5fa",
    text: "#d1d5db",
    border: "#4b5563",
    secondary: "#16a34a",
  }

  console.log("THEME", theme)

  const datasets = [
    {
      data,
      tension: 0.4,
      label: "Décès",
      borderWidth: 2,
      borderColor: theme.base,
      pointBorderColor: theme.base,
      pointBackgroundColor: theme.base,
      backgroundColor: hexToRgba(theme.base || defaultColor, 0.15),
    },
  ] as ChartDataset[]

  const chartData = { labels, datasets }

  const getAnnotationContent = () => {
    const label = labels[data.indexOf(max)]
    const [month, year] = (label || "January 2000").split(" ")

    return `${fm({ id: month })} ${year}: ${fn(max)} ${fm({ id: "deaths" })}`
  }

  const maxAnnotationLabel = {
    width: 0,
    height: 0,
    enabled: true,
    fontColor: theme.text,
    content: getAnnotationContent(),
    backgroundColor: theme.secondary,
  } as LabelOptions

  const maxAnnotation = {
    value: max,
    type: "line",
    scaleID: "y",
    borderWidth: 2,
    borderDash: [6, 3],
    borderColor: theme.secondary,
    label: maxAnnotationLabel,
  } as LineAnnotationOptions

  const options = {
    fill: true,
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 0 },
    layout: {
      padding: { top: 0, right: 30, bottom: 0, left: 0 },
    },
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
      annotation: {
        annotations: { maxAnnotation },
      },
      datalabels: {
        offset: 3,
        clamp: true,
        align: "end",
        anchor: "end",
        borderRadius: 4,
        textAlign: "center",
        font: { weight: "bold" },
        color: theme.text,
        backgroundColor: theme.base,
        padding: { top: 4, right: 5, bottom: 4, left: 5 },
        formatter: (value: number) => (value / 1000).toFixed() + "K",
        display: ({ active, dataIndex, dataset: { data } }) => {
          const d = data as number[]
          const avg = average(d)
          return active ? true : d[dataIndex] > avg + avg * 0.1 ? "auto" : false
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          padding: 0,
          color: theme.text,
        },
      },
      y: {
        beginAtZero: true,
        suggestedMax: max && max + (max * 5) / 100,
        ticks: {
          padding: 10,
          color: theme.text,
        },
        grid: {
          lineWidth: 1,
          drawTicks: false,
          drawBorder: false,
          borderDash: [3, 3],
          color: theme.border,
          // color: (context) => (context.tick.value > 0 ? theme.border : "lime"),
        },
      },
    },
  } as ChartOptions

  return <Line data={chartData} options={options} />
}

export default Overview
