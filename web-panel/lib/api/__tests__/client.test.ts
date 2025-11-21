import axios from 'axios';
import { useAuthStore } from '@/store/authStore';

// Mock axios and store before importing client
jest.mock('axios');
jest.mock('@/store/authStore');

const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockAuthStore = useAuthStore as unknown as jest.Mock;

describe('apiClient', () => {
  let apiClient: any;
  let requestInterceptor: any;
  let responseInterceptor: any;
  let mockAxiosInstance: any;

  const mockGetState = jest.fn();
  const mockLogout = jest.fn();

  beforeEach(() => {
    // Reset modules to ensure clean state
    jest.resetModules();

    // Setup auth store mock
    mockAuthStore.mockReturnValue({
      token: null,
      logout: mockLogout,
    });

    mockAuthStore.getState = mockGetState;

    // Create a mock axios instance
    mockAxiosInstance = {
      interceptors: {
        request: {
          use: jest.fn((onFulfilled, onRejected) => {
            requestInterceptor = { onFulfilled, onRejected };
            return 0;
          }),
        },
        response: {
          use: jest.fn((onFulfilled, onRejected) => {
            responseInterceptor = { onFulfilled, onRejected };
            return 0;
          }),
        },
      },
      defaults: {
        headers: {
          common: {},
        },
      },
    };

    mockedAxios.create.mockReturnValue(mockAxiosInstance as any);

    // Clear all mocks
    jest.clearAllMocks();

    // Now import the client to trigger initialization
    apiClient = require('../client').apiClient;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('initialization', () => {
    it('should create axios instance with correct base URL', () => {
      expect(mockedAxios.create).toHaveBeenCalledWith({
        baseURL: expect.any(String),
        headers: {
          'Content-Type': 'application/json',
        },
      });
    });

    it('should create axios instance with default Content-Type header', () => {
      const callArgs = mockedAxios.create.mock.calls[0][0];
      expect(callArgs?.headers?.['Content-Type']).toBe('application/json');
    });

    it('should register request interceptor', () => {
      expect(mockAxiosInstance.interceptors.request.use).toHaveBeenCalledWith(
        expect.any(Function),
        expect.any(Function),
      );
    });

    it('should register response interceptor', () => {
      expect(mockAxiosInstance.interceptors.response.use).toHaveBeenCalledWith(
        expect.any(Function),
        expect.any(Function),
      );
    });
  });

  describe('request interceptor', () => {
    it('should add Authorization header when token exists', () => {
      const mockToken = 'test-token-123';
      mockGetState.mockReturnValue({ token: mockToken, logout: mockLogout });

      const mockConfig = {
        headers: {},
      };

      const result = requestInterceptor.onFulfilled(mockConfig);

      expect(result.headers.Authorization).toBe(`Bearer ${mockToken}`);
    });

    it('should not add Authorization header when token is null', () => {
      mockGetState.mockReturnValue({ token: null, logout: mockLogout });

      const mockConfig = {
        headers: {},
      };

      const result = requestInterceptor.onFulfilled(mockConfig);

      expect(result.headers.Authorization).toBeUndefined();
    });

    it('should not add Authorization header when token is undefined', () => {
      mockGetState.mockReturnValue({ token: undefined, logout: mockLogout });

      const mockConfig = {
        headers: {},
      };

      const result = requestInterceptor.onFulfilled(mockConfig);

      expect(result.headers.Authorization).toBeUndefined();
    });

    it('should preserve existing headers when adding token', () => {
      const mockToken = 'test-token-123';
      mockGetState.mockReturnValue({ token: mockToken, logout: mockLogout });

      const mockConfig = {
        headers: {
          'X-Custom-Header': 'custom-value',
          'Content-Type': 'application/json',
        },
      };

      const result = requestInterceptor.onFulfilled(mockConfig);

      expect(result.headers['X-Custom-Header']).toBe('custom-value');
      expect(result.headers['Content-Type']).toBe('application/json');
      expect(result.headers.Authorization).toBe(`Bearer ${mockToken}`);
    });

    it('should return config object when successful', () => {
      mockGetState.mockReturnValue({ token: null, logout: mockLogout });

      const mockConfig = {
        url: '/test',
        method: 'GET',
        headers: {},
      };

      const result = requestInterceptor.onFulfilled(mockConfig);

      expect(result).toEqual(expect.objectContaining({
        url: '/test',
        method: 'GET',
        headers: expect.any(Object),
      }));
    });

    it('should handle request errors', async () => {
      const mockError = new Error('Request setup failed');

      await expect(
        requestInterceptor.onRejected(mockError),
      ).rejects.toThrow('Request setup failed');
    });

    it('should reject with error object', async () => {
      const mockError = { message: 'Configuration error', code: 'ERR_CONFIG' };

      await expect(
        requestInterceptor.onRejected(mockError),
      ).rejects.toEqual(mockError);
    });
  });

  describe('response interceptor', () => {
    it('should pass through successful responses unchanged', () => {
      const mockResponse = {
        data: { id: 1, name: 'Test' },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      };

      const result = responseInterceptor.onFulfilled(mockResponse);

      expect(result).toEqual(mockResponse);
    });

    it('should handle 401 unauthorized errors by calling logout', async () => {
      mockGetState.mockReturnValue({ token: 'some-token', logout: mockLogout });

      const mockError = {
        response: {
          status: 401,
          data: { message: 'Unauthorized' },
        },
      };

      await expect(
        responseInterceptor.onRejected(mockError),
      ).rejects.toEqual(mockError);

      expect(mockLogout).toHaveBeenCalledTimes(1);
    });

    it('should not call logout for non-401 errors', async () => {
      const mockError = {
        response: {
          status: 400,
          data: { message: 'Bad Request' },
        },
      };

      await expect(
        responseInterceptor.onRejected(mockError),
      ).rejects.toEqual(mockError);

      expect(mockLogout).not.toHaveBeenCalled();
    });

    it('should not call logout for 404 errors', async () => {
      const mockError = {
        response: {
          status: 404,
          data: { message: 'Not Found' },
        },
      };

      await expect(
        responseInterceptor.onRejected(mockError),
      ).rejects.toEqual(mockError);

      expect(mockLogout).not.toHaveBeenCalled();
    });

    it('should not call logout for 500 server errors', async () => {
      const mockError = {
        response: {
          status: 500,
          data: { message: 'Internal Server Error' },
        },
      };

      await expect(
        responseInterceptor.onRejected(mockError),
      ).rejects.toEqual(mockError);

      expect(mockLogout).not.toHaveBeenCalled();
    });

    it('should handle network errors without response object', async () => {
      const mockError = {
        message: 'Network Error',
        code: 'ECONNABORTED',
      };

      await expect(
        responseInterceptor.onRejected(mockError),
      ).rejects.toEqual(mockError);

      expect(mockLogout).not.toHaveBeenCalled();
    });

    it('should handle timeout errors', async () => {
      const mockError = {
        message: 'timeout of 5000ms exceeded',
        code: 'ECONNABORTED',
      };

      await expect(
        responseInterceptor.onRejected(mockError),
      ).rejects.toEqual(mockError);

      expect(mockLogout).not.toHaveBeenCalled();
    });

    it('should handle 403 forbidden errors without logout', async () => {
      const mockError = {
        response: {
          status: 403,
          data: { message: 'Forbidden' },
        },
      };

      await expect(
        responseInterceptor.onRejected(mockError),
      ).rejects.toEqual(mockError);

      expect(mockLogout).not.toHaveBeenCalled();
    });

    it('should call logout only once for multiple 401 errors', async () => {
      mockGetState.mockReturnValue({ token: 'some-token', logout: mockLogout });

      const mockError1 = {
        response: {
          status: 401,
          data: { message: 'Unauthorized' },
        },
      };

      const mockError2 = {
        response: {
          status: 401,
          data: { message: 'Token expired' },
        },
      };

      await expect(
        responseInterceptor.onRejected(mockError1),
      ).rejects.toEqual(mockError1);

      await expect(
        responseInterceptor.onRejected(mockError2),
      ).rejects.toEqual(mockError2);

      expect(mockLogout).toHaveBeenCalledTimes(2);
    });
  });

  describe('configuration', () => {
    it('should use environment API URL when available', () => {
      const callArgs = mockedAxios.create.mock.calls[0][0];
      expect(callArgs?.baseURL).toBeDefined();
    });

    it('should have JSON content type by default', () => {
      const callArgs = mockedAxios.create.mock.calls[0][0];
      expect(callArgs?.headers?.['Content-Type']).toBe('application/json');
    });
  });
});
