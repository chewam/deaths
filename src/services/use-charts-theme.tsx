import colors from "tailwindcss/colors"
import useColorScheme from "@/services/use-color-scheme"

interface ChartItemOptions {
  text: string
  border: string
  background: string
}

interface ChartItem extends ChartItemOptions {
  hover: Partial<ChartItemOptions>
  point: Partial<ChartItemOptions>
  label: Partial<ChartItemOptions & { hover: Partial<ChartItemOptions> }>
}

interface Theme {
  main: string
  primary: Partial<ChartItem>
  secondary: Partial<ChartItem>
  scale: Partial<ChartItem>
}

const useChartsTheme = (): Theme => {
  const darkMode = useColorScheme()

  const {
    white,
    transparent,
    green: { 600: green },
    blue: { 400: blue, 900: darkblue },
    gray: { 300: lightgray, 600: gray, 800: backgray, 900: darkgray },
  } = colors

  return {
    main: darkMode ? backgray : white,
    secondary: {
      border: green,
      label: {
        text: white,
        background: green,
      },
    },
    primary: {
      border: blue,
      background: blue,
      label: {
        text: white,
        background: transparent,
        hover: {
          text: darkblue,
          border: darkblue,
          background: white,
        },
      },
      point: {
        background: backgray,
      },
      hover: {
        border: darkblue,
        background: darkblue,
      },
    },
    scale: {
      border: darkMode ? gray : lightgray,
      text: darkMode ? lightgray : darkgray,
    },
  }
}

export default useChartsTheme
