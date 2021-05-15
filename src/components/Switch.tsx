import { useIntl } from "react-intl"
import { useEffect, useState } from "react"
import { useTheme } from "@/services/themes"
import { FaMoon, FaSun } from "react-icons/fa"

const Switch = (): JSX.Element | null => {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const { formatMessage: fm } = useIntl()

  useEffect(() => setMounted(true), [])

  if (!mounted) return null

  return (
    <div className="switch">
      {theme === "dark" ? (
        <FaSun
          size={11}
          title={fm({ id: "light mode" })}
          onClick={() => setTheme("light")}
        />
      ) : (
        <FaMoon
          size={11}
          title={fm({ id: "dark mode" })}
          onClick={() => setTheme("dark")}
        />
      )}
    </div>
  )
}

export default Switch
