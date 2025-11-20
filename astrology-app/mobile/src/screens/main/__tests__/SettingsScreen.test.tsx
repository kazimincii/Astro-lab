import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import SettingsScreen from '../SettingsScreen';
import { useAuthStore } from '@/store/authStore';

// Mock useAuthStore
jest.mock('@/store/authStore');

// Mock i18n
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('SettingsScreen', () => {
  const mockLogout = jest.fn();
  const mockUser = {
    id: 'user-123',
    email: 'john.doe@example.com',
    name: 'John Doe',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useAuthStore as unknown as jest.Mock).mockImplementation((selector) =>
      selector({
        logout: mockLogout,
        user: mockUser,
      }),
    );
  });

  describe('Rendering', () => {
    it('should render the settings screen', () => {
      const { getByText } = render(<SettingsScreen />);

      expect(getByText('screens.settings.title')).toBeDefined();
      expect(getByText('screens.settings.account.title')).toBeDefined();
    });

    it('should display user email', () => {
      const { getByText } = render(<SettingsScreen />);

      expect(getByText('john.doe@example.com')).toBeDefined();
    });

    it('should display logout button', () => {
      const { getByText } = render(<SettingsScreen />);

      expect(getByText('screens.settings.logout')).toBeDefined();
    });

    it('should render with translated strings', () => {
      const { getByText } = render(<SettingsScreen />);

      // Check that translation keys are being used
      expect(getByText('screens.settings.title')).toBeDefined();
      expect(getByText('screens.settings.account.title')).toBeDefined();
      expect(getByText('screens.settings.logout')).toBeDefined();
    });
  });

  describe('User Information', () => {
    it('should display correct user email', () => {
      const customUser = {
        id: 'user-456',
        email: 'jane.smith@example.com',
        name: 'Jane Smith',
      };

      (useAuthStore as unknown as jest.Mock).mockImplementation((selector) =>
        selector({
          logout: mockLogout,
          user: customUser,
        }),
      );

      const { getByText } = render(<SettingsScreen />);

      expect(getByText('jane.smith@example.com')).toBeDefined();
    });

    it('should handle user with different email format', () => {
      const customUser = {
        id: 'user-789',
        email: 'test+user@domain.co.uk',
        name: 'Test User',
      };

      (useAuthStore as unknown as jest.Mock).mockImplementation((selector) =>
        selector({
          logout: mockLogout,
          user: customUser,
        }),
      );

      const { getByText } = render(<SettingsScreen />);

      expect(getByText('test+user@domain.co.uk')).toBeDefined();
    });

    it('should handle undefined user gracefully', () => {
      (useAuthStore as unknown as jest.Mock).mockImplementation((selector) =>
        selector({
          logout: mockLogout,
          user: undefined,
        }),
      );

      const { queryByText } = render(<SettingsScreen />);

      // Should not crash, email section should be empty or handled
      expect(queryByText('screens.settings.account.title')).toBeDefined();
    });

    it('should handle null user gracefully', () => {
      (useAuthStore as unknown as jest.Mock).mockImplementation((selector) =>
        selector({
          logout: mockLogout,
          user: null,
        }),
      );

      const { queryByText } = render(<SettingsScreen />);

      expect(queryByText('screens.settings.account.title')).toBeDefined();
    });
  });

  describe('Logout Functionality', () => {
    it('should call logout when logout button is pressed', () => {
      const { getByText } = render(<SettingsScreen />);

      const logoutButton = getByText('screens.settings.logout');
      fireEvent.press(logoutButton);

      expect(mockLogout).toHaveBeenCalledTimes(1);
    });

    it('should call logout only once per press', () => {
      const { getByText } = render(<SettingsScreen />);

      const logoutButton = getByText('screens.settings.logout');
      fireEvent.press(logoutButton);

      expect(mockLogout).toHaveBeenCalledTimes(1);
    });

    it('should handle multiple logout button presses', () => {
      const { getByText } = render(<SettingsScreen />);

      const logoutButton = getByText('screens.settings.logout');
      fireEvent.press(logoutButton);
      fireEvent.press(logoutButton);
      fireEvent.press(logoutButton);

      expect(mockLogout).toHaveBeenCalledTimes(3);
    });

    it('should call logout without arguments', () => {
      const { getByText } = render(<SettingsScreen />);

      const logoutButton = getByText('screens.settings.logout');
      fireEvent.press(logoutButton);

      expect(mockLogout).toHaveBeenCalledWith();
    });
  });

  describe('UI Structure', () => {
    it('should render container view', () => {
      const { UNSAFE_root } = render(<SettingsScreen />);

      expect(UNSAFE_root).toBeDefined();
    });

    it('should render header section with title', () => {
      const { getByText } = render(<SettingsScreen />);

      const title = getByText('screens.settings.title');
      expect(title).toBeDefined();
    });

    it('should render account section', () => {
      const { getByText } = render(<SettingsScreen />);

      const sectionTitle = getByText('screens.settings.account.title');
      expect(sectionTitle).toBeDefined();
    });

    it('should render all main sections', () => {
      const { getByText } = render(<SettingsScreen />);

      // Header
      expect(getByText('screens.settings.title')).toBeDefined();

      // Account section
      expect(getByText('screens.settings.account.title')).toBeDefined();
      expect(getByText('john.doe@example.com')).toBeDefined();

      // Logout button
      expect(getByText('screens.settings.logout')).toBeDefined();
    });
  });

  describe('Store Integration', () => {
    it('should access user from auth store', () => {
      render(<SettingsScreen />);

      expect(useAuthStore).toHaveBeenCalled();
    });

    it('should access logout function from auth store', () => {
      render(<SettingsScreen />);

      expect(useAuthStore).toHaveBeenCalled();
    });

    it('should work with different store states', () => {
      const customLogout = jest.fn();
      const customUser = {
        id: 'custom-user',
        email: 'custom@example.com',
        name: 'Custom User',
      };

      (useAuthStore as unknown as jest.Mock).mockImplementation((selector) =>
        selector({
          logout: customLogout,
          user: customUser,
        }),
      );

      const { getByText } = render(<SettingsScreen />);

      expect(getByText('custom@example.com')).toBeDefined();

      const logoutButton = getByText('screens.settings.logout');
      fireEvent.press(logoutButton);

      expect(customLogout).toHaveBeenCalledTimes(1);
    });
  });

  describe('Accessibility', () => {
    it('should render logout button as touchable', () => {
      const { getByText } = render(<SettingsScreen />);

      const logoutButton = getByText('screens.settings.logout');

      // Should be able to press it (TouchableOpacity)
      fireEvent.press(logoutButton);
      expect(mockLogout).toHaveBeenCalled();
    });

    it('should display text in readable format', () => {
      const { getByText } = render(<SettingsScreen />);

      // All text elements should be rendered as Text components
      expect(getByText('screens.settings.title')).toBeDefined();
      expect(getByText('screens.settings.account.title')).toBeDefined();
      expect(getByText('john.doe@example.com')).toBeDefined();
      expect(getByText('screens.settings.logout')).toBeDefined();
    });
  });

  describe('Edge Cases', () => {
    it('should handle very long email addresses', () => {
      const longEmailUser = {
        id: 'user-long',
        email: 'very.long.email.address.with.many.dots@subdomain.example.com',
        name: 'Long Email User',
      };

      (useAuthStore as unknown as jest.Mock).mockImplementation((selector) =>
        selector({
          logout: mockLogout,
          user: longEmailUser,
        }),
      );

      const { getByText } = render(<SettingsScreen />);

      expect(
        getByText('very.long.email.address.with.many.dots@subdomain.example.com'),
      ).toBeDefined();
    });

    it('should handle special characters in email', () => {
      const specialEmailUser = {
        id: 'user-special',
        email: 'user+tag@example.com',
        name: 'Special User',
      };

      (useAuthStore as unknown as jest.Mock).mockImplementation((selector) =>
        selector({
          logout: mockLogout,
          user: specialEmailUser,
        }),
      );

      const { getByText } = render(<SettingsScreen />);

      expect(getByText('user+tag@example.com')).toBeDefined();
    });

    it('should render consistently on multiple renders', () => {
      const { getByText, rerender } = render(<SettingsScreen />);

      expect(getByText('john.doe@example.com')).toBeDefined();

      rerender(<SettingsScreen />);

      expect(getByText('john.doe@example.com')).toBeDefined();
    });
  });
});
