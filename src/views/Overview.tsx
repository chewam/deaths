import hexToRgba from "hex-to-rgba"
import Chart from "@/components/Chart"
import Panel from "@/components/Panel"
import { useTheme } from "@/services/themes"
import useOverview from "@/services/overview"

const average = (nums: [number]) => nums.reduce((a, b) => a + b) / nums.length

const Overview = () => {
  const [{ labels, data }] = useOverview()
  const { values: theme = {} } = useTheme()

  const max = Math.max(...data)

  const xAxes = [{}]

  const yAxes = [
    {
      ticks: {
        suggestedMax: max && max + (max * 5) / 100,
      },
    },
  ]

  const defaultColor = "#ffffff"

  const datasets = [
    {
      data,
      label: "Décès",
      pointBorderColor: theme.primary,
      pointBackgroundColor: theme.surface,
      backgroundColor: hexToRgba(theme.primary || defaultColor, 0.15),
      datalabels: {
        align: "end",
        anchor: "end",
        display: ({ active, dataIndex, dataset: { data } }) => {
          const avg = average(data)
          return active || data[dataIndex] > avg + avg * 0.2
        },
      },
    },
  ]

  // const gradient: [number, string][] = [
  //   [0, hexToRgba(theme.primary || defaultColor, 0.5)],
  //   [0.2, hexToRgba(theme.primary || defaultColor, 0.2)],
  //   [0.5, hexToRgba(theme.primary || defaultColor, 0)],
  // ]

  const annotations = max && [
    {
      value: max,
      type: "line",
      borderWidth: 2,
      mode: "horizontal",
      borderDash: [6, 3],
      scaleID: "y-axis-0",
      borderColor: theme.secondary,
      drawTime: "afterDatasetsDraw",
      label: {
        enabled: true,
        fontColor: theme["on-primary"],
        backgroundColor: theme.secondary,
        content: `${labels[data.indexOf(max)]}: ${max} décès`,
      },
    },
  ]

  const datalabels = {
    padding: 6,
    color: "white",
    borderRadius: 4,
    font: { weight: "bold" },
    backgroundColor: ({ active }) =>
      active
        ? hexToRgba(theme.primary || defaultColor, 0.9)
        : hexToRgba(theme.primary || defaultColor, 0.8),
    formatter: (value, { active, dataIndex, dataset: { label, data } }) =>
      active
        ? `${labels[dataIndex]}\n${data[dataIndex]} décès`
        : value > 1000
        ? (value / 1000).toFixed() + "K"
        : value,
  }

  return (
    <Panel className="overview">
      <div style={{ flex: 1 }}>
        <Chart
          xAxes={xAxes}
          yAxes={yAxes}
          labels={labels}
          datasets={datasets}
          // gradient={gradient}
          datalabels={datalabels}
          annotations={annotations}
        />
      </div>
    </Panel>
  )
}

export default Overview
