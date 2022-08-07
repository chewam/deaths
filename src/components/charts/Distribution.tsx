import type { ChartDataset, ChartOptions } from "chart.js"
import type { Context } from "chartjs-plugin-datalabels"

import hexToRgba from "hex-to-rgba"
import { useIntl } from "react-intl"
import { Bar } from "react-chartjs-2"
import ChartDataLabels from "chartjs-plugin-datalabels"
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
  ChartDataLabels
)

const Distribution = (): JSX.Element => {
  useRawMortality()
  const defaultColor = "#ffffff"
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

  const getBarBackgroundColor = ({ active }: Context) =>
    active ? hexToRgba(theme.base || defaultColor, 0.9) : "rgba(0, 0, 0, 0)"

  const getBarDisplay = ({
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

  const getBarFormatter = (
    value: number,
    { active, dataIndex, datasetIndex }: Context
  ) =>
    active
      ? `${dataIndex + 2000}\n${fm({
          id: "Deaths count",
        })}: ${fn(value)}\n${fm({ id: "Age group" })}: ${
          ageGroups[datasetIndex - 1]
        }${
          datasetIndex > 10
            ? "+"
            : ` ${fm({ id: "to" })} ${ageGroups[datasetIndex - 1] + 9} ${fm({
                id: "years old",
              })}`
        }`
      : value > 1000
      ? `${(value / 1000).toFixed()}K\n${ageGroups[datasetIndex - 1]}-${
          ageGroups[datasetIndex - 1] + 10
        }`
      : fn(Math.round(value))

  const bars = data.map((ageGroup, i) => ({
    yAxisID: "y",
    data: ageGroup,
    label: `bar-${i}`,
    borderColor: "transparent",
    borderWidth: { top: 2, right: 0, bottom: 2, left: 0 },
    backgroundColor: hexToRgba(theme.base || defaultColor, 0.8),
    datalabels: {
      borderRadius: 4,
      color: theme.label,
      display: getBarDisplay,
      formatter: getBarFormatter,
      textAlign: "center" as const,
      backgroundColor: getBarBackgroundColor,
      font: { size: 11, weight: "bold" as const },
      padding: { top: 4, right: 5, bottom: 4, left: 5 },
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
        textAlign: "center" as const,
        backgroundColor: theme.secondary,
        font: { weight: "bold" as const },
        padding: { top: 4, right: 5, bottom: 4, left: 5 },
        formatter: (value: number) => value.toFixed(2) + "%",
        display: ({ active }: Context) => (active ? true : "auto"),
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
          callback: (value: number) => `${value.toFixed(2)}%`,
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
