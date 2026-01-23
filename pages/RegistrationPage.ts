import { Page } from '@playwright/test';

export class RegistrationPage {
  readonly page: Page;

  // Locators
  private readonly firstNameInput = 'input[name="customer.firstName"]';
  private readonly lastNameInput = 'input[name="customer.lastName"]';
  private readonly addressInput = 'input[name="customer.address.street"]';
  private readonly cityInput = 'input[name="customer.address.city"]';
  private readonly stateSelect = 'select[name="customer.address.state"]';
  private readonly zipInput = 'input[name="customer.address.zip"]';
  private readonly phoneInput = 'input[name="customer.phoneNumber"]';
  private readonly usernameInput = 'input[name="customer.username"]';
  private readonly passwordInput = 'input[name="customer.password"]';
  private readonly confirmPasswordInput = 'input[name="repeatedPassword"]';
  private readonly registerButton = 'input[type="submit"]';
  private readonly welcomeText = 'text=Welcome';

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto('/parabank/register.htm');
  }

  async fillPersonalInfo(firstName: string, lastName: string, address: string, city: string, state: string, zip: string, phone: string) {
    await this.page.fill(this.firstNameInput, firstName);
    await this.page.fill(this.lastNameInput, lastName);
    await this.page.fill(this.addressInput, address);
    await this.page.fill(this.cityInput, city);
    await this.page.selectOption(this.stateSelect, state);
    await this.page.fill(this.zipInput, zip);
    await this.page.fill(this.phoneInput, phone);
  }

  async fillLoginInfo(username: string, password: string) {
    await this.page.fill(this.usernameInput, username);
    await this.page.fill(this.passwordInput, password);
    await this.page.fill(this.confirmPasswordInput, password);
  }

  async clickRegister() {
    await this.page.click(this.registerButton);
  }

  async verifyRegistrationSuccess() {
    await this.page.waitForURL('**/login.htm');
    await this.page.locator(this.welcomeText).waitFor();
  }
}