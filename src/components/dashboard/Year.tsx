import Panel from "@/components/Panel"
import { useTheme } from "@/services/themes"
import AgeGroups from "@/components/charts/Groups"
import { ImArrowDownRight, ImArrowUpRight } from "react-icons/im"

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

const Year = ({
  year,
  trend,
  deaths,
  average,
  mortality,
  ageGroups,
  population,
  main,
}: Props): JSX.Element => {
  const { values: theme = {} } = useTheme()

  return (
    <div className="wrapper">
      <Panel>
        <div className="left">
          <div className="top">
            <div className="year">{year}</div>
            <div className="trend">
              {trend ? (
                <ImArrowDownRight color={theme.secondary} />
              ) : (
                <ImArrowUpRight color={theme.important} />
              )}
            </div>
          </div>
          <div className="mortality">
            <div
              className="value"
              style={{
                color: mortality > average ? theme.important : theme.secondary,
              }}
            >
              {mortality.toFixed(3)}%
            </div>
            <div className="label">Taux de mortalité</div>
          </div>
          <div className="deaths">
            <div className="value">{deaths}</div>
            <div className="label">Nombre de décès</div>
          </div>
          <div className="population">
            <div className="value">{population}</div>
            <div className="label">Poulation totale</div>
          </div>
        </div>
        <div className="right">
          <AgeGroups ageGroups={ageGroups} big={main} />
        </div>
      </Panel>
    </div>
  )
}

export default Year
