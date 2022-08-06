const { version } = require("./package.json")
const { withSentryConfig } = require('@sentry/nextjs');

const analyzerEnabled = process.env.ANALYZE === "true"

if (analyzerEnabled) {
  const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: true,
  })
  module.exports = withBundleAnalyzer({});
} else {
  const stylesHashes = `'sha256-GbLDjoSyysR7kiVwIcYeVTprWy3h6FnE6JVXvI5hYU8=' 'sha256-/AgGTdNQUilncRMQ9QjaM/kDxwEIGyXtQowJ9/U17hQ=' 'sha256-CpoizHa8b2vV7JpFgz4koBy9M1jiVnyE0XBZVCiJCag=' 'sha256-ORRpAnnoKJoJwiu1FCh59dEwTz1asyZAFLCEStRWO1w=' 'sha256-URuMntBmADkWDWYN1NGggH9HYMCSrYPcNWrOBENBPQY=' 'sha256-HutZJ8SG+NFxP6oCpISPRIo4jcF9DlBO46ZN2fRpk48=' 'sha256-jRIzPTmKGwyMmOIlhrtrJvny1KckgZmlYASoXQTxYNU=' 'sha256-9KYpA/HTKRbmxj1jCQ6fypLMBek+mfPfW6mmp1swidE=' 'sha256-ad8uVI7gmSok2BuNptqR/SxndzR5Etplgr30jNfqYvs=' 'sha256-MYzxF+hweheX/DcuFHHev02esqzgtd+s6oLx0c20XY8=' 'sha256-KJysBqsPn6H8piB4LH5PYCwN7V8EKlfbFBpFlXlpsCY=' 'sha256-wIEMlUQgVpnHIefTkjb8ktqpVrFCA84wCUdNZrmkh6Y=' 'sha256-IpQjAM7AuOUc3zHs6EYqrCZTAi2Bm9Y3K6z636POTY0=' 'sha256-jknslU8ag6PNFCWk5xIhcdrPnAwtb4Wn9rdnDi8s8lM=' 'sha256-8oY77pjpJbbfG/eDjxxwjJVa7y1rRfb5LimwKhQBJJQ=' 'sha256-Wv5RXCTyjvK2OrnPPrU6iMmTnyw3xdCd40/FpWVFgAQ=' 'sha256-bT/CA3fTHVdEDYhJTsSLDP5WEIryQFzpCZ+IABLW0yM=' 'sha256-+9pJuW2tBVknv7iJPxx6rNkJe8zVH1V4SWxBTFpU1e0='`

  const ContentSecurityPolicy = `
    font-src 'self';
    default-src 'self';
    img-src 'self' www.google-analytics.com;
    style-src 'self' ${stylesHashes} 'unsafe-hashes';
    connect-src 'self' *.sentry.io vitals.vercel-insights.com www.google-analytics.com;
    script-src 'self' *.sentry.io *.googletagmanager.com www.google-analytics.com 'sha256-Knm+Tl38SOjwUxvDOr3uFM81svhZ9Twnt6mYVgF2K9s=';
  `

  const securityHeaders = [{
    key: "Content-Security-Policy",
    value: ContentSecurityPolicy.replace(/\s{2,}/g, ' ').trim()
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
          source: '/:path*',
          headers: securityHeaders,
        },
      ]
    }
  };

  const SentryWebpackPluginOptions = {};

  module.exports = withSentryConfig(moduleExports, SentryWebpackPluginOptions);
}
