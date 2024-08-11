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
 
module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: cspHeader.replace(/\n/g, ''),
          },
        ],
      },
    ]
  },
}

const analyzerEnabled = process.env.ANALYZE === "true"

if (analyzerEnabled) {
  const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: true,
  })
  module.exports = withBundleAnalyzer(config);
} else {
  module.exports = config
}
