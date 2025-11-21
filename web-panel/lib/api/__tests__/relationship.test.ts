import { relationshipApi, RelationshipProfile } from '../relationship';
import { apiClient } from '../client';

// Mock apiClient
jest.mock('../client', () => ({
  apiClient: {
    post: jest.fn(),
    get: jest.fn(),
  },
}));

describe('relationshipApi', () => {
  const mockRelationshipProfile: RelationshipProfile = {
    id: 'relationship-123',
    userId: 'user-123',
    person1Id: 'person-1',
    person2Id: 'person-2',
    compatibilityScores: {
      overall: 85,
      emotional: 90,
      communication: 75,
      values: 88,
      physical: 82,
    },
    summary: 'You share a strong emotional connection with excellent compatibility.',
    timeline: {
      past6Months: [
        {
          date: '2023-12-15',
          theme: 'Growth',
          description: 'A period of personal growth brought you closer.',
        },
        {
          date: '2023-10-01',
          theme: 'Communication',
          description: 'Improved communication strengthened your bond.',
        },
      ],
      next6Months: [
        {
          date: '2024-03-15',
          theme: 'Harmony',
          description: 'Expect a harmonious period ahead.',
        },
        {
          date: '2024-05-01',
          theme: 'Adventure',
          description: 'New adventures will bring excitement.',
        },
      ],
    },
    strengths: 'Deep emotional understanding, shared values, and strong communication.',
    challenges: 'Different approaches to conflict resolution may require attention.',
    advice: 'Continue building on your strong foundation with open communication.',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('analyzeCompatibility', () => {
    it('should analyze compatibility between two people', async () => {
      (apiClient.post as jest.Mock).mockResolvedValue({ data: mockRelationshipProfile });

      const result = await relationshipApi.analyzeCompatibility('person-1', 'person-2');

      expect(apiClient.post).toHaveBeenCalledWith('/relationship/analyze', {
        person1Id: 'person-1',
        person2Id: 'person-2',
      });
      expect(result).toEqual(mockRelationshipProfile);
    });

    it('should return compatibility scores for all categories', async () => {
      (apiClient.post as jest.Mock).mockResolvedValue({ data: mockRelationshipProfile });

      const result = await relationshipApi.analyzeCompatibility('person-1', 'person-2');

      expect(result.compatibilityScores).toHaveProperty('overall');
      expect(result.compatibilityScores).toHaveProperty('emotional');
      expect(result.compatibilityScores).toHaveProperty('communication');
      expect(result.compatibilityScores).toHaveProperty('values');
      expect(result.compatibilityScores).toHaveProperty('physical');
    });

    it('should return compatibility scores as numbers', async () => {
      (apiClient.post as jest.Mock).mockResolvedValue({ data: mockRelationshipProfile });

      const result = await relationshipApi.analyzeCompatibility('person-1', 'person-2');

      expect(typeof result.compatibilityScores.overall).toBe('number');
      expect(typeof result.compatibilityScores.emotional).toBe('number');
      expect(typeof result.compatibilityScores.communication).toBe('number');
      expect(typeof result.compatibilityScores.values).toBe('number');
      expect(typeof result.compatibilityScores.physical).toBe('number');
    });

    it('should include summary in the result', async () => {
      (apiClient.post as jest.Mock).mockResolvedValue({ data: mockRelationshipProfile });

      const result = await relationshipApi.analyzeCompatibility('person-1', 'person-2');

      expect(result.summary).toBeDefined();
      expect(typeof result.summary).toBe('string');
      expect(result.summary.length).toBeGreaterThan(0);
    });

    it('should include timeline with past and future events', async () => {
      (apiClient.post as jest.Mock).mockResolvedValue({ data: mockRelationshipProfile });

      const result = await relationshipApi.analyzeCompatibility('person-1', 'person-2');

      expect(result.timeline).toBeDefined();
      expect(result.timeline?.past6Months).toBeDefined();
      expect(result.timeline?.next6Months).toBeDefined();
      expect(Array.isArray(result.timeline?.past6Months)).toBe(true);
      expect(Array.isArray(result.timeline?.next6Months)).toBe(true);
    });

    it('should include strengths and challenges', async () => {
      (apiClient.post as jest.Mock).mockResolvedValue({ data: mockRelationshipProfile });

      const result = await relationshipApi.analyzeCompatibility('person-1', 'person-2');

      expect(result.strengths).toBeDefined();
      expect(result.challenges).toBeDefined();
    });

    it('should include advice', async () => {
      (apiClient.post as jest.Mock).mockResolvedValue({ data: mockRelationshipProfile });

      const result = await relationshipApi.analyzeCompatibility('person-1', 'person-2');

      expect(result.advice).toBeDefined();
      expect(typeof result.advice).toBe('string');
    });

    it('should include createdAt and updatedAt timestamps', async () => {
      (apiClient.post as jest.Mock).mockResolvedValue({ data: mockRelationshipProfile });

      const result = await relationshipApi.analyzeCompatibility('person-1', 'person-2');

      expect(result.createdAt).toBeDefined();
      expect(result.updatedAt).toBeDefined();
    });

    it('should handle null timeline', async () => {
      const profileWithoutTimeline = {
        ...mockRelationshipProfile,
        timeline: null,
      };

      (apiClient.post as jest.Mock).mockResolvedValue({ data: profileWithoutTimeline });

      const result = await relationshipApi.analyzeCompatibility('person-1', 'person-2');

      expect(result.timeline).toBeNull();
    });

    it('should handle null optional fields', async () => {
      const profileWithNulls = {
        ...mockRelationshipProfile,
        timeline: null,
        strengths: null,
        challenges: null,
        advice: null,
      };

      (apiClient.post as jest.Mock).mockResolvedValue({ data: profileWithNulls });

      const result = await relationshipApi.analyzeCompatibility('person-1', 'person-2');

      expect(result.timeline).toBeNull();
      expect(result.strengths).toBeNull();
      expect(result.challenges).toBeNull();
      expect(result.advice).toBeNull();
    });

    it('should handle API errors', async () => {
      const mockError = new Error('Network error');
      (apiClient.post as jest.Mock).mockRejectedValue(mockError);

      await expect(
        relationshipApi.analyzeCompatibility('person-1', 'person-2'),
      ).rejects.toThrow('Network error');
    });

    it('should handle 401 unauthorized errors', async () => {
      const mockError = {
        response: {
          status: 401,
          data: { message: 'Unauthorized' },
        },
      };
      (apiClient.post as jest.Mock).mockRejectedValue(mockError);

      await expect(
        relationshipApi.analyzeCompatibility('person-1', 'person-2'),
      ).rejects.toEqual(mockError);
    });

    it('should handle 404 not found errors', async () => {
      const mockError = {
        response: {
          status: 404,
          data: { message: 'Profile not found' },
        },
      };
      (apiClient.post as jest.Mock).mockRejectedValue(mockError);

      await expect(
        relationshipApi.analyzeCompatibility('person-1', 'person-2'),
      ).rejects.toEqual(mockError);
    });

    it('should call API only once per request', async () => {
      (apiClient.post as jest.Mock).mockResolvedValue({ data: mockRelationshipProfile });

      await relationshipApi.analyzeCompatibility('person-1', 'person-2');

      expect(apiClient.post).toHaveBeenCalledTimes(1);
    });

    it('should handle different person IDs', async () => {
      (apiClient.post as jest.Mock).mockResolvedValue({ data: mockRelationshipProfile });

      await relationshipApi.analyzeCompatibility('person-A', 'person-B');

      expect(apiClient.post).toHaveBeenCalledWith('/relationship/analyze', {
        person1Id: 'person-A',
        person2Id: 'person-B',
      });
    });
  });

  describe('getRelationship', () => {
    it('should get existing relationship analysis', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockRelationshipProfile });

      const result = await relationshipApi.getRelationship('person-1', 'person-2');

      expect(apiClient.get).toHaveBeenCalledWith('/relationship', {
        params: { person1Id: 'person-1', person2Id: 'person-2' },
      });
      expect(result).toEqual(mockRelationshipProfile);
    });

    it('should return complete relationship profile', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockRelationshipProfile });

      const result = await relationshipApi.getRelationship('person-1', 'person-2');

      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('userId');
      expect(result).toHaveProperty('person1Id');
      expect(result).toHaveProperty('person2Id');
      expect(result).toHaveProperty('compatibilityScores');
      expect(result).toHaveProperty('summary');
      expect(result).toHaveProperty('timeline');
      expect(result).toHaveProperty('strengths');
      expect(result).toHaveProperty('challenges');
      expect(result).toHaveProperty('advice');
    });

    it('should use query params for person IDs', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockRelationshipProfile });

      await relationshipApi.getRelationship('person-X', 'person-Y');

      expect(apiClient.get).toHaveBeenCalledWith('/relationship', {
        params: { person1Id: 'person-X', person2Id: 'person-Y' },
      });
    });

    it('should handle 404 when relationship not found', async () => {
      const mockError = {
        response: {
          status: 404,
          data: { message: 'Relationship not found' },
        },
      };
      (apiClient.get as jest.Mock).mockRejectedValue(mockError);

      await expect(
        relationshipApi.getRelationship('person-1', 'person-2'),
      ).rejects.toEqual(mockError);
    });

    it('should handle network errors', async () => {
      const mockError = new Error('Connection timeout');
      (apiClient.get as jest.Mock).mockRejectedValue(mockError);

      await expect(
        relationshipApi.getRelationship('person-1', 'person-2'),
      ).rejects.toThrow('Connection timeout');
    });

    it('should call API only once per request', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockRelationshipProfile });

      await relationshipApi.getRelationship('person-1', 'person-2');

      expect(apiClient.get).toHaveBeenCalledTimes(1);
    });

    it('should handle timeline events correctly', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockRelationshipProfile });

      const result = await relationshipApi.getRelationship('person-1', 'person-2');

      expect(result.timeline?.past6Months[0]).toHaveProperty('date');
      expect(result.timeline?.past6Months[0]).toHaveProperty('theme');
      expect(result.timeline?.past6Months[0]).toHaveProperty('description');
      expect(result.timeline?.next6Months[0]).toHaveProperty('date');
      expect(result.timeline?.next6Months[0]).toHaveProperty('theme');
      expect(result.timeline?.next6Months[0]).toHaveProperty('description');
    });

    it('should return relationship for different person combinations', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockRelationshipProfile });

      await relationshipApi.getRelationship('alice', 'bob');
      expect(apiClient.get).toHaveBeenLastCalledWith('/relationship', {
        params: { person1Id: 'alice', person2Id: 'bob' },
      });

      await relationshipApi.getRelationship('charlie', 'diana');
      expect(apiClient.get).toHaveBeenLastCalledWith('/relationship', {
        params: { person1Id: 'charlie', person2Id: 'diana' },
      });
    });
  });
});
