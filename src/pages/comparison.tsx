import Years from "@/components/filters/Years"
import ComparisonChart from "@/components/charts/Comparison"

const Comparison = () => {
  return (
    <div className="container mx-auto px-6">
      <div className="comparison">
        <div className="chart">
          <ComparisonChart />
        </div>
        <Years />
      </div>
    </div>
  )
}

export default Comparison
