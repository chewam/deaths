const { version } = require("./package.json")
const { withSentryConfig } = require('@sentry/nextjs');

console.log("process.env.VERCEL_GITHUB_COMMIT_SHA", process.env.VERCEL_GITHUB_COMMIT_SHA)

const moduleExports = {
  env: {
    APP_VERSION: version,
    VERCEL_URL: process.env.VERCEL_URL,
    ANALYTICS_ID: process.env.ANALYTICS_ID,
    VERCEL_GITHUB_COMMIT_SHA: process.env.VERCEL_GITHUB_COMMIT_SHA,
  },
  i18n: {
    defaultLocale: "en",
    locales: ["fr", "en"],
  }
};

const SentryWebpackPluginOptions = {};

module.exports = withSentryConfig(moduleExports, SentryWebpackPluginOptions);
