import useSWR from "swr"
import { ThemeProvider, useTheme as useThemes } from "next-themes"

export const useTheme = (): Theme => {
  const { resolvedTheme: theme, setTheme } = useThemes()

  const { data, mutate } = useSWR("theme", null, {
    initialData: {} as Record<string, unknown>,
  })

  const values = (data && theme ? data[theme] : {}) as Record<string, string>

  const setValues = (values: Record<string, unknown>) => {
    mutate(values)
  }

  return { theme, values, setValues, setTheme }
}

interface ThemesProps {
  light: Record<string, string>
  dark: Record<string, string>
  children: JSX.Element[]
}

export const Themes = ({ light, dark, children }: ThemesProps): JSX.Element => {
  const { setValues } = useTheme()

  setValues({ light, dark })

  return <ThemeProvider defaultTheme="system">{children}</ThemeProvider>
}
