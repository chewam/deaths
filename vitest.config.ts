import { defineConfig } from "vitest/config"
import react from "@vitejs/plugin-react"
import { fileURLToPath } from "node:url"

const r = (p: string) => fileURLToPath(new URL(p, import.meta.url))

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@/data": r("./src/data"),
      "@/lang": r("./src/lang"),
      "@/views": r("./src/views"),
      "@/utils": r("./src/utils"),
      "@/styles": r("./src/styles"),
      "@/services": r("./src/services"),
      "@/components": r("./src/components"),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    include: ["__tests__/**/*.test.{ts,tsx}"],
    exclude: ["node_modules", ".next", "e2e", ".claude/worktrees"],
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
      include: ["src/**/*.{ts,tsx}"],
      exclude: ["src/pages/_*.tsx", "src/utils/sentry.js", "**/*.d.ts"],
    },
  },
})
