import { test, expect } from '@playwright/test';
import { RegistrationPage } from '../pages/RegistrationPage';
import { RandomDataUtil } from '../utils/randomDataGenerator';

test.describe('User Registration with Random Data @simpleranreg', () => {
  // Run the test multiple times with different random data
  for (let i = 0; i < 1; i++) {
    test(`Register user with random data - Iteration ${i + 1}`, async ({ page }) => {
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
    });
  }
});