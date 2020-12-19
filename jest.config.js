module.exports = {
  collectCoverage: true,
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  collectCoverageFrom: [
    "src/**/**.js",
    "!**/node_modules/**",
    "!<rootDir>/src/pages/_*.js",
    "!<rootDir>/src/utils/sentry.js",
  ],
  moduleNameMapper: {
    "@data/(.*)": "<rootDir>/src/data/$1",
    "@utils/(.*)": "<rootDir>/src/utils/$1",
    "@styles/(.*)": "<rootDir>/src/styles/$1",
    "@components/(.*)": "<rootDir>/src/components/$1",
  },
  testPathIgnorePatterns: ["/node_modules/", "/.next/"],
  transform: {
    "^.+\\.(js)$": "<rootDir>/node_modules/babel-jest",
  },
  transformIgnorePatterns: ["/node_modules/"],
  setupFilesAfterEnv: ["./jest/setup.js"],
  snapshotResolver: "./jest/resolver.js",
}
