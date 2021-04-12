import Filters from "@/views/Filters"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import Mortality from "@/views/Mortality"
import useRawMortality from "@/services/raw-mortality"

const Page = (): JSX.Element => {
  useRawMortality()

  return (
    <>
      <Header />
      <Filters />
      <Mortality />
      <Footer />
    </>
  )
}

export default Page
