const { version } = require("./package.json")
const { withSentryConfig } = require("@sentry/nextjs")

const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline';
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data:;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
`

const nextConfig = {
  output: "standalone",
  env: { APP_VERSION: version },
  i18n: {
    defaultLocale: "en",
    locales: ["fr", "en"],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: cspHeader.replace(/\n/g, ""),
          },
        ],
      },
    ]
  },
}

const sentryBuildOptions = {
  silent: !process.env.CI,
}

const config = withSentryConfig(nextConfig, sentryBuildOptions)

if (process.env.ANALYZE === "true") {
  const withBundleAnalyzer = require("@next/bundle-analyzer")({ enabled: true })
  module.exports = withBundleAnalyzer(config)
} else {
  module.exports = config
}
