import React, { useState } from "react"
import NextHead from "next/head"

import List from "@components/List"
import Footer from "@components/Footer"
import Header from "@components/Header"
import Overview from "@components/Overview"
import { defaultYears } from "@utils/deaths"
import YearsView from "@components/YearsView"

const Home = () => {
  const VERCEL_URL = process.env.VERCEL_URL
  const [years, setYearsState] = useState(defaultYears)

  const toggleYear = (year) => {
    years[year] = !years[year]
    setYearsState({ ...years })
  }

  const Head = () => (
    <NextHead>
      <title>Décès annuels en France</title>
      <link rel="icon" href="/favicon.png" />
      <meta property="og:title" content="Décès annuels en France" />
      <meta
        name="description"
        property="og:description"
        content="Statistiques annuelles des décès en France de 2010 à nos jours, basées sur les données de l'INSEE."
      />
      <meta
        property="og:image"
        content={`https://${VERCEL_URL}/screenshot.png`}
      />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </NextHead>
  )

  const Body = () => (
    <>
      <Header />
      <main>
        <section className="top">
          <aside>
            <List toggleYear={toggleYear} years={years} />
          </aside>
          <figure>
            <YearsView years={years} />
          </figure>
        </section>
        <section className="bottom">
          <Overview />
        </section>
      </main>
      <Footer />
    </>
  )

  return (
    <>
      <Head />
      <Body />
    </>
  )
}

export default Home
