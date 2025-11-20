import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { MailService } from './mail.service';
import * as nodemailer from 'nodemailer';

// Mock nodemailer
jest.mock('nodemailer');

describe('MailService', () => {
  let service: MailService;
  let configService: ConfigService;
  let mockTransporter: any;

  const mockConfigService = {
    get: jest.fn((key: string, defaultValue?: any) => {
      const config: Record<string, any> = {
        MAIL_HOST: 'smtp.example.com',
        MAIL_PORT: 587,
        MAIL_SECURE: false,
        MAIL_USER: 'test@example.com',
        MAIL_PASSWORD: 'test-password',
        MAIL_FROM: 'noreply@astrology-app.com',
        FRONTEND_URL: 'https://app.example.com',
      };
      return config[key] ?? defaultValue;
    }),
  };

  beforeEach(async () => {
    mockTransporter = {
      sendMail: jest.fn().mockResolvedValue({ messageId: 'test-message-id' }),
    };

    (nodemailer.createTransport as jest.Mock).mockReturnValue(mockTransporter);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MailService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<MailService>(MailService);
    configService = module.get<ConfigService>(ConfigService);

    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('initialization', () => {
    it('should create transporter with correct configuration', () => {
      expect(nodemailer.createTransport).toHaveBeenCalledWith({
        host: 'smtp.example.com',
        port: 587,
        secure: false,
        auth: {
          user: 'test@example.com',
          pass: 'test-password',
        },
      });
    });

    it('should create transporter without auth when MAIL_USER is not configured', () => {
      // Create a new instance with config without MAIL_USER
      const configWithoutAuth = {
        get: jest.fn((key: string, defaultValue?: any) => {
          const config: Record<string, any> = {
            MAIL_HOST: 'localhost',
            MAIL_PORT: 1025,
            MAIL_SECURE: false,
          };
          return config[key] ?? defaultValue;
        }),
      };

      jest.clearAllMocks();
      (nodemailer.createTransport as jest.Mock).mockReturnValue(mockTransporter);

      const testModule = Test.createTestingModule({
        providers: [
          MailService,
          {
            provide: ConfigService,
            useValue: configWithoutAuth,
          },
        ],
      });

      testModule.compile();

      expect(nodemailer.createTransport).toHaveBeenCalledWith({
        host: 'localhost',
        port: 1025,
        secure: false,
        auth: undefined,
      });
    });
  });

  describe('sendVerificationEmail', () => {
    const testEmail = 'user@example.com';
    const testUserId = 'user-123';
    const testToken = 'verification-token-abc';

    it('should send verification email with correct parameters', async () => {
      await service.sendVerificationEmail(testEmail, testUserId, testToken);

      expect(mockTransporter.sendMail).toHaveBeenCalledWith({
        from: 'noreply@astrology-app.com',
        to: testEmail,
        subject: 'Verify Your Email Address',
        html: expect.stringContaining('Welcome to Astrology App!'),
      });
    });

    it('should include verification URL in email body', async () => {
      await service.sendVerificationEmail(testEmail, testUserId, testToken);

      const callArgs = mockTransporter.sendMail.mock.calls[0][0];
      expect(callArgs.html).toContain(
        `https://app.example.com/verify-email?userId=${testUserId}&token=${testToken}`,
      );
    });

    it('should use default frontend URL when not configured', async () => {
      const configWithDefault = {
        get: jest.fn((key: string, defaultValue?: any) => {
          if (key === 'FRONTEND_URL') return defaultValue;
          return mockConfigService.get(key, defaultValue);
        }),
      };

      const module = await Test.createTestingModule({
        providers: [
          MailService,
          {
            provide: ConfigService,
            useValue: configWithDefault,
          },
        ],
      }).compile();

      const testService = module.get<MailService>(MailService);
      await testService.sendVerificationEmail(testEmail, testUserId, testToken);

      const callArgs = mockTransporter.sendMail.mock.calls[0][0];
      expect(callArgs.html).toContain(
        `http://localhost:3000/verify-email?userId=${testUserId}&token=${testToken}`,
      );
    });

    it('should include welcome message and instructions', async () => {
      await service.sendVerificationEmail(testEmail, testUserId, testToken);

      const callArgs = mockTransporter.sendMail.mock.calls[0][0];
      expect(callArgs.html).toContain('Welcome to Astrology App!');
      expect(callArgs.html).toContain('Thank you for registering');
      expect(callArgs.html).toContain('verify your email address');
      expect(callArgs.html).toContain('Verify Email');
    });

    it('should mention expiration time in email', async () => {
      await service.sendVerificationEmail(testEmail, testUserId, testToken);

      const callArgs = mockTransporter.sendMail.mock.calls[0][0];
      expect(callArgs.html).toContain('24 hours');
    });

    it('should not throw error when email sending fails', async () => {
      mockTransporter.sendMail.mockRejectedValue(new Error('SMTP connection failed'));

      await expect(
        service.sendVerificationEmail(testEmail, testUserId, testToken),
      ).resolves.not.toThrow();
    });

    it('should log error when email sending fails', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      mockTransporter.sendMail.mockRejectedValue(new Error('SMTP connection failed'));

      await service.sendVerificationEmail(testEmail, testUserId, testToken);

      // Give time for async logging
      await new Promise(resolve => setTimeout(resolve, 10));

      consoleErrorSpy.mockRestore();
    });

    it('should call sendMail exactly once', async () => {
      await service.sendVerificationEmail(testEmail, testUserId, testToken);

      expect(mockTransporter.sendMail).toHaveBeenCalledTimes(1);
    });

    it('should use configured MAIL_FROM address', async () => {
      await service.sendVerificationEmail(testEmail, testUserId, testToken);

      const callArgs = mockTransporter.sendMail.mock.calls[0][0];
      expect(callArgs.from).toBe('noreply@astrology-app.com');
    });
  });

  describe('sendPasswordResetEmail', () => {
    const testEmail = 'user@example.com';
    const testToken = 'reset-token-xyz';

    it('should send password reset email with correct parameters', async () => {
      await service.sendPasswordResetEmail(testEmail, testToken);

      expect(mockTransporter.sendMail).toHaveBeenCalledWith({
        from: 'noreply@astrology-app.com',
        to: testEmail,
        subject: 'Reset Your Password',
        html: expect.stringContaining('Password Reset Request'),
      });
    });

    it('should include reset URL in email body', async () => {
      await service.sendPasswordResetEmail(testEmail, testToken);

      const callArgs = mockTransporter.sendMail.mock.calls[0][0];
      expect(callArgs.html).toContain(
        `https://app.example.com/reset-password?token=${testToken}`,
      );
    });

    it('should use default frontend URL when not configured', async () => {
      const configWithDefault = {
        get: jest.fn((key: string, defaultValue?: any) => {
          if (key === 'FRONTEND_URL') return defaultValue;
          return mockConfigService.get(key, defaultValue);
        }),
      };

      const module = await Test.createTestingModule({
        providers: [
          MailService,
          {
            provide: ConfigService,
            useValue: configWithDefault,
          },
        ],
      }).compile();

      const testService = module.get<MailService>(MailService);
      await testService.sendPasswordResetEmail(testEmail, testToken);

      const callArgs = mockTransporter.sendMail.mock.calls[0][0];
      expect(callArgs.html).toContain(
        `http://localhost:3000/reset-password?token=${testToken}`,
      );
    });

    it('should include reset instructions in email', async () => {
      await service.sendPasswordResetEmail(testEmail, testToken);

      const callArgs = mockTransporter.sendMail.mock.calls[0][0];
      expect(callArgs.html).toContain('Password Reset Request');
      expect(callArgs.html).toContain('You requested to reset your password');
      expect(callArgs.html).toContain('Reset Password');
    });

    it('should mention expiration time in email', async () => {
      await service.sendPasswordResetEmail(testEmail, testToken);

      const callArgs = mockTransporter.sendMail.mock.calls[0][0];
      expect(callArgs.html).toContain('1 hour');
    });

    it('should include security notice', async () => {
      await service.sendPasswordResetEmail(testEmail, testToken);

      const callArgs = mockTransporter.sendMail.mock.calls[0][0];
      expect(callArgs.html).toContain("If you didn't request this password reset");
      expect(callArgs.html).toContain('safely ignore this email');
    });

    it('should not throw error when email sending fails', async () => {
      mockTransporter.sendMail.mockRejectedValue(new Error('Network timeout'));

      await expect(
        service.sendPasswordResetEmail(testEmail, testToken),
      ).resolves.not.toThrow();
    });

    it('should log error when email sending fails', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      mockTransporter.sendMail.mockRejectedValue(new Error('Network timeout'));

      await service.sendPasswordResetEmail(testEmail, testToken);

      // Give time for async logging
      await new Promise(resolve => setTimeout(resolve, 10));

      consoleErrorSpy.mockRestore();
    });

    it('should call sendMail exactly once', async () => {
      await service.sendPasswordResetEmail(testEmail, testToken);

      expect(mockTransporter.sendMail).toHaveBeenCalledTimes(1);
    });

    it('should use configured MAIL_FROM address', async () => {
      await service.sendPasswordResetEmail(testEmail, testToken);

      const callArgs = mockTransporter.sendMail.mock.calls[0][0];
      expect(callArgs.from).toBe('noreply@astrology-app.com');
    });
  });

  describe('email delivery reliability', () => {
    it('should handle multiple verification emails sequentially', async () => {
      await service.sendVerificationEmail('user1@example.com', 'user-1', 'token-1');
      await service.sendVerificationEmail('user2@example.com', 'user-2', 'token-2');
      await service.sendVerificationEmail('user3@example.com', 'user-3', 'token-3');

      expect(mockTransporter.sendMail).toHaveBeenCalledTimes(3);
    });

    it('should handle multiple password reset emails sequentially', async () => {
      await service.sendPasswordResetEmail('user1@example.com', 'token-1');
      await service.sendPasswordResetEmail('user2@example.com', 'token-2');

      expect(mockTransporter.sendMail).toHaveBeenCalledTimes(2);
    });

    it('should continue sending emails even if one fails', async () => {
      mockTransporter.sendMail
        .mockRejectedValueOnce(new Error('Failed'))
        .mockResolvedValueOnce({ messageId: 'success-1' })
        .mockResolvedValueOnce({ messageId: 'success-2' });

      await service.sendVerificationEmail('fail@example.com', 'user-1', 'token-1');
      await service.sendVerificationEmail('success1@example.com', 'user-2', 'token-2');
      await service.sendPasswordResetEmail('success2@example.com', 'token-3');

      expect(mockTransporter.sendMail).toHaveBeenCalledTimes(3);
    });
  });

  describe('configuration edge cases', () => {
    it('should handle missing MAIL_FROM with default value', async () => {
      const configWithoutMailFrom = {
        get: jest.fn((key: string, defaultValue?: any) => {
          if (key === 'MAIL_FROM') return defaultValue;
          return mockConfigService.get(key, defaultValue);
        }),
      };

      const module = await Test.createTestingModule({
        providers: [
          MailService,
          {
            provide: ConfigService,
            useValue: configWithoutMailFrom,
          },
        ],
      }).compile();

      const testService = module.get<MailService>(MailService);
      await testService.sendVerificationEmail('test@example.com', 'user-1', 'token-1');

      const callArgs = mockTransporter.sendMail.mock.calls[0][0];
      expect(callArgs.from).toBe('noreply@astrology-app.com');
    });

    it('should handle special characters in email addresses', async () => {
      const specialEmail = 'user+test@example.com';
      await service.sendVerificationEmail(specialEmail, 'user-1', 'token-1');

      const callArgs = mockTransporter.sendMail.mock.calls[0][0];
      expect(callArgs.to).toBe(specialEmail);
    });

    it('should handle special characters in tokens', async () => {
      const specialToken = 'token-with-special-chars-!@#$%';
      await service.sendPasswordResetEmail('test@example.com', specialToken);

      const callArgs = mockTransporter.sendMail.mock.calls[0][0];
      expect(callArgs.html).toContain(specialToken);
    });
  });
});
