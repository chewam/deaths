import type { Context } from "chartjs-plugin-datalabels"
import type {
  LabelOptions,
  LineAnnotationOptions,
} from "chartjs-plugin-annotation"

import hexToRgba from "hex-to-rgba"
import { useIntl } from "react-intl"
import { Line } from "react-chartjs-2"
import ChartDataLabels from "chartjs-plugin-datalabels"
import AnnotationPlugin from "chartjs-plugin-annotation"
import {
  Title,
  Filler,
  LineElement,
  LinearScale,
  PointElement,
  CategoryScale,
  Chart as ChartJS,
} from "chart.js"

import useOverview from "@/services/overview"
import useRawDeaths from "@/services/raw-deaths"
import useColorScheme from "@/services/use-color-scheme"

ChartJS.register(
  Title,
  Filler,
  LineElement,
  LinearScale,
  PointElement,
  CategoryScale,
  ChartDataLabels,
  AnnotationPlugin
)

export const average = (nums: number[]): number =>
  nums.reduce((a, b) => a + b) / nums.length

export const getDatalabelsDisplay = ({
  active,
  dataIndex,
  dataset: { data },
}: Context) => {
  const d = data as number[]
  const avg = average(d)
  return active ? true : d[dataIndex] > avg + avg * 0.1 ? "auto" : false
}

const Overview = (): JSX.Element => {
  useRawDeaths()
  const defaultColor = "#ffffff"
  const [overview] = useOverview()
  const darkMode = useColorScheme()
  const { labels, data } = overview as Overview
  const max = data.length ? Math.max(...data) : 0
  const { formatMessage: fm, formatNumber: fn } = useIntl()

  const theme = {
    base: "#60a5fa",
    label: "#ffffff",
    secondary: "#16a34a",
    text: darkMode ? "#d1d5db" : "#111827",
    border: darkMode ? "#4b5563" : "#d1d5db",
  }

  const datasets = [
    {
      data,
      fill: true,
      tension: 0.4,
      label: "Décès",
      borderWidth: 2,
      borderColor: theme.base,
      pointBorderColor: theme.base,
      pointBackgroundColor: theme.base,
      backgroundColor: hexToRgba(theme.base || defaultColor, 0.15),
    },
  ]

  const getAnnotationContent = () => {
    const label = labels[data.indexOf(max)]
    const [month, year] = (label || "January 2000").split(" ")

    return `${fm({ id: month })} ${year}: ${fn(max)} ${fm({ id: "deaths" })}`
  }

  const maxAnnotationLabel = {
    width: 0,
    height: 0,
    type: "label",
    display: true,
    borderRadius: 4,
    color: theme.label,
    content: getAnnotationContent(),
    backgroundColor: theme.secondary,
  } as LabelOptions

  const maxAnnotationLine = {
    value: max,
    type: "line",
    scaleID: "y",
    borderWidth: 2,
    borderDash: [6, 3],
    label: maxAnnotationLabel,
    borderColor: theme.secondary,
  } as LineAnnotationOptions

  const datalabels = {
    offset: 3,
    clamp: true,
    borderRadius: 4,
    color: theme.label,
    align: "end" as const,
    anchor: "end" as const,
    backgroundColor: theme.base,
    textAlign: "center" as const,
    display: getDatalabelsDisplay,
    font: { weight: "bold" as const },
    padding: { top: 4, right: 5, bottom: 4, left: 5 },
    formatter: (value: number) => (value / 1000).toFixed() + "K",
  }

  const options = {
    fill: true,
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 0 },
    layout: {
      padding: { top: 0, right: 30, bottom: 0, left: 0 },
    },
    plugins: {
      datalabels,
      legend: { display: false },
      tooltip: { enabled: false },
      annotation: {
        annotations: { maxAnnotationLine },
      },
    },
    scales: {
      x: {
        display: true,
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
        },
      },
    },
  }

  return <Line data={{ labels, datasets }} options={options} />
}

export default Overview
