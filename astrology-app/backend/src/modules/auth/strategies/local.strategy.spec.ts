import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { LocalStrategy } from './local.strategy';
import { AuthService } from '../auth.service';

describe('LocalStrategy', () => {
  let strategy: LocalStrategy;
  let authService: AuthService;

  const mockAuthService = {
    validateUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocalStrategy,
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    strategy = module.get<LocalStrategy>(LocalStrategy);
    authService = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  describe('validate', () => {
    it('should return user when credentials are valid', async () => {
      const mockUser = {
        id: '123',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
      };

      mockAuthService.validateUser.mockResolvedValue(mockUser);

      const result = await strategy.validate('test@example.com', 'password123');

      expect(result).toEqual(mockUser);
      expect(authService.validateUser).toHaveBeenCalledWith(
        'test@example.com',
        'password123',
      );
    });

    it('should throw UnauthorizedException when user is not found', async () => {
      mockAuthService.validateUser.mockResolvedValue(null);

      await expect(
        strategy.validate('invalid@example.com', 'wrongpassword'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when validateUser returns undefined', async () => {
      mockAuthService.validateUser.mockResolvedValue(undefined);

      await expect(
        strategy.validate('test@example.com', 'password'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should call authService.validateUser with correct parameters', async () => {
      const email = 'user@example.com';
      const password = 'securePassword123';

      mockAuthService.validateUser.mockResolvedValue({ id: '1', email });

      await strategy.validate(email, password);

      expect(authService.validateUser).toHaveBeenCalledTimes(1);
      expect(authService.validateUser).toHaveBeenCalledWith(email, password);
    });

    it('should handle validation errors from authService', async () => {
      mockAuthService.validateUser.mockRejectedValue(
        new UnauthorizedException('Invalid credentials'),
      );

      await expect(
        strategy.validate('test@example.com', 'password'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should return complete user object from authService', async () => {
      const completeUser = {
        id: '456',
        email: 'complete@example.com',
        firstName: 'Complete',
        lastName: 'User',
        status: 'active',
        emailVerified: true,
      };

      mockAuthService.validateUser.mockResolvedValue(completeUser);

      const result = await strategy.validate(
        'complete@example.com',
        'password',
      );

      expect(result).toEqual(completeUser);
    });
  });
});
