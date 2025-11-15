import { Test, TestingModule } from '@nestjs/testing';
import { ProfilesService } from './profiles.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PersonProfile } from '../../entities/person-profile.entity';
import { Repository } from 'typeorm';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';

describe('ProfilesService', () => {
  let service: ProfilesService;
  let repository: Repository<PersonProfile>;
  let subscriptionsService: SubscriptionsService;

  const mockProfile = {
    id: '1',
    ownerId: 'user-1',
    name: 'John Doe',
    birthDate: new Date('1990-01-01'),
    birthTime: '12:00',
    birthCity: 'New York',
    latitude: 40.7128,
    longitude: -74.006,
    timezone: 'America/New_York',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  };

  const mockSubscriptionsService = {
    getEffectivePlan: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfilesService,
        {
          provide: getRepositoryToken(PersonProfile),
          useValue: mockRepository,
        },
        {
          provide: SubscriptionsService,
          useValue: mockSubscriptionsService,
        },
      ],
    }).compile();

    service = module.get<ProfilesService>(ProfilesService);
    repository = module.get<Repository<PersonProfile>>(getRepositoryToken(PersonProfile));
    subscriptionsService = module.get<SubscriptionsService>(SubscriptionsService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should successfully create a profile when within limits', async () => {
      const createDto = {
        name: 'Jane Doe',
        birthDate: new Date('1995-05-15'),
        birthTime: '14:30',
        birthCity: 'Los Angeles',
        latitude: 34.0522,
        longitude: -118.2437,
        timezone: 'America/Los_Angeles',
      };

      mockSubscriptionsService.getEffectivePlan.mockResolvedValue({
        planType: 'premium',
        maxProfiles: 50,
      });
      mockRepository.count.mockResolvedValue(10);
      mockRepository.create.mockReturnValue({ ...createDto, ownerId: 'user-1' });
      mockRepository.save.mockResolvedValue({ id: '2', ...createDto, ownerId: 'user-1' });

      const result = await service.create('user-1', createDto);

      expect(result).toBeDefined();
      expect(result.name).toBe(createDto.name);
      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('should throw ForbiddenException when profile limit is reached', async () => {
      mockSubscriptionsService.getEffectivePlan.mockResolvedValue({
        planType: 'basic',
        maxProfiles: 2,
      });
      mockRepository.count.mockResolvedValue(2);

      await expect(
        service.create('user-1', {
          name: 'Test',
          birthDate: new Date(),
          birthTime: '12:00',
          birthCity: 'Test',
          timezone: 'UTC',
        }),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('findAll', () => {
    it('should return all profiles for a user', async () => {
      const profiles = [mockProfile];
      mockRepository.find.mockResolvedValue(profiles);

      const result = await service.findAll('user-1');

      expect(result).toEqual(profiles);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { owner: { id: 'user-1' } },
        order: { isMainProfile: 'DESC', createdAt: 'DESC' },
      });
    });
  });

  describe('findOne', () => {
    it('should return a profile by id', async () => {
      mockRepository.findOne.mockResolvedValue(mockProfile);

      const result = await service.findOne('1', 'user-1');

      expect(result).toEqual(mockProfile);
    });

    it('should return null when profile does not exist', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const result = await service.findOne('999', 'user-1');

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update profile successfully', async () => {
      const updateDto = { name: 'Updated Name' };
      const updatedProfile = { ...mockProfile, ...updateDto };
      mockRepository.update.mockResolvedValue({ affected: 1 });
      mockRepository.findOne.mockResolvedValue(updatedProfile);

      const result = await service.update('1', 'user-1', updateDto);

      expect(mockRepository.update).toHaveBeenCalledWith(
        { id: '1', owner: { id: 'user-1' } },
        updateDto,
      );
      expect(result.name).toBe(updateDto.name);
    });
  });

  describe('delete', () => {
    it('should delete profile successfully', async () => {
      mockRepository.delete.mockResolvedValue({ affected: 1 });

      const result = await service.remove('1', 'user-1');

      expect(mockRepository.delete).toHaveBeenCalledWith({
        id: '1',
        owner: { id: 'user-1' },
      });
      expect(result).toEqual({ message: 'Profile deleted successfully' });
    });

    it('should delete even when profile does not exist', async () => {
      mockRepository.delete.mockResolvedValue({ affected: 0 });

      const result = await service.remove('999', 'user-1');

      expect(result).toEqual({ message: 'Profile deleted successfully' });
    });
  });
});
