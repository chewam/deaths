import AgeGroups from "@/components/charts/Groups"
import { FormattedMessage as Trans, FormattedNumber as Num } from "react-intl"

interface Props {
  year: string
  trend: boolean | null
  deaths: number
  average: number
  mortality: number
  ageGroups: number[]
  population: number
  main: boolean
}

const Tile = ({
  year,
  trend,
  deaths,
  average,
  mortality,
  ageGroups,
  population,
}: // main,
Props): JSX.Element => {
  return (
    <div className="tile">
      <div className="left">
        <h3>
          <div className="year">{year}</div>
          {trend ? (
            <i className="ri-arrow-right-down-line" title="mortality drop"></i>
          ) : (
            <i className="ri-arrow-right-up-line" title="mortality raise"></i>
          )}
        </h3>
        <div className="stat mortality-rate">
          <div className={`value${mortality > average ? " raise" : ""}`}>
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
        <AgeGroups ageGroups={ageGroups} big={false} />
      </div>
    </div>
  )
}

export default Tile
