import { Page } from '@playwright/test';

export class RegistrationPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto('/parabank/register.htm');
  }

  async fillPersonalInfo(firstName: string, lastName: string, address: string, city: string, state: string, zip: string, phone: string) {
    await this.page.fill('input[name="customer.firstName"]', firstName);
    await this.page.fill('input[name="customer.lastName"]', lastName);
    await this.page.fill('input[name="customer.address.street"]', address);
    await this.page.fill('input[name="customer.address.city"]', city);
    await this.page.selectOption('select[name="customer.address.state"]', state);
    await this.page.fill('input[name="customer.address.zip"]', zip);
    await this.page.fill('input[name="customer.phoneNumber"]', phone);
  }

  async fillLoginInfo(username: string, password: string) {
    await this.page.fill('input[name="customer.username"]', username);
    await this.page.fill('input[name="customer.password"]', password);
    await this.page.fill('input[name="repeatedPassword"]', password);
  }

  async clickRegister() {
    await this.page.click('input[type="submit"]');
  }

  async verifyRegistrationSuccess() {
    await this.page.waitForURL('**/login.htm');
    await this.page.locator('text=Welcome').waitFor();
  }
}