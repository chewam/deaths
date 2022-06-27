// import { palette } from "@/utils/index"
import useYears from "@/services/years"

const Years = (): JSX.Element => {
  const [years, setYears] = useYears()

  // const paletteSubset = palette
  //   .slice(0, Object.keys(years || {}).length)
  //   .reverse()

  const getYearStatus = (year: string | number) => {
    return years && years[year]
  }

  const toggle = (year: string) =>
    setYears({ ...years, [year]: !getYearStatus(year) })

  const getColorNumber = (i: number) => {
    const numbers = ["300", "400", "500", "600"]
    return numbers[i % numbers.length]
  }

  const getColorName = (i: number) => {
    const names = [
      "slate",
      "stone",
      "red",
      "orange",
      "amber",
      "yellow",
      "lime",
      "green",
      "emerald",
      "teal",
      "cyan",
      "sky",
      "blue",
      "indigo",
      "violet",
      "purple",
      "fuchsia",
      "pink",
      "rose",
    ]
    return names[i % names.length]
  }

  return (
    <ul className="years">
      {years &&
        Object.keys(years)
          .sort((a, b) => +b - +a)
          .map((year, i) => (
            <li key={i}>
              <button
                className={`${
                  getYearStatus(year)
                    ? `active bg-${getColorName(i)}-${getColorNumber(i)}`
                    : ""
                } `}
                style={
                  {
                    // backgroundColor: getYearStatus(year)
                    //   ? paletteSubset[i]
                    //   : "transparent",
                    // borderColor: getYearStatus(year)
                    //   ? paletteSubset[i]
                    //   : "inherit",
                  }
                }
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
