import {
  Bar,
  Cell,
  Label,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts"

import colors from "@data/colors"
import useI18n from "@utils/i18n"
import { ratioDeaths } from "@utils/deaths"
import CustomTooltip from "@components/Tooltip"

const styles = {
  stroke: "#b3b3b3",
  gridStroke: "#666",
  tick: { fontSize: 12 },
  padding: { left: 10, right: 10 },
  margin: { top: 8, right: 0, bottom: 10, left: -5 },
}

const Ratio = () => {
  const { f, fn } = useI18n()

  const reference = ratioDeaths.reduce((a, b) => (a.ratio > b.ratio ? a : b))

  const referenceLabel = `${reference.year}: ${fn(reference.ratio)}% ${f(
    "mortality"
  )}`

  const tickFormatter = (value) =>
    `${fn(value, {
      minimumFractionDigits: 2,
    })}%`

  const toolTipRenderer = ([{ value }]) =>
    `${fn(value, {
      minimumFractionDigits: 2,
    })}% ${f("mortality")}`

  return (
    <ResponsiveContainer id="ratio-resp-container" className="ratio">
      <BarChart data={ratioDeaths} margin={styles.margin}>
        <CartesianGrid stroke={styles.gridStroke} strokeDasharray="3 3" />
        <XAxis
          dy={10}
          angle={30}
          dataKey="year"
          tick={styles.tick}
          stroke={styles.stroke}
          padding={styles.padding}
          interval="preserveStartEnd"
        />
        <YAxis
          dx={-5}
          type="number"
          tick={styles.tick}
          stroke={styles.stroke}
          tickFormatter={tickFormatter}
          domain={["dataMin - 0.09", "dataMax + 0.07"]}
        />
        <ReferenceLine
          y={reference.ratio}
          label={
            <Label
              fill={"#ccc"}
              fontSize="80%"
              value={referenceLabel}
              position="insideBottomRight"
            />
          }
          stroke={colors[reference.year]}
          strokeDasharray="3 3"
        />
        <Tooltip
          content={<CustomTooltip />}
          cursor={{ fill: "#000", fillOpacity: "0.4" }}
          renderer={toolTipRenderer}
        />
        <Bar dataKey="ratio">
          {ratioDeaths.map((ratio, index) => (
            <Cell
              fillOpacity="0.4"
              key={`cell-${index}`}
              stroke={colors[ratio.year]}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

export default Ratio
