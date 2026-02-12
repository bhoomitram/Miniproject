import { test, expect } from '@playwright/test';
import { parse } from 'csv-parse/sync';
import { readFileSync } from 'fs';
import { join } from 'path';
import { LoginPage } from '../pages/LoginPage.ts';
import { TransferPage } from '../pages/TransferPage.ts';
import { parseIterations2 } from '../utils/common.ts';

interface TransferData {
  Iteration: string;
  username: string;
  password: string;
  amount: string;
  fromAccount: string;
  toAccount: string;
}

// Load test data from transferData.csv
const csvData = readFileSync(join(__dirname, '../data/DT_Transfert_AvecJDDLogin.csv'), 'utf8');
const records = parse(csvData, { columns: true, skip_empty_lines: true }) as TransferData[];

const iterationParam = process.env.ITERATION || "1"; // Default to iteration 1 if not specified
const iterationsToRun = parseIterations2(iterationParam, records);

test('Transfer Funds @simpletransferIT', async ({ page }) => {
  for (const index of iterationsToRun) {
    const data = records[index];

    if (!data) continue;
    const loginPage = new LoginPage(page);
    const transferPage = new TransferPage(page);

    await test.step(`Iteration ${index + 1}`, async () => {
      console.log(`[ITERATION] ${index + 1}: Running test with user ${data.username}`);
    });

    await test.step('Login', async () => {
      // Login
      await loginPage.goto();
      await loginPage.fillUsername(data.username);
      await loginPage.fillPassword(data.password);
      await loginPage.clickLogin();
      await loginPage.verifyLoginSuccess();
    });

    await test.step('Go to Transfer Funds', async () => {
      // Go to Transfer Funds
      await transferPage.gotoTransferFunds();
    });

    await test.step('Fill transfer details', async () => {
      // Fill transfer details
      await transferPage.fillAmount(data.amount);
      await transferPage.selectFromAccount(data.fromAccount);
      await transferPage.selectToAccount(data.toAccount);
    });

    await test.step('Click Transfer', async () => {
      // Click Transfer
      await transferPage.clickTransfer();
    });

    await test.step('Verify transfer success', async () => {
      // Verify transfer success
      await transferPage.verifyTransferSuccess();
    });
  }
});