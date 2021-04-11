import Overview from "@/views/Overview"

import useRawDeaths from "@/services/raw-deaths"

const Page = (): JSX.Element => {
  useRawDeaths()

  return <Overview />
}

export default Page
