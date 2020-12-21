import colors from "@data/colors"
import { useIntl } from "react-intl"
import { getRatio, getTotal } from "@utils/deaths"

const List = ({ years, toggleYear }) => {
  const intl = useIntl()

  return (
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
                <div>
                  {getTotal(year)}{" "}
                  {intl.formatMessage({
                    id: "deaths",
                    defaultMessage: "décès",
                  })}
                </div>
                <div>
                  {getRatio(year)}%{" "}
                  {intl.formatMessage({
                    id: "mortality",
                    defaultMessage: "de mortalité",
                  })}
                </div>
              </div>
            </div>
          </li>
        ))}
    </ul>
  )
}

export default List
