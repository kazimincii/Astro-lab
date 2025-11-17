import { Test, TestingModule } from '@nestjs/testing';
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
    id: '123e4567-e89b-12d3-a456-426614174000',
    email: 'test@example.com',
  };

  const mockProfile = {
    id: 'profile-123',
    name: 'John Doe',
    birthDate: '1990-01-15',
    birthTime: '14:30',
    birthCity: 'New York',
    birthCountry: 'United States',
    birthLatitude: 40.7128,
    birthLongitude: -74.0060,
    isMainProfile: false,
    createdAt: new Date(),
    updatedAt: new Date(),
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

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new profile successfully', async () => {
      const mockRequest = { user: mockUser };
      const createProfileDto: CreateProfileDto = {
        name: 'John Doe',
        birthDate: '1990-01-15',
        birthTime: '14:30',
        birthCity: 'New York',
        birthCountry: 'United States',
        birthLatitude: 40.7128,
        birthLongitude: -74.0060,
        isMainProfile: false,
      };

      mockProfilesService.create.mockResolvedValue(mockProfile);

      const result = await controller.create(mockRequest, createProfileDto);

      expect(result).toEqual(mockProfile);
      expect(profilesService.create).toHaveBeenCalledWith(mockUser.id, createProfileDto);
      expect(profilesService.create).toHaveBeenCalledTimes(1);
    });

    it('should create main profile', async () => {
      const mockRequest = { user: mockUser };
      const createProfileDto: CreateProfileDto = {
        name: 'John Doe',
        birthDate: '1990-01-15',
        birthTime: '14:30',
        birthCity: 'New York',
        birthCountry: 'United States',
        birthLatitude: 40.7128,
        birthLongitude: -74.0060,
        isMainProfile: true,
      };

      const mainProfile = { ...mockProfile, isMainProfile: true };
      mockProfilesService.create.mockResolvedValue(mainProfile);

      const result = await controller.create(mockRequest, createProfileDto);

      expect(result.isMainProfile).toBe(true);
    });

    it('should handle profile limit errors', async () => {
      const mockRequest = { user: mockUser };
      const createProfileDto: CreateProfileDto = {
        name: 'John Doe',
        birthDate: '1990-01-15',
        birthTime: '14:30',
        birthCity: 'New York',
        birthCountry: 'United States',
        birthLatitude: 40.7128,
        birthLongitude: -74.0060,
      };

      mockProfilesService.create.mockRejectedValue(
        new Error('Profile limit reached for current plan'),
      );

      await expect(controller.create(mockRequest, createProfileDto)).rejects.toThrow(
        'Profile limit reached for current plan',
      );
    });
  });

  describe('findAll', () => {
    it('should return all user profiles', async () => {
      const mockRequest = { user: mockUser };
      const expectedProfiles = [
        mockProfile,
        {
          id: 'profile-456',
          name: 'Jane Smith',
          birthDate: '1992-05-20',
          birthTime: '10:15',
          birthCity: 'Los Angeles',
          isMainProfile: true,
        },
      ];

      mockProfilesService.findAll.mockResolvedValue(expectedProfiles);

      const result = await controller.findAll(mockRequest);

      expect(result).toEqual(expectedProfiles);
      expect(profilesService.findAll).toHaveBeenCalledWith(mockUser.id);
      expect(profilesService.findAll).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when no profiles exist', async () => {
      const mockRequest = { user: mockUser };

      mockProfilesService.findAll.mockResolvedValue([]);

      const result = await controller.findAll(mockRequest);

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a specific profile', async () => {
      const mockRequest = { user: mockUser };
      const profileId = 'profile-123';

      mockProfilesService.findOne.mockResolvedValue(mockProfile);

      const result = await controller.findOne(mockRequest, profileId);

      expect(result).toEqual(mockProfile);
      expect(profilesService.findOne).toHaveBeenCalledWith(profileId, mockUser.id);
      expect(profilesService.findOne).toHaveBeenCalledTimes(1);
    });

    it('should handle profile not found', async () => {
      const mockRequest = { user: mockUser };
      const profileId = 'non-existent';

      mockProfilesService.findOne.mockRejectedValue(new Error('Profile not found'));

      await expect(controller.findOne(mockRequest, profileId)).rejects.toThrow(
        'Profile not found',
      );
    });

    it('should prevent access to other users profiles', async () => {
      const mockRequest = { user: mockUser };
      const profileId = 'other-user-profile';

      mockProfilesService.findOne.mockRejectedValue(new Error('Profile not found'));

      await expect(controller.findOne(mockRequest, profileId)).rejects.toThrow(
        'Profile not found',
      );
    });
  });

  describe('update', () => {
    it('should update profile successfully', async () => {
      const mockRequest = { user: mockUser };
      const profileId = 'profile-123';
      const updateProfileDto: UpdateProfileDto = {
        name: 'John Updated Doe',
        birthTime: '15:00',
      };

      const updatedProfile = {
        ...mockProfile,
        name: 'John Updated Doe',
        birthTime: '15:00',
        updatedAt: new Date(),
      };

      mockProfilesService.update.mockResolvedValue(updatedProfile);

      const result = await controller.update(mockRequest, profileId, updateProfileDto);

      expect(result).toEqual(updatedProfile);
      expect(profilesService.update).toHaveBeenCalledWith(
        profileId,
        mockUser.id,
        updateProfileDto,
      );
      expect(profilesService.update).toHaveBeenCalledTimes(1);
    });

    it('should update only specified fields', async () => {
      const mockRequest = { user: mockUser };
      const profileId = 'profile-123';
      const updateProfileDto: UpdateProfileDto = {
        birthTime: '16:45',
      };

      const updatedProfile = {
        ...mockProfile,
        birthTime: '16:45',
      };

      mockProfilesService.update.mockResolvedValue(updatedProfile);

      const result = await controller.update(mockRequest, profileId, updateProfileDto);

      expect(result.birthTime).toBe('16:45');
      expect(result.name).toBe(mockProfile.name); // Unchanged
    });

    it('should handle update errors', async () => {
      const mockRequest = { user: mockUser };
      const profileId = 'non-existent';
      const updateProfileDto: UpdateProfileDto = {
        name: 'New Name',
      };

      mockProfilesService.update.mockRejectedValue(new Error('Profile not found'));

      await expect(
        controller.update(mockRequest, profileId, updateProfileDto),
      ).rejects.toThrow('Profile not found');
    });
  });

  describe('remove', () => {
    it('should delete profile successfully', async () => {
      const mockRequest = { user: mockUser };
      const profileId = 'profile-123';
      const expectedResponse = {
        message: 'Profile deleted successfully',
      };

      mockProfilesService.remove.mockResolvedValue(expectedResponse);

      const result = await controller.remove(mockRequest, profileId);

      expect(result).toEqual(expectedResponse);
      expect(profilesService.remove).toHaveBeenCalledWith(profileId, mockUser.id);
      expect(profilesService.remove).toHaveBeenCalledTimes(1);
    });

    it('should handle delete errors', async () => {
      const mockRequest = { user: mockUser };
      const profileId = 'non-existent';

      mockProfilesService.remove.mockRejectedValue(new Error('Profile not found'));

      await expect(controller.remove(mockRequest, profileId)).rejects.toThrow(
        'Profile not found',
      );
    });

    it('should prevent deletion of other users profiles', async () => {
      const mockRequest = { user: mockUser };
      const profileId = 'other-user-profile';

      mockProfilesService.remove.mockRejectedValue(new Error('Profile not found'));

      await expect(controller.remove(mockRequest, profileId)).rejects.toThrow(
        'Profile not found',
      );
    });
  });
});
