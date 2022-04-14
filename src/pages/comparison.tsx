import Years from "@/components/filters/Years"
import Comparison from "@/components/charts/Comparison"

const Page = (): JSX.Element => {
  return (
    <div className="container mx-auto px-6">
      <div className="comparison">
        <div className="chart">
          <Comparison />
        </div>
        <Years />
      </div>
    </div>
  )
}

export default Page
