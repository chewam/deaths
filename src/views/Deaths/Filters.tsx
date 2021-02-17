import useYears from "@/services/years"

const Filters = () => {
  const [years, setYears] = useYears()
  const toggle = (year: string) => setYears({ ...years, [year]: !years[year] })

  return (
    <ul className="filters button-group">
      {Object.keys(years)
        .sort((a, b) => +b - +a)
        .map((year, i) => (
          <li key={i}>
            <button
              className={`${years[year] ? "active" : ""}`}
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
