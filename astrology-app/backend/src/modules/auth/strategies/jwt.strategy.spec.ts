import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;
  let configService: ConfigService;

  const mockConfigService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    mockConfigService.get.mockReturnValue('test-secret-key');

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  it('should get JWT secret from config service', () => {
    expect(configService.get).toHaveBeenCalledWith('auth.jwtSecret');
  });

  describe('validate', () => {
    it('should return user data from JWT payload', async () => {
      const payload = {
        sub: '123e4567-e89b-12d3-a456-426614174000',
        email: 'test@example.com',
        iat: 1234567890,
        exp: 1234571490,
      };

      const result = await strategy.validate(payload);

      expect(result).toEqual({
        id: payload.sub,
        email: payload.email,
      });
    });

    it('should extract id from sub claim', async () => {
      const payload = {
        sub: 'user-id-123',
        email: 'user@test.com',
      };

      const result = await strategy.validate(payload);

      expect(result.id).toBe('user-id-123');
    });

    it('should preserve email from payload', async () => {
      const payload = {
        sub: 'some-id',
        email: 'unique@example.com',
      };

      const result = await strategy.validate(payload);

      expect(result.email).toBe('unique@example.com');
    });

    it('should handle payload with additional fields', async () => {
      const payload = {
        sub: 'user-123',
        email: 'test@example.com',
        role: 'admin',
        permissions: ['read', 'write'],
      };

      const result = await strategy.validate(payload);

      // Should only return id and email
      expect(result).toEqual({
        id: 'user-123',
        email: 'test@example.com',
      });
    });
  });
});
