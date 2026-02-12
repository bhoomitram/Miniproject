import { test, expect } from '@playwright/test';
import { parse } from 'csv-parse/sync';
import { readFileSync } from 'fs';
import { join } from 'path';
import { LoginPage } from '../pages/LoginPage';
import { BillPayPage } from '../pages/BillPayPage';
import { parseIterations2 } from '../utils/common';

interface LoginData {
  username: string;
  password: string;
}

interface BillPayData {
  Iteration: string;
  IT_Login: string;
  payeeName: string;
  payeeAddress: string;
  payeeAccount: string;
  amount: string;
  fromAccount: string;
}

// Load login data from loginData.csv
const loginCsvData = readFileSync(join(__dirname, '../data/loginData.csv'), 'utf8');
const loginRecords = parse(loginCsvData, { columns: true, skip_empty_lines: true }) as LoginData[];

// Load bill pay data from billPayData.csv
const billPayCsvData = readFileSync(join(__dirname, '../data/DT_PaiementFacture.csv'), 'utf8');
const billPayRecords = parse(billPayCsvData, { columns: true, skip_empty_lines: true, relax_column_count: true }) as BillPayData[];

const iterationParam = process.env.ITERATION || "1"; // Default to 1 if not specified
const iterationsToRun = parseIterations2(iterationParam, billPayRecords);

test('Bill Pay With Login @billpayIT', async ({ page }) => {
  for (const index of iterationsToRun) {
    const billPayData = billPayRecords[index];

    if (!billPayData) continue;

    // Use IT_Login column to determine which login to use
    const loginIndex = parseInt(billPayData.IT_Login, 10) - 1; // Convert to 0-based index
    const loginData = loginRecords[loginIndex];

    if (!loginData) continue;

    const loginPage = new LoginPage(page);
    const billPayPage = new BillPayPage(page);

    await test.step(`Iteration ${index + 1}`, async () => {
      console.log(`[ITERATION] ${index + 1}: Running test with user ${loginData.username} (IT_Login=${billPayData.IT_Login})`);
    });

    await test.step('Login', async () => {
      // Login
      await loginPage.goto();
      await loginPage.fillUsername(loginData.username);
      await loginPage.fillPassword(loginData.password);
      await loginPage.clickLogin();
      await loginPage.verifyLoginSuccess();
    });

    await test.step('Go to Bill Pay', async () => {
      // Go to Bill Pay
      await billPayPage.gotoBillPay();
    });

    await test.step('Fill payee details', async () => {
      // Parse address: assuming format "street, city, state zip"
      const addressParts = billPayData.payeeAddress.split(', ');
      const street = addressParts[0];
      const city = addressParts[1];
      const stateZip = addressParts[2].split(' ');
      const state = stateZip[0];
      const zip = stateZip[1];
   

      // Fill payee info
      await billPayPage.fillPayeeInfo(
        billPayData.payeeName,
        street,
        city,
        state,
        zip,
        billPayData.PF_Tel, // phone not provided
        billPayData.payeeAccount
      );
    });

    await test.step('Fill payment details', async () => {
      // Fill payment info
      await billPayPage.fillPaymentInfo(billPayData.amount, billPayData.fromAccount);
    });

    await test.step('Click Send Payment', async () => {
      // Click Send Payment
      await billPayPage.clickSendPayment();
    });

    await test.step('Verify bill payment success', async () => {
      // Verify bill payment success
      await billPayPage.verifyBillPaymentSuccess();
    });
  }
});