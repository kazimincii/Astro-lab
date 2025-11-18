/**
 * Features & Navigation E2E Tests
 * Tests all app features and navigation flow
 */

describe('App Features & Navigation', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  describe('Today Tab - Daily Horoscope', () => {
    test('Daily horoscope displays correctly', async () => {
      // Login
      await element(by.id('auth-login-tab')).tap();
      await element(by.id('login-email-input')).typeText('testuser@example.com');
      await element(by.id('login-password-input')).typeText('TestPass123');
      await element(by.id('login-submit-btn')).tap();

      // Navigate to Today
      await element(by.id('today-tab')).tap();

      // Verify horoscope content
      await expect(element(by.id('horoscope-card'))).toBeVisible();
      await expect(element(by.id('zodiac-sign'))).toBeVisible();
      await expect(element(by.id('horoscope-text'))).toBeVisible();
      await expect(element(by.id('lucky-numbers'))).toBeVisible();
    });

    test('Moon phase widget shows correctly', async () => {
      await element(by.id('today-tab')).tap();

      // Verify moon phase
      await expect(element(by.id('moon-phase-card'))).toBeVisible();
      await expect(element(by.id('moon-phase-emoji'))).toBeVisible();
      await expect(element(by.id('moon-illumination'))).toBeVisible();
    });

    test('Biorhythm chart displays', async () => {
      await element(by.id('today-tab')).tap();

      // Scroll to biorhythm
      await scrollTo('biorhythm-section');

      // Verify chart
      await expect(element(by.id('biorhythm-chart'))).toBeVisible();
      await expect(element(by.id('physical-line'))).toBeVisible();
      await expect(element(by.id('emotional-line'))).toBeVisible();
      await expect(element(by.id('intellectual-line'))).toBeVisible();
    });
  });

  describe('Explore Tab - Features Navigation', () => {
    test('User can navigate all explore screens', async () => {
      await element(by.id('explore-tab')).tap();

      // Test each feature screen
      const screens = [
        'today-horoscope-btn',
        'birth-chart-btn',
        'tarot-btn',
        'numerology-btn',
        'chakras-btn',
        'education-btn',
      ];

      for (const screenId of screens) {
        await element(by.id(screenId)).tap();

        // Wait for screen to load
        await waitFor(element(by.id(`${screenId}-content`))).toBeVisible().withTimeout(3000);

        // Go back
        await element(by.id('back-btn')).tap();
      }
    });

    test('Birth Chart analysis works', async () => {
      await element(by.id('explore-tab')).tap();
      await element(by.id('birth-chart-btn')).tap();

      // Verify chart components
      await expect(element(by.id('chart-visualization'))).toBeVisible();
      await expect(element(by.id('sun-sign'))).toBeVisible();
      await expect(element(by.id('moon-sign'))).toBeVisible();
      await expect(element(by.id('rising-sign'))).toBeVisible();

      // Scroll to detailed analysis
      await scrollTo('detailed-analysis');
      await expect(element(by.id('planets-positions'))).toBeVisible();
      await expect(element(by.id('house-analysis'))).toBeVisible();
    });

    test('Tarot reading flow', async () => {
      await element(by.id('explore-tab')).tap();
      await element(by.id('tarot-btn')).tap();

      // Draw cards button
      await element(by.id('draw-cards-btn')).tap();

      // Wait for card animation
      await waitFor(element(by.id('card-1'))).toBeVisible().withTimeout(2000);
      await waitFor(element(by.id('card-2'))).toBeVisible().withTimeout(2000);
      await waitFor(element(by.id('card-3'))).toBeVisible().withTimeout(2000);

      // Verify interpretation
      await expect(element(by.id('tarot-interpretation'))).toBeVisible();

      // Draw again
      await element(by.id('draw-cards-btn')).tap();
      
      // Should show new cards
      await waitFor(element(by.id('card-1-new'))).toBeVisible().withTimeout(2000);
    });
  });

  describe('Profiles Management', () => {
    test('User can create multiple profiles', async () => {
      // Navigate to profiles
      await element(by.id('profiles-tab')).tap();

      // Create first profile
      await element(by.id('add-profile-btn')).tap();
      await element(by.id('profile-name-input')).typeText('John Doe');
      await element(by.id('profile-date-input')).tap();
      // ... date selection
      await element(by.id('profile-location-input')).typeText('New York');
      await element(by.id('create-profile-btn')).tap();

      // Wait for profile creation
      await waitFor(element(by.id('profile-card-John Doe'))).toBeVisible().withTimeout(3000);

      // Create second profile
      await element(by.id('add-profile-btn')).tap();
      await element(by.id('profile-name-input')).typeText('Jane Doe');
      await element(by.id('profile-date-input')).tap();
      // ... date selection
      await element(by.id('profile-location-input')).typeText('Los Angeles');
      await element(by.id('create-profile-btn')).tap();

      // Verify both profiles visible
      await expect(element(by.id('profile-card-John Doe'))).toBeVisible();
      await expect(element(by.id('profile-card-Jane Doe'))).toBeVisible();
    });

    test('User can switch profiles', async () => {
      await element(by.id('profiles-tab')).tap();

      // Select first profile
      await element(by.id('profile-card-John Doe')).tap();

      // Go to today and verify zodiac
      await element(by.id('today-tab')).tap();
      await expect(element(by.id('zodiac-sign'))).toHaveText(/Taurus|Gemini|Cancer/);

      // Switch profile
      await element(by.id('profiles-tab')).tap();
      await element(by.id('profile-card-Jane Doe')).tap();

      // Go to today and verify different zodiac
      await element(by.id('today-tab')).tap();
      await expect(element(by.id('zodiac-sign'))).not.toHaveText(/Taurus|Gemini|Cancer/);
    });
  });

  describe('Settings', () => {
    test('User can change language', async () => {
      await element(by.id('settings-tab')).tap();

      // Open language settings
      await element(by.text('Language')).tap();

      // Change to Turkish
      await element(by.text('Turkish')).tap();

      // Verify language changed
      await waitFor(element(by.text('Bugün'))).toBeVisible().withTimeout(2000);
    });

    test('User can toggle dark mode', async () => {
      await element(by.id('settings-tab')).tap();

      // Find theme toggle
      await element(by.id('dark-mode-toggle')).tap();

      // Verify theme changed (check background color)
      await expect(element(by.id('app-background'))).toHaveToggleValue(true);
    });

    test('User can view privacy policy and terms', async () => {
      await element(by.id('settings-tab')).tap();

      // Open privacy policy
      await element(by.text('Privacy Policy')).tap();
      await expect(element(by.id('privacy-policy-content'))).toBeVisible();

      // Go back
      await element(by.id('back-btn')).tap();

      // Open terms
      await element(by.text('Terms of Service')).tap();
      await expect(element(by.id('terms-content'))).toBeVisible();
    });
  });

  describe('Deep Linking', () => {
    test('Deep link to horoscope works', async () => {
      // Open via deep link
      await device.openURL({ url: 'astroapp://horoscope' });

      // Verify horoscope screen appears
      await waitFor(element(by.id('horoscope-screen'))).toBeVisible().withTimeout(3000);
    });

    test('Deep link to birth chart works', async () => {
      await device.openURL({ url: 'astroapp://birth-chart' });
      await waitFor(element(by.id('birth-chart-screen'))).toBeVisible().withTimeout(3000);
    });

    test('Deep link with profile parameter works', async () => {
      await device.openURL({ 
        url: 'astroapp://profile/john-doe-123' 
      });

      // Verify profile screen appears with correct profile
      await waitFor(element(by.id('profile-detail-screen'))).toBeVisible().withTimeout(3000);
      await expect(element(by.id('profile-name'))).toHaveText('John Doe');
    });
  });

  describe('Error Handling', () => {
    test('Network error shows retry option', async () => {
      // Simulate network error
      await device.setAirplaneMode(true);

      await element(by.id('today-tab')).tap();
      
      // Horoscope loading should fail
      await waitFor(element(by.id('network-error-message'))).toBeVisible().withTimeout(3000);
      await expect(element(by.id('retry-btn'))).toBeVisible();

      // Re-enable network
      await device.setAirplaneMode(false);

      // Retry should work
      await element(by.id('retry-btn')).tap();
      await waitFor(element(by.id('horoscope-card'))).toBeVisible().withTimeout(5000);
    });

    test('Session expiration shows login prompt', async () => {
      // This would require mocking session expiration
      // Implement based on your app's session handling

      await element(by.id('explore-tab')).tap();
      await element(by.id('birth-chart-btn')).tap();

      // Simulate session expiration
      // ... (implementation depends on app architecture)

      // Should show login prompt
      await waitFor(element(by.id('session-expired-modal'))).toBeVisible().withTimeout(3000);
      await element(by.id('login-again-btn')).tap();

      // Verify auth screen appears
      await waitFor(element(by.id('auth-splash'))).toBeVisible().withTimeout(3000);
    });
  });
});
