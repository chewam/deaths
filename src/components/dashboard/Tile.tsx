import AgeGroups from "@/components/charts/Groups"
import { FormattedMessage as Trans, FormattedNumber as Num } from "react-intl"

interface Props {
  year: string
  trend: boolean | null
  deaths: number
  main?: boolean
  average: number
  mortality: number
  ageGroups: number[]
  population: number
}

const theme = {
  base: "#60a5fa",
  text: "#d1d5db",
  border: "#4b5563",
  secondary: "#16a34a",
}

const Tile = ({
  year,
  trend,
  deaths,
  average,
  mortality,
  ageGroups,
  population,
  main = false,
}: Props): JSX.Element => {
  return (
    <div className="tile">
      <div className="left">
        <h3>
          <div className="year">{year}</div>
          {/* <div className="trend"> */}
          {trend ? (
            // <ImArrowDownRight color={theme.secondary} />
            <i className="ri-arrow-right-down-line" title="mortality drop"></i>
          ) : (
            // <ImArrowUpRight color={theme.important} />
            <i className="ri-arrow-right-up-line" title="mortality raise"></i>
          )}
          {/* </div> */}
        </h3>
        <div className="stat">
          <div
            className="value"
            style={{
              color: mortality > average ? theme.base : theme.secondary,
            }}
          >
            <Num value={Number(mortality.toFixed(3))} />%
          </div>
          <div className="label">
            <Trans id="Mortality rate" />
          </div>
        </div>
        <div className="stat">
          <div className="value">
            <Num value={Number(deaths)} />
          </div>
          <div className="label">
            <Trans id="Deaths count" />
          </div>
        </div>
        <div className="stat">
          <div className="value">
            <Num value={Number(population)} />
          </div>
          <div className="label">
            <Trans id="Total population" />
          </div>
        </div>
      </div>
      <div className="right">
        <AgeGroups ageGroups={ageGroups} big={main} />
      </div>
    </div>
  )
}

export default Tile
