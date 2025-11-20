import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { ProfilesController } from './profiles.controller';
import { ProfilesService } from './profiles.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

describe('ProfilesController', () => {
  let controller: ProfilesController;
  let profilesService: ProfilesService;

  const mockProfilesService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
  };

  const mockProfile = {
    id: 'profile-456',
    userId: 'user-123',
    name: 'John Doe',
    birthDate: '1990-01-15',
    birthTime: '14:30',
    birthCity: 'New York',
    birthCountry: 'United States',
    birthLatitude: 40.7128,
    birthLongitude: -74.0060,
    timezone: 'America/New_York',
    gender: 'male',
    isMainProfile: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfilesController],
      providers: [
        {
          provide: ProfilesService,
          useValue: mockProfilesService,
        },
      ],
    }).compile();

    controller = module.get<ProfilesController>(ProfilesController);
    profilesService = module.get<ProfilesService>(ProfilesService);
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    const createProfileDto: CreateProfileDto = {
      name: 'Jane Smith',
      birthDate: '1985-06-20',
      birthTime: '10:15',
      birthCity: 'Los Angeles',
      birthCountry: 'United States',
      birthLatitude: 34.0522,
      birthLongitude: -118.2437,
      timezone: 'America/Los_Angeles',
      gender: 'female',
    };

    it('should successfully create a new profile', async () => {
      const expectedProfile = {
        id: 'new-profile-789',
        ...createProfileDto,
        userId: mockUser.id,
        isMainProfile: false,
        createdAt: new Date(),
      };

      mockProfilesService.create.mockResolvedValue(expectedProfile);

      const mockRequest = { user: mockUser };
      const result = await controller.create(mockRequest, createProfileDto);

      expect(result).toEqual(expectedProfile);
      expect(mockProfilesService.create).toHaveBeenCalledWith(
        mockUser.id,
        createProfileDto,
      );
      expect(mockProfilesService.create).toHaveBeenCalledTimes(1);
    });

    it('should create profile with minimal required data', async () => {
      const minimalDto: CreateProfileDto = {
        name: 'Minimal Profile',
        birthDate: '1995-12-31',
        birthTime: '00:00',
        birthCity: 'London',
        birthCountry: 'United Kingdom',
        birthLatitude: 51.5074,
        birthLongitude: -0.1278,
      };

      const expectedProfile = {
        id: 'minimal-profile',
        ...minimalDto,
        userId: mockUser.id,
        isMainProfile: false,
        createdAt: new Date(),
      };

      mockProfilesService.create.mockResolvedValue(expectedProfile);

      const mockRequest = { user: mockUser };
      const result = await controller.create(mockRequest, minimalDto);

      expect(result).toEqual(expectedProfile);
      expect(mockProfilesService.create).toHaveBeenCalledWith(mockUser.id, minimalDto);
    });

    it('should throw BadRequestException for invalid input data', async () => {
      const invalidDto = {
        name: '',
        birthDate: 'invalid-date',
      } as any;

      mockProfilesService.create.mockRejectedValue(
        new BadRequestException('Invalid input data'),
      );

      const mockRequest = { user: mockUser };

      await expect(controller.create(mockRequest, invalidDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw ForbiddenException when profile limit is reached', async () => {
      mockProfilesService.create.mockRejectedValue(
        new ForbiddenException('Profile limit reached for current plan'),
      );

      const mockRequest = { user: mockUser };

      await expect(controller.create(mockRequest, createProfileDto)).rejects.toThrow(
        ForbiddenException,
      );
      expect(mockProfilesService.create).toHaveBeenCalledWith(
        mockUser.id,
        createProfileDto,
      );
    });

    it('should pass user ID from authenticated request', async () => {
      const mockRequest = { user: { id: 'different-user-456' } };
      mockProfilesService.create.mockResolvedValue({
        id: 'profile-new',
        ...createProfileDto,
      });

      await controller.create(mockRequest, createProfileDto);

      expect(mockProfilesService.create).toHaveBeenCalledWith(
        'different-user-456',
        createProfileDto,
      );
    });
  });

  describe('findAll', () => {
    it('should return all profiles for authenticated user', async () => {
      const mockProfiles = [
        mockProfile,
        {
          id: 'profile-789',
          userId: 'user-123',
          name: 'Jane Doe',
          birthDate: '1992-05-10',
          isMainProfile: false,
        },
      ];

      mockProfilesService.findAll.mockResolvedValue(mockProfiles);

      const mockRequest = { user: mockUser };
      const result = await controller.findAll(mockRequest);

      expect(result).toEqual(mockProfiles);
      expect(mockProfilesService.findAll).toHaveBeenCalledWith(mockUser.id);
      expect(mockProfilesService.findAll).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when user has no profiles', async () => {
      mockProfilesService.findAll.mockResolvedValue([]);

      const mockRequest = { user: mockUser };
      const result = await controller.findAll(mockRequest);

      expect(result).toEqual([]);
      expect(mockProfilesService.findAll).toHaveBeenCalledWith(mockUser.id);
    });

    it('should only return profiles belonging to authenticated user', async () => {
      const userProfiles = [mockProfile];
      mockProfilesService.findAll.mockResolvedValue(userProfiles);

      const mockRequest = { user: mockUser };
      const result = await controller.findAll(mockRequest);

      expect(result).toEqual(userProfiles);
      expect(result.every(p => p.userId === mockUser.id)).toBe(true);
    });

    it('should handle service errors appropriately', async () => {
      mockProfilesService.findAll.mockRejectedValue(
        new Error('Database connection error'),
      );

      const mockRequest = { user: mockUser };

      await expect(controller.findAll(mockRequest)).rejects.toThrow(
        'Database connection error',
      );
    });
  });

  describe('findOne', () => {
    it('should return a specific profile by ID', async () => {
      mockProfilesService.findOne.mockResolvedValue(mockProfile);

      const mockRequest = { user: mockUser };
      const result = await controller.findOne(mockRequest, mockProfile.id);

      expect(result).toEqual(mockProfile);
      expect(mockProfilesService.findOne).toHaveBeenCalledWith(
        mockProfile.id,
        mockUser.id,
      );
      expect(mockProfilesService.findOne).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundException when profile does not exist', async () => {
      mockProfilesService.findOne.mockRejectedValue(
        new NotFoundException('Profile not found'),
      );

      const mockRequest = { user: mockUser };

      await expect(
        controller.findOne(mockRequest, 'non-existent-id'),
      ).rejects.toThrow(NotFoundException);
      expect(mockProfilesService.findOne).toHaveBeenCalledWith(
        'non-existent-id',
        mockUser.id,
      );
    });

    it('should throw NotFoundException when user tries to access another user\'s profile', async () => {
      mockProfilesService.findOne.mockRejectedValue(
        new NotFoundException('Profile not found'),
      );

      const mockRequest = { user: mockUser };

      await expect(
        controller.findOne(mockRequest, 'other-user-profile'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should return profile with all fields', async () => {
      const completeProfile = {
        ...mockProfile,
        notes: 'Some personal notes',
        gender: 'male',
        timezone: 'America/New_York',
      };

      mockProfilesService.findOne.mockResolvedValue(completeProfile);

      const mockRequest = { user: mockUser };
      const result = await controller.findOne(mockRequest, mockProfile.id);

      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('name');
      expect(result).toHaveProperty('birthDate');
      expect(result).toHaveProperty('birthTime');
      expect(result).toHaveProperty('birthCity');
      expect(result).toHaveProperty('notes');
      expect(result).toHaveProperty('timezone');
    });
  });

  describe('update', () => {
    const updateProfileDto: UpdateProfileDto = {
      name: 'Updated Name',
      notes: 'Updated notes',
    };

    it('should successfully update a profile', async () => {
      const updatedProfile = {
        ...mockProfile,
        ...updateProfileDto,
        updatedAt: new Date(),
      };

      mockProfilesService.update.mockResolvedValue(updatedProfile);

      const mockRequest = { user: mockUser };
      const result = await controller.update(
        mockRequest,
        mockProfile.id,
        updateProfileDto,
      );

      expect(result).toEqual(updatedProfile);
      expect(mockProfilesService.update).toHaveBeenCalledWith(
        mockProfile.id,
        mockUser.id,
        updateProfileDto,
      );
      expect(mockProfilesService.update).toHaveBeenCalledTimes(1);
    });

    it('should update single field', async () => {
      const singleFieldUpdate: UpdateProfileDto = {
        name: 'New Name Only',
      };

      const updatedProfile = {
        ...mockProfile,
        name: 'New Name Only',
        updatedAt: new Date(),
      };

      mockProfilesService.update.mockResolvedValue(updatedProfile);

      const mockRequest = { user: mockUser };
      const result = await controller.update(
        mockRequest,
        mockProfile.id,
        singleFieldUpdate,
      );

      expect(result.name).toBe('New Name Only');
      expect(mockProfilesService.update).toHaveBeenCalledWith(
        mockProfile.id,
        mockUser.id,
        singleFieldUpdate,
      );
    });

    it('should update multiple fields', async () => {
      const multiFieldUpdate: UpdateProfileDto = {
        name: 'New Name',
        birthCity: 'San Francisco',
        birthTime: '18:00',
        notes: 'Updated notes',
      };

      const updatedProfile = {
        ...mockProfile,
        ...multiFieldUpdate,
        updatedAt: new Date(),
      };

      mockProfilesService.update.mockResolvedValue(updatedProfile);

      const mockRequest = { user: mockUser };
      const result = await controller.update(
        mockRequest,
        mockProfile.id,
        multiFieldUpdate,
      );

      expect(result.name).toBe('New Name');
      expect(result.birthCity).toBe('San Francisco');
      expect(result.birthTime).toBe('18:00');
    });

    it('should throw NotFoundException when profile does not exist', async () => {
      mockProfilesService.update.mockRejectedValue(
        new NotFoundException('Profile not found'),
      );

      const mockRequest = { user: mockUser };

      await expect(
        controller.update(mockRequest, 'non-existent-id', updateProfileDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException for invalid update data', async () => {
      const invalidUpdate = {
        birthDate: 'invalid-date-format',
      } as any;

      mockProfilesService.update.mockRejectedValue(
        new BadRequestException('Invalid input data'),
      );

      const mockRequest = { user: mockUser };

      await expect(
        controller.update(mockRequest, mockProfile.id, invalidUpdate),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException when user tries to update another user\'s profile', async () => {
      mockProfilesService.update.mockRejectedValue(
        new NotFoundException('Profile not found'),
      );

      const mockRequest = { user: mockUser };

      await expect(
        controller.update(mockRequest, 'other-user-profile', updateProfileDto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should successfully delete a profile', async () => {
      const deleteResponse = {
        message: 'Profile deleted successfully',
      };

      mockProfilesService.remove.mockResolvedValue(deleteResponse);

      const mockRequest = { user: mockUser };
      const result = await controller.remove(mockRequest, mockProfile.id);

      expect(result).toEqual(deleteResponse);
      expect(mockProfilesService.remove).toHaveBeenCalledWith(
        mockProfile.id,
        mockUser.id,
      );
      expect(mockProfilesService.remove).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundException when profile does not exist', async () => {
      mockProfilesService.remove.mockRejectedValue(
        new NotFoundException('Profile not found'),
      );

      const mockRequest = { user: mockUser };

      await expect(
        controller.remove(mockRequest, 'non-existent-id'),
      ).rejects.toThrow(NotFoundException);
      expect(mockProfilesService.remove).toHaveBeenCalledWith(
        'non-existent-id',
        mockUser.id,
      );
    });

    it('should throw NotFoundException when user tries to delete another user\'s profile', async () => {
      mockProfilesService.remove.mockRejectedValue(
        new NotFoundException('Profile not found'),
      );

      const mockRequest = { user: mockUser };

      await expect(
        controller.remove(mockRequest, 'other-user-profile'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should permanently delete profile data', async () => {
      const deleteResponse = {
        message: 'Profile deleted successfully',
      };

      mockProfilesService.remove.mockResolvedValue(deleteResponse);

      const mockRequest = { user: mockUser };
      await controller.remove(mockRequest, mockProfile.id);

      // Verify deletion was called
      expect(mockProfilesService.remove).toHaveBeenCalled();

      // Simulate trying to find deleted profile
      mockProfilesService.findOne.mockRejectedValue(
        new NotFoundException('Profile not found'),
      );

      await expect(
        controller.findOne(mockRequest, mockProfile.id),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('authorization', () => {
    it('should use user ID from JWT token for all operations', async () => {
      const authenticatedUser = { id: 'authenticated-user-999' };
      const mockRequest = { user: authenticatedUser };

      mockProfilesService.create.mockResolvedValue(mockProfile);
      mockProfilesService.findAll.mockResolvedValue([]);
      mockProfilesService.findOne.mockResolvedValue(mockProfile);
      mockProfilesService.update.mockResolvedValue(mockProfile);
      mockProfilesService.remove.mockResolvedValue({ message: 'Deleted' });

      await controller.create(mockRequest, {} as CreateProfileDto);
      expect(mockProfilesService.create).toHaveBeenCalledWith(
        authenticatedUser.id,
        expect.any(Object),
      );

      await controller.findAll(mockRequest);
      expect(mockProfilesService.findAll).toHaveBeenCalledWith(authenticatedUser.id);

      await controller.findOne(mockRequest, 'profile-id');
      expect(mockProfilesService.findOne).toHaveBeenCalledWith(
        'profile-id',
        authenticatedUser.id,
      );

      await controller.update(mockRequest, 'profile-id', {} as UpdateProfileDto);
      expect(mockProfilesService.update).toHaveBeenCalledWith(
        'profile-id',
        authenticatedUser.id,
        expect.any(Object),
      );

      await controller.remove(mockRequest, 'profile-id');
      expect(mockProfilesService.remove).toHaveBeenCalledWith(
        'profile-id',
        authenticatedUser.id,
      );
    });
  });
});
