import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import LoginScreen from '../LoginScreen';
import { useAuthStore } from '@/store/authStore';
import { authApi } from '@/api/auth';
import { Alert } from 'react-native';

// Mock the dependencies
jest.mock('@/store/authStore');
jest.mock('@/api/auth');
jest.mock('react-native/Libraries/Alert/Alert', () => ({
  alert: jest.fn(),
}));

const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
};

describe('LoginScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useAuthStore as unknown as jest.Mock).mockReturnValue({
      login: jest.fn(),
    });
  });

  it('should render correctly', () => {
    const { getByText, getByPlaceholderText } = render(
      <LoginScreen navigation={mockNavigation} />
    );

    expect(getByText('Welcome Back')).toBeTruthy();
    expect(getByPlaceholderText('Email')).toBeTruthy();
    expect(getByPlaceholderText('Password')).toBeTruthy();
  });

  it('should show error when fields are empty', async () => {
    const { getByText } = render(
      <LoginScreen navigation={mockNavigation} />
    );

    const loginButton = getByText(/Log In/i) || getByText(/Sign In/i) || getByText(/Login/i);

    if (loginButton) {
      fireEvent.press(loginButton);

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith(
          'Error',
          'Please fill in all fields'
        );
      });
    }
  });

  it('should call login API with correct credentials', async () => {
    const mockLogin = jest.fn();
    (useAuthStore as unknown as jest.Mock).mockReturnValue({
      login: mockLogin,
    });

    const mockResponse = {
      user: { id: '1', email: 'test@example.com' },
      accessToken: 'mock-token',
    };

    (authApi.login as jest.Mock).mockResolvedValue(mockResponse);

    const { getByPlaceholderText, getByText } = render(
      <LoginScreen navigation={mockNavigation} />
    );

    const emailInput = getByPlaceholderText('Email');
    const passwordInput = getByPlaceholderText('Password');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');

    const loginButton = getByText(/Log In/i) || getByText(/Sign In/i) || getByText(/Login/i);

    if (loginButton) {
      fireEvent.press(loginButton);

      await waitFor(() => {
        expect(authApi.login).toHaveBeenCalledWith('test@example.com', 'password123');
        expect(mockLogin).toHaveBeenCalledWith(mockResponse.user, mockResponse.accessToken);
      });
    }
  });

  it('should show error on login failure', async () => {
    const mockError = {
      response: {
        data: {
          message: 'Invalid credentials',
        },
      },
    };

    (authApi.login as jest.Mock).mockRejectedValue(mockError);

    const { getByPlaceholderText, getByText } = render(
      <LoginScreen navigation={mockNavigation} />
    );

    const emailInput = getByPlaceholderText('Email');
    const passwordInput = getByPlaceholderText('Password');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'wrongpassword');

    const loginButton = getByText(/Log In/i) || getByText(/Sign In/i) || getByText(/Login/i);

    if (loginButton) {
      fireEvent.press(loginButton);

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith('Error', 'Invalid credentials');
      });
    }
  });
});
