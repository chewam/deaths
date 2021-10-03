const { version } = require("./package.json")
const { withSentryConfig } = require('@sentry/nextjs');

const securityHeaders = [{
  key: "Content-Security-Policy",
  value: "default-src 'self' *.googletagmanager.com *.sentry.io"
}]

const moduleExports = {
  env: { APP_VERSION: version },
  i18n: {
    defaultLocale: "en",
    locales: ["fr", "en"],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ]
  }
};

const SentryWebpackPluginOptions = {};

module.exports = withSentryConfig(moduleExports, SentryWebpackPluginOptions);
