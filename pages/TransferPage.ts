import { Page } from '@playwright/test';

export class TransferPage {
  readonly page: Page;

  // Locators
  private readonly transferFundsLink = 'a[href="transfer.htm"]';
  private readonly amountInput = 'input[name="input"]';
  private readonly fromAccountSelect = 'select[name="fromAccountId"]';
  private readonly toAccountSelect = 'select[name="toAccountId"]';
  private readonly transferButton = 'input[type="submit"]';
  private readonly transferCompleteText = 'text=Transfer Complete!';
  private readonly errorMessage = 'text=The amount cannot exceed the balance';
  private readonly accountsOverviewLink = 'a[href="overview.htm"]';

  constructor(page: Page) {
    this.page = page;
  }

  async gotoTransferFunds() {
    await this.page.click(this.transferFundsLink);
  }

  async fillAmount(amount: string) {
    await this.page.fill(this.amountInput, amount);
  }

  async selectFromAccount(fromAccount: string) {
    await this.page.selectOption(this.fromAccountSelect, fromAccount);
  }

  async selectToAccount(toAccount: string) {
    await this.page.selectOption(this.toAccountSelect, toAccount);
  }

  async clickTransfer() {
    await this.page.click(this.transferButton);
  }

  async verifyTransferSuccess() {
    await this.page.locator(this.transferCompleteText).waitFor();
  }

  async verifyInsufficientBalanceError() {
    await this.page.locator(this.errorMessage).waitFor();
  }

  async gotoAccountsOverview() {
    await this.page.click(this.accountsOverviewLink);
  }

  async getAccountBalance(accountNumber: string): Promise<string> {
    // Assuming the balance is in a table cell next to the account number
    const balanceLocator = this.page.locator(`td:has-text("${accountNumber}") + td`);
    return await balanceLocator.textContent() || '';
  }
}