import { Page } from '@playwright/test';

export class RegistrationPage {
  readonly page: Page;

  // Locators
  private readonly firstNameInput = 'input[name="customer.firstName"]';
  private readonly lastNameInput = 'input[name="customer.lastName"]';
  private readonly addressInput = 'input[name="customer.address.street"]';
  private readonly cityInput = 'input[name="customer.address.city"]';
  private readonly stateSelect = 'input[name="customer.address.state"]';
  private readonly zipInput = 'input[id="customer.address.zipCode"]';
  private readonly phoneInput = 'input[name="customer.phoneNumber"]';
  private readonly SSNInput = 'input[id="customer.ssn"]';
  private readonly usernameInput = 'input[name="customer.username"]';
  private readonly passwordInput = 'input[name="customer.password"]';
  private readonly confirmPasswordInput = 'input[name="repeatedPassword"]';
  private readonly registerButton = 'input[value="Register"]';
  private readonly welcomeText = '#rightPanel > h1';

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto('/parabank/register.htm');
  }

  async fillPersonalInfo(firstName: string, lastName: string, address: string, city: string, state: string, zip: string, phone: string, SSN: string) {
    await this.page.fill(this.firstNameInput, firstName);
    await this.page.fill(this.lastNameInput, lastName);
    await this.page.fill(this.addressInput, address);
    await this.page.fill(this.cityInput, city);
    await this.page.fill(this.stateSelect, state);
    await this.page.fill(this.zipInput, zip);
    await this.page.fill(this.phoneInput, phone);
    await this.page.fill(this.SSNInput, "123-45-6789");
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
    await this.page.waitForURL('**/register.htm');
    await this.page.locator(this.welcomeText).waitFor();
  }

  async clickLogout() {
    await this.page.click('a[href="logout.htm"]');
  }
}