import { Page } from '@playwright/test';

export class TransferPage {
  readonly page: Page;

  // Locators
  private readonly transferFundsLink = 'a[href="transfer.htm"]';
  private readonly amountInput = 'input[name="input"]';
  private readonly fromAccountSelect = 'select[id="fromAccountId"]';
  private readonly toAccountSelect = 'select[id="toAccountId"]';
  private readonly transferButton = 'input[type="submit"]';
  private readonly transferCompleteText = 'text=Transfer Complete!';
  private readonly errorMessage = 'text=The amount cannot exceed the balance';
  private readonly accountsOverviewLink = 'a[href="overview.htm"]';
  private readonly OpenNewAccountLink = 'a[href="openaccount.htm"]';
  private readonly OpenNewAccountButton = 'input[type="button"][value="Open New Account"]';

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
    //await this.page.selectOption(this.fromAccountSelect, fromAccount);
    await this.page.selectOption(this.fromAccountSelect, { index: 0 }); // Select the first option to trigger any dynamic changes
  }

  async selectToAccount(toAccount: string) {
    //await this.page.selectOption(this.toAccountSelect, toAccount);
    await this.page.selectOption(this.toAccountSelect, { index: 1 }); // Select the first option to trigger any dynamic changes
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

  async gotoOpenNewAccountAndOpen() {
    await this.page.click(this.OpenNewAccountLink);
    await this.page.click(this.OpenNewAccountButton);
    await this.page.locator('text=Account Opened').waitFor();
  }


  
}