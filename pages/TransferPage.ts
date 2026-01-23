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
}