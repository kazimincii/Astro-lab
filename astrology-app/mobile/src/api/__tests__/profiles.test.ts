import { profilesApi } from '../profiles';
import apiClient from '../client';

// Mock apiClient - uses centralized mock from __mocks__/client.ts
jest.mock('../client');

describe('profilesApi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockProfile = {
    id: '1',
    userId: 'user_123',
    name: 'John Doe',
    birthDate: '1990-01-15',
    birthTime: '14:30',
    birthPlace: 'New York, USA',
    sunSign: 'Capricorn',
    moonSign: 'Pisces',
    risingSign: 'Leo',
    relationship: 'Self',
    isMainProfile: true,
    createdAt: '2024-01-01T00:00:00Z',
  };

  describe('getAll', () => {
    it('should fetch all user profiles', async () => {
      const mockProfiles = [
        mockProfile,
        {
          ...mockProfile,
          id: '2',
          name: 'Jane Smith',
          relationship: 'Partner',
          isMainProfile: false,
        },
      ];

      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockProfiles });

      const result = await profilesApi.getAll();

      expect(apiClient.get).toHaveBeenCalledWith('/profiles');
      expect(result).toEqual(mockProfiles);
      expect(result).toHaveLength(2);
    });

    it('should return empty array when no profiles exist', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ data: [] });

      const result = await profilesApi.getAll();

      expect(result).toEqual([]);
    });

    it('should handle errors when fetching profiles', async () => {
      const mockError = new Error('Network error');
      (apiClient.get as jest.Mock).mockRejectedValue(mockError);

      await expect(profilesApi.getAll()).rejects.toThrow('Network error');
    });
  });

  describe('getOne', () => {
    it('should fetch a single profile by id', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockProfile });

      const result = await profilesApi.getOne('1');

      expect(apiClient.get).toHaveBeenCalledWith('/profiles/1');
      expect(result).toEqual(mockProfile);
    });

    it('should handle profile not found', async () => {
      const mockError = new Error('Profile not found');
      (apiClient.get as jest.Mock).mockRejectedValue(mockError);

      await expect(profilesApi.getOne('999')).rejects.toThrow('Profile not found');
    });
  });

  describe('create', () => {
    it('should create a new profile', async () => {
      const newProfileData = {
        name: 'Alice Johnson',
        birthDate: '1995-03-20',
        birthTime: '08:15',
        birthPlace: 'London, UK',
        relationship: 'Friend',
      };

      const createdProfile = {
        id: '3',
        ...newProfileData,
        userId: 'user_123',
        isMainProfile: false,
        createdAt: '2024-11-16T00:00:00Z',
      };

      (apiClient.post as jest.Mock).mockResolvedValue({ data: createdProfile });

      const result = await profilesApi.create(newProfileData);

      expect(apiClient.post).toHaveBeenCalledWith('/profiles', newProfileData);
      expect(result).toEqual(createdProfile);
    });

    it('should handle profile limit exceeded', async () => {
      const mockError = new Error('Profile limit exceeded');
      (apiClient.post as jest.Mock).mockRejectedValue(mockError);

      await expect(
        profilesApi.create({
          name: 'Test User',
          birthDate: '2000-01-01',
        })
      ).rejects.toThrow('Profile limit exceeded');
    });

    it('should handle validation errors', async () => {
      const mockError = new Error('Invalid birth date format');
      (apiClient.post as jest.Mock).mockRejectedValue(mockError);

      await expect(
        profilesApi.create({
          name: 'Test User',
          birthDate: 'invalid-date',
        })
      ).rejects.toThrow('Invalid birth date format');
    });
  });

  describe('update', () => {
    it('should update an existing profile', async () => {
      const updateData = {
        name: 'John Updated',
        birthPlace: 'Los Angeles, USA',
      };

      const updatedProfile = {
        ...mockProfile,
        ...updateData,
        updatedAt: '2024-11-16T00:00:00Z',
      };

      (apiClient.patch as jest.Mock).mockResolvedValue({ data: updatedProfile });

      const result = await profilesApi.update('1', updateData);

      expect(apiClient.patch).toHaveBeenCalledWith('/profiles/1', updateData);
      expect(result).toEqual(updatedProfile);
    });

    it('should handle profile not found on update', async () => {
      const mockError = new Error('Profile not found');
      (apiClient.patch as jest.Mock).mockRejectedValue(mockError);

      await expect(profilesApi.update('999', { name: 'Test' })).rejects.toThrow(
        'Profile not found'
      );
    });
  });

  describe('delete', () => {
    it('should delete a profile successfully', async () => {
      const mockResponse = { success: true, message: 'Profile deleted' };

      (apiClient.delete as jest.Mock).mockResolvedValue({ data: mockResponse });

      const result = await profilesApi.delete('2');

      expect(apiClient.delete).toHaveBeenCalledWith('/profiles/2');
      expect(result).toEqual(mockResponse);
    });

    it('should handle cannot delete main profile', async () => {
      const mockError = new Error('Cannot delete main profile');
      (apiClient.delete as jest.Mock).mockRejectedValue(mockError);

      await expect(profilesApi.delete('1')).rejects.toThrow('Cannot delete main profile');
    });

    it('should handle profile not found on delete', async () => {
      const mockError = new Error('Profile not found');
      (apiClient.delete as jest.Mock).mockRejectedValue(mockError);

      await expect(profilesApi.delete('999')).rejects.toThrow('Profile not found');
    });
  });
});
