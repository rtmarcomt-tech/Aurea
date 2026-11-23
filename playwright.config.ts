import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: "list",
  use: {
    baseURL: "http://127.0.0.1:3000",
    trace: "retain-on-failure",
    ...devices["Desktop Chrome"],
  },
  webServer: {
    command: "npm start",
    url: "http://127.0.0.1:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    env: {
      NODE_ENV: "production",
      APP_SECRET: "ci-only-placeholder-secret-not-used-in-production",
      APP_URL: "http://127.0.0.1:3000",
      DATABASE_URL: "postgresql://ci:ci@127.0.0.1:5432/aurea?schema=public",
    },
  },
});
