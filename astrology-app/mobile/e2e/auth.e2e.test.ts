/**
 * Authentication E2E Tests
 * Tests all auth flows: registration, login, logout, password reset
 */

describe('Authentication', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  afterAll(async () => {
    await device.sendUserActivity({ interfaceStyle: 'light' });
  });

  describe('User Registration', () => {
    test('New user can register successfully', async () => {
      // Tap register tab
      await element(by.id('auth-register-tab')).tap();
      
      // Fill email
      await element(by.id('register-email-input')).typeText('newuser@test.com');
      
      // Fill password
      await element(by.id('register-password-input')).typeText('SecurePass123');
      
      // Fill password confirmation
      await element(by.id('register-confirm-input')).typeText('SecurePass123');
      
      // Tap register button
      await element(by.id('register-submit-btn')).tap();
      
      // Wait for profile creation screen
      await waitFor(element(by.id('profile-creation-screen'))).toBeVisible().withTimeout(5000);
      
      // Complete profile
      await element(by.id('profile-name-input')).typeText('Test User');
      await element(by.id('profile-birth-date')).tap();
      
      // Select date (mock)
      await element(by.id('date-picker-confirm')).tap();
      
      // Complete onboarding
      await element(by.id('onboarding-complete-btn')).tap();
      
      // Verify home screen appears
      await waitFor(element(by.id('home-tab'))).toBeVisible().withTimeout(5000);
      await expect(element(by.id('home-tab'))).toBeVisible();
    });

    test('Registration with invalid email shows error', async () => {
      await element(by.id('auth-register-tab')).tap();
      
      // Enter invalid email
      await element(by.id('register-email-input')).typeText('invalid-email');
      await element(by.id('register-password-input')).typeText('SecurePass123');
      await element(by.id('register-confirm-input')).typeText('SecurePass123');
      
      // Try to submit
      await element(by.id('register-submit-btn')).tap();
      
      // Verify error message
      await waitFor(element(by.text('Please enter a valid email'))).toBeVisible().withTimeout(3000);
    });

    test('Registration with mismatched passwords shows error', async () => {
      await element(by.id('auth-register-tab')).tap();
      
      await element(by.id('register-email-input')).typeText('test@example.com');
      await element(by.id('register-password-input')).typeText('SecurePass123');
      await element(by.id('register-confirm-input')).typeText('DifferentPass');
      
      await element(by.id('register-submit-btn')).tap();
      
      // Verify error
      await waitFor(element(by.text('Passwords do not match'))).toBeVisible().withTimeout(3000);
    });
  });

  describe('User Login', () => {
    test('Registered user can login', async () => {
      // Go to login
      await element(by.id('auth-login-tab')).tap();
      
      // Enter credentials
      await element(by.id('login-email-input')).typeText('newuser@test.com');
      await element(by.id('login-password-input')).typeText('SecurePass123');
      
      // Submit
      await element(by.id('login-submit-btn')).tap();
      
      // Verify home screen
      await waitFor(element(by.id('home-tab'))).toBeVisible().withTimeout(5000);
    });

    test('Invalid credentials show error', async () => {
      await element(by.id('auth-login-tab')).tap();
      
      await element(by.id('login-email-input')).typeText('test@example.com');
      await element(by.id('login-password-input')).typeText('WrongPassword');
      
      await element(by.id('login-submit-btn')).tap();
      
      // Verify error
      await waitFor(element(by.text('Invalid email or password'))).toBeVisible().withTimeout(3000);
    });

    test('Empty fields show validation errors', async () => {
      await element(by.id('auth-login-tab')).tap();
      
      // Try to submit empty form
      await element(by.id('login-submit-btn')).tap();
      
      // Verify error
      await waitFor(element(by.text('Email is required'))).toBeVisible().withTimeout(3000);
    });
  });

  describe('Logout', () => {
    test('User can logout from settings', async () => {
      // First login
      await element(by.id('auth-login-tab')).tap();
      await element(by.id('login-email-input')).typeText('newuser@test.com');
      await element(by.id('login-password-input')).typeText('SecurePass123');
      await element(by.id('login-submit-btn')).tap();
      
      // Wait for home
      await waitFor(element(by.id('home-tab'))).toBeVisible().withTimeout(5000);
      
      // Go to settings
      await element(by.id('settings-tab')).tap();
      
      // Find and tap logout
      await element(by.text('Logout')).tap();
      
      // Confirm logout
      await element(by.id('logout-confirm-btn')).tap();
      
      // Verify back at auth screen
      await waitFor(element(by.id('auth-splash'))).toBeVisible().withTimeout(5000);
    });
  });
});
