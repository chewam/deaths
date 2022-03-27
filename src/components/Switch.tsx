import { useIntl } from "react-intl"
import { useEffect, useState } from "react"
import { useTheme } from "@/services/themes"
// import { FaMoon, FaSun } from "react-icons/fa"

const Switch = (): JSX.Element | null => {
  const { theme, setTheme } = useTheme()
  const { formatMessage: fm } = useIntl()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) return null

  return (
    <div className="switch">
      {theme === "dark" ? (
        // <FaSun
        //   size={11}
        //   title={fm({ id: "light mode" })}
        //   onClick={() => setTheme("light")}
        // />
        <i className="ri-sun-line"></i>
      ) : (
        // <FaMoon
        //   size={11}
        //   title={fm({ id: "dark mode" })}
        //   onClick={() => setTheme("dark")}
        // />
        <i className="ri-moon-line"></i>
      )}
    </div>
  )
}

export default Switch
