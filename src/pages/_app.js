import * as Sentry from "@sentry/node"

import "@styles/index.scss"

Sentry.init({
  dsn: process.env.SENTRY_DSN,
})

function Deaths({ Component, pageProps }) {
  return <Component {...pageProps} />
}

export default Deaths
