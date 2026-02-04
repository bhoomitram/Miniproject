import { test, expect } from '@playwright/test';
import { parse } from 'csv-parse/sync';
import { readFileSync } from 'fs';
import { join } from 'path';
import { RegistrationPage } from '../pages/RegistrationPage';
import { LoginPage } from '../pages/LoginPage';

// Load test data from CSV
const csvData = readFileSync(join(__dirname, '../data/userData.csv'), 'utf8');
const records = parse(csvData, { columns: true, skip_empty_lines: true });

test.describe('User Registration and Login @reglogin', () => {
  records.forEach((userData: any) => {
    test(`Register and login user ${userData.username}`, async ({ page }) => {
      const registrationPage = new RegistrationPage(page);
      const loginPage = new LoginPage(page);

      // === REGISTRATION PHASE ===
      // Navigate to registration page
      await registrationPage.goto();

      // Fill personal information
      await registrationPage.fillPersonalInfo(
        userData.firstName,
        userData.lastName,
        userData.address,
        userData.city,
        userData.state,
        userData.zip,
        userData.phone,
        userData.SSN
      );

      // Fill login information
      await registrationPage.fillLoginInfo(userData.username, userData.password);

      // Click Register
      await registrationPage.clickRegister();

      // Verify registration success
      await registrationPage.verifyRegistrationSuccess();

      // === LOGIN PHASE ===
      // Navigate to login page
      await loginPage.goto();

      // Fill login credentials
      await loginPage.fillUsername(userData.username);
      await loginPage.fillPassword(userData.password);

      // Click Login
      await loginPage.clickLogin();

      // Verify login success
      await loginPage.verifyLoginSuccess();
    });
  });
});