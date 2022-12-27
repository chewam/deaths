// jest.config.js
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
})

// Add any custom config to be passed to Jest
/** @type {import('jest').Config} */
const customJestConfig = {
  // Add more setup options before each test is run
  // setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  // if using TypeScript with a baseUrl set to the root directory then you need the below for alias' to work
  moduleDirectories: ['node_modules', '<rootDir>/'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
//     '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
//     '\\.(gif|ttf|eot|svg|png)$': '<rootDir>/test/__mocks__/fileMock.js',
    "@/data/(.*)": "<rootDir>/src/data/$1",
    "@/lang/(.*)": "<rootDir>/src/lang/$1",
    "@/views/(.*)": "<rootDir>/src/views/$1",
    "@/utils/(.*)": "<rootDir>/src/utils/$1",
    "@/styles/(.*)": "<rootDir>/src/styles/$1",
    "@/services/(.*)": "<rootDir>/src/services/$1",
    "@/components/(.*)": "<rootDir>/src/components/$1",
  },
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig)

// module.exports = {
//   collectCoverage: true,
//   coverageThreshold: {
//     global: {
//       branches: 5,
//       functions: 5,
//       lines: 5,
//       statements: 5,
//     },
//   },
//   collectCoverageFrom: [
//     "src/**/**.tsx",
//     "!**/node_modules/**",
//     "!<rootDir>/src/pages/_*.tsx",
//     "!<rootDir>/src/utils/sentry.js",
//   ],
//   setupFilesAfterEnv: ["./jest/setup.tsx"],
//   roots: ['<rootDir>'],
//   moduleFileExtensions: ['ts', 'tsx', 'js', 'json', 'jsx'],
//   testPathIgnorePatterns: ['<rootDir>[/\\\\](node_modules|.next)[/\\\\]'],
//   transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\].+\\.(ts|tsx)$'],
//   transform: {
//     '^.+\\.(ts|tsx)$': 'babel-jest',
//   },
//   watchPlugins: ['jest-watch-typeahead/filename', 'jest-watch-typeahead/testname'],
//   moduleNameMapper: {
//     '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
//     '\\.(gif|ttf|eot|svg|png)$': '<rootDir>/test/__mocks__/fileMock.js',
//     "@/data/(.*)": "<rootDir>/src/data/$1",
//     "@/lang/(.*)": "<rootDir>/src/lang/$1",
//     "@/views/(.*)": "<rootDir>/src/views/$1",
//     "@/utils/(.*)": "<rootDir>/src/utils/$1",
//     "@/styles/(.*)": "<rootDir>/src/styles/$1",
//     "@/services/(.*)": "<rootDir>/src/services/$1",
//     "@/components/(.*)": "<rootDir>/src/components/$1",
//   },
// }
