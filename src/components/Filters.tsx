import useYears from "@/services/years"

const Filters = (): JSX.Element => {
  const [years, setYears] = useYears()

  const getYearStatus = (year: string | number) => {
    return years && years[year]
  }

  const toggle = (year: string) =>
    setYears({ ...years, [year]: !getYearStatus(year) })

  return (
    <ul className="filters button-group">
      {years &&
        Object.keys(years)
          .sort((a, b) => +b - +a)
          .map((year, i) => (
            <li key={i}>
              <button
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

export default Filters
