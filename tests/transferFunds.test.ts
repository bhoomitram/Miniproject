import { test, expect } from '@playwright/test';
import { parse } from 'csv-parse/sync';
import { readFileSync } from 'fs';
import { LoginPage } from '../pages/LoginPage';
import { TransferPage } from '../pages/TransferPage';

// Load test data from CSV
const csvData = readFileSync('./data/transferData.csv', 'utf8');
const records = parse(csvData, { columns: true, skip_empty_lines: true });

test.describe('Transfer Funds', () => {
  records.forEach((data: any) => {
    test(`Transfer funds for user ${data.username}`, async ({ page }) => {
      const loginPage = new LoginPage(page);
      const transferPage = new TransferPage(page);

      // Login
      await loginPage.goto();
      await loginPage.fillUsername(data.username);
      await loginPage.fillPassword(data.password);
      await loginPage.clickLogin();
      await loginPage.verifyLoginSuccess();

      // Go to Transfer Funds
      await transferPage.gotoTransferFunds();

      // Fill transfer details
      await transferPage.fillAmount(data.amount);
      await transferPage.selectFromAccount(data.fromAccount);
      await transferPage.selectToAccount(data.toAccount);

      // Click Transfer
      await transferPage.clickTransfer();

      // Verify transfer success
      await transferPage.verifyTransferSuccess();
    });
  });
});