import * as Sentry from "@sentry/nextjs"

const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN

Sentry.init({
  dsn:
    SENTRY_DSN ||
    "https://f38955b2aa7c43e088d9f63a9539d94c@o450609.ingest.sentry.io/5435230",
})

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart
