import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException, BadRequestException } from '@nestjs/common';
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
    firstName: 'John',
    lastName: 'Doe',
  };

  const mockTokens = {
    accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test.access',
    refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test.refresh',
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

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should successfully register a new user', async () => {
      const registerDto: RegisterDto = {
        email: 'newuser@example.com',
        password: 'SecurePass123!',
        firstName: 'Jane',
        lastName: 'Smith',
      };

      const expectedResponse = {
        message: 'Registration successful. Please check your email to verify your account.',
        user: {
          id: '456',
          email: registerDto.email,
          firstName: registerDto.firstName,
          lastName: registerDto.lastName,
        },
      };

      mockAuthService.register.mockResolvedValue(expectedResponse);

      const result = await controller.register(registerDto);

      expect(result).toEqual(expectedResponse);
      expect(mockAuthService.register).toHaveBeenCalledWith(registerDto);
      expect(mockAuthService.register).toHaveBeenCalledTimes(1);
    });

    it('should throw BadRequestException when email already exists', async () => {
      const registerDto: RegisterDto = {
        email: 'existing@example.com',
        password: 'SecurePass123!',
        firstName: 'Jane',
        lastName: 'Smith',
      };

      mockAuthService.register.mockRejectedValue(
        new BadRequestException('Email already exists'),
      );

      await expect(controller.register(registerDto)).rejects.toThrow(
        BadRequestException,
      );
      expect(mockAuthService.register).toHaveBeenCalledWith(registerDto);
    });

    it('should throw BadRequestException for invalid input data', async () => {
      const registerDto: RegisterDto = {
        email: 'invalid-email',
        password: '123', // too short
        firstName: '',
        lastName: '',
      };

      mockAuthService.register.mockRejectedValue(
        new BadRequestException('Invalid input data'),
      );

      await expect(controller.register(registerDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('login', () => {
    it('should successfully login with valid credentials', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'Password123!',
      };

      const expectedResponse = {
        ...mockTokens,
        user: mockUser,
      };

      const mockRequest = {
        user: mockUser,
      };

      mockAuthService.login.mockResolvedValue(expectedResponse);

      const result = await controller.login(loginDto, mockRequest);

      expect(result).toEqual(expectedResponse);
      expect(mockAuthService.login).toHaveBeenCalledWith(mockUser);
      expect(mockAuthService.login).toHaveBeenCalledTimes(1);
    });

    it('should throw UnauthorizedException for invalid credentials', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      const mockRequest = {
        user: null,
      };

      mockAuthService.login.mockRejectedValue(
        new UnauthorizedException('Invalid credentials'),
      );

      await expect(controller.login(loginDto, mockRequest)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should update last login timestamp on successful login', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'Password123!',
      };

      const mockRequest = {
        user: mockUser,
      };

      const expectedResponse = {
        ...mockTokens,
        user: mockUser,
      };

      mockAuthService.login.mockResolvedValue(expectedResponse);

      const result = await controller.login(loginDto, mockRequest);

      expect(result).toBeDefined();
      expect(result.accessToken).toBeDefined();
      expect(result.refreshToken).toBeDefined();
    });
  });

  describe('logout', () => {
    it('should successfully logout authenticated user', async () => {
      const mockRequest = {
        user: { id: mockUser.id },
      };

      const expectedResponse = {
        message: 'Logged out successfully',
      };

      mockAuthService.logout.mockResolvedValue(expectedResponse);

      const result = await controller.logout(mockRequest);

      expect(result).toEqual(expectedResponse);
      expect(mockAuthService.logout).toHaveBeenCalledWith(mockUser.id);
      expect(mockAuthService.logout).toHaveBeenCalledTimes(1);
    });

    it('should throw UnauthorizedException if user is not authenticated', async () => {
      const mockRequest = {
        user: null,
      };

      mockAuthService.logout.mockRejectedValue(
        new UnauthorizedException('Unauthorized'),
      );

      await expect(controller.logout(mockRequest)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('refreshToken', () => {
    it('should successfully refresh access token with valid refresh token', async () => {
      const refreshToken = mockTokens.refreshToken;

      const expectedResponse = {
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
      };

      mockAuthService.refreshToken.mockResolvedValue(expectedResponse);

      const result = await controller.refreshToken(refreshToken);

      expect(result).toEqual(expectedResponse);
      expect(mockAuthService.refreshToken).toHaveBeenCalledWith(refreshToken);
      expect(mockAuthService.refreshToken).toHaveBeenCalledTimes(1);
    });

    it('should throw UnauthorizedException with invalid refresh token', async () => {
      const invalidToken = 'invalid-token';

      mockAuthService.refreshToken.mockRejectedValue(
        new UnauthorizedException('Invalid refresh token'),
      );

      await expect(controller.refreshToken(invalidToken)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(mockAuthService.refreshToken).toHaveBeenCalledWith(invalidToken);
    });

    it('should throw UnauthorizedException with expired refresh token', async () => {
      const expiredToken = 'expired-token';

      mockAuthService.refreshToken.mockRejectedValue(
        new UnauthorizedException('Invalid refresh token'),
      );

      await expect(controller.refreshToken(expiredToken)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('verifyEmail', () => {
    it('should successfully verify email with valid token', async () => {
      const token = 'valid-verification-token';
      const mockRequest = {
        user: { id: mockUser.id },
      };

      const expectedResponse = {
        message: 'Email verified successfully',
      };

      mockAuthService.verifyEmail.mockResolvedValue(expectedResponse);

      const result = await controller.verifyEmail(mockRequest, token);

      expect(result).toEqual(expectedResponse);
      expect(mockAuthService.verifyEmail).toHaveBeenCalledWith(mockUser.id, token);
      expect(mockAuthService.verifyEmail).toHaveBeenCalledTimes(1);
    });

    it('should throw BadRequestException with invalid verification token', async () => {
      const invalidToken = 'invalid-token';
      const mockRequest = {
        user: { id: mockUser.id },
      };

      mockAuthService.verifyEmail.mockRejectedValue(
        new BadRequestException('Invalid verification token'),
      );

      await expect(controller.verifyEmail(mockRequest, invalidToken)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException with expired verification token', async () => {
      const expiredToken = 'expired-token';
      const mockRequest = {
        user: { id: mockUser.id },
      };

      mockAuthService.verifyEmail.mockRejectedValue(
        new BadRequestException('Invalid verification token'),
      );

      await expect(controller.verifyEmail(mockRequest, expiredToken)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw UnauthorizedException if user is not authenticated', async () => {
      const token = 'valid-token';
      const mockRequest = {
        user: null,
      };

      mockAuthService.verifyEmail.mockRejectedValue(
        new UnauthorizedException('Unauthorized'),
      );

      await expect(controller.verifyEmail(mockRequest, token)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('forgotPassword', () => {
    it('should send password reset email for existing user', async () => {
      const email = 'test@example.com';

      const expectedResponse = {
        message: 'If the email exists, a reset link has been sent',
      };

      mockAuthService.forgotPassword.mockResolvedValue(expectedResponse);

      const result = await controller.forgotPassword(email);

      expect(result).toEqual(expectedResponse);
      expect(mockAuthService.forgotPassword).toHaveBeenCalledWith(email);
      expect(mockAuthService.forgotPassword).toHaveBeenCalledTimes(1);
    });

    it('should return same message for non-existing user (security)', async () => {
      const email = 'nonexistent@example.com';

      const expectedResponse = {
        message: 'If the email exists, a reset link has been sent',
      };

      mockAuthService.forgotPassword.mockResolvedValue(expectedResponse);

      const result = await controller.forgotPassword(email);

      expect(result).toEqual(expectedResponse);
      expect(result.message).not.toContain('not found');
      expect(result.message).not.toContain('does not exist');
    });

    it('should handle invalid email format', async () => {
      const invalidEmail = 'not-an-email';

      const expectedResponse = {
        message: 'If the email exists, a reset link has been sent',
      };

      mockAuthService.forgotPassword.mockResolvedValue(expectedResponse);

      const result = await controller.forgotPassword(invalidEmail);

      expect(result).toEqual(expectedResponse);
    });
  });

  describe('resetPassword', () => {
    it('should successfully reset password with valid token', async () => {
      const token = 'valid-reset-token';
      const newPassword = 'NewSecurePass123!';

      const expectedResponse = {
        message: 'Password reset successfully',
      };

      mockAuthService.resetPassword.mockResolvedValue(expectedResponse);

      const result = await controller.resetPassword(token, newPassword);

      expect(result).toEqual(expectedResponse);
      expect(mockAuthService.resetPassword).toHaveBeenCalledWith(token, newPassword);
      expect(mockAuthService.resetPassword).toHaveBeenCalledTimes(1);
    });

    it('should throw BadRequestException with invalid reset token', async () => {
      const invalidToken = 'invalid-token';
      const newPassword = 'NewSecurePass123!';

      mockAuthService.resetPassword.mockRejectedValue(
        new BadRequestException('Invalid or expired reset token'),
      );

      await expect(controller.resetPassword(invalidToken, newPassword)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException with expired reset token', async () => {
      const expiredToken = 'expired-token';
      const newPassword = 'NewSecurePass123!';

      mockAuthService.resetPassword.mockRejectedValue(
        new BadRequestException('Invalid or expired reset token'),
      );

      await expect(controller.resetPassword(expiredToken, newPassword)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException with weak password', async () => {
      const token = 'valid-token';
      const weakPassword = '123'; // too short

      mockAuthService.resetPassword.mockRejectedValue(
        new BadRequestException('Password does not meet requirements'),
      );

      await expect(controller.resetPassword(token, weakPassword)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
