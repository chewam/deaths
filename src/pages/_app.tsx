import App from "next/app"
import { useEffect } from "react"
import ErrorPage from "next/error"
import Head from "@/components/Head"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { Themes } from "@/services/themes"
import FiltersBar from "@/components/FiltersBar"
import type { AppProps, AppContext } from "next/app"

import "@/styles/index.scss"
import dark from "@/styles/themes/dark.module.scss"
import light from "@/styles/themes/light.module.scss"

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  // Remove the server-side injected CSS to avoid Material-UI slider flickering
  useEffect(() => {
    const jssStyles = document.querySelector("#jss-server-side")
    if (jssStyles) {
      const { parentElement } = jssStyles
      parentElement?.removeChild(jssStyles)
    }
  }, [])

  if (pageProps?.statusCode >= 400) {
    return <ErrorPage statusCode={pageProps.statusCode} />
  }

  return (
    <Themes light={light} dark={dark}>
      <Head />
      <Header />
      <FiltersBar />
      <Component {...pageProps} />
      <Footer />
    </Themes>
  )
}

export default MyApp
