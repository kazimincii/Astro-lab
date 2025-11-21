// Mock implementation of apiClient for tests
// This mock provides both default and named exports to support all import styles

const mockApiClient = {
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
  patch: jest.fn(),
  interceptors: {
    request: {
      use: jest.fn(() => 0),
      eject: jest.fn(),
    },
    response: {
      use: jest.fn(() => 0),
      eject: jest.fn(),
    },
  },
  defaults: {
    headers: {
      common: {},
    },
  },
};

// Export as both default and named export
export default mockApiClient;
export { mockApiClient as apiClient };
