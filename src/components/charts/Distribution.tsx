import type { ChartDataset, ChartOptions } from "chart.js"
import type { Context } from "chartjs-plugin-datalabels"

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

import useTheme from "@/services/useTheme"
import useMortality from "@/services/mortality"
import useRawMortality from "@/services/raw-mortality"

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
  const theme = useTheme()
  const [mortality] = useMortality()
  const { formatMessage: fm, formatNumber: fn } = useIntl()
  const { labels, data, ratio, ageGroups } = mortality as Mortality

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
    backgroundColor: theme.primary.background,
    hoverBackgroundColor: theme.primary.hover?.background,
    borderWidth: { top: 1, right: 0, bottom: 0, left: 0 },
    datalabels: {
      borderRadius: 4,
      display: getBarLabelDisplay,
      textAlign: "center" as const,
      formatter: getFormattedBarLabel,
      borderColor: theme.primary.label?.hover?.border,
      font: { size: 10, weight: "bold" as const },
      borderWidth: ({ active }: Context) => (active ? 2 : 0),
      backgroundColor: ({ active }: Context) =>
        active
          ? theme.primary.label?.hover?.background
          : theme.primary.label?.background,
      color: ({ active }: Context) =>
        active ? theme.primary.label?.hover?.text : theme.primary.label?.text,
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
      borderColor: theme.secondary.border,
      pointBackgroundColor: theme.secondary.border,
      datalabels: {
        offset: 3,
        clamp: true,
        borderRadius: 4,
        align: "end" as const,
        anchor: "end" as const,
        color: theme.secondary.label?.text,
        display: getLineLabelDisplay,
        textAlign: "center" as const,
        formatter: getFormattedLineLabel,
        font: { weight: "bold" as const },
        backgroundColor: theme.secondary.label?.background,
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
          color: theme.scale.text,
        },
      },
      y: {
        stacked: true,
        type: "linear" as const,
        ticks: {
          padding: 10,
          color: theme.scale.text,
        },
        grid: {
          lineWidth: 1,
          drawTicks: false,
          drawBorder: false,
          borderDash: [3, 3],
          color: theme.scale.border,
        },
      },
      y2: {
        type: "linear" as const,
        position: "right" as const,
        ticks: {
          padding: 10,
          stepSize: 0.1,
          color: theme.scale.text,
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
