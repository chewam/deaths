import {
  Line,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts"

import { linearDeaths } from "@utils/deaths"

const styles = {
  stroke: "#b3b3b3",
  gridStroke: "#666",
  tick: { fontSize: 12 },
  padding: { left: 0, right: 20 },
  margin: { top: 8, right: 0, bottom: 10, left: -10 },
}

const MonthTooltip = ({ active, payload, label }) =>
  active ? (
    <div className="custom-tooltip">
      <div>{label}</div>
      <div>{new Intl.NumberFormat("fr-FR").format(payload[0].value)} décès</div>
    </div>
  ) : null

const Overview = () => (
  <ResponsiveContainer id="overview-resp-container">
    <LineChart data={linearDeaths} margin={styles.margin}>
      <CartesianGrid stroke={styles.gridStroke} strokeDasharray="3 3" />
      <Line dataKey="value" type="monotone" dot={{ fill: styles.stroke }} />
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
      />
      <Tooltip content={<MonthTooltip />} />
    </LineChart>
  </ResponsiveContainer>
)

export default Overview
