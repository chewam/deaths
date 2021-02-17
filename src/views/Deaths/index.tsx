import Chart from "./Chart"
import Panel from "@/components/Panel"
import Filters from "@/components/Filters"

const Deaths = () => {
  return (
    <Panel className="deaths">
      <Chart />
      <Filters />
    </Panel>
  )
}

export default Deaths
