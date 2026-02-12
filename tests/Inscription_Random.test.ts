/////////////////////////////////////////////////////////////////////////
import { test, expect } from '@playwright/test';
import { RegistrationPage } from '../pages/RegistrationPage';
import { RandomDataUtil } from '../utils/randomDataGenerator';
import { LoginPage } from '../pages/LoginPage';

// Read iteration count from environment variable `ITERATION` (defaults to 1)
const ITERATIONS = (() => {
  const raw = process.env.ITERATION ?? '1';
  const n = parseInt(raw, 10);
  return Number.isInteger(n) && n > 0 ? n : 1;
})();
////////////////////////////////////////////////////////////////////////


// Run the test with multiple iterations using ITERATION
test(`Register user with random data based on N iterations @simpleregrandomIT`, async ({ page }) => {
  for (let i = 0; i < ITERATIONS; i++) {
    const registrationPage = new RegistrationPage(page);
    const loginPage = new LoginPage(page);
    
    // Generate random data

    const userData = {
      firstName: RandomDataUtil.getFirstName(),
      lastName: RandomDataUtil.getlastName(),
      address: RandomDataUtil.getRandomAddress(),
      city: RandomDataUtil.getRandomCity(),
      state: RandomDataUtil.getRandomState(),
      zip: RandomDataUtil.getRandomPin(),
      phone: RandomDataUtil.getPhoneNumber(),
      username: RandomDataUtil.getUsername(),
      password: RandomDataUtil.getRandomPassword(12),
      SSN: RandomDataUtil.getRandomNumeric(6)
    };

    await test.step(`====== Iteration ${i + 1}: Running test with user (${userData.username}) ${userData.firstName} ${userData.lastName}`, async () => {
      console.log(`[ITERATION] ${i + 1}: Running test with user (${userData.username}) ${userData.firstName} ${userData.lastName}`);
    });

    // Navigate to registration page
    await registrationPage.goto();

    // Fill personal information
    await registrationPage.fillPersonalInfo(
      userData.firstName,
      userData.lastName,
      userData.address,
      userData.city,
      userData.state,
      userData.zip,
      userData.phone,
      userData.SSN
    );

    // Fill login information
    await test.step('Fill login information', async () => { 
      await registrationPage.fillLoginInfo(userData.username, userData.password);
    });
    // Click Register
    await registrationPage.clickRegister();

    // Verify registration success
    await registrationPage.verifyRegistrationSuccess();

        // Log out after registration
    await registrationPage.clickLogout();

    // === LOGIN PHASE ===
    await loginPage.goto();
    await loginPage.fillUsername(userData.username);
    await loginPage.fillPassword(userData.password);
    await loginPage.clickLogin();
    await loginPage.verifyLoginSuccess();
  }
});