import { Page } from '@playwright/test';

export class LoginPage {
  readonly page: Page;

  // Locators
  private readonly usernameInput = 'input[name="username"]';
  private readonly passwordInput = 'input[name="password"]';
  private readonly loginButton = 'input[type="submit"]';
  private readonly accountsOverviewTitle = 'h1.title';

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto('/parabank/index.htm');
  }

  async fillUsername(username: string) {
    await this.page.fill(this.usernameInput, username);
  }

  async fillPassword(password: string) {
    await this.page.fill(this.passwordInput, password);
  }

  async clickLogin() {
    await this.page.click(this.loginButton);
  }

  async verifyLoginSuccess() {
    await this.page.waitForURL('**/overview.htm');
    await this.page.locator(this.accountsOverviewTitle).waitFor();
  }
}