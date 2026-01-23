import { Page } from '@playwright/test';

export class LoginPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto('/parabank/index.htm');
  }

  async fillUsername(username: string) {
    await this.page.fill('input[name="username"]', username);
  }

  async fillPassword(password: string) {
    await this.page.fill('input[name="password"]', password);
  }

  async clickLogin() {
    await this.page.click('input[type="submit"]');
  }

  async verifyLoginSuccess() {
    await this.page.waitForURL('**/overview.htm');
    await this.page.locator('h1.title').waitFor();
  }
}