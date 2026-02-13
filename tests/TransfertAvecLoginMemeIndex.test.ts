import { test, expect } from '@playwright/test';
import { parse } from 'csv-parse/sync';
import { readFileSync } from 'fs';
import { join } from 'path';
import { LoginPage } from '../pages/LoginPage.ts';
import { TransferPage } from '../pages/TransferPage.ts';
import { parseIterations2 } from '../utils/common.ts';

interface LoginData {
  username: string;
  password: string;
}

interface TransferData {
  Iteration: string;
  amount: string;
  fromAccount: string;
  toAccount: string;
}

// Load login data from loginData.csv
const loginCsvData = readFileSync(join(__dirname, '../data/DT_login.csv'), 'utf8');
const loginRecords = parse(loginCsvData, { columns: true, skip_empty_lines: true }) as LoginData[];

// Load transfer data from transferData_SansLogin.csv
const transferCsvData = readFileSync(join(__dirname, '../data/DT_Transfert_SansLogin.csv'), 'utf8');
const transferRecords = parse(transferCsvData, { columns: true, skip_empty_lines: true }) as TransferData[];

const iterationParam = process.env.ITERATION || "1"; // Default to iteration 1 if not specified
const iterationsToRun = parseIterations2(iterationParam, transferRecords);

test('Transfert avec Login même index @TransfertAvecIndex', async ({ page }) => {
  for (const index of iterationsToRun) {
    const loginData = loginRecords[index];
    const transferData = transferRecords[index];

    if (!loginData || !transferData) continue;
    const loginPage = new LoginPage(page);
    const transferPage = new TransferPage(page);

    await test.step(`Iteration ${index + 1}`, async () => {
      console.log(`[ITERATION] ${index + 1}: Running test with user ${loginData.username}`);
    });

    await test.step('Login', async () => {
      // Login
      await loginPage.goto();
      await loginPage.fillUsername(loginData.username);
      await loginPage.fillPassword(loginData.password);
      await loginPage.clickLogin();
      await loginPage.verifyLoginSuccess();
    });

    await test.step('Go to Transfer Funds', async () => {
      // Go to Transfer Funds
      await transferPage.gotoTransferFunds();
    });

    await test.step('Fill transfer details', async () => {
      // Fill transfer details
      await transferPage.fillAmount(transferData.amount);
      await transferPage.selectFromAccount(transferData.fromAccount);
      await transferPage.selectToAccount(transferData.toAccount);
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