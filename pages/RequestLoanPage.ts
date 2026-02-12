import { Page } from '@playwright/test';

export class RequestLoanPage {
  readonly page: Page;

  // Locators
  private readonly requestLoanLink = 'a[href="requestloan.htm"]';
  private readonly loanAmountInput = 'input[id="amount"]';
  private readonly downPaymentInput = '#downPayment';
  private readonly fromAccountSelect = '#fromAccountId';
  private readonly applyNowButton = '//input[@value="Apply Now"]';
  private readonly loanRequestApprovedText = '//td[@id="loanStatus" and normalize-space(text())="Approved"]';

  constructor(page: Page) {
    this.page = page;
  }

  async gotoRequestLoan() {
    await this.page.click(this.requestLoanLink);
  }

  async fillLoanDetails(amount: string, downPayment: string, fromAccount: string) {
    await this.page.fill(this.loanAmountInput, amount);
    await this.page.fill(this.downPaymentInput, downPayment);
    //await this.page.selectOption(this.fromAccountSelect, fromAccount);
    await this.page.selectOption(this.fromAccountSelect, { index: 0}); // Select the first account for simplicity });
  }

  async clickApplyNow() {
    await this.page.click(this.applyNowButton);
  }

  async verifyLoanApproval() {
    await this.page.locator(this.loanRequestApprovedText).waitFor();
  }
}