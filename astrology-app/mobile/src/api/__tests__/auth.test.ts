import { authApi } from '../auth';
import { apiClient } from '../client';

// Mock apiClient
jest.mock('../client', () => ({
  apiClient: {
    post: jest.fn(),
  },
}));

describe('authApi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user with email and password', async () => {
      const mockResponse = {
        user: {
          id: '123',
          email: 'test@example.com',
          firstName: 'John',
          lastName: 'Doe',
        },
        accessToken: 'access_token_123',
        refreshToken: 'refresh_token_123',
      };

      const registrationData = {
        email: 'test@example.com',
        password: 'Password123!',
        firstName: 'John',
        lastName: 'Doe',
      };

      (apiClient.post as jest.Mock).mockResolvedValue({ data: mockResponse });

      const result = await authApi.register(registrationData);

      expect(apiClient.post).toHaveBeenCalledWith('/auth/register', registrationData);
      expect(result).toEqual(mockResponse);
    });

    it('should register a user without optional fields', async () => {
      const mockResponse = {
        user: {
          id: '123',
          email: 'test@example.com',
        },
        accessToken: 'access_token_123',
        refreshToken: 'refresh_token_123',
      };

      const registrationData = {
        email: 'test@example.com',
        password: 'Password123!',
      };

      (apiClient.post as jest.Mock).mockResolvedValue({ data: mockResponse });

      const result = await authApi.register(registrationData);

      expect(apiClient.post).toHaveBeenCalledWith('/auth/register', registrationData);
      expect(result).toEqual(mockResponse);
    });

    it('should handle registration errors', async () => {
      const mockError = new Error('Email already exists');
      (apiClient.post as jest.Mock).mockRejectedValue(mockError);

      await expect(
        authApi.register({
          email: 'test@example.com',
          password: 'Password123!',
        })
      ).rejects.toThrow('Email already exists');
    });
  });

  describe('login', () => {
    it('should login user with valid credentials', async () => {
      const mockResponse = {
        user: {
          id: '123',
          email: 'test@example.com',
        },
        accessToken: 'access_token_123',
        refreshToken: 'refresh_token_123',
      };

      (apiClient.post as jest.Mock).mockResolvedValue({ data: mockResponse });

      const result = await authApi.login('test@example.com', 'Password123!');

      expect(apiClient.post).toHaveBeenCalledWith('/auth/login', {
        email: 'test@example.com',
        password: 'Password123!',
      });
      expect(result).toEqual(mockResponse);
    });

    it('should handle invalid credentials', async () => {
      const mockError = new Error('Invalid credentials');
      (apiClient.post as jest.Mock).mockRejectedValue(mockError);

      await expect(authApi.login('test@example.com', 'wrongpassword')).rejects.toThrow(
        'Invalid credentials'
      );
    });
  });

  describe('logout', () => {
    it('should logout user successfully', async () => {
      const mockResponse = { success: true };

      (apiClient.post as jest.Mock).mockResolvedValue({ data: mockResponse });

      const result = await authApi.logout();

      expect(apiClient.post).toHaveBeenCalledWith('/auth/logout');
      expect(result).toEqual(mockResponse);
    });

    it('should handle logout errors', async () => {
      const mockError = new Error('Logout failed');
      (apiClient.post as jest.Mock).mockRejectedValue(mockError);

      await expect(authApi.logout()).rejects.toThrow('Logout failed');
    });
  });

  describe('refreshToken', () => {
    it('should refresh access token successfully', async () => {
      const mockResponse = {
        accessToken: 'new_access_token_456',
        refreshToken: 'new_refresh_token_456',
      };

      (apiClient.post as jest.Mock).mockResolvedValue({ data: mockResponse });

      const result = await authApi.refreshToken('old_refresh_token_123');

      expect(apiClient.post).toHaveBeenCalledWith('/auth/refresh', {
        refreshToken: 'old_refresh_token_123',
      });
      expect(result).toEqual(mockResponse);
    });

    it('should handle invalid refresh token', async () => {
      const mockError = new Error('Invalid refresh token');
      (apiClient.post as jest.Mock).mockRejectedValue(mockError);

      await expect(authApi.refreshToken('invalid_token')).rejects.toThrow(
        'Invalid refresh token'
      );
    });
  });
});
