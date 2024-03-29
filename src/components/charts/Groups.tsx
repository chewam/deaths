import type { ChartOptions } from "chart.js"
import type { Context } from "chartjs-plugin-datalabels"

import { sumArray } from "@/utils/index"
import { Doughnut } from "react-chartjs-2"
import ChartDataLabels from "chartjs-plugin-datalabels"
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js"
import AnnotationPlugin from "chartjs-plugin-annotation"

interface Props {
  ageGroups: number[]
  big: boolean
}

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels, AnnotationPlugin)

export const getAgeGroupFormatter =
  (labels: string[]) =>
  (_value: number, { dataIndex }: Context) =>
    labels[dataIndex]

export const getLabelsFormatter =
  (groups: number[]) =>
  (_value: number, { dataIndex }: Context) =>
    `${(groups[dataIndex] / 1000).toFixed(0)}K`

export const getLabelsDisplay =
  (groups: number[]) =>
  ({ dataIndex }: Context) =>
    groups[dataIndex] > 20000 ? true : false

export const getLabelsColor =
  (darkPalette: string[]) =>
  ({ dataIndex }: Context) =>
    darkPalette[dataIndex]

const Groups = ({ ageGroups, big }: Props) => {
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
  }

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
        labels: {
          title: {
            offset: -5,
            align: "top",
            color: getLabelsColor(darkPalette),
            display: getLabelsDisplay(groups),
            formatter: getLabelsFormatter(groups),
            font: { weight: "bold", size: big ? 19 : 15 },
          },
          ageGroup: {
            offset: -5,
            align: "bottom",
            display: getLabelsDisplay(groups),
            color: getLabelsColor(darkPalette),
            formatter: getAgeGroupFormatter(labels),
            font: { weight: "bold", size: big ? 17 : 13 },
          },
        },
      },
    },
  } as ChartOptions<"doughnut">

  return <Doughnut data={data} options={options} />
}

export default Groups
