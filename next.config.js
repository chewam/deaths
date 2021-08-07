const { version } = require("./package.json")
const { withSentryConfig } = require('@sentry/nextjs');

const moduleExports = {
  env: { APP_VERSION: version },
  i18n: {
    defaultLocale: "en",
    locales: ["fr", "en"],
  }
};

const SentryWebpackPluginOptions = {};

module.exports = withSentryConfig(moduleExports, SentryWebpackPluginOptions);
