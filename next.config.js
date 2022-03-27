const { version } = require("./package.json")
const { withSentryConfig } = require('@sentry/nextjs');

// const securityHeaders = [{
//   key: "Content-Security-Policy",
//   value: "default-src 'self' *.googletagmanager.com *.sentry.io"
// }]

const moduleExports = {
  env: { APP_VERSION: version },
  i18n: {
    defaultLocale: "en",
    locales: ["fr", "en"],
  },
  // async headers() {
  //   return [
  //     {
  //       source: '/(.*)',
  //       headers: securityHeaders,
  //     },
  //   ]
  // }
};

const SentryWebpackPluginOptions = {};

module.exports = withSentryConfig(moduleExports, SentryWebpackPluginOptions);



// const { version } = require("./package.json")
// const { withSentryConfig } = require('@sentry/nextjs');

// const ContentSecurityPolicy = `
//   default-src 'self' *.googletagmanager.com *.sentry.io;
// `

// const securityHeaders = [
// //   {
// //   key: "Content-Security-Policy",
// //   value: "default-src 'self' *.googletagmanager.com *.sentry.io"
// // },
// {
//   key: 'Content-Security-Policy',
//   value: ContentSecurityPolicy.replace(/\s{2,}/g, ' ').trim()
// },
// {
//   key: 'X-DNS-Prefetch-Control',
//   value: 'on'
// },
// {
//   key: 'Strict-Transport-Security',
//   value: 'max-age=63072000; includeSubDomains; preload'
// },
// {
//   key: 'X-XSS-Protection',
//   value: '1; mode=block'
// },
// {
//   key: 'X-Frame-Options',
//   value: 'SAMEORIGIN'
// },
// {
//   key: 'Permissions-Policy',
//   value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()'
// },
// {
//   key: 'X-Content-Type-Options',
//   value: 'nosniff'
// },
// {
//   key: 'Referrer-Policy',
//   value: 'origin-when-cross-origin'
// }]

// const moduleExports = {
//   env: { APP_VERSION: version },
//   i18n: {
//     defaultLocale: "en",
//     locales: ["fr", "en"],
//   },
//   async headers() {
//     return [
//       {
//         source: '/:path*',
//         headers: securityHeaders,
//       },
//     ]
//   }
// };

// const SentryWebpackPluginOptions = {};

// module.exports = withSentryConfig(moduleExports, SentryWebpackPluginOptions);
