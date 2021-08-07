module.exports = {
  collectCoverage: true,
  coverageThreshold: {
    global: {
      branches: 5,
      functions: 5,
      lines: 5,
      statements: 5,
    },
  },
  collectCoverageFrom: [
    "src/**/**.tsx",
    "!**/node_modules/**",
    "!<rootDir>/src/pages/_*.tsx",
    "!<rootDir>/src/utils/sentry.js",
  ],
  setupFilesAfterEnv: ["./jest/setup.tsx"],
  roots: ['<rootDir>'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json', 'jsx'],
  testPathIgnorePatterns: ['<rootDir>[/\\\\](node_modules|.next)[/\\\\]'],
  transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\].+\\.(ts|tsx)$'],
  transform: {
    '^.+\\.(ts|tsx)$': 'babel-jest',
  },
  watchPlugins: ['jest-watch-typeahead/filename', 'jest-watch-typeahead/testname'],
  moduleNameMapper: {
    '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
    '\\.(gif|ttf|eot|svg|png)$': '<rootDir>/test/__mocks__/fileMock.js',
    "@/data/(.*)": "<rootDir>/src/data/$1",
    "@/lang/(.*)": "<rootDir>/src/lang/$1",
    "@/views/(.*)": "<rootDir>/src/views/$1",
    "@/utils/(.*)": "<rootDir>/src/utils/$1",
    "@/styles/(.*)": "<rootDir>/src/styles/$1",
    "@/services/(.*)": "<rootDir>/src/services/$1",
    "@/components/(.*)": "<rootDir>/src/components/$1",
  },
}
