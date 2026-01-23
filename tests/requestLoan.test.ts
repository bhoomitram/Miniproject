import { test, expect } from '@playwright/test';
import { parse } from 'csv-parse/sync';
import { readFileSync } from 'fs';
import { LoginPage } from '../pages/LoginPage';
import { RequestLoanPage } from '../pages/RequestLoanPage';

// Load test data from CSV
const csvData = readFileSync('./data/loanRequestData.csv', 'utf8');
const records = parse(csvData, { columns: true, skip_empty_lines: true });

test.describe('Request Loan', () => {
  records.forEach((data: any) => {
    test(`Request loan for user ${data.username}`, async ({ page }) => {
      const loginPage = new LoginPage(page);
      const requestLoanPage = new RequestLoanPage(page);

      // Login
      await loginPage.goto();
      await loginPage.fillUsername(data.username);
      await loginPage.fillPassword(data.password);
      await loginPage.clickLogin();
      await loginPage.verifyLoginSuccess();

      // Go to Request Loan
      await requestLoanPage.gotoRequestLoan();

      // Fill loan details (assuming down payment is 0)
      await requestLoanPage.fillLoanDetails(data.loanAmount, '0', data.fromAccount);

      // Click Apply Now
      await requestLoanPage.clickApplyNow();

      // Verify loan approval
      await requestLoanPage.verifyLoanApproval();
    });
  });
});