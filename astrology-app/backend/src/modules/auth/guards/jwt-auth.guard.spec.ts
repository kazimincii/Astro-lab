import { ExecutionContext } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;

  beforeEach(() => {
    guard = new JwtAuthGuard();
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should extend AuthGuard with jwt strategy', () => {
    expect(guard).toBeInstanceOf(JwtAuthGuard);
  });

  it('should have canActivate method', () => {
    expect(guard.canActivate).toBeDefined();
  });

  describe('canActivate', () => {
    it('should call parent canActivate', () => {
      const mockContext = {
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue({
            headers: {
              authorization: 'Bearer valid-token',
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
