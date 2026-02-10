import { test, expect } from '@playwright/test';
import { RegistrationPage } from '../pages/RegistrationPage';
import { RandomDataUtil } from '../utils/randomDataGenerator';

// Read iteration count from environment variable `ITERATION` (defaults to 1)
const ITERATION = (() => {
  const raw = process.env.ITERATION ?? '1';
  const n = parseInt(raw, 10);
  return Number.isInteger(n) && n > 0 ? n : 1;
})();

// Run the test with multiple iterations using ITERATION
test(`Register user with random data @simpleregrandomIT`, async ({ page }) => {
  for (let i = 0; i < ITERATION; i++) {
    const registrationPage = new RegistrationPage(page);

    // Generate random data
    const firstName = RandomDataUtil.getFirstName();
    const lastName = RandomDataUtil.getlastName();
    const address = RandomDataUtil.getRandomAddress();
    const city = RandomDataUtil.getRandomCity();
    const state = RandomDataUtil.getRandomState();
    const zip = RandomDataUtil.getRandomPin();
    const phone = RandomDataUtil.getPhoneNumber();
    const SSN = RandomDataUtil.getRandomNumeric(6);
    const username = RandomDataUtil.getUsername();
    const password = RandomDataUtil.getRandomPassword(12); // Generate a 12-character password

    // Navigate to registration page
    await registrationPage.goto();

    // Fill personal information
    await registrationPage.fillPersonalInfo(
      firstName,
      lastName,
      address,
      city,
      state,
      zip,
      phone,
      SSN
    );

    // Fill login information
    await registrationPage.fillLoginInfo(username, password);

    // Click Register
    await registrationPage.clickRegister();

    // Verify registration success
    await registrationPage.verifyRegistrationSuccess();
  }
});