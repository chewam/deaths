import ErrorPage from "next/error"
import Head from "@/components/Head"
import { useRouter } from "next/router"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import type { AppProps } from "next/app"
import { IntlProvider } from "react-intl"
import FiltersBar from "@/components/FiltersBar"

import "remixicon/fonts/remixicon.css"
import "@/styles/tailwind.scss"
import "@/styles/globals.scss"

import en from "@/lang/en.json"
import fr from "@/lang/fr.json"

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const { locale = "", defaultLocale = "" } = router
  const messages = { en, fr } as Record<string, Record<string, string>>

  if (pageProps?.statusCode >= 400) {
    return <ErrorPage statusCode={pageProps.statusCode} />
  }

  return (
    <IntlProvider
      locale={locale}
      defaultLocale={defaultLocale}
      messages={messages[locale] || messages[defaultLocale]}
    >
      <Head />
      <Header />
      <FiltersBar />
      <Component {...pageProps} />
      <Footer />
    </IntlProvider>
  )
}

export default MyApp
