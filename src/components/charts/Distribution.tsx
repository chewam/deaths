import hexToRgba from "hex-to-rgba"
import { useIntl } from "react-intl"
import { Bar } from "react-chartjs-2"
import { useTheme } from "@/services/themes"
import useMortality from "@/services/mortality"
import useRawMortality from "@/services/raw-mortality"
import ChartDataLabels from "chartjs-plugin-datalabels"

import type { Context } from "chartjs-plugin-datalabels"
import type { Chart, ChartDataset, ChartOptions } from "chart.js"

const Distribution = (): JSX.Element => {
  useRawMortality()
  const [mortality] = useMortality()
  const { values: theme = {} } = useTheme()
  const { formatMessage: fm, formatNumber: fn } = useIntl()
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
      borderRadius: 4,
      textAlign: "center",
      color: theme["on-primary"],
      font: { size: 11, weight: "bold" },
      backgroundColor: ({ active }: Context) =>
        active
          ? hexToRgba(theme.primary || defaultColor, 0.9)
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
                : ` ${fm({ id: "to" })} ${
                    ageGroups[datasetIndex - 1] + 9
                  } ${fm({ id: "years old" })}`
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
  ] as ChartDataset[]

  const chartData = { labels, datasets }

  const plugins = [ChartDataLabels]

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
          color: theme.muted,
        },
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
          color: (context) =>
            context.tick.value > 0 ? theme.muted : theme.surface,
        },
      },
      y2: {
        type: "linear",
        position: "right",
        ticks: {
          padding: 10,
          stepSize: 0.1,
          color: theme.muted,
          callback: (value: number) => `${value.toFixed(2)}%`,
        },
        grid: {
          display: false,
          drawBorder: false,
        },
      },
    },
  } as ChartOptions

  return <Bar type="bar" data={chartData} options={options} plugins={plugins} />
}

export default Distribution
