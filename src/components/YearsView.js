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
  stroke: "#b3b3b3",
  gridStroke: "#666",
  tick: { fontSize: 12 },
  padding: { left: 0, right: 25 },
  margin: { top: 8, right: 0, bottom: 10, left: -10 },
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

const YearsView = ({ years }) => (
  <ResponsiveContainer id="chart-resp-container">
    <LineChart data={deaths} margin={styles.margin}>
      <CartesianGrid stroke={styles.gridStroke} strokeDasharray="3 3" />
      {Object.keys(years).map((year, i) =>
        years[year] ? (
          <Line
            key={i}
            dataKey={year}
            type="monotone"
            stroke={colors[year]}
            dot={{ fill: styles.stroke }}
          />
        ) : null
      )}
      <XAxis
        dy={10}
        angle={30}
        interval={0}
        dataKey="month"
        tick={styles.tick}
        stroke={styles.stroke}
        padding={styles.padding}
      />
      <YAxis
        dx={-5}
        type="number"
        tick={styles.tick}
        stroke={styles.stroke}
        domain={[40000, 80000]}
      />
      <Tooltip content={<MonthTooltip />} />
    </LineChart>
  </ResponsiveContainer>
)

export default YearsView
