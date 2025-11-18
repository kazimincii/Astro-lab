/**
 * Subscription & Premium Features E2E Tests
 * Tests: trial activation, plan upgrade, payment processing, premium features
 */

describe('Subscription & Premium Features', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  describe('Trial Management', () => {
    test('User can start free trial', async () => {
      // Login to app
      await element(by.id('auth-login-tab')).tap();
      await element(by.id('login-email-input')).typeText('testuser@example.com');
      await element(by.id('login-password-input')).typeText('TestPass123');
      await element(by.id('login-submit-btn')).tap();

      // Navigate to plans
      await element(by.id('plans-tab')).tap();
      
      // Start trial
      await element(by.text('Start 7-Day Free Trial')).tap();
      
      // Confirm trial
      await element(by.id('trial-confirm-btn')).tap();
      
      // Verify trial active status
      await waitFor(element(by.text('Trial Active'))).toBeVisible().withTimeout(3000);
      await expect(element(by.text('7 days remaining'))).toBeVisible();
    });

    test('Trial countdown displays correctly', async () => {
      // Login and start trial
      await element(by.id('auth-login-tab')).tap();
      await element(by.id('login-email-input')).typeText('testuser@example.com');
      await element(by.id('login-password-input')).typeText('TestPass123');
      await element(by.id('login-submit-btn')).tap();

      await element(by.id('plans-tab')).tap();
      await element(by.text('Start 7-Day Free Trial')).tap();
      await element(by.id('trial-confirm-btn')).tap();

      // Navigate to settings to see trial info
      await element(by.id('settings-tab')).tap();
      
      // Verify countdown visible
      await expect(element(by.id('trial-countdown'))).toBeVisible();
      await expect(element(by.text(/\d+ days? remaining/))).toBeVisible();
    });
  });

  describe('Plan Upgrade', () => {
    test('User can upgrade to Premium', async () => {
      // Login
      await element(by.id('auth-login-tab')).tap();
      await element(by.id('login-email-input')).typeText('testuser@example.com');
      await element(by.id('login-password-input')).typeText('TestPass123');
      await element(by.id('login-submit-btn')).tap();

      // Navigate to plans
      await element(by.id('plans-tab')).tap();
      
      // Select Premium plan
      await element(by.id('premium-plan-card')).tap();
      
      // Tap upgrade
      await element(by.text('Upgrade to Premium')).tap();
      
      // Payment sheet should appear
      await waitFor(element(by.id('payment-sheet'))).toBeVisible().withTimeout(3000);
      
      // Enter test card details
      await element(by.id('card-number-input')).typeText('4242424242424242');
      await element(by.id('card-expiry-input')).typeText('1225');
      await element(by.id('card-cvc-input')).typeText('123');
      
      // Complete payment
      await element(by.id('payment-submit-btn')).tap();
      
      // Verify upgrade success
      await waitFor(element(by.text('Premium Unlocked'))).toBeVisible().withTimeout(5000);
    });

    test('Failed payment shows error', async () => {
      await element(by.id('auth-login-tab')).tap();
      await element(by.id('login-email-input')).typeText('testuser@example.com');
      await element(by.id('login-password-input')).typeText('TestPass123');
      await element(by.id('login-submit-btn')).tap();

      await element(by.id('plans-tab')).tap();
      await element(by.id('premium-plan-card')).tap();
      await element(by.text('Upgrade to Premium')).tap();

      // Enter invalid card
      await waitFor(element(by.id('payment-sheet'))).toBeVisible().withTimeout(3000);
      await element(by.id('card-number-input')).typeText('4000000000000002');
      await element(by.id('card-expiry-input')).typeText('1225');
      await element(by.id('card-cvc-input')).typeText('123');

      await element(by.id('payment-submit-btn')).tap();

      // Verify error message
      await waitFor(element(by.text(/Payment failed|Card declined/))).toBeVisible().withTimeout(3000);
    });
  });

  describe('Premium Actions Limit', () => {
    test('Free user hits action limit', async () => {
      // Login
      await element(by.id('auth-login-tab')).tap();
      await element(by.id('login-email-input')).typeText('freeuser@example.com');
      await element(by.id('login-password-input')).typeText('TestPass123');
      await element(by.id('login-submit-btn')).tap();

      // Try to use premium action (e.g., generate birth chart)
      await element(by.id('explore-tab')).tap();
      await element(by.id('birth-chart-btn')).tap();

      // First action should work
      await waitFor(element(by.id('birth-chart-loader'))).toBeVisible().withTimeout(2000);
      await element(by.id('birth-chart-loader')).waitForRemoved(withTimeout(5000));

      // Go back and try again
      await element(by.id('back-btn')).tap();
      await element(by.id('birth-chart-btn')).tap();

      // Second action should show upgrade screen
      await waitFor(element(by.text('Premium Feature'))).toBeVisible().withTimeout(2000);
      await expect(element(by.text('Upgrade to unlock unlimited access'))).toBeVisible();
    });

    test('Premium user has unlimited actions', async () => {
      // Login with premium account
      await element(by.id('auth-login-tab')).tap();
      await element(by.id('login-email-input')).typeText('premiumuser@example.com');
      await element(by.id('login-password-input')).typeText('TestPass123');
      await element(by.id('login-submit-btn')).tap();

      // Access premium features multiple times
      for (let i = 0; i < 5; i++) {
        await element(by.id('explore-tab')).tap();
        await element(by.id('birth-chart-btn')).tap();

        // Should load successfully
        await waitFor(element(by.id('birth-chart-loader'))).toBeVisible().withTimeout(2000);
        await element(by.id('birth-chart-loader')).waitForRemoved(withTimeout(5000));

        // Should show chart (not upgrade screen)
        await expect(element(by.id('birth-chart-content'))).toBeVisible();

        // Go back for next iteration
        await element(by.id('back-btn')).tap();
      }

      // All iterations should succeed
      await expect(element(by.id('explore-tab'))).toBeVisible();
    });
  });

  describe('Billing & Account', () => {
    test('User can view billing details', async () => {
      await element(by.id('auth-login-tab')).tap();
      await element(by.id('login-email-input')).typeText('premiumuser@example.com');
      await element(by.id('login-password-input')).typeText('TestPass123');
      await element(by.id('login-submit-btn')).tap();

      // Go to settings
      await element(by.id('settings-tab')).tap();
      
      // Open billing section
      await element(by.text('Billing')).tap();
      
      // Verify billing info visible
      await expect(element(by.id('subscription-status'))).toBeVisible();
      await expect(element(by.text(/Premium|Active/))).toBeVisible();
    });

    test('User can cancel subscription', async () => {
      await element(by.id('auth-login-tab')).tap();
      await element(by.id('login-email-input')).typeText('premiumuser@example.com');
      await element(by.id('login-password-input')).typeText('TestPass123');
      await element(by.id('login-submit-btn')).tap();

      await element(by.id('settings-tab')).tap();
      await element(by.text('Billing')).tap();

      // Find cancel button
      await scrollTo('bottom');
      await element(by.text('Cancel Subscription')).tap();

      // Confirm cancellation
      await element(by.id('cancel-confirm-btn')).tap();

      // Verify cancellation
      await waitFor(element(by.text('Subscription Cancelled'))).toBeVisible().withTimeout(3000);
    });
  });
});
