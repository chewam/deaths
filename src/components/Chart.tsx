import merge from "deepmerge"
import hexToRgba from "hex-to-rgba"
import { Line } from "react-chartjs-2"
import { useTheme } from "@/services/themes"
import "chartjs-plugin-datalabels"
import { ChartDataSets, ChartOptions, ChartXAxe, ChartYAxe } from "chart.js"
import { AnnotationConfig } from "chartjs-plugin-annotation"

// defaults.global.animation = false

interface ChartProps {
  labels: string[]
  xAxes: ChartXAxe[]
  yAxes: ChartYAxe[]
  datasets: ChartDataSets[]
  gradient?: [number, string][]
  // annotationsx?: AnnotationOptions[]
  // annotationsy?: ChartOptions["annotation"]["annotations"] | undefined
  annotations?: AnnotationConfig["annotations"]
  datalabels?: ChartDataSets["datalabels"]
}

// const getBackground = (
//   element: HTMLElement,
//   gradient: [number, string][] | undefined
// ): string | CanvasGradient => {
//   if (gradient) {
//     const canvas = element as HTMLCanvasElement
//     const ctx = canvas.getContext("2d")
//     const g = ctx?.createLinearGradient(0, 0, 0, canvas.clientWidth)

//     gradient.map(([offset, color]) => g?.addColorStop(offset, color))

//     return g || ""
//   }

//   return "rgba(0, 0, 0, 0.1)"
// }

const MyChart = ({
  xAxes,
  yAxes,
  datasets,
  labels,
  // gradient,
  annotations,
  datalabels,
}: ChartProps): JSX.Element => {
  const { values: theme } = useTheme()

  // const config = (canvas: HTMLCanvasElement): Record<string, unknown> => {
  // const config = (element: HTMLElement) => {
  const config = () => {
    const defaultDataset = {
      pointRadius: 3,
      pointBorderWidth: 2,
      borderColor: theme?.primary,
      pointBackgroundColor: theme?.primary,
      pointBorderColor: hexToRgba(theme?.background || "", 0.9),
    }

    return {
      labels,
      datasets: datasets?.map((dataset) => {
        const obj = merge(defaultDataset, dataset)
        return { ...obj }
        // return { backgroundColor: getBackground(element, gradient), ...obj }
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
