import {
  Bar,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts"

import colors from "@data/colors"

import { ratioDeaths } from "@utils/deaths"

import CustomTooltip from "@components/Tooltip"

const styles = {
  stroke: "#b3b3b3",
  gridStroke: "#666",
  tick: { fontSize: 12 },
  padding: { left: 10, right: 10 },
  margin: { top: 8, right: 0, bottom: 10, left: -5 },
}

const tickFormatter = (value) => `${value}%`

const toolTipRenderer = ([{ value }]) =>
  `${new Intl.NumberFormat("fr-FR").format(value)}% de mortalité`

const Ratio = () => (
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
        domain={[0.8, 1.1]}
        tickFormatter={tickFormatter}
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

export default Ratio
