import { defineConfig, devices } from '@playwright/test';
import { allure } from 'allure-playwright';

export default defineConfig({
  testDir: './tests',
  reporter: [
    ['html'],
    ['allure-playwright']
  ],
  use: {
    baseURL: 'https://parabank.parasoft.com',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});