import { sumArray } from "@/utils/index"
import type { ChartOptions } from "chart.js"
import { Doughnut } from "react-chartjs-2"
import { useTheme } from "@/services/themes"
import ChartDataLabels from "chartjs-plugin-datalabels"

import type { ChartDataset } from "chart.js"

interface Props {
  ageGroups: number[]
  big: boolean
}

const Groups = ({ ageGroups, big }: Props): JSX.Element => {
  const { values: theme = {} } = useTheme()

  const groups = [
    sumArray(ageGroups.slice(0, 7)),
    ...ageGroups.slice(7, ageGroups.length - 2),
    sumArray(ageGroups.slice(ageGroups.length - 2, ageGroups.length)),
  ]

  const plugins = [ChartDataLabels]

  const dataset = {
    label: "# of Votes",
    data: groups,
    backgroundColor: [
      "rgba(54, 162, 235, 0.2)",
      "rgba(255, 206, 86, 0.2)",
      "rgba(75, 192, 192, 0.2)",
      "rgba(153, 102, 255, 0.2)",
      "rgba(255, 159, 64, 0.2)",
    ],
    borderColor: [
      "rgba(54, 162, 235, 1)",
      "rgba(255, 206, 86, 1)",
      "rgba(75, 192, 192, 1)",
      "rgba(153, 102, 255, 1)",
      "rgba(255, 159, 64, 1)",
    ],
    borderWidth: 1,
  } as ChartDataset

  const data = {
    datasets: [dataset],
    labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
  }

  const options = {
    cutout: "30%",
    aspectRatio: 1,
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 0 },
    layout: {
      padding: { top: 1, right: 1, bottom: 1, left: 1 },
    },
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
      datalabels: {
        color: theme.color,
        labels: {
          title: {
            align: "top",
            font: { weight: "bold", size: big ? 19 : 15 },
            display: ({ dataIndex }) => {
              return groups[dataIndex] > 20000 ? true : false
            },
            formatter: (value, { dataIndex }) => {
              return `${(groups[dataIndex] / 1000).toFixed(0)}K`
            },
          },
          ageGroup: {
            align: "bottom",
            font: { weight: "bold", size: big ? 17 : 13 },
            display: ({ dataIndex }) => {
              return groups[dataIndex] > 20000 ? true : false
            },
            formatter: (value, { dataIndex }) => {
              return ["0-69", "70-79", "80-89", "90+"][dataIndex]
            },
          },
        },
      },
    },
  } as ChartOptions

  return (
    <Doughnut type="doughnut" data={data} options={options} plugins={plugins} />
  )
}

export default Groups
