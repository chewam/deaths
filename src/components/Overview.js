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

import Months from "@data/months"
import useI18n from "@utils/i18n"
import { linearDeaths } from "@utils/deaths"
import CustomTooltip from "@components/Tooltip"

const styles = {
  stroke: "#b3b3b3",
  gridStroke: "#666",
  lineStroke: "#3182bd",
  tick: { fontSize: 12 },
  padding: { left: 0, right: 20 },
  margin: { top: 8, right: 0, bottom: 10, left: -5 },
}

const Overview = () => {
  const { f, fn, fd } = useI18n()

  const reference = linearDeaths.reduce((a, b) => (a.value > b.value ? a : b))

  const referenceLabel = `${fd(
    new Date(reference.year, Months.indexOf(reference.month)),
    { month: "long" }
  )} ${reference.year}: ${fn(reference.value)} ${f("deaths")}`

  const YAxisTickFormatter = (value) => fn(value)

  const XAxisTickFormatter = (value) => {
    const [month, year] = value.split(" ")
    return `${fd(new Date(year, Months.indexOf(month)), {
      month: "long",
    }).substring(0, 3)}. ${year}`
  }

  const toolTipRenderer = ([{ value }]) => `${fn(value)} ${f("deaths")}`

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
          tickFormatter={XAxisTickFormatter}
        />
        <YAxis
          dx={-5}
          type="number"
          tick={styles.tick}
          stroke={styles.stroke}
          tickFormatter={YAxisTickFormatter}
          domain={["dataMin - 2000", "dataMax + 3000"]}
        />
        <ReferenceLine
          y={reference.value}
          label={
            <Label
              fill={"#ccc"}
              fontSize="80%"
              value={referenceLabel}
              position="insideBottomRight"
            />
          }
          stroke={styles.lineStroke}
          strokeDasharray="3 3"
        />
        <Tooltip content={<CustomTooltip />} renderer={toolTipRenderer} />
        <Line
          dataKey="value"
          type="monotone"
          stroke={styles.lineStroke}
          dot={{ stroke: styles.stroke, r: 1 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

export default Overview
