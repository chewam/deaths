module.exports = {
  collectCoverage: true,
  collectCoverageFrom: ["src/**/**.js", "!**/node_modules/**"],
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
