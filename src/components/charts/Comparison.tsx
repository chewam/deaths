import type { ChartDataset } from "chart.js"
import type { Context } from "chartjs-plugin-datalabels"
import type {
  LabelOptions,
  LineAnnotationOptions,
} from "chartjs-plugin-annotation"

import { useIntl } from "react-intl"
import { Line } from "react-chartjs-2"
import ChartDataLabels from "chartjs-plugin-datalabels"
import AnnotationPlugin from "chartjs-plugin-annotation"
import {
  Title,
  LineElement,
  LinearScale,
  PointElement,
  CategoryScale,
  Chart as ChartJS,
} from "chart.js"

import { palette } from "@/utils/index"
import useYears from "@/services/years"
import Months from "@/data/months.json"
import useDeaths from "@/services/deaths"
import useRawDeaths from "@/services/raw-deaths"
import useTheme from "@/services/use-charts-theme"

ChartJS.register(
  Title,
  LineElement,
  LinearScale,
  PointElement,
  CategoryScale,
  ChartDataLabels,
  AnnotationPlugin
)

export const getMaximum = (data: Deaths["data"]) => {
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
  const theme = useTheme()
  const [years] = useYears()
  const [deaths] = useDeaths()
  const { labels, data } = deaths as Deaths
  const max = getMaximum(data)
  const { formatMessage: fm, formatNumber: fn } = useIntl()
  const paletteSubset = palette.slice(0, Object.keys(years || {}).length)

  const getDataSet = (year: string, index: number): ChartDataset<"line"> => ({
    label: year,
    tension: 0.4,
    pointRadius: 4,
    borderWidth: 2,
    type: "line" as const,
    data: (data || {})[+year - 2000],
    borderColor: paletteSubset[index],
    pointBorderColor: paletteSubset[index],
    pointBackgroundColor: theme.primary.point?.background,
    backgroundColor: theme.primary.background,
    datalabels: {
      offset: 3,
      clamp: true,
      borderRadius: 4,
      align: "end" as const,
      anchor: "end" as const,
      textAlign: "center" as const,
      color: theme.primary.label?.text,
      font: { weight: "bold" as const },
      backgroundColor: paletteSubset[index],
      padding: { top: 4, right: 5, bottom: 4, left: 5 },
      display: ({ active }: Context) => (active ? true : "auto"),
      formatter: (value: number) => (value / 1000).toFixed() + "K",
    },
  })

  const datasets = Object.keys(years || {}).reduce(
    (dataset: ChartDataset<"line">[], year, i) => (
      years && years[year] && dataset.push(getDataSet(year, i)), dataset
    ),
    []
  )

  const getAnnotationContent = () => {
    const month = Months[max?.month - 1] || "January"

    return `${fm({ id: month })} ${max?.year}: ${fn(max?.value)} ${fm({
      id: "deaths",
    })}`
  }

  const maxAnnotationLabel = {
    width: 0,
    height: 0,
    type: "label",
    display: true,
    borderRadius: 4,
    content: getAnnotationContent(),
    color: theme.primary.label?.text,
    backgroundColor: theme.secondary.label?.background,
  } as LabelOptions

  const maxAnnotationLine = {
    type: "line",
    scaleID: "y",
    borderWidth: 2,
    value: max?.value,
    borderDash: [6, 3],
    label: maxAnnotationLabel,
    borderColor: theme.secondary.border,
  } as LineAnnotationOptions

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 0 },
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
      annotation: {
        annotations: { maxAnnotationLine },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          color: theme.scale.text,
        },
      },
      y: {
        beginAtZero: true,
        suggestedMax: max && max.value + (max.value * 5) / 100,
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
          zeroLineColor: theme.scale.border,
        },
      },
    },
  }

  return <Line data={{ labels, datasets }} options={options} />
}

export default Comparison
