import { test, expect } from '@playwright/test';
import { parse } from 'csv-parse/sync';
import { readFileSync } from 'fs';
import { join } from 'path';
import { RegistrationPage } from '../pages/RegistrationPage';

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
const csvData = readFileSync(join(__dirname, '../data/userData.csv'), 'utf8');
const records = parse(csvData, { columns: true, skip_empty_lines: true }) as UserData[];

// Parse ITERATION environment variable
// Format: "1-3;5;7-9" means iterations 1,2,3,5,7,8,9 (1-based indexing)
function parseIterations(iterationStr?: string): number[] {
  if (!iterationStr) {
    // If no iteration specified, run all
    return Array.from({ length: records.length }, (_, i) => i);
  }

  const iterations = new Set<number>();
  const parts = iterationStr.split(';');

  parts.forEach((part) => {
    part = part.trim();
    if (part.includes('-')) {
      const [start, end] = part.split('-').map((s) => parseInt(s.trim(), 10));
      if (!isNaN(start) && !isNaN(end)) {
        for (let i = start; i <= end; i++) {
          iterations.add(i - 1); // Convert to 0-based indexing
        }
      }
    } else {
      const num = parseInt(part, 10);
      if (!isNaN(num)) {
        iterations.add(num - 1); // Convert to 0-based indexing
      }
    }
  });

  return Array.from(iterations).sort((a, b) => a - b);
}

const iterationParam = process.env.ITERATION;
const iterationsToRun = parseIterations(iterationParam);

test('Register user @simpleregloginIT', async ({ page }) => {
  for (const index of iterationsToRun) {
    const userData = records[index];
    
    console.log(`[ITERATION] ${index + 1}: Running test with user ${userData.username}`);

    if (!userData) continue;
    const registrationPage = new RegistrationPage(page);

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

