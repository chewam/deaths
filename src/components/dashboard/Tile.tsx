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
        <div className="year-trend">
          <div className="year">{year}</div>
          {trend ? (
            <i className="ri-arrow-right-down-line" title="mortality drop"></i>
          ) : (
            <i className="ri-arrow-right-up-line" title="mortality raise"></i>
          )}
        </div>
        <div className="stat">
          <div className={`value ${mortality > average ? "above" : "below"}`}>
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
