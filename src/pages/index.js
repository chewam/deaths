import Head from "next/head"
import React, { useState } from "react"

import List from "@components/List"
import Chart from "@components/Chart"
import Footer from "@components/Footer"
import Header from "@components/Header"
import Overview from "@components/Overview"
import { defaultYears } from "@utils/deaths"

const Home = () => {
  const [years, setYearsState] = useState(defaultYears)

  const toggleYear = (year) => {
    years[year] = !years[year]
    setYearsState({ ...years })
  }

  const Meta = () => (
    <Head>
      <title>Décès annuels en France</title>
      <link rel="icon" href="/favicon.png" />
      <meta
        name="description"
        content="Statistiques annuelles des décès en France de 2010 à nos jours."
      />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </Head>
  )

  return (
    <>
      <Meta />
      <Header />
      <main>
        <aside>
          <List toggleYear={toggleYear} years={years} />
        </aside>

        <section>
          <Chart years={years} />
        </section>
      </main>
      <section style={{ height: "200px", margin: "1rem" }}>
        <Overview />
      </section>
      <Footer />
    </>
  )
}

export default Home
