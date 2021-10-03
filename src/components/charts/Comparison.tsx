import { Chart } from "chart.js"
import hexToRgba from "hex-to-rgba"
import { useIntl } from "react-intl"
import { Line } from "react-chartjs-2"
import { palette } from "@/utils/index"
import useYears from "@/services/years"
import Months from "@/data/months.json"
import useDeaths from "@/services/deaths"
import { useTheme } from "@/services/themes"
import useRawDeaths from "@/services/raw-deaths"
import ChartDataLabels from "chartjs-plugin-datalabels"
import annotationPlugin from "chartjs-plugin-annotation"

import type { Context } from "chartjs-plugin-datalabels"
import type { ChartDataset, ChartOptions } from "chart.js"
import type {
  LabelOptions,
  LineAnnotationOptions,
} from "chartjs-plugin-annotation"

const getMaximum = (data: Deaths["data"]) => {
  if (!data) return {}
  const maximums = data.reduce((acc, year, i) => {
    const max = Math.max(...(year || []))
    const index = year?.indexOf(max)
    acc[max] = { year: 2000 + i, month: index + 1, value: max }
    return acc
  }, {} as { [key: number]: Record<string, number> })
  const keys = Object.keys(maximums).map(Number)
  const maxValue = Math.max(...keys)
  return maximums[maxValue]
}

const Comparison = (): JSX.Element => {
  useRawDeaths()
  const [years] = useYears()
  const [deaths] = useDeaths()
  const defaultColor = "#ffffff"
  const { labels, data } = deaths as Deaths
  const { values: theme = {} } = useTheme()
  const max = getMaximum(data)
  const { formatMessage: fm, formatNumber: fn } = useIntl()
  const paletteSubset = palette.slice(0, Object.keys(years || {}).length)

  Chart.register(annotationPlugin)
  Chart.register(ChartDataLabels)

  const getDataSet = (year: string, index: number): ChartDataset => ({
    label: year,
    tension: 0.4,
    pointRadius: 4,
    borderWidth: 2,
    data: (data || {})[+year - 2000],
    borderColor: paletteSubset[index],
    pointBackgroundColor: theme.surface,
    pointBorderColor: paletteSubset[index],
    backgroundColor: hexToRgba(theme.primary || defaultColor, 0.1),
    datalabels: {
      offset: 3,
      clamp: true,
      align: "end",
      anchor: "end",
      borderRadius: 4,
      textAlign: "center",
      font: { weight: "bold" },
      color: theme["on-primary"],
      backgroundColor: paletteSubset[index],
      padding: { top: 4, right: 5, bottom: 4, left: 5 },
      display: ({ active }: Context) => (active ? true : "auto"),
      formatter: (value: number) => (value / 1000).toFixed() + "K",
    },
  })

  const datasets = Object.keys(years || {}).reduce(
    (datasets: ChartDataset[], year, i) => (
      years && years[year] && datasets.push(getDataSet(year, i)), datasets
    ),
    []
  )

  const chartData = { labels, datasets }

  const getAnnotationContent = () => {
    const month = Months[max?.month - 1] || "January"

    return `${fm({ id: month })} ${max?.year}: ${fn(max?.value)} ${fm({
      id: "deaths",
    })}`
  }

  const maxAnnotationLabel = {
    width: 0,
    height: 0,
    enabled: true,
    fontColor: theme["on-primary"],
    content: getAnnotationContent(),
    backgroundColor: theme.secondary,
  } as LabelOptions

  const maxAnnotation = {
    type: "line",
    scaleID: "y",
    borderWidth: 2,
    value: max?.value,
    borderDash: [6, 3],
    borderColor: theme.secondary,
    label: maxAnnotationLabel,
  } as LineAnnotationOptions

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 0 },
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
      annotation: {
        annotations: { maxAnnotation },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          color: theme.muted,
        },
      },
      y: {
        beginAtZero: true,
        suggestedMax: max && max.value + (max.value * 5) / 100,
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
    },
  } as ChartOptions

  return <Line data={chartData} options={options} />
}

export default Comparison
