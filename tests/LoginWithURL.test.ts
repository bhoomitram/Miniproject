import { test, expect } from '@playwright/test';
import { parse } from 'csv-parse/sync';
import { readFileSync } from 'fs';
import { join, resolve } from 'path';
import { LoginPage } from '../pages/LoginPage.ts';
import { parseIterations2 } from '../utils/common.ts';

interface LoginDataWithURL {
  username: string;
  password: string;
  url: string;
}

// Load test data from DT_Login_URL.csv
const csvData = readFileSync(resolve(__dirname, '../data/DT_Login_URL.csv'), 'utf8');
const records = parse(csvData, { columns: true, skip_empty_lines: true }) as LoginDataWithURL[];

const iterationParam = process.env.ITERATION || "1-2"; // Default to iteration 1 if not specified
const iterationsToRun = parseIterations2(iterationParam, records);

test('User Login with URL @urllogin', async ({ page }) => {
  for (const index of iterationsToRun) {
    const userData = records[index];

    if (!userData) continue;
    const loginPage = new LoginPage(page);

    await test.step(`Iteration ${index + 1}`, async () => {
      console.log(`[ITERATION] ${index + 1}: Running test with user ${userData.username} on URL ${userData.url}`);
    });

    await test.step('Navigate to login page using URL', async () => {
      // Navigate to login page using URL from CSV
      await page.goto(userData.url, { timeout: 60000 });
    });

    await test.step('Fill login information', async () => {
      // Fill login information
      await loginPage.fillUsername(userData.username);
      await loginPage.fillPassword(userData.password);
    });

    await test.step('Click Login', async () => {
      // Click Login
      await loginPage.clickLogin();
    });

    await test.step('Verify login success', async () => {
      // Verify login success
      await loginPage.verifyLoginSuccess();
    });

    await test.step('Logout', async () => {
      // Click Logout
      await loginPage.clickLogout();
    });

  }
});
