import { Page } from '@playwright/test';

export class TransferPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async gotoTransferFunds() {
    await this.page.click('a[href="transfer.htm"]');
  }

  async fillAmount(amount: string) {
    await this.page.fill('input[name="input"]', amount);
  }

  async selectFromAccount(fromAccount: string) {
    await this.page.selectOption('select[name="fromAccountId"]', fromAccount);
  }

  async selectToAccount(toAccount: string) {
    await this.page.selectOption('select[name="toAccountId"]', toAccount);
  }

  async clickTransfer() {
    await this.page.click('input[type="submit"]');
  }

  async verifyTransferSuccess() {
    await this.page.locator('text=Transfer Complete!').waitFor();
  }
}