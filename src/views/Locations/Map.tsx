import { memo } from "react"
import useYears from "@/services/years"
import { scaleQuantize } from "d3-scale"
import { sumObjects } from "@/utils/index"
import { useTheme } from "@/services/themes"
import France from "@/data/departements.json"
import useLocations from "@/services/locations"
import { ComposableMap, Geographies, Geography } from "react-simple-maps"

const Map = ({ onOver }: { onOver: (label: string) => void }) => {
  const [years] = useYears()
  const [locations] = useLocations()
  const { values: theme } = useTheme()
  const { scale } = theme || {}

  const colorScale = scaleQuantize()
    .domain([1, 10])
    .range((scale || "").split(",").map((v) => parseInt(v, 10)))

  const getColor = (count: number): string =>
    colorScale(count ? Math.round((count * 10) / max) : 0).toString(16)

  const data = (locations || []).reduce(
    (acc, year, i) => (
      (acc = years && years[2000 + i] ? sumObjects(year, acc) : acc), acc
    ),
    {}
  )

  const max = Math.max(...Object.keys(data).map((key) => data[key]))

  return (
    <>
      <ComposableMap
        data-tip=""
        style={{ width: "100%", height: "99%" }}
        projectionConfig={{ scale: 3500, center: [2.4, 46.2] }}
      >
        <Geographies geography={France}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const {
                properties: { code, nom },
              } = geo
              const count = data[code]

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  stroke={theme.muted}
                  fill={getColor(count)}
                  onMouseEnter={() =>
                    onOver(`${nom} (${code}): ${count} décès`)
                  }
                  onMouseLeave={() => onOver("")}
                  style={{ hover: { fill: theme.surface } }}
                />
              )
            })
          }
        </Geographies>
      </ComposableMap>
    </>
  )
}

export default memo(Map)
