import { ComposableMap, Geographies, Geography } from "react-simple-maps"
import { memo } from "react"
import { scaleQuantize } from "d3-scale"
import France from "@/data/departements.json"

import useYears from "@/services/years"
import useLocations from "@/services/locations"

import { sumObjects } from "@/utils/index"

const colorScale = scaleQuantize().domain([1, 10]).range([
  // "#ffedea",
  // "#ffcec5",
  // "#ffad9f",
  // "#ff8a75",
  // "#ff5533",
  // "#e2492d",
  // "#be3d26",
  // "#9a311f",
  // "#782618",
  "#C2F0FF",
  "#B2DCFF",
  "#A3C2FF",
  "#94A3FF",
  "#8a85ff",
  "#8F73DF",
  "#8E61BF",
  "#884F9F",
  "#7C3E80",
])

const Map = ({ onOver, yearIndex }) => {
  const [locations] = useLocations()
  const [years, setYears] = useYears()

  const data = locations.reduce(
    (acc, year, i) => (
      (acc = years[2000 + i] ? sumObjects(year, acc) : acc), acc
    ),
    {}
  )

  const max = Math.max(...Object.keys(data).map((key) => data[key]))

  return (
    <>
      <ComposableMap
        data-tip=""
        style={{ width: "100%", height: "auto" }}
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
                  fill={colorScale(count ? Math.round((count * 10) / max) : 0)}
                  onMouseEnter={() => {
                    onOver(`${nom} (${code}): ${count} décès`)
                  }}
                  onMouseLeave={() => {
                    onOver("")
                  }}
                  style={{
                    hover: {
                      fill: "#000",
                      outline: "none",
                    },
                  }}
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
