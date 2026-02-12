import { test, expect } from '@playwright/test';
import { parse } from 'csv-parse/sync';
import { readFileSync } from 'fs';
import { join } from 'path';
import { LoginPage } from '../pages/LoginPage';
import { TransferPage } from '../pages/TransferPage';
import { parseIterations2 } from '../utils/common';

interface LoginData {
  username: string;
  password: string;
}

interface TransferData {
  Iteration: string;
  IT_Login: string;
  amount1: string;
  fromAccount: string;
  toAccount: string;
  amount2: string;
}

// Load login data from loginData.csv
const loginCsvData = readFileSync(join(__dirname, '../data/DT_Login.csv'), 'utf8');
const loginRecords = parse(loginCsvData, { columns: true, skip_empty_lines: true }) as LoginData[];

// Load transfer data from DT_TransferCompte.csv
const transferCsvData = readFileSync(join(__dirname, '../data/DT_TransferCompte.csv'), 'utf8');
const transferRecords = parse(transferCsvData, { columns: true, skip_empty_lines: true }) as TransferData[];

const iterationParam = process.env.ITERATION || "1" // Default to iteration 1 if not specified
const iterationsToRun = parseIterations2(iterationParam, transferRecords);

test('Secure Transfer Funds With Login @securetransferloginIT', async ({ page }) => {
  for (const index of iterationsToRun) {
    const transferData = transferRecords[index];

    if (!transferData) continue;

    // Use IT_Login column to determine which login to use
    const loginIndex = parseInt(transferData.IT_Login, 10) - 1; // Convert to 0-based index
    const loginData = loginRecords[loginIndex];

    if (!loginData) continue;

    const loginPage = new LoginPage(page);
    const transferPage = new TransferPage(page);

    await test.step(`Iteration ${index + 1}`, async () => {
      console.log(`[ITERATION] ${index + 1}: Running test with user ${loginData.username} (IT_Login=${transferData.IT_Login})`);
    });

    await test.step('Login', async () => {
      // Login
      await loginPage.goto();
      await loginPage.fillUsername(loginData.username);
      await loginPage.fillPassword(loginData.password);
      await loginPage.clickLogin();
      await loginPage.verifyLoginSuccess();
    });

    await test.step('Get initial balances', async () => {
      // Get initial balances
      await transferPage.gotoAccountsOverview();
    });

    let initialFromBalance: number = 0;
    let initialToBalance: number = 0;

    await test.step('Record initial from account balance', async () => {
      initialFromBalance = parseFloat(await transferPage.getAccountBalance(transferData.fromAccount));
    });

    await test.step('Record initial to account balance', async () => {
      initialToBalance = parseFloat(await transferPage.getAccountBalance(transferData.toAccount));
    });

    await test.step('Go to Transfer Funds', async () => {
      // Go to Transfer Funds
      await transferPage.gotoTransferFunds();
    });

    await test.step('Perform first transfer', async () => {
      // Perform first transfer
      await transferPage.fillAmount(transferData.amount1);
      await transferPage.selectFromAccount(transferData.fromAccount);
      await transferPage.selectToAccount(transferData.toAccount);
      await transferPage.clickTransfer();
    });

    await test.step('Verify first transfer success', async () => {
      // Verify transfer success
      await transferPage.verifyTransferSuccess();
    });

    await test.step('Check updated balances', async () => {
      // Check updated balances
      await transferPage.gotoAccountsOverview();
      const updatedFromBalance = parseFloat(await transferPage.getAccountBalance(transferData.fromAccount));
      const updatedToBalance = parseFloat(await transferPage.getAccountBalance(transferData.toAccount));

      expect(updatedFromBalance).toBe(initialFromBalance - parseFloat(transferData.amount1));
      expect(updatedToBalance).toBe(initialToBalance + parseFloat(transferData.amount1));
    });

    await test.step('Attempt second transfer with excessive amount', async () => {
      // Attempt second transfer with excessive amount
      await transferPage.gotoTransferFunds();
      await transferPage.fillAmount(transferData.amount2);
      await transferPage.selectFromAccount(transferData.fromAccount);
      await transferPage.selectToAccount(transferData.toAccount);
      await transferPage.clickTransfer();
    });

    await test.step('Verify insufficient balance error', async () => {
      // Verify insufficient balance error
      await transferPage.verifyInsufficientBalanceError();
    });
  }
});