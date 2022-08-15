import type { ChartDataset, ChartOptions } from "chart.js"
import type { Context } from "chartjs-plugin-datalabels"

import hexToRgba from "hex-to-rgba"
import { useIntl } from "react-intl"
import { Bar } from "react-chartjs-2"
import ChartDataLabels from "chartjs-plugin-datalabels"
import AnnotationPlugin from "chartjs-plugin-annotation"
import {
  Title,
  BarElement,
  LineElement,
  LinearScale,
  PointElement,
  CategoryScale,
  Chart as ChartJS,
} from "chart.js"

import useMortality from "@/services/mortality"
import useRawMortality from "@/services/raw-mortality"
import useColorScheme from "@/services/use-color-scheme"

ChartJS.register(
  Title,
  BarElement,
  LineElement,
  LinearScale,
  PointElement,
  CategoryScale,
  ChartDataLabels,
  AnnotationPlugin
)

export const getBarLabelBackgroundColor =
  () =>
  ({ active }: Context) =>
    active ? "rgb(30, 58, 138)" : "rgba(0, 0, 0, 0)"

export const getBarLabelDisplay = ({
  chart,
  active,
  dataIndex,
  dataset: { data },
}: Context) => {
  const { scales } = chart as ChartJS
  const scale = scales["y"]
  const { max } = scale
  const value = (data || [])[dataIndex] || 0

  return active ? true : value > max * 0.05 ? "auto" : false
}

export const getFormattedLineLabel = (value: number) => `${value.toFixed(2)}%`

export const getLineLabelDisplay = ({ active }: Context) =>
  active ? true : "auto"

const Distribution = (): JSX.Element => {
  useRawMortality()
  const darkMode = useColorScheme()
  const [mortality] = useMortality()
  const { formatMessage: fm, formatNumber: fn } = useIntl()
  const { labels, data, ratio, ageGroups } = mortality as Mortality

  const theme = {
    base: "#60a5fa",
    label: "#ffffff",
    secondary: "#16a34a",
    text: darkMode ? "#d1d5db" : "#111827",
    border: darkMode ? "#4b5563" : "#d1d5db",
  }

  const tr = (str: string) => fm({ id: str })

  const getAgeGroup = (datasetIndex: number) => {
    const ageGroup = ageGroups[datasetIndex - 1]

    return `${ageGroup}${
      datasetIndex > 10
        ? "+"
        : ` ${tr("to")} ${ageGroup + 9} ${tr("years old")}`
    }`
  }

  const getLongFormat = (
    dataIndex: number,
    datasetIndex: number,
    value: number
  ) => {
    return `${dataIndex + 2000}
${tr("Deaths count")}: ${fn(value)}
${tr("Age group")}: ${getAgeGroup(datasetIndex)}`
  }

  const getShortFormat = (datasetIndex: number, value: number) => {
    const ageGroup = ageGroups[datasetIndex - 1]
    return `${(value / 1000).toFixed()}K\n${ageGroup}-${ageGroup + 10}`
  }

  const getFormattedBarLabel = (
    value: number,
    { active, dataIndex, datasetIndex }: Context
  ) => {
    if (active) {
      return getLongFormat(dataIndex, datasetIndex, value)
    } else if (value > 1000) {
      return getShortFormat(datasetIndex, value)
    }
    return fn(Math.round(value))
  }

  const bars = data.map((ageGroup, i) => ({
    yAxisID: "y",
    data: ageGroup,
    label: `bar-${i}`,
    borderColor: "transparent",
    hoverBackgroundColor: "rgb(30, 58, 138)",
    backgroundColor: hexToRgba(theme.base, 0.8),
    borderWidth: { top: 1, right: 0, bottom: 0, left: 0 },
    datalabels: {
      borderRadius: 4,
      color: theme.label,
      display: getBarLabelDisplay,
      textAlign: "center" as const,
      formatter: getFormattedBarLabel,
      font: { size: 10, weight: "bold" as const },
      backgroundColor: getBarLabelBackgroundColor(),
    },
  }))

  const datasets = [
    {
      data: ratio,
      tension: 0.4,
      yAxisID: "y2",
      label: "Ratio",
      borderWidth: 3,
      pointRadius: 5,
      type: "line" as const,
      borderColor: theme.secondary,
      pointBorderColor: theme.secondary,
      pointBackgroundColor: theme.secondary,
      datalabels: {
        offset: 3,
        clamp: true,
        borderRadius: 4,
        color: theme.label,
        align: "end" as const,
        anchor: "end" as const,
        display: getLineLabelDisplay,
        textAlign: "center" as const,
        formatter: getFormattedLineLabel,
        backgroundColor: theme.secondary,
        font: { weight: "bold" as const },
        padding: { top: 4, right: 5, bottom: 4, left: 5 },
      },
    },
    ...bars,
  ] as ChartDataset<"bar">[]

  const options = {
    maintainAspectRatio: false,
    animation: { duration: 0 },
    interaction: { mode: "nearest" as const },
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
      annotation: { annotations: {} },
    },
    scales: {
      x: {
        type: "category" as const,
        stacked: true,
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          color: theme.text,
        },
      },
      y: {
        stacked: true,
        type: "linear" as const,
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
      y2: {
        type: "linear" as const,
        position: "right" as const,
        ticks: {
          padding: 10,
          stepSize: 0.1,
          color: theme.text,
          callback: getFormattedLineLabel,
        },
        grid: {
          display: false,
          drawBorder: false,
        },
      },
    },
  } as ChartOptions<"bar">

  return <Bar data={{ labels, datasets }} options={options} />
}

export default Distribution
