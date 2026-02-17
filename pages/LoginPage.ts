import { Page } from '@playwright/test';

export class LoginPage {
  readonly page: Page;

  // Locators
  private readonly usernameInput = 'input[name="username"]';
  private readonly passwordInput = 'input[name="password"]';
  private readonly loginButton = 'input[type="submit"]';
  private readonly logoutButton = 'a[href="logout.htm"]';
  private readonly accountsOverviewTitle = '#showOverview > h1';

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto('/parabank/index.htm', {
    timeout: 60000 // 60 seconds
    });
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

  async clickLogout() {
    await this.page.click(this.logoutButton);
  }
}