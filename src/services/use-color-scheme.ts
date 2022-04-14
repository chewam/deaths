import { useEffect, useState } from "react"

const useColorScheme = () => {
  const mode =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
      : null

  const [prefersDarkMode, setPrefersDarkMode] = useState(mode)

  useEffect(() => {
    function handleDarkModePrefferedChange() {
      const doesMatch = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches
      setPrefersDarkMode(doesMatch)
    }

    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", handleDarkModePrefferedChange)

    return () => {
      window
        .matchMedia("(prefers-color-scheme: dark)")
        .removeEventListener("change", handleDarkModePrefferedChange)
    }
  }, [])

  return prefersDarkMode
}

export default useColorScheme
