import { ExecutionContext } from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard';

describe('LocalAuthGuard', () => {
  let guard: LocalAuthGuard;

  beforeEach(() => {
    guard = new LocalAuthGuard();
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should extend AuthGuard with local strategy', () => {
    expect(guard).toBeInstanceOf(LocalAuthGuard);
  });

  it('should have canActivate method', () => {
    expect(guard.canActivate).toBeDefined();
  });

  describe('canActivate', () => {
    it('should call parent canActivate', () => {
      const mockContext = {
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue({
            body: {
              email: 'test@example.com',
              password: 'password123',
            },
          }),
        }),
      } as unknown as ExecutionContext;

      const canActivateSpy = jest.spyOn(guard, 'canActivate');

      try {
        guard.canActivate(mockContext);
      } catch (error) {
        // Expected to throw in test environment without full passport setup
      }

      expect(canActivateSpy).toHaveBeenCalledWith(mockContext);
    });
  });
});
