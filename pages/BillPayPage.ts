import { Page } from '@playwright/test';

export class BillPayPage {
  readonly page: Page;

  // Locators
  private readonly billPayLink = 'a[href="billpay.htm"]';
  private readonly payeeNameInput = 'input[name="payee.name"]';
  private readonly payeeAddressInput = 'input[name="payee.address.street"]';
  private readonly payeeCityInput = 'input[name="payee.address.city"]';
  private readonly payeeStateInput = 'input[name="payee.address.state"]';
  private readonly payeeZipInput = 'input[name="payee.address.zipCode"]';
  private readonly payeePhoneInput = 'input[name="payee.phoneNumber"]';
  private readonly payeeAccountInput = 'input[name="payee.accountNumber"]';
  private readonly verifyAccountInput = 'input[name="verifyAccount"]';
  private readonly amountInput = 'input[name="amount"]';
  private readonly fromAccountSelect = 'select[name="fromAccountId"]';
  private readonly sendPaymentButton = 'input[value="Send Payment"]';
  private readonly billPaymentCompleteText = 'text=Bill Payment Complete';

  constructor(page: Page) {
    this.page = page;
  }

  async gotoBillPay() {
    await this.page.click(this.billPayLink);
  }

  async fillPayeeInfo(name: string, address: string, city: string, state: string, zip: string, phone: string, account: string) {
    await this.page.fill(this.payeeNameInput, name);
    await this.page.fill(this.payeeAddressInput, address);
    await this.page.fill(this.payeeCityInput, city);
    await this.page.fill(this.payeeStateInput, state);
    await this.page.fill(this.payeeZipInput, zip);
    await this.page.fill(this.payeePhoneInput, phone);
    await this.page.fill(this.payeeAccountInput, account);
    await this.page.fill(this.verifyAccountInput, account);
  }

  async fillPaymentInfo(amount: string, fromAccount: string) {
    await this.page.fill(this.amountInput, amount);
    //await this.page.selectOption(this.fromAccountSelect, fromAccount);
    await this.page.selectOption(this.fromAccountSelect, { index: 0}); // Select the first option to trigger any dynamic changes
  }

  async clickSendPayment() {
    await this.page.click(this.sendPaymentButton);
  }

  async verifyBillPaymentSuccess() {
    await this.page.locator(this.billPaymentCompleteText).waitFor();
  }
}