import { Chart } from "chart.js"
import hexToRgba from "hex-to-rgba"
import { useIntl } from "react-intl"
import { Bar } from "react-chartjs-2"
import useMortality from "@/services/mortality"
import useRawMortality from "@/services/raw-mortality"
import ChartDataLabels from "chartjs-plugin-datalabels"

import type { Context } from "chartjs-plugin-datalabels"
import type { ChartDataset, ChartOptions } from "chart.js"

const Distribution = (): JSX.Element => {
  useRawMortality()
  const defaultColor = "#ffffff"
  const [mortality] = useMortality()
  const { formatMessage: fm, formatNumber: fn } = useIntl()
  const { labels, data, ratio, ageGroups } = mortality as Mortality

  const theme = {
    base: "#60a5fa",
    text: "#111827",
    border: "#d1d5db",
    secondary: "#16a34a",
    label: "#fff",
  }

  Chart.register(ChartDataLabels)

  const bars = data.map((ageGroup, i) => ({
    type: "bar",
    yAxisID: "y",
    data: ageGroup,
    label: `bar-${i}`,
    borderColor: "transparent",
    borderWidth: { top: 2, right: 0, bottom: 2, left: 0 },
    backgroundColor: hexToRgba(theme.base || defaultColor, 0.8),
    datalabels: {
      borderRadius: 4,
      textAlign: "center",
      color: theme.label,
      font: { size: 11, weight: "bold" },
      backgroundColor: ({ active }: Context) =>
        active
          ? hexToRgba(theme.base || defaultColor, 0.9)
          : "rgba(0, 0, 0, 0)",
      padding: { top: 4, right: 5, bottom: 4, left: 5 },
      display: ({ active, dataset: { data }, dataIndex, chart }: Context) => {
        const { scales } = chart as Chart
        const scale = scales["y"]
        const { max } = scale
        const value = (data || [])[dataIndex] || 0
        return active ? true : value > max * 0.05 ? "auto" : false
      },
      formatter: (
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
                : ` ${fm({ id: "to" })} ${ageGroups[datasetIndex - 1] + 9} ${fm(
                    { id: "years old" }
                  )}`
            }`
          : value > 1000
          ? `${(value / 1000).toFixed()}K\n${ageGroups[datasetIndex - 1]}-${
              ageGroups[datasetIndex - 1] + 10
            }`
          : fn(Math.round(value)),
    },
  }))

  const datasets = [
    {
      data: ratio,
      tension: 0.4,
      type: "line",
      yAxisID: "y2",
      label: "Ratio",
      borderWidth: 3,
      pointRadius: 5,
      borderColor: theme.secondary,
      pointBorderColor: theme.secondary,
      pointBackgroundColor: theme.secondary,
      datalabels: {
        offset: 3,
        clamp: true,
        align: "end",
        anchor: "end",
        borderRadius: 4,
        color: theme.label,
        textAlign: "center",
        font: { weight: "bold" },
        backgroundColor: theme.secondary,
        padding: { top: 4, right: 5, bottom: 4, left: 5 },
        formatter: (value: number) => value.toFixed(2) + "%",
        display: ({ active }: Context) => (active ? true : "auto"),
      },
    },
    ...bars,
  ] as ChartDataset[]

  const chartData = { labels, datasets }

  const options = {
    maintainAspectRatio: false,
    animation: { duration: 0 },
    interaction: { mode: "nearest" },
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
    scales: {
      x: {
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
        type: "linear",
        stacked: true,
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
        type: "linear",
        position: "right",
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
  } as ChartOptions

  return <Bar data={chartData} options={options} />
}

export default Distribution
