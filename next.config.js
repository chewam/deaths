const { version } = require("./package.json")
const { withSentryConfig } = require('@sentry/nextjs');

const moduleExports = {
  env: { APP_VERSION: version },
  i18n: {
    defaultLocale: "en",
    locales: ["fr", "en"],
  },
};

const SentryWebpackPluginOptions = {};

const config = withSentryConfig(moduleExports, SentryWebpackPluginOptions);

const analyzerEnabled = process.env.ANALYZE === "true"

if (analyzerEnabled) {
  const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: true,
  })
  module.exports = withBundleAnalyzer(config);
} else {
  module.exports = config
}
