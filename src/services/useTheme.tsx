import type { Config } from "tailwindcss"

import resolveConfig from "tailwindcss/resolveConfig"
import useColorScheme from "@/services/use-color-scheme"

interface ChartItemOptions {
  text: string
  border: string
  background: string
}

interface ChartItem extends ChartItemOptions {
  hover: Partial<ChartItemOptions>
  label: Partial<ChartItemOptions & { hover: Partial<ChartItemOptions> }>
}

interface Theme {
  line: Partial<ChartItem>
  bar: Partial<ChartItem>
  scale: Partial<ChartItem>
}

const useTheme = (): Theme => {
  const darkMode = useColorScheme()
  const styles = resolveConfig({} as Config)
  const colors = styles.theme?.colors

  if (colors) {
    const {
      // @ts-expect-error: wrong type definition from tailwindcss
      white,
      // @ts-expect-error: wrong type definition from tailwindcss
      transparent,
      // @ts-expect-error: wrong type definition from tailwindcss
      green: { 600: green },
      // @ts-expect-error: wrong type definition from tailwindcss
      blue: { 400: blue, 900: darkblue },
      // @ts-expect-error: wrong type definition from tailwindcss
      gray: { 300: lightgray, 600: gray, 900: darkgray },
    } = colors

    const theme = {
      line: {
        border: green,
        label: {
          text: white,
          background: green,
        },
      },
      bar: {
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
        hover: {
          background: darkblue,
        },
      },
      scale: {
        border: darkMode ? gray : lightgray,
        text: darkMode ? lightgray : darkgray,
      },
    }

    console.log("fullConfig.theme", colors, blue)

    return theme
  }

  return {} as Theme
}

export default useTheme
