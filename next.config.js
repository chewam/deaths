const { randomBytes } = require("crypto")
const { version } = require("./package.json")
const { withSentryConfig } = require('@sentry/nextjs');

const nonce = randomBytes(8).toString("base64")
process.env.NONCE = nonce

const ContentSecurityPolicy =
  process.env.NODE_ENV === "production"
    ? `
      default-src 'self';
      font-src 'self';
      base-uri 'self';
      style-src 'self';
      img-src 'self' data:;
      connect-src 'self' *.sentry.io;
      script-src 'self' 'nonce-${nonce}' https://*.sentry.io 'unsafe-inline';
    `
    : `
      default-src 'self';
      font-src 'self';
      img-src 'self' data:;
      connect-src 'self' *.sentry.io;
      style-src 'self' 'unsafe-inline';
      script-src 'self' 'nonce-${nonce}' https://*.sentry.io 'unsafe-eval';
    `

const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: ContentSecurityPolicy.replace(/\s{2,}/g, " ").trim(),
  },
]

const moduleExports = {
  env: { APP_VERSION: version },
  i18n: {
    defaultLocale: "en",
    locales: ["fr", "en"],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ]
  },
};

const SentryWebpackPluginOptions = {};

module.exports = withSentryConfig(moduleExports, SentryWebpackPluginOptions);
