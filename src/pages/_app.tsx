import type { AppProps } from "next/app"
import { Themes } from "@/services/themes"

import Head from "next/head"
import Menu from "@/components/Menu"
import Filters from "@/views/Filters"
import Header from "@/components/Header"
import Footer from "@/components/Footer"

import "@/styles/index.scss"
import dark from "@/styles/themes/dark.module.scss"
import light from "@/styles/themes/light.module.scss"

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <Themes light={light} dark={dark}>
      <Head>
        <title>Mortalité en France</title>
        <link
          as="font"
          rel="preload"
          crossOrigin=""
          href="/fonts/Roboto-Regular.ttf"
        />
      </Head>
      <Header />
      <Menu />
      <Filters />
      <Component {...pageProps} />
      <Footer />
    </Themes>
  )
}

export default MyApp
