import { test, expect } from '@playwright/test';
import { RegistrationPage } from '../pages/RegistrationPage';
import { LoginPage } from '../pages/LoginPage';
import { RandomDataUtil } from '../utils/randomDataGenerator';

test.describe('User Registration and Login with Random Data', () => {
  
  test('Register and login user with random credentials - Test 1', async ({ page }) => {
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
      SSN: '123-45-6789'
    };

    const registrationPage = new RegistrationPage(page);
    const loginPage = new LoginPage(page);

    // === REGISTRATION PHASE ===
    await registrationPage.goto();

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

    await registrationPage.fillLoginInfo(userData.username, userData.password);
    await registrationPage.clickRegister();
    await registrationPage.verifyRegistrationSuccess();

    // Log out after registration
    await registrationPage.clickLogout();

    // === LOGIN PHASE ===
    await loginPage.goto();
    await loginPage.fillUsername(userData.username);
    await loginPage.fillPassword(userData.password);
    await loginPage.clickLogin();
    await loginPage.verifyLoginSuccess();
  });

  test('Register and login user with random credentials - Test 2', async ({ page }) => {
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
      SSN: '123-45-6789'
    };

    const registrationPage = new RegistrationPage(page);
    const loginPage = new LoginPage(page);

    // === REGISTRATION PHASE ===
    await registrationPage.goto();

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

    await registrationPage.fillLoginInfo(userData.username, userData.password);
    await registrationPage.clickRegister();
    await registrationPage.verifyRegistrationSuccess();

    // Log out after registration
    await registrationPage.clickLogout();

    // === LOGIN PHASE ===
    await loginPage.goto();
    await loginPage.fillUsername(userData.username);
    await loginPage.fillPassword(userData.password);
    await loginPage.clickLogin();
    await loginPage.verifyLoginSuccess();
  });

  test('Register and login user with random credentials - Test 3', async ({ page }) => {
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
      SSN: '123-45-6789'
    };

    const registrationPage = new RegistrationPage(page);
    const loginPage = new LoginPage(page);

    // === REGISTRATION PHASE ===
    await registrationPage.goto();

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

    await registrationPage.fillLoginInfo(userData.username, userData.password);
    await registrationPage.clickRegister();
    await registrationPage.verifyRegistrationSuccess();

    // Log out after registration
    await registrationPage.clickLogout();

    // === LOGIN PHASE ===
    await loginPage.goto();
    await loginPage.fillUsername(userData.username);
    await loginPage.fillPassword(userData.password);
    await loginPage.clickLogin();
    await loginPage.verifyLoginSuccess();
  });
});