import { defineConfig, devices } from "@playwright/test"

const PORT = Number(process.env.PORT ?? 3000)
const BASE_URL = `http://127.0.0.1:${PORT}`
const isCI = !!process.env.CI

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 1 : undefined,
  reporter: isCI ? [["github"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: BASE_URL,
    locale: "en-US",
    timezoneId: "Europe/Paris",
    trace: "retain-on-failure",
    video: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "e2e-behavior",
      testMatch: /.*\.spec\.ts$/,
      testIgnore: /.*\.visual\.spec\.ts$/,
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1280, height: 800 },
      },
    },
    {
      name: "e2e-visual",
      testMatch: /.*\.visual\.spec\.ts$/,
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1280, height: 800 },
      },
      expect: { toHaveScreenshot: { maxDiffPixelRatio: 0.01 } },
    },
  ],
  webServer: {
    command: "yarn build && yarn start",
    url: BASE_URL,
    reuseExistingServer: !isCI,
    stdout: "pipe",
    stderr: "pipe",
    timeout: 180_000,
  },
})
