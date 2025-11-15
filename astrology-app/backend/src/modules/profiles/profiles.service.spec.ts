import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BadRequestException } from '@nestjs/common';

import { ProfilesService } from './profiles.service';
import { PersonProfile } from '../../entities/person-profile.entity';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';

describe('ProfilesService', () => {
  let service: ProfilesService;
  let repository: Repository<PersonProfile>;
  const mockRepository = {
    count: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockSubscriptionsService = {
    ensureDefaultSubscription: jest.fn(),
  };

  const baseProfile = {
    id: 'profile-1',
    name: 'John Doe',
    birthDate: new Date('1990-01-01'),
    birthTime: '12:00',
    birthCity: 'New York',
    birthCountry: 'US',
    birthLatitude: 40.7128,
    birthLongitude: -74.006,
    timezone: 'UTC',
    owner: { id: 'user-1' },
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
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });

  describe('create', () => {
    it('should create a profile when usage is below the plan limit', async () => {
      mockSubscriptionsService.ensureDefaultSubscription.mockResolvedValue({
        profileLimit: 5,
        unlimitedActions: false,
      });
      mockRepository.count.mockResolvedValue(2);
      mockRepository.create.mockReturnValue(baseProfile);
      mockRepository.save.mockResolvedValue(baseProfile);

      const result = await service.create('user-1', {
        name: 'John Doe',
        birthDate: baseProfile.birthDate,
        birthTime: baseProfile.birthTime,
        birthCity: baseProfile.birthCity,
        birthCountry: baseProfile.birthCountry,
        birthLatitude: baseProfile.birthLatitude,
        birthLongitude: baseProfile.birthLongitude,
        timezone: baseProfile.timezone,
      });

      expect(result).toEqual(baseProfile);
      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('should throw when profile limit is reached', async () => {
      mockSubscriptionsService.ensureDefaultSubscription.mockResolvedValue({
        profileLimit: 2,
        unlimitedActions: false,
      });
      mockRepository.count.mockResolvedValue(2);

      await expect(
        service.create('user-1', {
          name: 'Jane',
          birthDate: baseProfile.birthDate,
          birthTime: baseProfile.birthTime,
          birthCity: baseProfile.birthCity,
          birthCountry: baseProfile.birthCountry,
          birthLatitude: baseProfile.birthLatitude,
          birthLongitude: baseProfile.birthLongitude,
          timezone: baseProfile.timezone,
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return user profiles ordered by main flag and creation date', async () => {
      mockRepository.find.mockResolvedValue([baseProfile]);
      const result = await service.findAll('user-1');

      expect(result).toEqual([baseProfile]);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { owner: { id: 'user-1' } },
        order: { isMainProfile: 'DESC', createdAt: 'DESC' },
      });
    });
  });

  describe('findOne', () => {
    it('should fetch a profile scoped to the owner', async () => {
      mockRepository.findOne.mockResolvedValue(baseProfile);

      const result = await service.findOne('profile-1', 'user-1');
      expect(result).toEqual(baseProfile);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'profile-1', owner: { id: 'user-1' } },
      });
    });
  });

  describe('update', () => {
    it('should persist updates and return the latest entity', async () => {
      mockRepository.update.mockResolvedValue(undefined);
      mockRepository.findOne.mockResolvedValue({ ...baseProfile, name: 'Updated' });

      const result = await service.update('profile-1', 'user-1', { name: 'Updated' });
      expect(result?.name).toBe('Updated');
      expect(mockRepository.update).toHaveBeenCalledWith(
        { id: 'profile-1', owner: { id: 'user-1' } },
        { name: 'Updated' },
      );
    });
  });

  describe('remove', () => {
    it('should remove a profile by id and owner', async () => {
      mockRepository.delete.mockResolvedValue({ affected: 1 });
      const result = await service.remove('profile-1', 'user-1');

      expect(result).toEqual({ message: 'Profile deleted successfully' });
      expect(mockRepository.delete).toHaveBeenCalledWith({
        id: 'profile-1',
        owner: { id: 'user-1' },
      });
    });
  });
});
