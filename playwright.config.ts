import { defineConfig, devices } from '@playwright/test';
import { allure } from 'allure-playwright';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  //forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  //retries: process.env.CI ? 2 : 0,
  retries: 0,
  /* Opt out of parallel tests on CI. */
  //workers: process.env.CI ? 1 : undefined,
  workers: 1,
  reporter: [
    ['html', { outputFolder: 'reports/html', open: 'always' }],
    ['allure-playwright', {outputFolder: '../reports/allure-results'}],
  ],
  use: {
    baseURL: 'https://parabank.parasoft.com',
    trace: 'on-first-retry',
    
    headless: false,
    //screenshot: 'only-on-failure',
    screenshot: 'on',
    //video: 'retain-on-failure',
    video: 'on',
    viewport: { width: 1280, height: 720 },
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});