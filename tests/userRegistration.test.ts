import { test, expect } from '@playwright/test';
import { parse } from 'csv-parse/sync';
import { readFileSync } from 'fs';
import { join } from 'path';
import { RegistrationPage } from '../pages/RegistrationPage';

// Load test data from CSV
const csvData = readFileSync(join(__dirname, '../data/userData.csv'), 'utf8');
const records = parse(csvData, { columns: true, skip_empty_lines: true });

test.describe('User Registration', () => {
  records.forEach((userData: any) => {
    test(`Register user ${userData.username}`, async ({ page }) => {
      const registrationPage = new RegistrationPage(page);

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
    });
  });
});
