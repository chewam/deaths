import { palette } from "@/utils/index"
import useYears from "@/services/years"

const Years = (): JSX.Element => {
  const [years, setYears] = useYears()

  const paletteSubset = palette
    .slice(0, Object.keys(years || {}).length)
    .reverse()

  const getYearStatus = (year: string | number) => {
    return years && years[year]
  }

  const toggle = (year: string) =>
    setYears({ ...years, [year]: !getYearStatus(year) })

  return (
    <ul className="years button-group">
      {years &&
        Object.keys(years)
          .sort((a, b) => +b - +a)
          .map((year, i) => (
            <li key={i}>
              <button
                style={{
                  backgroundColor: getYearStatus(year)
                    ? paletteSubset[i]
                    : "transparent",
                  borderColor: getYearStatus(year)
                    ? paletteSubset[i]
                    : "inherit",
                }}
                className={`${getYearStatus(year) ? "active" : ""}`}
                onClick={() => toggle(year)}
              >
                {year}
              </button>
            </li>
          ))}
    </ul>
  )
}

export default Years
