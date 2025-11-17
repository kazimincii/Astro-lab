import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
    logout: jest.fn(),
    refreshToken: jest.fn(),
    verifyEmail: jest.fn(),
    forgotPassword: jest.fn(),
    resetPassword: jest.fn(),
  };

  const mockUser = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
  };

  const mockAuthResponse = {
    accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.refresh...',
    user: mockUser,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const registerDto: RegisterDto = {
        email: 'newuser@example.com',
        password: 'Password123!',
        firstName: 'New',
        lastName: 'User',
      };

      const expectedResponse = {
        ...mockAuthResponse,
        message: 'Registration successful',
      };

      mockAuthService.register.mockResolvedValue(expectedResponse);

      const result = await controller.register(registerDto);

      expect(result).toEqual(expectedResponse);
      expect(authService.register).toHaveBeenCalledWith(registerDto);
      expect(authService.register).toHaveBeenCalledTimes(1);
    });

    it('should handle registration errors', async () => {
      const registerDto: RegisterDto = {
        email: 'existing@example.com',
        password: 'Password123!',
        firstName: 'Existing',
        lastName: 'User',
      };

      mockAuthService.register.mockRejectedValue(
        new Error('Email already exists'),
      );

      await expect(controller.register(registerDto)).rejects.toThrow(
        'Email already exists',
      );
    });
  });

  describe('login', () => {
    it('should login user successfully', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'Password123!',
      };

      const mockRequest = {
        user: mockUser,
      };

      mockAuthService.login.mockResolvedValue(mockAuthResponse);

      const result = await controller.login(loginDto, mockRequest);

      expect(result).toEqual(mockAuthResponse);
      expect(authService.login).toHaveBeenCalledWith(mockUser);
      expect(authService.login).toHaveBeenCalledTimes(1);
    });

    it('should handle login with different users', async () => {
      const differentUser = {
        id: 'different-id',
        email: 'different@example.com',
        firstName: 'Different',
        lastName: 'User',
      };

      const mockRequest = {
        user: differentUser,
      };

      const expectedResponse = {
        ...mockAuthResponse,
        user: differentUser,
      };

      mockAuthService.login.mockResolvedValue(expectedResponse);

      const result = await controller.login({} as LoginDto, mockRequest);

      expect(authService.login).toHaveBeenCalledWith(differentUser);
      expect(result.user).toEqual(differentUser);
    });
  });

  describe('logout', () => {
    it('should logout user successfully', async () => {
      const mockRequest = {
        user: { id: mockUser.id },
      };

      const expectedResponse = {
        message: 'Logout successful',
      };

      mockAuthService.logout.mockResolvedValue(expectedResponse);

      const result = await controller.logout(mockRequest);

      expect(result).toEqual(expectedResponse);
      expect(authService.logout).toHaveBeenCalledWith(mockUser.id);
      expect(authService.logout).toHaveBeenCalledTimes(1);
    });

    it('should handle logout errors', async () => {
      const mockRequest = {
        user: { id: 'invalid-id' },
      };

      mockAuthService.logout.mockRejectedValue(new Error('User not found'));

      await expect(controller.logout(mockRequest)).rejects.toThrow(
        'User not found',
      );
    });
  });

  describe('refreshToken', () => {
    it('should refresh tokens successfully', async () => {
      const refreshToken = 'valid-refresh-token';
      const expectedResponse = {
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
      };

      mockAuthService.refreshToken.mockResolvedValue(expectedResponse);

      const result = await controller.refreshToken(refreshToken);

      expect(result).toEqual(expectedResponse);
      expect(authService.refreshToken).toHaveBeenCalledWith(refreshToken);
      expect(authService.refreshToken).toHaveBeenCalledTimes(1);
    });

    it('should handle invalid refresh token', async () => {
      const invalidToken = 'invalid-token';

      mockAuthService.refreshToken.mockRejectedValue(
        new Error('Invalid refresh token'),
      );

      await expect(controller.refreshToken(invalidToken)).rejects.toThrow(
        'Invalid refresh token',
      );
    });

    it('should handle expired refresh token', async () => {
      const expiredToken = 'expired-token';

      mockAuthService.refreshToken.mockRejectedValue(
        new Error('Refresh token expired'),
      );

      await expect(controller.refreshToken(expiredToken)).rejects.toThrow(
        'Refresh token expired',
      );
    });
  });

  describe('verifyEmail', () => {
    it('should verify email successfully', async () => {
      const mockRequest = {
        user: { id: mockUser.id },
      };
      const verificationToken = 'valid-verification-token';
      const expectedResponse = {
        message: 'Email verified successfully',
      };

      mockAuthService.verifyEmail.mockResolvedValue(expectedResponse);

      const result = await controller.verifyEmail(mockRequest, verificationToken);

      expect(result).toEqual(expectedResponse);
      expect(authService.verifyEmail).toHaveBeenCalledWith(
        mockUser.id,
        verificationToken,
      );
      expect(authService.verifyEmail).toHaveBeenCalledTimes(1);
    });

    it('should handle invalid verification token', async () => {
      const mockRequest = {
        user: { id: mockUser.id },
      };
      const invalidToken = 'invalid-token';

      mockAuthService.verifyEmail.mockRejectedValue(
        new Error('Invalid or expired token'),
      );

      await expect(
        controller.verifyEmail(mockRequest, invalidToken),
      ).rejects.toThrow('Invalid or expired token');
    });
  });

  describe('forgotPassword', () => {
    it('should send password reset email successfully', async () => {
      const email = 'test@example.com';
      const expectedResponse = {
        message: 'Password reset email sent',
      };

      mockAuthService.forgotPassword.mockResolvedValue(expectedResponse);

      const result = await controller.forgotPassword(email);

      expect(result).toEqual(expectedResponse);
      expect(authService.forgotPassword).toHaveBeenCalledWith(email);
      expect(authService.forgotPassword).toHaveBeenCalledTimes(1);
    });

    it('should handle non-existent email', async () => {
      const email = 'nonexistent@example.com';

      mockAuthService.forgotPassword.mockRejectedValue(
        new Error('User not found'),
      );

      await expect(controller.forgotPassword(email)).rejects.toThrow(
        'User not found',
      );
    });

    it('should handle different email formats', async () => {
      const emails = [
        'user@example.com',
        'user.name@example.co.uk',
        'user+tag@example.com',
      ];

      const expectedResponse = {
        message: 'Password reset email sent',
      };

      mockAuthService.forgotPassword.mockResolvedValue(expectedResponse);

      for (const email of emails) {
        await controller.forgotPassword(email);
        expect(authService.forgotPassword).toHaveBeenCalledWith(email);
      }
    });
  });

  describe('resetPassword', () => {
    it('should reset password successfully', async () => {
      const resetToken = 'valid-reset-token';
      const newPassword = 'NewPassword123!';
      const expectedResponse = {
        message: 'Password reset successfully',
      };

      mockAuthService.resetPassword.mockResolvedValue(expectedResponse);

      const result = await controller.resetPassword(resetToken, newPassword);

      expect(result).toEqual(expectedResponse);
      expect(authService.resetPassword).toHaveBeenCalledWith(
        resetToken,
        newPassword,
      );
      expect(authService.resetPassword).toHaveBeenCalledTimes(1);
    });

    it('should handle invalid reset token', async () => {
      const invalidToken = 'invalid-token';
      const newPassword = 'NewPassword123!';

      mockAuthService.resetPassword.mockRejectedValue(
        new Error('Invalid or expired token'),
      );

      await expect(
        controller.resetPassword(invalidToken, newPassword),
      ).rejects.toThrow('Invalid or expired token');
    });

    it('should handle weak password', async () => {
      const resetToken = 'valid-token';
      const weakPassword = '123';

      mockAuthService.resetPassword.mockRejectedValue(
        new Error('Password does not meet requirements'),
      );

      await expect(
        controller.resetPassword(resetToken, weakPassword),
      ).rejects.toThrow('Password does not meet requirements');
    });
  });
});
