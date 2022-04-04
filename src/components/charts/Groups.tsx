import { Chart } from "chart.js"
import { sumArray } from "@/utils/index"
import type { ChartOptions } from "chart.js"
import { Doughnut } from "react-chartjs-2"
import ChartDataLabels from "chartjs-plugin-datalabels"

import type { ChartDataset } from "chart.js"

interface Props {
  ageGroups: number[]
  big: boolean
}

const Groups = ({ ageGroups, big }: Props): JSX.Element => {
  const theme = {
    base: "#60a5fa",
    text: "#d1d5db",
    border: "#4b5563",
    secondary: "#16a34a",
  }

  Chart.register(ChartDataLabels)

  const groups = [
    sumArray(ageGroups.slice(0, 7)),
    ...ageGroups.slice(7, ageGroups.length - 2),
    sumArray(ageGroups.slice(ageGroups.length - 2, ageGroups.length)),
  ]

  const labels = ["0-69", "70-79", "80-89", "90+"]

  const lightPalette = [
    "rgba(189,224,254, 0.5)",
    "rgba(162,210,255, 0.5)",
    "rgba(205,180,219, 0.5)",
    "rgba(255,175,204, 0.5)",
  ]

  const darkPalette = [
    "rgba(159,194,224, 1)",
    "rgba(132,180,225, 1)",
    "rgba(175,150,189, 1)",
    "rgba(225,145,174, 1)",
  ]

  const dataset = {
    data: groups,
    borderWidth: 1,
    label: "# of Votes",
    borderColor: darkPalette,
    backgroundColor: lightPalette,
  } as ChartDataset

  const data = {
    labels,
    datasets: [dataset],
  }

  const options = {
    events: [],
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
        color: theme.base,
        labels: {
          title: {
            offset: -5,
            align: "top",
            color: ({ dataIndex }) => darkPalette[dataIndex],
            font: { weight: "bold", size: big ? 19 : 15 },
            display: ({ dataIndex }) => {
              return groups[dataIndex] > 20000 ? true : false
            },
            formatter: (value, { dataIndex }) => {
              return `${(groups[dataIndex] / 1000).toFixed(0)}K`
            },
          },
          ageGroup: {
            offset: -5,
            align: "bottom",
            font: { weight: "bold", size: big ? 17 : 13 },
            color: ({ dataIndex }) => darkPalette[dataIndex],
            display: ({ dataIndex }) => {
              return groups[dataIndex] > 20000 ? true : false
            },
            formatter: (value, { dataIndex }) => {
              return labels[dataIndex]
            },
          },
        },
      },
    },
  } as ChartOptions

  return <Doughnut data={data} options={options} />
}

export default Groups
