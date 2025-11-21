import { numerologyApi, NumerologyProfile, NumerologyComparison } from '../numerology';
import { apiClient } from '../client';

// Mock apiClient
jest.mock('../client', () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
  },
}));

describe('numerologyApi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockNumerologyProfile: NumerologyProfile = {
    lifePath: 7,
    destiny: 3,
    soulUrge: 11,
    personality: 5,
    personalYear: 8,
    description:
      'Life Path 7: The seeker of truth and wisdom. You are analytical and introspective.',
    strengths: ['Analytical', 'Intuitive', 'Spiritual', 'Independent'],
    challenges: ['Overthinking', 'Isolation', 'Trust issues', 'Perfectionism'],
  };

  describe('getProfile', () => {
    it('should fetch numerology profile for a user', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockNumerologyProfile });

      const result = await numerologyApi.getProfile('profile_123');

      expect(apiClient.get).toHaveBeenCalledWith('/numerology/profile/profile_123');
      expect(result).toEqual(mockNumerologyProfile);
      expect(result.lifePath).toBe(7);
    });

    it('should handle Life Path 1 profile', async () => {
      const lifePath1: NumerologyProfile = {
        lifePath: 1,
        destiny: 1,
        soulUrge: 8,
        personality: 3,
        personalYear: 5,
        description: 'Life Path 1: The leader and pioneer.',
        strengths: ['Leadership', 'Independence', 'Innovation', 'Courage'],
        challenges: ['Stubbornness', 'Impatience', 'Ego', 'Loneliness'],
      };

      (apiClient.get as jest.Mock).mockResolvedValue({ data: lifePath1 });

      const result = await numerologyApi.getProfile('profile_123');

      expect(result.lifePath).toBe(1);
      expect(result.strengths).toContain('Leadership');
    });

    it('should handle Master Number 11 (Life Path)', async () => {
      const masterNumber: NumerologyProfile = {
        lifePath: 11,
        destiny: 22,
        soulUrge: 33,
        personality: 4,
        personalYear: 9,
        description: 'Life Path 11: Master number - spiritual messenger.',
        strengths: ['Intuition', 'Inspiration', 'Idealism', 'Charisma'],
        challenges: ['Anxiety', 'Oversensitivity', 'Impracticality', 'Self-doubt'],
      };

      (apiClient.get as jest.Mock).mockResolvedValue({ data: masterNumber });

      const result = await numerologyApi.getProfile('profile_123');

      expect(result.lifePath).toBe(11);
      expect(result.destiny).toBe(22);
      expect(result.soulUrge).toBe(33);
    });

    it('should include personal year number', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockNumerologyProfile });

      const result = await numerologyApi.getProfile('profile_123');

      expect(result.personalYear).toBeGreaterThanOrEqual(1);
      expect(result.personalYear).toBeLessThanOrEqual(9);
    });

    it('should handle errors when profile not found', async () => {
      const mockError = new Error('Profile not found');
      (apiClient.get as jest.Mock).mockRejectedValue(mockError);

      await expect(numerologyApi.getProfile('invalid_id')).rejects.toThrow(
        'Profile not found'
      );
    });

    it('should return strengths and challenges arrays', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockNumerologyProfile });

      const result = await numerologyApi.getProfile('profile_123');

      expect(Array.isArray(result.strengths)).toBe(true);
      expect(Array.isArray(result.challenges)).toBe(true);
      expect(result.strengths.length).toBeGreaterThan(0);
      expect(result.challenges.length).toBeGreaterThan(0);
    });
  });

  describe('compareProfiles', () => {
    const mockComparison: NumerologyComparison = {
      compatibility: 78,
      strengths: ['Complementary energies', 'Shared values', 'Emotional connection'],
      challenges: ['Different life paths', 'Communication styles', 'Pace of life'],
      advice:
        'Focus on understanding each other\'s unique perspectives and find balance.',
    };

    it('should compare two numerology profiles', async () => {
      (apiClient.post as jest.Mock).mockResolvedValue({ data: mockComparison });

      const result = await numerologyApi.compareProfiles('profile_1', 'profile_2');

      expect(apiClient.post).toHaveBeenCalledWith('/numerology/compare', {
        profileId1: 'profile_1',
        profileId2: 'profile_2',
      });
      expect(result).toEqual(mockComparison);
      expect(result.compatibility).toBe(78);
    });

    it('should handle high compatibility (90+)', async () => {
      const highCompatibility: NumerologyComparison = {
        compatibility: 95,
        strengths: [
          'Perfect match',
          'Same life path',
          'Harmonious energy',
          'Shared goals',
        ],
        challenges: ['Too similar', 'Need for growth'],
        advice: 'An exceptional match! Nurture this connection.',
      };

      (apiClient.post as jest.Mock).mockResolvedValue({ data: highCompatibility });

      const result = await numerologyApi.compareProfiles('profile_1', 'profile_2');

      expect(result.compatibility).toBeGreaterThanOrEqual(90);
      expect(result.strengths).toContain('Perfect match');
    });

    it('should handle low compatibility (below 50)', async () => {
      const lowCompatibility: NumerologyComparison = {
        compatibility: 35,
        strengths: ['Learning opportunity', 'Growth through challenges'],
        challenges: [
          'Different values',
          'Conflicting energies',
          'Communication barriers',
          'Incompatible goals',
        ],
        advice:
          'This relationship requires significant effort and understanding.',
      };

      (apiClient.post as jest.Mock).mockResolvedValue({ data: lowCompatibility });

      const result = await numerologyApi.compareProfiles('profile_1', 'profile_2');

      expect(result.compatibility).toBeLessThan(50);
      expect(result.challenges.length).toBeGreaterThan(result.strengths.length);
    });

    it('should handle same profile comparison', async () => {
      const sameProfile: NumerologyComparison = {
        compatibility: 100,
        strengths: ['Perfect understanding', 'Identical energies'],
        challenges: [],
        advice: 'You are comparing the same profile.',
      };

      (apiClient.post as jest.Mock).mockResolvedValue({ data: sameProfile });

      const result = await numerologyApi.compareProfiles('profile_1', 'profile_1');

      expect(result.compatibility).toBe(100);
    });

    it('should provide advice for improving compatibility', async () => {
      (apiClient.post as jest.Mock).mockResolvedValue({ data: mockComparison });

      const result = await numerologyApi.compareProfiles('profile_1', 'profile_2');

      expect(result.advice).toBeDefined();
      expect(typeof result.advice).toBe('string');
      expect(result.advice.length).toBeGreaterThan(0);
    });
  });

  describe('analyzeNumber', () => {
    it('should analyze a phone number', async () => {
      const phoneAnalysis = {
        number: '555-1234',
        type: 'phone',
        vibration: 7,
        meaning: 'This number resonates with spiritual energy and introspection.',
        lucky: true,
      };

      (apiClient.post as jest.Mock).mockResolvedValue({ data: phoneAnalysis });

      const result = await numerologyApi.analyzeNumber('555-1234', 'phone');

      expect(apiClient.post).toHaveBeenCalledWith('/numerology/analyze', {
        number: '555-1234',
        type: 'phone',
      });
      expect(result.type).toBe('phone');
      expect(result.vibration).toBe(7);
    });

    it('should analyze an address number', async () => {
      const addressAnalysis = {
        number: '123',
        type: 'address',
        vibration: 6,
        meaning: 'This address promotes harmony and family life.',
        lucky: true,
      };

      (apiClient.post as jest.Mock).mockResolvedValue({ data: addressAnalysis });

      const result = await numerologyApi.analyzeNumber('123', 'address');

      expect(result.type).toBe('address');
      expect(result.meaning).toContain('harmony');
    });

    it('should analyze a license plate number', async () => {
      const plateAnalysis = {
        number: 'ABC-123',
        type: 'license',
        vibration: 1,
        meaning: 'This number carries leadership energy.',
        lucky: false,
      };

      (apiClient.post as jest.Mock).mockResolvedValue({ data: plateAnalysis });

      const result = await numerologyApi.analyzeNumber('ABC-123', 'license');

      expect(result.type).toBe('license');
      expect(result.vibration).toBe(1);
    });

    it('should handle lucky vs unlucky numbers', async () => {
      const luckyNumber = {
        number: '888',
        type: 'custom',
        vibration: 6,
        meaning: 'Extremely lucky number in many cultures.',
        lucky: true,
      };

      (apiClient.post as jest.Mock).mockResolvedValue({ data: luckyNumber });

      const result = await numerologyApi.analyzeNumber('888', 'custom');

      expect(result.lucky).toBe(true);
    });

    it('should handle errors when analyzing invalid number', async () => {
      const mockError = new Error('Invalid number format');
      (apiClient.post as jest.Mock).mockRejectedValue(mockError);

      await expect(numerologyApi.analyzeNumber('invalid', 'phone')).rejects.toThrow(
        'Invalid number format'
      );
    });
  });

  describe('Numerology number ranges', () => {
    it('should validate core numbers are within range 1-9 or master numbers', async () => {
      const validProfile: NumerologyProfile = {
        lifePath: 5,
        destiny: 9,
        soulUrge: 1,
        personality: 7,
        personalYear: 3,
        description: 'Test profile',
        strengths: ['Test'],
        challenges: ['Test'],
      };

      (apiClient.get as jest.Mock).mockResolvedValue({ data: validProfile });

      const result = await numerologyApi.getProfile('profile_123');

      // Core numbers should be 1-9 or master numbers (11, 22, 33)
      const isValidNumber = (num: number) =>
        (num >= 1 && num <= 9) || num === 11 || num === 22 || num === 33;

      expect(isValidNumber(result.lifePath)).toBe(true);
      expect(isValidNumber(result.destiny)).toBe(true);
      expect(isValidNumber(result.soulUrge)).toBe(true);
      expect(isValidNumber(result.personality)).toBe(true);
      expect(result.personalYear).toBeGreaterThanOrEqual(1);
      expect(result.personalYear).toBeLessThanOrEqual(9);
    });
  });
});
