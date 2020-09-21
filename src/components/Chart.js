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

import colors from "@data/colors"
import deaths from "@data/deaths"

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
      {payload.reverse().map((item, i) => (
        <div key={i} style={{ color: item.color }}>
          {item.name}: {new Intl.NumberFormat("fr-FR").format(item.value)}
        </div>
      ))}
    </div>
  ) : null

const Chart = ({ years }) => (
  <ResponsiveContainer>
    <LineChart data={deaths} margin={styles.margin}>
      <CartesianGrid stroke={styles.stroke} strokeDasharray="3 3" />
      {Object.keys(years).map((year, i) =>
        years[year] ? (
          <Line key={i} dataKey={year} type="monotone" stroke={colors[year]} />
        ) : null
      )}
      <XAxis
        dy={0}
        angle={30}
        interval={0}
        dataKey="month"
        tick={styles.tick}
        padding={styles.padding}
      />
      <YAxis type="number" domain={[40000, 80000]} tick={styles.tick} />
      <Tooltip content={<MonthTooltip />} />
    </LineChart>
  </ResponsiveContainer>
)

export default Chart
