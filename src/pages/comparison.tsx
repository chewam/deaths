import Panel from "@/components/Panel"
import Years from "@/components/filters/Years"
import Comparison from "@/components/charts/Comparison"

const Page = (): JSX.Element => {
  return (
    <Panel className="comparison">
      <div className="chart">
        <Comparison />
      </div>
      <Years />
    </Panel>
  )
}

export default Page
