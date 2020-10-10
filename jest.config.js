module.exports = {
  collectCoverageFrom: ["src/**/*.{js}", "!**/node_modules/**"],

  moduleNameMapper: {
    "@data/(.*)": "<rootDir>/src/data/$1",
    "@utils/(.*)": "<rootDir>/src/utils/$1",
    "@styles/(.*)": "<rootDir>/src/styles/$1",
    "@components/(.*)": "<rootDir>/src/components/$1",
  },
  // setupFilesAfterEnv: ["<rootDir>/config/jest/setup.js"],
  testPathIgnorePatterns: ["/node_modules/", "/.next/"],
  transform: {
    "^.+\\.(js)$": "<rootDir>/node_modules/babel-jest",
    // "^.+\\.css$": "<rootDir>/config/jest/cssTransform.js",
  },
  transformIgnorePatterns: ["/node_modules/"],
}
