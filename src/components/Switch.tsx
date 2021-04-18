import { useTheme } from "@/services/themes"
import { useEffect, useState } from "react"
import { FaMoon, FaSun } from "react-icons/fa"

const Switch = (): JSX.Element | null => {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) return null

  return (
    <div className="switch">
      {theme === "dark" ? (
        <FaSun size={11} onClick={() => setTheme("light")} title="light mode" />
      ) : (
        <FaMoon size={11} onClick={() => setTheme("dark")} title="dark mode" />
      )}
    </div>
  )
}

export default Switch
