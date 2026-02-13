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

test('Transfert entre comptes @TransfertCompte @TNR', async ({ page }) => {
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

    await test.step('Open new account', async () => {
      await transferPage.gotoOpenNewAccountAndOpen();
    });
 
    await test.step('Overview accounts after opening new account', async () => {
      // Get initial balances
      await transferPage.gotoAccountsOverview();
    });

    let initialFromBalanceNumber = 0;

    await test.step('Record initial amount from account balance', async () => {
      const oAccountLink = page.locator("//table[@id='accountTable']//tr[1]/td[1]/a");
      const DynamicFromBalanceText = await oAccountLink.textContent();
      if (DynamicFromBalanceText) {
        const initialFromBalanceLocator = page.locator("//table[@id='accountTable']//tr[1]/td[2]");
        let initialFromBalanceText = await initialFromBalanceLocator.textContent();
        if (initialFromBalanceText) {
          initialFromBalanceNumber = parseFloat(initialFromBalanceText.replace(/[^0-9.-]/g, ''));
        }
      }
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
      const updatedFromBalanceLocator = page.locator("//table[@id='accountTable']//tr[1]/td[2]");
      let updatedFromBalanceText = await updatedFromBalanceLocator.textContent();
      if (updatedFromBalanceText) {
        const updatedFromBalanceNumber = parseFloat(updatedFromBalanceText.replace(/[^0-9.-]/g, ''));
        expect(updatedFromBalanceNumber).toBe(initialFromBalanceNumber - parseFloat(transferData.amount1));
      }
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