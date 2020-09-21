import React from "react"
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
  stroke: "#333",
  tick: { fontSize: 12 },
  padding: { left: 30, right: 30 },
  margin: { top: 5, right: 5, bottom: 5, left: 0 },
}

const MonthTooltip = ({ active, payload, label }) =>
  active ? (
    <div className="custom-tooltip">
      <div>{label}</div>
      <div>{new Intl.NumberFormat("fr-FR").format(payload[0].value)} décès</div>
    </div>
  ) : null

const Overview = () => (
  <ResponsiveContainer>
    <LineChart data={linearDeaths} margin={styles.margin}>
      <CartesianGrid stroke={styles.stroke} strokeDasharray="3 3" />
      <Line dataKey="value" type="monotone" />
      <XAxis
        dy={0}
        angle={30}
        dataKey="label"
        tick={styles.tick}
        padding={styles.padding}
        interval="preserveStartEnd"
      />
      <YAxis type="number" domain={[40000, 75000]} tick={styles.tick} />
      <Tooltip content={<MonthTooltip />} />
    </LineChart>
  </ResponsiveContainer>
)

export default Overview
