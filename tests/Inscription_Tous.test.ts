import { test, expect } from '@playwright/test';
import { parse } from 'csv-parse/sync';
import { readFileSync } from 'fs';
import { join } from 'path';
import { RegistrationPage } from '../pages/RegistrationPage.ts';

interface UserData {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  SSN: string;
  username: string;
  password: string;
}

// Load test data from CSV
const csvData = readFileSync(join(__dirname, '../data/DT_Inscription.csv'), 'utf8');
const records = parse(csvData, { columns: true, skip_empty_lines: true }) as UserData[];

test('Register user @EngToutesIT', async ({ page }) => {
  for (const userData of records) {
    const registrationPage = new RegistrationPage(page);

    //await test.step(`Iteration ${records.indexOf(userData) + 1}`, async () => {
    //  console.log(`[ITERATION] ${records.indexOf(userData) + 1}: Running test with user ${userData.username}`);
    //});

    await test.step('Open homepage', async () => {
       // Navigate to registration page
      await registrationPage.goto();
    });

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
  }
});

