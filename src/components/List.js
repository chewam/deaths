import React from "react"

import colors from "@data/colors"
import { getTotal } from "@utils/deaths"

const List = ({ years, toggleYear }) => (
  <ul>
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
            <div>{year}</div>
            <div className="deaths">{getTotal(year)} décès</div>
          </div>
        </li>
      ))}
  </ul>
)

export default List
