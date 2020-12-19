import {
  Line,
  Label,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts"

import { linearDeaths } from "@utils/deaths"

import CustomTooltip from "@components/Tooltip"

const styles = {
  stroke: "#b3b3b3",
  gridStroke: "#666",
  tick: { fontSize: 12 },
  padding: { left: 0, right: 20 },
  margin: { top: 8, right: 0, bottom: 10, left: -5 },
}

const tickFormatter = (value) => new Intl.NumberFormat("fr-FR").format(value)

const toolTipRenderer = ([{ value }]) =>
  `${new Intl.NumberFormat("fr-FR").format(value)} décès`

const Overview = () => {
  const reference = linearDeaths.reduce((a, b) => (a.value > b.value ? a : b))

  return (
    <ResponsiveContainer id="overview-resp-container" className="overview">
      <LineChart data={linearDeaths} margin={styles.margin}>
        <CartesianGrid stroke={styles.gridStroke} strokeDasharray="3 3" />
        <XAxis
          dy={10}
          angle={30}
          dataKey="label"
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
          domain={[40000, 75000]}
          tickFormatter={tickFormatter}
        />
        <ReferenceLine
          y={reference.value}
          label={
            <Label
              fill={"#ccc"}
              fontSize="80%"
              position="insideBottomRight"
              value={`${reference.label}: ${new Intl.NumberFormat(
                "fr-FR"
              ).format(reference.value)} décès`}
            />
          }
          stroke={styles.stroke}
          strokeDasharray="3 3"
        />
        <Tooltip content={<CustomTooltip />} renderer={toolTipRenderer} />
        <Line
          dataKey="value"
          type="monotone"
          dot={{ fill: styles.stroke, fillOpacity: 0 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

export default Overview
