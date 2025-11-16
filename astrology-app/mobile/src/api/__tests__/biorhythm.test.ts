import { biorhythmApi, BiorhythmProfile } from '../biorhythm';
import apiClient from '../client';

// Mock apiClient
jest.mock('../client', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
  },
}));

describe('biorhythmApi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockBiorhythmProfile: BiorhythmProfile = {
    id: 'bio_123',
    personId: 'person_456',
    calculatedDate: '2024-11-16',
    data: {
      physical: 85.5,
      emotional: 60.2,
      intellectual: 92.8,
      criticalDays: ['2024-11-20', '2024-11-27'],
      nextPeaks: {
        physical: '2024-11-23',
        emotional: '2024-11-25',
        intellectual: '2024-11-21',
      },
    },
    commentary: 'Your physical and intellectual rhythms are at high levels today.',
    createdAt: '2024-11-16T10:00:00Z',
    updatedAt: '2024-11-16T10:00:00Z',
  };

  describe('calculateBiorhythm', () => {
    it('should calculate biorhythm for a specific date', async () => {
      (apiClient.post as jest.Mock).mockResolvedValue({ data: mockBiorhythmProfile });

      const result = await biorhythmApi.calculateBiorhythm('person_456', '2024-11-16');

      expect(apiClient.post).toHaveBeenCalledWith('/biorhythm/person_456/calculate', {
        date: '2024-11-16',
      });
      expect(result).toEqual(mockBiorhythmProfile);
      expect(result.data.physical).toBe(85.5);
    });

    it('should calculate biorhythm without date (uses current date)', async () => {
      (apiClient.post as jest.Mock).mockResolvedValue({ data: mockBiorhythmProfile });

      const result = await biorhythmApi.calculateBiorhythm('person_456');

      expect(apiClient.post).toHaveBeenCalledWith('/biorhythm/person_456/calculate', {
        date: undefined,
      });
      expect(result).toEqual(mockBiorhythmProfile);
    });

    it('should handle high physical rhythm day', async () => {
      const highPhysical = {
        ...mockBiorhythmProfile,
        data: {
          ...mockBiorhythmProfile.data,
          physical: 95.0,
        },
        commentary: 'Excellent day for physical activities!',
      };

      (apiClient.post as jest.Mock).mockResolvedValue({ data: highPhysical });

      const result = await biorhythmApi.calculateBiorhythm('person_456');

      expect(result.data.physical).toBeGreaterThan(90);
    });

    it('should handle critical days in biorhythm', async () => {
      const criticalDay = {
        ...mockBiorhythmProfile,
        data: {
          ...mockBiorhythmProfile.data,
          criticalDays: ['2024-11-16', '2024-11-17'],
        },
        commentary: 'Be cautious - critical day for multiple rhythms.',
      };

      (apiClient.post as jest.Mock).mockResolvedValue({ data: criticalDay });

      const result = await biorhythmApi.calculateBiorhythm('person_456', '2024-11-16');

      expect(result.data.criticalDays).toContain('2024-11-16');
      expect(result.data.criticalDays.length).toBeGreaterThan(0);
    });

    it('should handle errors when calculating biorhythm', async () => {
      const mockError = new Error('Person not found');
      (apiClient.post as jest.Mock).mockRejectedValue(mockError);

      await expect(biorhythmApi.calculateBiorhythm('invalid_id')).rejects.toThrow(
        'Person not found'
      );
    });

    it('should handle all three rhythms at peak levels', async () => {
      const allPeaks = {
        ...mockBiorhythmProfile,
        data: {
          physical: 98.5,
          emotional: 96.3,
          intellectual: 99.1,
          criticalDays: [],
          nextPeaks: {
            physical: '2024-12-10',
            emotional: '2024-12-08',
            intellectual: '2024-12-06',
          },
        },
        commentary: 'Exceptional day - all rhythms at peak!',
      };

      (apiClient.post as jest.Mock).mockResolvedValue({ data: allPeaks });

      const result = await biorhythmApi.calculateBiorhythm('person_456');

      expect(result.data.physical).toBeGreaterThan(95);
      expect(result.data.emotional).toBeGreaterThan(95);
      expect(result.data.intellectual).toBeGreaterThan(95);
    });
  });

  describe('getLatestBiorhythm', () => {
    it('should fetch the latest biorhythm profile', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockBiorhythmProfile });

      const result = await biorhythmApi.getLatestBiorhythm('person_456');

      expect(apiClient.get).toHaveBeenCalledWith('/biorhythm/person_456/latest');
      expect(result).toEqual(mockBiorhythmProfile);
    });

    it('should handle no previous biorhythm calculation', async () => {
      const mockError = new Error('No biorhythm profile found');
      (apiClient.get as jest.Mock).mockRejectedValue(mockError);

      await expect(biorhythmApi.getLatestBiorhythm('person_456')).rejects.toThrow(
        'No biorhythm profile found'
      );
    });

    it('should fetch latest with low emotional rhythm', async () => {
      const lowEmotional = {
        ...mockBiorhythmProfile,
        data: {
          ...mockBiorhythmProfile.data,
          emotional: 15.2,
        },
        commentary: 'Low emotional energy today - focus on rest.',
      };

      (apiClient.get as jest.Mock).mockResolvedValue({ data: lowEmotional });

      const result = await biorhythmApi.getLatestBiorhythm('person_456');

      expect(result.data.emotional).toBeLessThan(20);
    });

    it('should include next peak dates', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockBiorhythmProfile });

      const result = await biorhythmApi.getLatestBiorhythm('person_456');

      expect(result.data.nextPeaks.physical).toBeDefined();
      expect(result.data.nextPeaks.emotional).toBeDefined();
      expect(result.data.nextPeaks.intellectual).toBeDefined();
    });
  });

  describe('Biorhythm value ranges', () => {
    it('should handle biorhythm values between 0-100', async () => {
      const validRanges = {
        ...mockBiorhythmProfile,
        data: {
          physical: 50.0,
          emotional: 75.5,
          intellectual: 25.8,
          criticalDays: [],
          nextPeaks: mockBiorhythmProfile.data.nextPeaks,
        },
      };

      (apiClient.post as jest.Mock).mockResolvedValue({ data: validRanges });

      const result = await biorhythmApi.calculateBiorhythm('person_456');

      expect(result.data.physical).toBeGreaterThanOrEqual(0);
      expect(result.data.physical).toBeLessThanOrEqual(100);
      expect(result.data.emotional).toBeGreaterThanOrEqual(0);
      expect(result.data.emotional).toBeLessThanOrEqual(100);
      expect(result.data.intellectual).toBeGreaterThanOrEqual(0);
      expect(result.data.intellectual).toBeLessThanOrEqual(100);
    });
  });
});
