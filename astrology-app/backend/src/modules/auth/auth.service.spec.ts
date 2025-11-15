import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException, BadRequestException } from '@nestjs/common';

import { AuthService } from './auth.service';
import { User } from '../../entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: Repository<User>;

  const mockUser: any = {
    id: '123',
    email: 'test@example.com',
    password: 'hashedPassword',
    firstName: 'Test',
    lastName: 'User',
    status: 'active',
    language: 'en',
    timezone: 'UTC',
    emailVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockUserRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  const mockSubscriptionsService = {
    ensureDefaultSubscription: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: SubscriptionsService,
          useValue: mockSubscriptionsService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should successfully register a new user', async () => {
      const registerDto: RegisterDto = {
        email: 'newuser@example.com',
        password: 'Password123!',
        firstName: 'New',
        lastName: 'User',
      };

      mockUserRepository.findOne.mockResolvedValue(null);
      jest.spyOn(bcrypt, 'hash').mockImplementation(async () => 'hashedPassword');
      mockUserRepository.create.mockReturnValue({ ...registerDto, password: 'hashedPassword' });
      mockUserRepository.save.mockImplementation(async entity => {
        Object.assign(entity, { id: '456' });
        return entity;
      });

      const result = await service.register(registerDto);

      expect(result.user.email).toBe(registerDto.email);
      expect(result).toHaveProperty('message');
      expect(mockSubscriptionsService.ensureDefaultSubscription).toHaveBeenCalledWith('456');
      expect(mockUserRepository.save).toHaveBeenCalled();
    });

    it('should throw BadRequestException if user already exists', async () => {
      const registerDto: RegisterDto = {
        email: 'existing@example.com',
        password: 'Password123!',
        firstName: 'Existing',
        lastName: 'User',
      };

      mockUserRepository.findOne.mockResolvedValue(mockUser);

      await expect(service.register(registerDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('validateUser', () => {
    it('should return user data when credentials are valid', async () => {
      const password = 'Password123!';
      jest.spyOn(bcrypt, 'compare').mockImplementation(async () => true);
      mockUserRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.validateUser(mockUser.email, password);

      expect(result).toBeDefined();
      expect(result.email).toEqual(mockUser.email);
    });

    it('should throw UnauthorizedException when credentials are invalid', async () => {
      jest.spyOn(bcrypt, 'compare').mockImplementation(async () => false);
      mockUserRepository.findOne.mockResolvedValue(mockUser);

      await expect(service.validateUser(mockUser.email, 'wrongpassword')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException when user does not exist', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.validateUser('nonexistent@example.com', 'password')).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('login', () => {
    it('should return access and refresh tokens for valid user', async () => {
      mockJwtService.sign.mockReturnValueOnce('refresh-token').mockReturnValueOnce('access-token');
      mockUserRepository.update.mockResolvedValue(undefined);

      const result = await service.login(mockUser as User);

      expect(result.accessToken).toBe('access-token');
      expect(result.refreshToken).toBe('refresh-token');
      expect(mockSubscriptionsService.ensureDefaultSubscription).toHaveBeenCalledWith(mockUser.id);
      expect(mockUserRepository.update).toHaveBeenCalledWith(mockUser.id, expect.any(Object));
    });
  });
});
