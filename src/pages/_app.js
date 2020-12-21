import * as Sentry from "@sentry/node"
import { IntlProvider } from "react-intl"
import { useRouter } from "next/router"

import "@styles/index.scss"

import messages from "../lang/en.json"

Sentry.init({
  dsn: process.env.SENTRY_DSN,
})

function Deaths({ Component, pageProps }) {
  const router = useRouter()
  const { locale, defaultLocale } = router

  return (
    <IntlProvider
      locale={locale}
      messages={messages}
      defaultLocale={defaultLocale}
    >
      <Component {...pageProps} />
    </IntlProvider>
  )
}

export default Deaths
