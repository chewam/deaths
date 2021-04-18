import Filters from "@/views/Filters"
import Comparison from "@/views/Deaths"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import useRawDeaths from "@/services/raw-deaths"

const Page = (): JSX.Element => {
  useRawDeaths()

  return (
    <>
      <Header />
      <Filters />
      <Comparison />
      <Footer />
    </>
  )
}

export default Page
