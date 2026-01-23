import { Page } from '@playwright/test';

export class RequestLoanPage {
  readonly page: Page;

  // Locators
  private readonly requestLoanLink = 'a[href="requestloan.htm"]';
  private readonly loanAmountInput = 'input[name="amount"]';
  private readonly downPaymentInput = 'input[name="downPayment"]';
  private readonly fromAccountSelect = 'select[name="fromAccountId"]';
  private readonly applyNowButton = 'input[type="submit"]';
  private readonly loanRequestApprovedText = 'text=Loan Request Processed';

  constructor(page: Page) {
    this.page = page;
  }

  async gotoRequestLoan() {
    await this.page.click(this.requestLoanLink);
  }

  async fillLoanDetails(amount: string, downPayment: string, fromAccount: string) {
    await this.page.fill(this.loanAmountInput, amount);
    await this.page.fill(this.downPaymentInput, downPayment);
    await this.page.selectOption(this.fromAccountSelect, fromAccount);
  }

  async clickApplyNow() {
    await this.page.click(this.applyNowButton);
  }

  async verifyLoanApproval() {
    await this.page.locator(this.loanRequestApprovedText).waitFor();
  }
}