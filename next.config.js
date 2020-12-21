const webpack = require("webpack")
const { version } = require("./package.json")
const nextSourceMaps = require("@zeit/next-source-maps")

module.exports = nextSourceMaps({
  env: {
    APP_VERSION: version,
    SENTRY_DSN: process.env.SENTRY_DSN,
    VERCEL_URL: process.env.VERCEL_URL,
    ANALYTICS_ID: process.env.ANALYTICS_ID,
    VERCEL_GITHUB_COMMIT_SHA: process.env.VERCEL_GITHUB_COMMIT_SHA,
  },
  i18n: {
    locales: ["en", "fr"],
    defaultLocale: "fr",
  },
  webpack: (config, { isServer, buildId }) => {
    config.plugins.push(
      new webpack.DefinePlugin({
        // looks like it doesnt work for some reason
        "process.env.SENTRY_RELEASE": JSON.stringify(buildId),
      })
    )

    if (!isServer) {
      config.resolve.alias["@sentry/node"] = "@sentry/browser"
    }

    return config
  },
})
