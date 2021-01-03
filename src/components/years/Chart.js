import {
  Line,
  Label,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  ReferenceLine,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts"

import colors from "@data/colors"
import deaths from "@data/deaths"
import Months from "@data/months"
import useI18n from "@utils/i18n"
import CustomTooltip from "@components/Tooltip"

const styles = {
  stroke: "#b3b3b3",
  gridStroke: "#666",
  tick: { fontSize: 12 },
  padding: { left: 0, right: 25 },
  margin: { top: 8, right: 0, bottom: 10, left: -10 },
}

const Chart = ({ years }) => {
  const { f, fn, fd } = useI18n()

  const YAxisTickFormatter = (value) => fn(value)

  const XAxisTickFormatter = (value) => {
    return `${fd(new Date(2001, Months.indexOf(value)), {
      month: "long",
    })}`
  }

  const toolTipRenderer = (payload) =>
    payload.reverse().map((item, i) => (
      <div key={i} style={{ color: item.color }}>
        {item.name}: {fn(item.value)} {f("deaths")}
      </div>
    ))

  const reference = deaths
    .map((month, i) => {
      const year = Object.keys(month).reduce((a, b) =>
        !years[b] || b === "month" || month[a] > month[b] ? a : b
      )
      return { month: i, year, value: month[year] }
    })
    .reduce((a, b) => (a.value > b.value ? a : b))

  const referenceLabel = `${fd(new Date(reference.year, reference.month, 15), {
    month: "long",
  })} ${reference.year}: ${fn(reference.value)} ${f("deaths")}`

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
              value={referenceLabel}
            />
          }
          stroke={colors[reference.year]}
          strokeDasharray="3 3"
        />
        <XAxis
          dy={10}
          angle={30}
          interval={0}
          dataKey="month"
          tick={styles.tick}
          stroke={styles.stroke}
          padding={styles.padding}
          tickFormatter={XAxisTickFormatter}
        />
        <YAxis
          dx={-5}
          type="number"
          tick={styles.tick}
          stroke={styles.stroke}
          tickFormatter={YAxisTickFormatter}
          domain={["dataMin - 5000", "dataMax + 5000"]}
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
        <Tooltip renderer={toolTipRenderer} content={<CustomTooltip />} />
      </LineChart>
    </ResponsiveContainer>
  )
}

export default Chart
