import Filters from "@/views/Filters"
import Overview from "@/views/Overview"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import useRawDeaths from "@/services/raw-deaths"

const Index = (): JSX.Element => {
  useRawDeaths()

  return (
    <>
      <Header />
      <Filters />
      <Overview />
      <Footer />
    </>
  )
}

export default Index
