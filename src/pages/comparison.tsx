import Comparison from "@/views/Deaths"
import useRawDeaths from "@/services/raw-deaths"

const Page = (): JSX.Element => {
  useRawDeaths()

  return <Comparison />
}

export default Page
