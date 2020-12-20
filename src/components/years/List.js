import colors from "@data/colors"
import { getRatio, getTotal } from "@utils/deaths"

const List = ({ years, toggleYear }) => (
  <ul className="list">
    {Object.keys(years)
      .reverse()
      .map((year, i) => (
        <li
          key={i}
          onClick={() => toggleYear(year)}
          className={years[year] ? "" : "disabled"}
        >
          <div>
            <div
              className="dot"
              style={{
                borderColor: colors[year],
                backgroundColor: colors[year],
              }}
            ></div>
          </div>
          <div>
            <div className="year">{year}</div>
            <div className="deaths">
              <div>{getTotal(year)} décès</div>
              <div>{getRatio(year)}% de mortalité</div>
            </div>
          </div>
        </li>
      ))}
  </ul>
)

export default List
