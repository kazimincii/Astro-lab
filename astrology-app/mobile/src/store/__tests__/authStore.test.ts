import { renderHook, act } from '@testing-library/react-native';
import { useAuthStore } from '../authStore';

describe('Auth Store', () => {
  beforeEach(() => {
    // Reset store to initial state before each test
    act(() => {
      useAuthStore.setState({
        isAuthenticated: false,
        user: null,
        token: null,
      });
    });
  });

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const { result } = renderHook(() => useAuthStore());

      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBeNull();
      expect(result.current.token).toBeNull();
    });

    it('should have login function', () => {
      const { result } = renderHook(() => useAuthStore());

      expect(typeof result.current.login).toBe('function');
    });

    it('should have logout function', () => {
      const { result } = renderHook(() => useAuthStore());

      expect(typeof result.current.logout).toBe('function');
    });
  });

  describe('Login', () => {
    it('should set authenticated state on login', () => {
      const { result } = renderHook(() => useAuthStore());

      const mockUser = {
        id: '123',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
      };
      const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';

      act(() => {
        result.current.login(mockUser, mockToken);
      });

      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.user).toEqual(mockUser);
      expect(result.current.token).toBe(mockToken);
    });

    it('should update user data on login', () => {
      const { result } = renderHook(() => useAuthStore());

      const mockUser = {
        id: 'user-456',
        email: 'user@test.com',
        firstName: 'John',
        lastName: 'Doe',
      };
      const mockToken = 'jwt-token-123';

      act(() => {
        result.current.login(mockUser, mockToken);
      });

      expect(result.current.user).toEqual(mockUser);
      expect(result.current.user?.email).toBe('user@test.com');
      expect(result.current.user?.firstName).toBe('John');
    });

    it('should store token on login', () => {
      const { result } = renderHook(() => useAuthStore());

      const mockUser = { id: '1', email: 'test@example.com' };
      const mockToken = 'secure-jwt-token';

      act(() => {
        result.current.login(mockUser, mockToken);
      });

      expect(result.current.token).toBe('secure-jwt-token');
    });

    it('should handle login with minimal user data', () => {
      const { result } = renderHook(() => useAuthStore());

      const minimalUser = { id: '1' };
      const token = 'token';

      act(() => {
        result.current.login(minimalUser, token);
      });

      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.user).toEqual(minimalUser);
    });

    it('should overwrite previous user data on new login', () => {
      const { result } = renderHook(() => useAuthStore());

      const firstUser = { id: '1', email: 'first@example.com' };
      const secondUser = { id: '2', email: 'second@example.com' };

      act(() => {
        result.current.login(firstUser, 'token1');
      });

      expect(result.current.user?.email).toBe('first@example.com');

      act(() => {
        result.current.login(secondUser, 'token2');
      });

      expect(result.current.user?.email).toBe('second@example.com');
      expect(result.current.token).toBe('token2');
    });
  });

  describe('Logout', () => {
    it('should clear authenticated state on logout', () => {
      const { result } = renderHook(() => useAuthStore());

      // First login
      act(() => {
        result.current.login(
          { id: '1', email: 'test@example.com' },
          'test-token'
        );
      });

      expect(result.current.isAuthenticated).toBe(true);

      // Then logout
      act(() => {
        result.current.logout();
      });

      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBeNull();
      expect(result.current.token).toBeNull();
    });

    it('should clear user data on logout', () => {
      const { result } = renderHook(() => useAuthStore());

      act(() => {
        result.current.login(
          { id: '1', email: 'test@example.com', firstName: 'Test' },
          'token'
        );
      });

      act(() => {
        result.current.logout();
      });

      expect(result.current.user).toBeNull();
    });

    it('should clear token on logout', () => {
      const { result } = renderHook(() => useAuthStore());

      act(() => {
        result.current.login({ id: '1' }, 'secure-token');
      });

      expect(result.current.token).toBe('secure-token');

      act(() => {
        result.current.logout();
      });

      expect(result.current.token).toBeNull();
    });

    it('should handle logout when not logged in', () => {
      const { result } = renderHook(() => useAuthStore());

      // Logout without logging in first
      act(() => {
        result.current.logout();
      });

      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBeNull();
      expect(result.current.token).toBeNull();
    });
  });

  describe('State Persistence', () => {
    it('should maintain state across multiple hook calls', () => {
      const { result: result1 } = renderHook(() => useAuthStore());

      act(() => {
        result1.current.login({ id: '1', email: 'test@example.com' }, 'token');
      });

      // Create a new hook instance
      const { result: result2 } = renderHook(() => useAuthStore());

      expect(result2.current.isAuthenticated).toBe(true);
      expect(result2.current.user?.email).toBe('test@example.com');
      expect(result2.current.token).toBe('token');
    });

    it('should sync state changes across hooks', () => {
      const { result: result1 } = renderHook(() => useAuthStore());
      const { result: result2 } = renderHook(() => useAuthStore());

      act(() => {
        result1.current.login({ id: '1' }, 'token');
      });

      expect(result2.current.isAuthenticated).toBe(true);
      expect(result2.current.token).toBe('token');
    });
  });

  describe('Edge Cases', () => {
    it('should handle login with empty string token', () => {
      const { result } = renderHook(() => useAuthStore());

      act(() => {
        result.current.login({ id: '1' }, '');
      });

      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.token).toBe('');
    });

    it('should handle login with null user properties', () => {
      const { result } = renderHook(() => useAuthStore());

      const userWithNulls = {
        id: '1',
        email: null,
        firstName: null,
      };

      act(() => {
        result.current.login(userWithNulls, 'token');
      });

      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.user).toEqual(userWithNulls);
    });

    it('should handle rapid login/logout cycles', () => {
      const { result } = renderHook(() => useAuthStore());

      for (let i = 0; i < 10; i++) {
        act(() => {
          result.current.login({ id: `${i}` }, `token${i}`);
        });
        expect(result.current.isAuthenticated).toBe(true);

        act(() => {
          result.current.logout();
        });
        expect(result.current.isAuthenticated).toBe(false);
      }
    });
  });
});
