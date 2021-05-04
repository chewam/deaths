import hexToRgba from "hex-to-rgba"
import { Bar } from "react-chartjs-2"
import { useTheme } from "@/services/themes"
import useMortality from "@/services/mortality"
import useRawMortality from "@/services/raw-mortality"

const Distribution = (): JSX.Element => {
  useRawMortality()
  const [mortality] = useMortality()
  const { values: theme = {} } = useTheme()
  const { labels, data, ratio, ageGroups } = mortality as Mortality

  const defaultColor = "#ffffff"

  const bars = data.map((ageGroup, i) => ({
    type: "bar",
    yAxisID: "y",
    data: ageGroup,
    label: `bar-${i}`,
    borderColor: theme.surface,
    borderWidth: { top: 2, right: 0, bottom: 2, left: 0 },
    backgroundColor: hexToRgba(theme.primary || defaultColor, 0.5),
  }))

  const datasets = [
    {
      // fill: false,
      data: ratio,
      type: "line",
      yAxisID: "y2",
      label: "Ratio",
      borderWidth: 3,
      pointRadius: 5,
      borderColor: theme.secondary,
      pointBorderColor: theme.secondary,
      pointBackgroundColor: theme.surface,
    },
    ...bars,
  ]

  const chartData = {
    labels,
    datasets,
  }

  const options = {
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
    scales: {
      x: {
        // offset: true,
        stacked: true,
        // gridLines: { display: false },
        // ticks: {
        // padding: 5,
        // },
      },
      y: { type: "linear", stacked: true },
      y2: {
        type: "linear",
        position: "right",
        grid: { drawOnChartArea: false },
      },
    },
  }

  return <Bar type="bar" data={chartData} options={options} />
}

export default Distribution
