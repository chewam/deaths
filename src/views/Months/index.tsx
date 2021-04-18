import Chart from "./Chart"
import Panel from "@/components/Panel"
import useMonths from "@/services/months"
import useOverview from "@/services/overview"

const Months = (): JSX.Element => {
  const [monthsData] = useMonths()
  const [overview] = useOverview()
  const { labels, data } = overview as Overview

  const months = {
    data: data.slice(-12).reverse(),
    labels: labels.slice(-12).reverse(),
  }

  return (
    <div className="months">
      {months.labels.map((label, i) => (
        <div key={i} className="wrapper">
          <Panel className="month">
            <div className="title">
              {label.split(" ").map((text, i) => (
                <div key={i}>{text}</div>
              ))}
            </div>
            <div className="chart">
              <Chart
                data={monthsData.data.map((group: number[]) => group[i])}
              />
              <div className="count">
                <div>{months.data[i]}</div>
                <div>décès</div>
              </div>
            </div>
          </Panel>
        </div>
      ))}
    </div>
  )
}

export default Months
