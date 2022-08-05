import DistributionChart from "@/components/charts/Distribution"

const Distribution = (): JSX.Element => {
  return (
    <div className="container mx-auto px-6">
      <div className="distribution">
        <DistributionChart />
      </div>
    </div>
  )
}

export default Distribution
