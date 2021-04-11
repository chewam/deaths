import Mortality from "@/views/Mortality"

import useRawMortality from "@/services/raw-mortality"

const Page = (): JSX.Element => {
  useRawMortality()

  return <Mortality />
}

export default Page
