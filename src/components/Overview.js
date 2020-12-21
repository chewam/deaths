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
import { useIntl } from "react-intl"

import Months from "@data/months"
import { linearDeaths } from "@utils/deaths"
import CustomTooltip from "@components/Tooltip"

const styles = {
  stroke: "#b3b3b3",
  gridStroke: "#666",
  tick: { fontSize: 12 },
  padding: { left: 0, right: 20 },
  margin: { top: 8, right: 0, bottom: 10, left: -5 },
}

const Overview = () => {
  const intl = useIntl()

  const reference = linearDeaths.reduce((a, b) => (a.value > b.value ? a : b))

  const referenceLabel = `${intl.formatDate(
    new Date(reference.year, Months.indexOf(reference.month)),
    { month: "long" }
  )} ${reference.year}: ${intl.formatNumber(
    reference.value
  )} ${intl.formatMessage({
    id: "deaths",
    defaultMessage: "décès",
  })}`

  const YAxisTickFormatter = (value) => intl.formatNumber(value)

  const XAxisTickFormatter = (value) => {
    const [month, year] = value.split(" ")
    return `${intl
      .formatDate(new Date(year, Months.indexOf(month)), { month: "long" })
      .substring(0, 3)}. ${year}`
  }

  const toolTipRenderer = ([{ value }]) =>
    `${intl.formatNumber(value)} ${intl.formatMessage({
      id: "deaths",
      defaultMessage: "décès",
    })}`

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
              position="insideBottomRight"
              value={referenceLabel}
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
