import { Test, TestingModule } from '@nestjs/testing';
import {
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: UsersService;

  const mockUsersService = {
    findOne: jest.fn(),
    update: jest.fn(),
  };

  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
    language: 'en',
    phone: '+1234567890',
    timezone: 'America/New_York',
    emailVerified: true,
    subscription: {
      plan: 'standard',
      status: 'active',
      endDate: new Date('2024-02-01'),
    },
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2024-01-01'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getProfile', () => {
    it('should return user profile for authenticated user', async () => {
      mockUsersService.findOne.mockResolvedValue(mockUser);

      const mockRequest = { user: { id: 'user-123' } };
      const result = await controller.getProfile(mockRequest);

      expect(result).toEqual(mockUser);
      expect(mockUsersService.findOne).toHaveBeenCalledWith('user-123');
      expect(mockUsersService.findOne).toHaveBeenCalledTimes(1);
    });

    it('should return profile with all user information', async () => {
      mockUsersService.findOne.mockResolvedValue(mockUser);

      const mockRequest = { user: { id: 'user-123' } };
      const result = await controller.getProfile(mockRequest);

      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('email');
      expect(result).toHaveProperty('firstName');
      expect(result).toHaveProperty('lastName');
      expect(result).toHaveProperty('language');
      expect(result).toHaveProperty('phone');
      expect(result).toHaveProperty('timezone');
      expect(result).toHaveProperty('emailVerified');
      expect(result).toHaveProperty('subscription');
      expect(result).toHaveProperty('createdAt');
      expect(result).toHaveProperty('updatedAt');
    });

    it('should return profile with subscription details', async () => {
      mockUsersService.findOne.mockResolvedValue(mockUser);

      const mockRequest = { user: { id: 'user-123' } };
      const result = await controller.getProfile(mockRequest);

      expect(result.subscription).toBeDefined();
      expect(result.subscription.plan).toBe('standard');
      expect(result.subscription.status).toBe('active');
      expect(result.subscription.endDate).toBeDefined();
    });

    it('should handle user without subscription', async () => {
      const userWithoutSub = {
        ...mockUser,
        subscription: null,
      };

      mockUsersService.findOne.mockResolvedValue(userWithoutSub);

      const mockRequest = { user: { id: 'user-123' } };
      const result = await controller.getProfile(mockRequest);

      expect(result.subscription).toBeNull();
    });

    it('should throw NotFoundException when user not found', async () => {
      mockUsersService.findOne.mockRejectedValue(
        new NotFoundException('User not found'),
      );

      const mockRequest = { user: { id: 'non-existent' } };

      await expect(controller.getProfile(mockRequest)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should use authenticated user ID from request', async () => {
      const differentUser = { id: 'user-456' };
      mockUsersService.findOne.mockResolvedValue({
        ...mockUser,
        id: 'user-456',
      });

      const mockRequest = { user: differentUser };
      await controller.getProfile(mockRequest);

      expect(mockUsersService.findOne).toHaveBeenCalledWith('user-456');
    });

    it('should return email verification status', async () => {
      mockUsersService.findOne.mockResolvedValue(mockUser);

      const mockRequest = { user: { id: 'user-123' } };
      const result = await controller.getProfile(mockRequest);

      expect(result.emailVerified).toBe(true);
    });

    it('should return user with unverified email', async () => {
      const unverifiedUser = {
        ...mockUser,
        emailVerified: false,
      };

      mockUsersService.findOne.mockResolvedValue(unverifiedUser);

      const mockRequest = { user: { id: 'user-123' } };
      const result = await controller.getProfile(mockRequest);

      expect(result.emailVerified).toBe(false);
    });

    it('should return user language preference', async () => {
      mockUsersService.findOne.mockResolvedValue(mockUser);

      const mockRequest = { user: { id: 'user-123' } };
      const result = await controller.getProfile(mockRequest);

      expect(result.language).toBe('en');
    });

    it('should return user timezone', async () => {
      mockUsersService.findOne.mockResolvedValue(mockUser);

      const mockRequest = { user: { id: 'user-123' } };
      const result = await controller.getProfile(mockRequest);

      expect(result.timezone).toBe('America/New_York');
    });
  });

  describe('updateProfile', () => {
    const updateDto: UpdateUserDto = {
      firstName: 'Jane',
      lastName: 'Smith',
    };

    it('should update user profile successfully', async () => {
      const updatedUser = {
        ...mockUser,
        ...updateDto,
        updatedAt: new Date(),
      };

      mockUsersService.update.mockResolvedValue(updatedUser);

      const mockRequest = { user: { id: 'user-123' } };
      const result = await controller.updateProfile(mockRequest, updateDto);

      expect(result).toEqual(updatedUser);
      expect(mockUsersService.update).toHaveBeenCalledWith('user-123', updateDto);
      expect(mockUsersService.update).toHaveBeenCalledTimes(1);
    });

    it('should update first name only', async () => {
      const singleFieldUpdate: UpdateUserDto = {
        firstName: 'Alice',
      };

      const updatedUser = {
        ...mockUser,
        firstName: 'Alice',
        updatedAt: new Date(),
      };

      mockUsersService.update.mockResolvedValue(updatedUser);

      const mockRequest = { user: { id: 'user-123' } };
      const result = await controller.updateProfile(mockRequest, singleFieldUpdate);

      expect(result.firstName).toBe('Alice');
      expect(mockUsersService.update).toHaveBeenCalledWith(
        'user-123',
        singleFieldUpdate,
      );
    });

    it('should update last name only', async () => {
      const singleFieldUpdate: UpdateUserDto = {
        lastName: 'Johnson',
      };

      const updatedUser = {
        ...mockUser,
        lastName: 'Johnson',
        updatedAt: new Date(),
      };

      mockUsersService.update.mockResolvedValue(updatedUser);

      const mockRequest = { user: { id: 'user-123' } };
      const result = await controller.updateProfile(mockRequest, singleFieldUpdate);

      expect(result.lastName).toBe('Johnson');
    });

    it('should update email address', async () => {
      const emailUpdate: UpdateUserDto = {
        email: 'newemail@example.com',
      };

      const updatedUser = {
        ...mockUser,
        email: 'newemail@example.com',
        updatedAt: new Date(),
      };

      mockUsersService.update.mockResolvedValue(updatedUser);

      const mockRequest = { user: { id: 'user-123' } };
      const result = await controller.updateProfile(mockRequest, emailUpdate);

      expect(result.email).toBe('newemail@example.com');
    });

    it('should update language preference', async () => {
      const languageUpdate: UpdateUserDto = {
        language: 'tr',
      };

      const updatedUser = {
        ...mockUser,
        language: 'tr',
        updatedAt: new Date(),
      };

      mockUsersService.update.mockResolvedValue(updatedUser);

      const mockRequest = { user: { id: 'user-123' } };
      const result = await controller.updateProfile(mockRequest, languageUpdate);

      expect(result.language).toBe('tr');
    });

    it('should update phone number', async () => {
      const phoneUpdate: UpdateUserDto = {
        phone: '+9876543210',
      };

      const updatedUser = {
        ...mockUser,
        phone: '+9876543210',
        updatedAt: new Date(),
      };

      mockUsersService.update.mockResolvedValue(updatedUser);

      const mockRequest = { user: { id: 'user-123' } };
      const result = await controller.updateProfile(mockRequest, phoneUpdate);

      expect(result.phone).toBe('+9876543210');
    });

    it('should update timezone', async () => {
      const timezoneUpdate: UpdateUserDto = {
        timezone: 'Europe/Istanbul',
      };

      const updatedUser = {
        ...mockUser,
        timezone: 'Europe/Istanbul',
        updatedAt: new Date(),
      };

      mockUsersService.update.mockResolvedValue(updatedUser);

      const mockRequest = { user: { id: 'user-123' } };
      const result = await controller.updateProfile(mockRequest, timezoneUpdate);

      expect(result.timezone).toBe('Europe/Istanbul');
    });

    it('should update multiple fields at once', async () => {
      const multiFieldUpdate: UpdateUserDto = {
        firstName: 'Jane',
        lastName: 'Smith',
        phone: '+1111111111',
        timezone: 'America/Los_Angeles',
      };

      const updatedUser = {
        ...mockUser,
        ...multiFieldUpdate,
        updatedAt: new Date(),
      };

      mockUsersService.update.mockResolvedValue(updatedUser);

      const mockRequest = { user: { id: 'user-123' } };
      const result = await controller.updateProfile(mockRequest, multiFieldUpdate);

      expect(result.firstName).toBe('Jane');
      expect(result.lastName).toBe('Smith');
      expect(result.phone).toBe('+1111111111');
      expect(result.timezone).toBe('America/Los_Angeles');
    });

    it('should throw ConflictException when email already exists', async () => {
      const emailUpdate: UpdateUserDto = {
        email: 'existing@example.com',
      };

      mockUsersService.update.mockRejectedValue(
        new ConflictException('Email already exists'),
      );

      const mockRequest = { user: { id: 'user-123' } };

      await expect(
        controller.updateProfile(mockRequest, emailUpdate),
      ).rejects.toThrow(ConflictException);
    });

    it('should throw BadRequestException for invalid input data', async () => {
      const invalidUpdate: UpdateUserDto = {
        email: 'not-an-email',
      };

      mockUsersService.update.mockRejectedValue(
        new BadRequestException('Invalid input data'),
      );

      const mockRequest = { user: { id: 'user-123' } };

      await expect(
        controller.updateProfile(mockRequest, invalidUpdate),
      ).rejects.toThrow(BadRequestException);
    });

    it('should update updatedAt timestamp', async () => {
      const updateDto: UpdateUserDto = {
        firstName: 'Updated',
      };

      const now = new Date();
      const updatedUser = {
        ...mockUser,
        firstName: 'Updated',
        updatedAt: now,
      };

      mockUsersService.update.mockResolvedValue(updatedUser);

      const mockRequest = { user: { id: 'user-123' } };
      const result = await controller.updateProfile(mockRequest, updateDto);

      expect(result.updatedAt).toBeDefined();
      expect(result.updatedAt).toEqual(now);
    });

    it('should use authenticated user ID from request', async () => {
      const differentUser = { id: 'user-789' };
      const updateDto: UpdateUserDto = {
        firstName: 'Test',
      };

      mockUsersService.update.mockResolvedValue({
        ...mockUser,
        id: 'user-789',
        firstName: 'Test',
      });

      const mockRequest = { user: differentUser };
      await controller.updateProfile(mockRequest, updateDto);

      expect(mockUsersService.update).toHaveBeenCalledWith('user-789', updateDto);
    });

    it('should handle empty update', async () => {
      const emptyUpdate: UpdateUserDto = {};

      mockUsersService.update.mockResolvedValue(mockUser);

      const mockRequest = { user: { id: 'user-123' } };
      const result = await controller.updateProfile(mockRequest, emptyUpdate);

      expect(result).toEqual(mockUser);
      expect(mockUsersService.update).toHaveBeenCalledWith('user-123', emptyUpdate);
    });
  });

  describe('authorization', () => {
    it('should only allow users to access their own profile', async () => {
      const user1 = { id: 'user-1' };
      const user2 = { id: 'user-2' };

      mockUsersService.findOne.mockImplementation((id) => {
        return Promise.resolve({ ...mockUser, id });
      });

      const request1 = { user: user1 };
      const request2 = { user: user2 };

      await controller.getProfile(request1);
      expect(mockUsersService.findOne).toHaveBeenCalledWith('user-1');

      await controller.getProfile(request2);
      expect(mockUsersService.findOne).toHaveBeenCalledWith('user-2');
    });

    it('should only allow users to update their own profile', async () => {
      const user1 = { id: 'user-1' };
      const user2 = { id: 'user-2' };

      const updateDto: UpdateUserDto = { firstName: 'Updated' };

      mockUsersService.update.mockImplementation((id, data) => {
        return Promise.resolve({ ...mockUser, id, ...data });
      });

      const request1 = { user: user1 };
      const request2 = { user: user2 };

      await controller.updateProfile(request1, updateDto);
      expect(mockUsersService.update).toHaveBeenCalledWith('user-1', updateDto);

      await controller.updateProfile(request2, updateDto);
      expect(mockUsersService.update).toHaveBeenCalledWith('user-2', updateDto);
    });
  });
});
