import OverviewChart from "@/components/charts/Overview"

const Overview = (): JSX.Element => {
  return (
    <div className="container mx-auto px-6">
      <div className="overview">
        <OverviewChart />
      </div>
    </div>
  )
}

export default Overview
