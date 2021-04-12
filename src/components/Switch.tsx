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
        <FaSun size={12} onClick={() => setTheme("light")} />
      ) : (
        <FaMoon size={12} onClick={() => setTheme("dark")} />
      )}
    </div>
  )
}

export default Switch
