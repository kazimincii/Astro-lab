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

  it('should render inputs and login action', async () => {
    const { getByPlaceholderText, findAllByText } = render(<LoginScreen navigation={mockNavigation} />);

    expect(getByPlaceholderText('Email')).toBeTruthy();
    expect(getByPlaceholderText('Password')).toBeTruthy();
    const loginButtons = await findAllByText(/Login/i);
    expect(loginButtons.length).toBeGreaterThan(0);
  });

  it('should show error when fields are empty', async () => {
    const { findAllByText } = render(<LoginScreen navigation={mockNavigation} />);

    const loginButton = (await findAllByText(/Login/i))[0];

    fireEvent.press(loginButton);

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Error', 'Please fill in all fields');
    });
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

    const { getByPlaceholderText, findAllByText } = render(<LoginScreen navigation={mockNavigation} />);

    const emailInput = getByPlaceholderText('Email');
    const passwordInput = getByPlaceholderText('Password');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');

    const loginButton = (await findAllByText(/Login/i))[0];

    fireEvent.press(loginButton);

    await waitFor(() => {
      expect(authApi.login).toHaveBeenCalledWith('test@example.com', 'password123');
      expect(mockLogin).toHaveBeenCalledWith(mockResponse.user, mockResponse.accessToken);
    });
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

    const { getByPlaceholderText, findAllByText } = render(<LoginScreen navigation={mockNavigation} />);

    const emailInput = getByPlaceholderText('Email');
    const passwordInput = getByPlaceholderText('Password');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'wrongpassword');

    const loginButton = (await findAllByText(/Login/i))[0];

    fireEvent.press(loginButton);

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Error', 'Invalid credentials');
    });
  });
});
