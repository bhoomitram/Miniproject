import { test, expect } from '@playwright/test';
import { parse } from 'csv-parse/sync';
import { readFileSync } from 'fs';
import { join } from 'path';
import { RegistrationPage } from '../pages/RegistrationPage.ts';
import { parseIterations2 } from '../utils/common.ts';

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

// Load test data from userData.csv
const csvData = readFileSync(join(__dirname, '../data/DT_Inscription.csv'), 'utf8');
const records = parse(csvData, { columns: true, skip_empty_lines: true }) as UserData[];

const iterationParam = process.env.ITERATION || "1"; // Default to iteration 1 if not specified
const iterationsToRun = parseIterations2(iterationParam, records);

test('Register user @simplereg', async ({ page }) => {
  for (const index of iterationsToRun) {
    const userData = records[index];   

    if (!userData) continue;
    const registrationPage = new RegistrationPage(page);

    await test.step(`Iteration ${index + 1}`, async () => {
      console.log(`[ITERATION] ${index + 1}: Running test with user ${userData.username}`);
    });

    await test.step('Open homepage', async () => {
       // Navigate to registration page
      await registrationPage.goto();
    });

    await test.step('Fill personal information', async () => {
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
      });

    // Fill login information
    await test.step('Fill login information', async () => {
      await registrationPage.fillLoginInfo(userData.username, userData.password);
    });

    await test.step('Register user and Verification', async () => {
      // Click Register
      await registrationPage.clickRegister();

      // Verify registration success
      await registrationPage.verifyRegistrationSuccess();
    });
  }
});

