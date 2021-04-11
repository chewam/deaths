import Overview from "@/views/Overview"

import useRawDeaths from "@/services/raw-deaths"

const Index = (): JSX.Element => {
  useRawDeaths()

  return <Overview />
}

export default Index
