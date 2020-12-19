import Head from "@components/Head"
import Years from "@components/years"
import Footer from "@components/Footer"
import Header from "@components/Header"
import Overview from "@components/Overview"
import Ratio from "@components/Ratio"

const Body = () => (
  <>
    <Header />
    <main>
      <section className="top">
        <Years />
      </section>
      <section className="bottom">
        <Ratio />
        <Overview />
      </section>
    </main>
    <Footer />
  </>
)

const Home = () => (
  <>
    <Head />
    <Body />
  </>
)

export default Home
