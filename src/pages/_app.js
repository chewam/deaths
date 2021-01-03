import * as Sentry from "@sentry/node"
import { IntlProvider } from "react-intl"
import { useRouter } from "next/router"

import "@styles/index.scss"

import en from "@lang/en.json"
import fr from "@lang/fr.json"

Sentry.init({
  dsn: process.env.SENTRY_DSN,
})

function Deaths({ Component, pageProps }) {
  const router = useRouter()
  const messages = { en, fr }
  const { locale, defaultLocale } = router

  return (
    <IntlProvider
      locale={locale}
      defaultLocale={defaultLocale}
      messages={messages[locale] || messages[defaultLocale]}
    >
      <Component {...pageProps} />
    </IntlProvider>
  )
}

export default Deaths
