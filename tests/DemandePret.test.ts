import { test, expect } from '@playwright/test';
import { parse } from 'csv-parse/sync';
import { readFileSync } from 'fs';
import { join } from 'path';
import { LoginPage } from '../pages/LoginPage';
import { RequestLoanPage } from '../pages/RequestLoanPage';
import { parseIterations2 } from '../utils/common';

interface LoginData {
  username: string;
  password: string;
}

interface LoanRequestData {
  Iteration: string;
  IT_Login: string;
  loanAmount: string;
  downPayment: string;
  fromAccount: string;
}

// Load login data from loginData.csv
const loginCsvData = readFileSync(join(__dirname, '../data/loginData.csv'), 'utf8');
const loginRecords = parse(loginCsvData, { columns: true, skip_empty_lines: true }) as LoginData[];

// Load loan request data from DT_DemandePret.csv
const loanCsvData = readFileSync(join(__dirname, '../data/DT_DemandePret.csv'), 'utf8');
const loanRecords = parse(loanCsvData, { columns: true, skip_empty_lines: true }) as LoanRequestData[];

const iterationParam = process.env.ITERATION || "1"; // Default to 1 if not specified
const iterationsToRun = parseIterations2(iterationParam, loanRecords);

test('Request Loan With Login @loanrequestIT', async ({ page }) => {
  for (const index of iterationsToRun) {
    const loanData = loanRecords[index];

    if (!loanData) continue;

    // Use IT_Login column to determine which login to use
    const loginIndex = parseInt(loanData.IT_Login, 10) - 1; // Convert to 0-based index
    const loginData = loginRecords[loginIndex];

    if (!loginData) continue;

    const loginPage = new LoginPage(page);
    const requestLoanPage = new RequestLoanPage(page);

    await test.step(`Iteration ${index + 1}`, async () => {
      console.log(`[ITERATION] ${index + 1}: Running test with user ${loginData.username} (IT_Login=${loanData.IT_Login})`);
    });

    await test.step('Login', async () => {
      // Login
      await loginPage.goto();
      await loginPage.fillUsername(loginData.username);
      await loginPage.fillPassword(loginData.password);
      await loginPage.clickLogin();
      await loginPage.verifyLoginSuccess();
    });

    await test.step('Go to Request Loan', async () => {
      // Go to Request Loan
      await requestLoanPage.gotoRequestLoan();
    });

    await test.step('Fill loan details', async () => {
      // Fill loan details (assuming down payment is 0)
      await requestLoanPage.fillLoanDetails(loanData.loanAmount, loanData.downPayment, loanData.fromAccount);
    });

    await test.step('Click Apply Now', async () => {
      // Click Apply Now
      await requestLoanPage.clickApplyNow();
    });

    await test.step('Verify loan approval', async () => {
      // Verify loan approval
      await requestLoanPage.verifyLoanApproval();
    });
  }
});