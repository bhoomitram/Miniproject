import { test, expect } from '@playwright/test';
import { parse } from 'csv-parse/sync';
import { readFileSync } from 'fs';
import { LoginPage } from '../pages/LoginPage';
import { BillPayPage } from '../pages/BillPayPage';

// Load test data from CSV
const csvData = readFileSync('./data/billPayData.csv', 'utf8');
const records = parse(csvData, { columns: true, skip_empty_lines: true });

test.describe('Bill Pay', () => {
  records.forEach((data: any) => {
    test(`Bill pay for user ${data.username}`, async ({ page }) => {
      const loginPage = new LoginPage(page);
      const billPayPage = new BillPayPage(page);

      // Login
      await loginPage.goto();
      await loginPage.fillUsername(data.username);
      await loginPage.fillPassword(data.password);
      await loginPage.clickLogin();
      await loginPage.verifyLoginSuccess();

      // Go to Bill Pay
      await billPayPage.gotoBillPay();

      // Parse address: assuming format "street, city, state zip"
      const addressParts = data.payeeAddress.split(', ');
      const street = addressParts[0];
      const city = addressParts[1];
      const stateZip = addressParts[2].split(' ');
      const state = stateZip[0];
      const zip = stateZip[1];

      // Fill payee info
      await billPayPage.fillPayeeInfo(
        data.payeeName,
        street,
        city,
        state,
        zip,
        '', // phone not provided
        data.payeeAccount
      );

      // Fill payment info
      await billPayPage.fillPaymentInfo(data.amount, data.fromAccount);

      // Click Send Payment
      await billPayPage.clickSendPayment();

      // Verify bill payment success
      await billPayPage.verifyBillPaymentSuccess();
    });
  });
});