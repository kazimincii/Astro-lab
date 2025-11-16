import { chakrasApi, ChakraProfile, ChakraStatus, ChakraState } from '../chakras';
import apiClient from '../client';

// Mock apiClient
jest.mock('../client', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
  },
}));

describe('chakrasApi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const createMockChakraState = (
    name: string,
    status: ChakraStatus,
    score: number
  ): ChakraState => ({
    name,
    status,
    score,
    tips: [`Balance your ${name} chakra through meditation`, 'Practice breathing exercises'],
  });

  const mockChakraProfile: ChakraProfile = {
    id: 'chakra_123',
    personId: 'person_456',
    chakraStates: {
      root: createMockChakraState('Root', ChakraStatus.BALANCED, 75),
      sacral: createMockChakraState('Sacral', ChakraStatus.UNDERACTIVE, 45),
      solarPlexus: createMockChakraState('Solar Plexus', ChakraStatus.BALANCED, 80),
      heart: createMockChakraState('Heart', ChakraStatus.OVERACTIVE, 95),
      throat: createMockChakraState('Throat', ChakraStatus.BALANCED, 70),
      thirdEye: createMockChakraState('Third Eye', ChakraStatus.UNDERACTIVE, 50),
      crown: createMockChakraState('Crown', ChakraStatus.BALANCED, 85),
    },
    overallGuidance:
      'Focus on balancing your Sacral and Third Eye chakras for better energy flow.',
    meditation: {
      recommended: ['Root chakra meditation', 'Heart opening meditation'],
      breathwork: ['Alternate nostril breathing', 'Deep belly breathing'],
    },
    createdAt: '2024-11-16T10:00:00Z',
    updatedAt: '2024-11-16T10:00:00Z',
  };

  describe('generateChakraProfile', () => {
    it('should generate a new chakra profile', async () => {
      (apiClient.post as jest.Mock).mockResolvedValue({ data: mockChakraProfile });

      const result = await chakrasApi.generateChakraProfile('person_456');

      expect(apiClient.post).toHaveBeenCalledWith('/chakras/person_456/generate');
      expect(result).toEqual(mockChakraProfile);
      expect(result.personId).toBe('person_456');
    });

    it('should include all seven chakras', async () => {
      (apiClient.post as jest.Mock).mockResolvedValue({ data: mockChakraProfile });

      const result = await chakrasApi.generateChakraProfile('person_456');

      expect(result.chakraStates.root).toBeDefined();
      expect(result.chakraStates.sacral).toBeDefined();
      expect(result.chakraStates.solarPlexus).toBeDefined();
      expect(result.chakraStates.heart).toBeDefined();
      expect(result.chakraStates.throat).toBeDefined();
      expect(result.chakraStates.thirdEye).toBeDefined();
      expect(result.chakraStates.crown).toBeDefined();
    });

    it('should handle balanced chakras', async () => {
      const allBalanced: ChakraProfile = {
        ...mockChakraProfile,
        chakraStates: {
          root: createMockChakraState('Root', ChakraStatus.BALANCED, 75),
          sacral: createMockChakraState('Sacral', ChakraStatus.BALANCED, 78),
          solarPlexus: createMockChakraState('Solar Plexus', ChakraStatus.BALANCED, 80),
          heart: createMockChakraState('Heart', ChakraStatus.BALANCED, 82),
          throat: createMockChakraState('Throat', ChakraStatus.BALANCED, 76),
          thirdEye: createMockChakraState('Third Eye', ChakraStatus.BALANCED, 79),
          crown: createMockChakraState('Crown', ChakraStatus.BALANCED, 85),
        },
        overallGuidance: 'All chakras are balanced! Continue your spiritual practice.',
      };

      (apiClient.post as jest.Mock).mockResolvedValue({ data: allBalanced });

      const result = await chakrasApi.generateChakraProfile('person_456');

      const allChakrasBalanced = Object.values(result.chakraStates).every(
        (chakra) => chakra.status === ChakraStatus.BALANCED
      );
      expect(allChakrasBalanced).toBe(true);
    });

    it('should handle underactive chakras', async () => {
      const underactiveProfile: ChakraProfile = {
        ...mockChakraProfile,
        chakraStates: {
          ...mockChakraProfile.chakraStates,
          root: createMockChakraState('Root', ChakraStatus.UNDERACTIVE, 30),
          sacral: createMockChakraState('Sacral', ChakraStatus.UNDERACTIVE, 25),
        },
        overallGuidance: 'Focus on grounding exercises to activate lower chakras.',
      };

      (apiClient.post as jest.Mock).mockResolvedValue({ data: underactiveProfile });

      const result = await chakrasApi.generateChakraProfile('person_456');

      expect(result.chakraStates.root.status).toBe(ChakraStatus.UNDERACTIVE);
      expect(result.chakraStates.sacral.status).toBe(ChakraStatus.UNDERACTIVE);
      expect(result.chakraStates.root.score).toBeLessThan(50);
    });

    it('should handle overactive chakras', async () => {
      const overactiveProfile: ChakraProfile = {
        ...mockChakraProfile,
        chakraStates: {
          ...mockChakraProfile.chakraStates,
          throat: createMockChakraState('Throat', ChakraStatus.OVERACTIVE, 98),
          crown: createMockChakraState('Crown', ChakraStatus.OVERACTIVE, 95),
        },
        overallGuidance: 'Practice grounding to balance overactive upper chakras.',
      };

      (apiClient.post as jest.Mock).mockResolvedValue({ data: overactiveProfile });

      const result = await chakrasApi.generateChakraProfile('person_456');

      expect(result.chakraStates.throat.status).toBe(ChakraStatus.OVERACTIVE);
      expect(result.chakraStates.crown.status).toBe(ChakraStatus.OVERACTIVE);
    });

    it('should include meditation recommendations', async () => {
      (apiClient.post as jest.Mock).mockResolvedValue({ data: mockChakraProfile });

      const result = await chakrasApi.generateChakraProfile('person_456');

      expect(result.meditation).toBeDefined();
      expect(result.meditation?.recommended).toBeDefined();
      expect(result.meditation?.breathwork).toBeDefined();
      expect(Array.isArray(result.meditation?.recommended)).toBe(true);
      expect(Array.isArray(result.meditation?.breathwork)).toBe(true);
    });

    it('should provide tips for each chakra', async () => {
      (apiClient.post as jest.Mock).mockResolvedValue({ data: mockChakraProfile });

      const result = await chakrasApi.generateChakraProfile('person_456');

      Object.values(result.chakraStates).forEach((chakra) => {
        expect(Array.isArray(chakra.tips)).toBe(true);
        expect(chakra.tips.length).toBeGreaterThan(0);
      });
    });

    it('should handle errors when generating profile', async () => {
      const mockError = new Error('Person not found');
      (apiClient.post as jest.Mock).mockRejectedValue(mockError);

      await expect(chakrasApi.generateChakraProfile('invalid_id')).rejects.toThrow(
        'Person not found'
      );
    });

    it('should provide overall guidance', async () => {
      (apiClient.post as jest.Mock).mockResolvedValue({ data: mockChakraProfile });

      const result = await chakrasApi.generateChakraProfile('person_456');

      expect(result.overallGuidance).toBeDefined();
      expect(typeof result.overallGuidance).toBe('string');
    });
  });

  describe('getChakraProfile', () => {
    it('should fetch existing chakra profile', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockChakraProfile });

      const result = await chakrasApi.getChakraProfile('person_456');

      expect(apiClient.get).toHaveBeenCalledWith('/chakras/person_456');
      expect(result).toEqual(mockChakraProfile);
    });

    it('should handle profile not found', async () => {
      const mockError = new Error('Chakra profile not found');
      (apiClient.get as jest.Mock).mockRejectedValue(mockError);

      await expect(chakrasApi.getChakraProfile('invalid_id')).rejects.toThrow(
        'Chakra profile not found'
      );
    });

    it('should fetch profile with mixed chakra states', async () => {
      const mixedStates: ChakraProfile = {
        ...mockChakraProfile,
        chakraStates: {
          root: createMockChakraState('Root', ChakraStatus.BALANCED, 70),
          sacral: createMockChakraState('Sacral', ChakraStatus.UNDERACTIVE, 40),
          solarPlexus: createMockChakraState('Solar Plexus', ChakraStatus.OVERACTIVE, 90),
          heart: createMockChakraState('Heart', ChakraStatus.BALANCED, 75),
          throat: createMockChakraState('Throat', ChakraStatus.UNDERACTIVE, 45),
          thirdEye: createMockChakraState('Third Eye', ChakraStatus.BALANCED, 80),
          crown: createMockChakraState('Crown', ChakraStatus.OVERACTIVE, 92),
        },
      };

      (apiClient.get as jest.Mock).mockResolvedValue({ data: mixedStates });

      const result = await chakrasApi.getChakraProfile('person_456');

      const balanced = Object.values(result.chakraStates).filter(
        (c) => c.status === ChakraStatus.BALANCED
      );
      const underactive = Object.values(result.chakraStates).filter(
        (c) => c.status === ChakraStatus.UNDERACTIVE
      );
      const overactive = Object.values(result.chakraStates).filter(
        (c) => c.status === ChakraStatus.OVERACTIVE
      );

      expect(balanced.length).toBeGreaterThan(0);
      expect(underactive.length).toBeGreaterThan(0);
      expect(overactive.length).toBeGreaterThan(0);
    });
  });

  describe('Chakra score ranges', () => {
    it('should have chakra scores between 0-100', async () => {
      (apiClient.post as jest.Mock).mockResolvedValue({ data: mockChakraProfile });

      const result = await chakrasApi.generateChakraProfile('person_456');

      Object.values(result.chakraStates).forEach((chakra) => {
        expect(chakra.score).toBeGreaterThanOrEqual(0);
        expect(chakra.score).toBeLessThanOrEqual(100);
      });
    });

    it('should correlate status with score ranges', async () => {
      (apiClient.post as jest.Mock).mockResolvedValue({ data: mockChakraProfile });

      const result = await chakrasApi.generateChakraProfile('person_456');

      Object.values(result.chakraStates).forEach((chakra) => {
        if (chakra.status === ChakraStatus.UNDERACTIVE) {
          expect(chakra.score).toBeLessThan(60);
        } else if (chakra.status === ChakraStatus.OVERACTIVE) {
          expect(chakra.score).toBeGreaterThan(85);
        } else {
          expect(chakra.score).toBeGreaterThanOrEqual(60);
          expect(chakra.score).toBeLessThanOrEqual(85);
        }
      });
    });
  });
});
