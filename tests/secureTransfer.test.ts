import { test, expect } from '@playwright/test';
import { parse } from 'csv-parse/sync';
import { readFileSync } from 'fs';
import { LoginPage } from '../pages/LoginPage';
import { TransferPage } from '../pages/TransferPage';

// Load test data from CSV
const csvData = readFileSync('./data/secureTransferData.csv', 'utf8');
const records = parse(csvData, { columns: true, skip_empty_lines: true });

test.describe('Secure Transfer Funds', () => {
  records.forEach((data: any) => {
    test(`Secure transfer for user ${data.username}`, async ({ page }) => {
      const loginPage = new LoginPage(page);
      const transferPage = new TransferPage(page);

      // Login
      await loginPage.goto();
      await loginPage.fillUsername(data.username);
      await loginPage.fillPassword(data.password);
      await loginPage.clickLogin();
      await loginPage.verifyLoginSuccess();

      // Get initial balances
      await transferPage.gotoAccountsOverview();
      const initialFromBalance = parseFloat(await transferPage.getAccountBalance(data.fromAccount));
      const initialToBalance = parseFloat(await transferPage.getAccountBalance(data.toAccount));

      // Go to Transfer Funds
      await transferPage.gotoTransferFunds();

      // Perform first transfer
      await transferPage.fillAmount(data.amount1);
      await transferPage.selectFromAccount(data.fromAccount);
      await transferPage.selectToAccount(data.toAccount);
      await transferPage.clickTransfer();

      // Verify transfer success
      await transferPage.verifyTransferSuccess();

      // Check updated balances
      await transferPage.gotoAccountsOverview();
      const updatedFromBalance = parseFloat(await transferPage.getAccountBalance(data.fromAccount));
      const updatedToBalance = parseFloat(await transferPage.getAccountBalance(data.toAccount));

      expect(updatedFromBalance).toBe(initialFromBalance - parseFloat(data.amount1));
      expect(updatedToBalance).toBe(initialToBalance + parseFloat(data.amount1));

      // Attempt second transfer with excessive amount
      await transferPage.gotoTransferFunds();
      await transferPage.fillAmount(data.amount2);
      await transferPage.selectFromAccount(data.fromAccount);
      await transferPage.selectToAccount(data.toAccount);
      await transferPage.clickTransfer();

      // Verify insufficient balance error
      await transferPage.verifyInsufficientBalanceError();
    });
  });
});