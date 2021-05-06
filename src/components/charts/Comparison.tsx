import hexToRgba from "hex-to-rgba"
import { Line } from "react-chartjs-2"
import useYears from "@/services/years"
import Months from "@/data/months.json"
import useDeaths from "@/services/deaths"
import { Chart, ChartOptions } from "chart.js"
import { useTheme } from "@/services/themes"
import useRawDeaths from "@/services/raw-deaths"
import ChartDataLabels from "chartjs-plugin-datalabels"
import annotationPlugin, {
  LabelOptions,
  LineAnnotationOptions,
} from "chartjs-plugin-annotation"

Chart.register(annotationPlugin)

// const average = (nums: number[]) => nums.reduce((a, b) => a + b) / nums.length

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

const Overview = (): JSX.Element => {
  useRawDeaths()
  const [years] = useYears()
  const [deaths] = useDeaths()
  const { labels, data } = deaths as Deaths
  const { values: theme = {} } = useTheme()

  const max = getMaximum(data)

  const defaultColor = "#ffffff"

  const datasets = Object.keys(years || {}).reduce(
    (datasets: Record<string, unknown>[], year) => (
      years &&
        years[year] &&
        datasets.push({
          label: year,
          pointRadius: 4,
          borderWidth: 2,
          borderColor: theme?.primary,
          pointBorderColor: theme.primary,
          data: (data || {})[+year - 2000],
          pointBackgroundColor: theme.surface,
          backgroundColor: hexToRgba(theme.primary || defaultColor, 0.1),
        }),
      datasets
    ),
    []
  )

  const chartData = { labels, datasets }

  const plugins = [ChartDataLabels]

  const maxAnnotationLabel = {
    width: 0,
    height: 0,
    enabled: true,
    fontColor: theme["on-primary"],
    backgroundColor: theme.secondary,
    content: `${Months[max?.month - 1]} ${max?.year}: ${max?.value} décès`,
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
    fill: true,
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 0 },
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
        color: theme["on-primary"],
        backgroundColor: theme.primary,
        padding: { top: 4, right: 5, bottom: 4, left: 5 },
        formatter: (value: number) => (value / 1000).toFixed() + "K",
        display: ({ active }) => (active ? true : "auto"),
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

  return (
    <Line type="line" data={chartData} options={options} plugins={plugins} />
  )
}

export default Overview
