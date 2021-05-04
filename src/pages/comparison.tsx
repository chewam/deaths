import Panel from "@/components/Panel"
import Filters from "@/components/Filters"
import Comparison from "@/components/charts/Comparison"

const Page = (): JSX.Element => {
  return (
    <Panel className="comparison">
      <div className="chart">
        <Comparison />
      </div>
      <Filters />
    </Panel>
  )
}

export default Page
