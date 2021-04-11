import palette from "google-palette"
import { useTheme } from "@/services/themes"
import { Doughnut } from "react-chartjs-2"
import { ChartDataSets, ChartOptions } from "chart.js"

interface Props {
  data: ChartDataSets["data"]
}

const Chart = ({ data }: Props): JSX.Element => {
  const { values: theme = {} } = useTheme()

  const labels = [
    "0-9",
    "10-19",
    "20-29",
    "30-39",
    "40-49",
    "50-59",
    "60-69",
    "70-79",
    "80-89",
    "90-99",
    "100-109",
    "110+",
  ]

  const colors = palette("rainbow", labels.length, 0, 0.5).map(
    (color: string) => `#${color}`
  )

  const datasets = [
    {
      data,
      label: "toto",
      type: "doughnut",
      backgroundColor: colors,
      borderColor: theme.surface,
    },
  ]

  const datalabels = {
    labels: {
      label: {
        offset: -5,
        align: "top",
        color: "white",
        display: ({ active, dataset: { data }, dataIndex }) => {
          const d = data as number[]
          return active || d[dataIndex] > Math.max(...d) * 0.3
        },
        formatter: (value, { dataIndex }) => labels[dataIndex],
      },
      value: {
        offset: -5,
        color: "white",
        align: "bottom",
        borderColor: "white",
        font: { weight: "bold" },
        // backgroundColor: ({ dataset: { backgroundColor } }) => backgroundColor,
        // display: ({ active, dataset: { data }, dataIndex }) =>
        //   active || data[dataIndex] > Math.max(...data) * 0.3,
        display: ({ active, dataset: { data }, dataIndex }) => {
          const d = data as number[]
          return active || d[dataIndex] > Math.max(...d) * 0.3
        },
        formatter: (value) =>
          value > 1000 ? (value / 1000).toFixed() + "k" : Math.round(value),
      },
    },
  } as ChartDataSets["datalabels"]

  const options = {
    responsive: true,
    animation: false,
    plugins: { datalabels },
    maintainAspectRatio: false,
    legend: { display: false },
    tooltips: { enabled: false },
  } as ChartOptions

  return <Doughnut data={{ labels, datasets }} options={options} />
}

export default Chart
