import { Chart } from "chart.js"
import hexToRgba from "hex-to-rgba"
import { useIntl } from "react-intl"
import { Line } from "react-chartjs-2"
import ChartDataLabels from "chartjs-plugin-datalabels"
import type { Context } from "chartjs-plugin-datalabels"
import annotationPlugin from "chartjs-plugin-annotation"
import type { ChartDataset, ChartOptions } from "chart.js"
import type {
  LabelOptions,
  LineAnnotationOptions,
} from "chartjs-plugin-annotation"

import { palette } from "@/utils/index"
import useYears from "@/services/years"
import Months from "@/data/months.json"
import useDeaths from "@/services/deaths"
import useRawDeaths from "@/services/raw-deaths"
import useColorScheme from "@/services/use-color-scheme"

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
  const darkMode = useColorScheme()
  const { labels, data } = deaths as Deaths
  const max = getMaximum(data)
  const { formatMessage: fm, formatNumber: fn } = useIntl()
  const paletteSubset = palette.slice(0, Object.keys(years || {}).length)

  const theme = {
    base: "#60a5fa",
    label: "#ffffff",
    secondary: "#16a34a",
    text: darkMode ? "#d1d5db" : "#111827",
    border: darkMode ? "#4b5563" : "#d1d5db",
  }

  Chart.register(annotationPlugin)
  Chart.register(ChartDataLabels)

  const getDataSet = (year: string, index: number): ChartDataset => ({
    label: year,
    tension: 0.4,
    pointRadius: 4,
    borderWidth: 2,
    data: (data || {})[+year - 2000],
    borderColor: paletteSubset[index],
    pointBorderColor: paletteSubset[index],
    backgroundColor: hexToRgba(theme.base || defaultColor, 0.1),
    datalabels: {
      offset: 3,
      clamp: true,
      align: "end",
      anchor: "end",
      borderRadius: 4,
      color: theme.label,
      textAlign: "center",
      font: { weight: "bold" },
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
    fontColor: theme.label,
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
          color: theme.text,
        },
      },
      y: {
        beginAtZero: true,
        suggestedMax: max && max.value + (max.value * 5) / 100,
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
          zeroLineColor: theme.border,
        },
      },
    },
  } as ChartOptions

  return <Line data={chartData} options={options} />
}

export default Comparison
