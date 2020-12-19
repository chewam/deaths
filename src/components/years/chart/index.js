import {
  Line,
  Label,
  XAxis,
  YAxis,
  Tooltip as RCTooltip,
  LineChart,
  ReferenceLine,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts"

import colors from "@data/colors"
import deaths from "@data/deaths"
import Tooltip from "./Tooltip"
import Months from "@data/months"

const styles = {
  stroke: "#b3b3b3",
  gridStroke: "#666",
  tick: { fontSize: 12 },
  padding: { left: 0, right: 25 },
  margin: { top: 8, right: 0, bottom: 10, left: -10 },
}

const Chart = ({ years }) => {
  const reference = deaths
    .map((month, i) => {
      const year = Object.keys(month).reduce((a, b) =>
        !years[b] || b === "month" || month[a] > month[b] ? a : b
      )
      return { month: i, year, value: month[year] }
    })
    .reduce((a, b) => (a.value > b.value ? a : b))

  return (
    <ResponsiveContainer id="chart-resp-container">
      <LineChart data={deaths} margin={styles.margin}>
        <CartesianGrid stroke={styles.gridStroke} strokeDasharray="3 3" />
        <ReferenceLine
          y={reference.value}
          label={
            <Label
              fill={"#ccc"}
              fontSize="80%"
              position="insideBottomRight"
              value={`${Months[reference.month]} ${
                reference.year
              }: ${Intl.NumberFormat("fr-FR").format(reference.value)} décès`}
            />
          }
          stroke={colors[reference.year]}
          strokeDasharray="3 3"
        />
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
          tickFormatter={(value) => Intl.NumberFormat("fr-FR").format(value)}
        />
        <RCTooltip content={<Tooltip />} />
      </LineChart>
    </ResponsiveContainer>
  )
}

export default Chart
