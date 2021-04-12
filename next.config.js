const { version } = require("./package.json")

module.exports = {
  env: {
    APP_VERSION: version,
    VERCEL_URL: process.env.VERCEL_URL,
    ANALYTICS_ID: process.env.ANALYTICS_ID,
    VERCEL_GITHUB_COMMIT_SHA: process.env.VERCEL_GITHUB_COMMIT_SHA,
  },
}
