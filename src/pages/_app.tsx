import { useEffect } from "react"
import ErrorPage from "next/error"
import Head from "@/components/Head"
import { useRouter } from "next/router"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import type { AppProps } from "next/app"
import { IntlProvider } from "react-intl"
import { Themes } from "@/services/themes"
import FiltersBar from "@/components/FiltersBar"

import "@/styles/index.scss"
import dark from "@/styles/themes/dark.module.scss"
import light from "@/styles/themes/light.module.scss"

import en from "@/lang/en.json"
import fr from "@/lang/fr.json"

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  const router = useRouter()
  const { locale = "", defaultLocale = "" } = router
  const messages = { en, fr } as Record<string, Record<string, string>>

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
    <IntlProvider
      locale={locale}
      defaultLocale={defaultLocale}
      messages={messages[locale] || messages[defaultLocale]}
    >
      <Themes light={light} dark={dark}>
        <Head />
        <Header />
        <FiltersBar />
        <Component {...pageProps} />
        <Footer />
      </Themes>
    </IntlProvider>
  )
}

export default MyApp
