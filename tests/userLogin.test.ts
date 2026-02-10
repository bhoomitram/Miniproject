import { test, expect } from '@playwright/test';
import { parse } from 'csv-parse/sync';
import { readFileSync } from 'fs';
import { LoginPage } from '../pages/LoginPage';

// Load test data from CSV
const csvData = readFileSync('./data/loginData.csv', 'utf8');
const records = parse(csvData, { columns: true, skip_empty_lines: true });

test.describe('User Login' , () => {
  records.forEach((userData: any) => {
    test(`Login user ${userData.username}`, async ({ page }) => {
      const loginPage = new LoginPage(page);

      // Navigate to login page
      await loginPage.goto();

      // Fill login information
      await loginPage.fillUsername(userData.username);
      await loginPage.fillPassword(userData.password);

      // Click Login
      await loginPage.clickLogin();

      // Verify login success
      await loginPage.verifyLoginSuccess();
    });
  });
});