import merge from "deepmerge"
import hexToRgba from "hex-to-rgba"
import { Line } from "react-chartjs-2"
import { useTheme } from "@/services/themes"
import "chartjs-plugin-datalabels"
import { ChartDataSets, ChartOptions, ChartXAxe, ChartYAxe } from "chart.js"
import { AnnotationConfig } from "chartjs-plugin-annotation"
import "chartjs-plugin-annotation"

interface ChartProps {
  labels: string[]
  xAxes: ChartXAxe[]
  yAxes: ChartYAxe[]
  datasets: ChartDataSets[]
  gradient?: [number, string][]
  annotations?: AnnotationConfig["annotations"]
  datalabels?: ChartDataSets["datalabels"]
}

const MyChart = ({
  xAxes,
  yAxes,
  datasets,
  labels,
  annotations,
  datalabels,
}: ChartProps): JSX.Element => {
  const { values: theme } = useTheme()

  const config = () => {
    const defaultDataset = {
      pointRadius: 3,
      pointBorderWidth: 2,
      pointBackgroundColor: theme?.primary,
      pointBorderColor: hexToRgba(theme?.background || "", 0.9),
    }

    return {
      labels,
      datasets: datasets?.map((dataset) => {
        const obj = merge(defaultDataset, dataset)
        return { ...obj }
      }),
    }
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    legend: { display: false },
    tooltips: { enabled: false },
    hover: { mode: "nearest", intersect: false },
    scales: {
      xAxes: xAxes.map((xAxe) =>
        merge(
          {
            gridLines: { display: false },
            ticks: {
              padding: 5,
              fontColor: theme?.color,
            },
          },
          xAxe
        )
      ),
      yAxes: yAxes.map((yAxe) =>
        merge(
          {
            gridLines: {
              lineWidth: 1,
              drawTicks: false,
              drawBorder: false,
              borderDash: [3, 3],
              color: theme?.muted,
              drawOnChartArea: true,
              zeroLineColor: theme?.muted,
            },
            ticks: {
              padding: 15,
              beginAtZero: true,
              fontColor: theme?.color,
            },
          },
          yAxe
        )
      ),
    },
    plugins: { datalabels },
    annotation: {
      annotations: [...(annotations || [])],
    },
  } as ChartOptions

  return <Line data={config} options={options} />
}

export default MyChart
