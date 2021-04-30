import Head from "@/components/Head"
import Filters from "@/views/Filters"
import type { AppProps } from "next/app"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { Themes } from "@/services/themes"

import "@/styles/index.scss"
import dark from "@/styles/themes/dark.module.scss"
import light from "@/styles/themes/light.module.scss"

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <Themes light={light} dark={dark}>
      <Head />
      <Header />
      <Filters />
      <Component {...pageProps} />
      <Footer />
    </Themes>
  )
}

export default MyApp
