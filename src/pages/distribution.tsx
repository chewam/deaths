import Distribution from "@/views/Distribution"

import useRawMortality from "@/services/raw-mortality"

const Page = (): JSX.Element => {
  useRawMortality()

  return <Distribution />
}

export default Page
