import { relationshipApi, RelationshipProfile } from '../relationship';
import apiClient from '../client';

// Mock apiClient
jest.mock('../client', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
  },
}));

describe('relationshipApi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockRelationshipProfile: RelationshipProfile = {
    id: 'rel_123',
    userId: 'user_456',
    person1Id: 'person_789',
    person2Id: 'person_012',
    compatibilityScores: {
      overall: 82,
      emotional: 85,
      communication: 78,
      values: 88,
      physical: 75,
    },
    summary:
      'A harmonious partnership with strong emotional connection and shared values. Communication requires conscious effort.',
    timeline: {
      past6Months: [
        {
          date: '2024-05-16',
          theme: 'Growth Together',
          description: 'You both experienced significant personal growth.',
        },
        {
          date: '2024-08-16',
          theme: 'Communication Challenge',
          description: 'A period requiring better understanding.',
        },
      ],
      next6Months: [
        {
          date: '2024-12-16',
          theme: 'Deepening Bond',
          description: 'Your connection will strengthen significantly.',
        },
        {
          date: '2025-03-16',
          theme: 'Shared Goals',
          description: 'Alignment in life direction.',
        },
      ],
    },
    strengths: 'Deep emotional understanding, shared core values, mutual respect.',
    challenges: 'Different communication styles, need for personal space balance.',
    advice:
      'Continue nurturing your emotional bond while honoring individual needs. Practice active listening.',
    createdAt: '2024-11-16T10:00:00Z',
    updatedAt: '2024-11-16T10:00:00Z',
  };

  describe('analyzeCompatibility', () => {
    it('should analyze compatibility between two people', async () => {
      (apiClient.post as jest.Mock).mockResolvedValue({ data: mockRelationshipProfile });

      const result = await relationshipApi.analyzeCompatibility('person_789', 'person_012');

      expect(apiClient.post).toHaveBeenCalledWith('/relationship/analyze', {
        person1Id: 'person_789',
        person2Id: 'person_012',
      });
      expect(result).toEqual(mockRelationshipProfile);
    });

    it('should return high compatibility scores', async () => {
      const highCompatibility: RelationshipProfile = {
        ...mockRelationshipProfile,
        compatibilityScores: {
          overall: 95,
          emotional: 98,
          communication: 92,
          values: 96,
          physical: 93,
        },
        summary: 'Exceptional compatibility! A truly harmonious match.',
      };

      (apiClient.post as jest.Mock).mockResolvedValue({ data: highCompatibility });

      const result = await relationshipApi.analyzeCompatibility('person_1', 'person_2');

      expect(result.compatibilityScores.overall).toBeGreaterThanOrEqual(90);
      expect(result.summary).toContain('Exceptional');
    });

    it('should return moderate compatibility scores', async () => {
      const moderateCompatibility: RelationshipProfile = {
        ...mockRelationshipProfile,
        compatibilityScores: {
          overall: 65,
          emotional: 70,
          communication: 58,
          values: 72,
          physical: 60,
        },
        summary: 'Moderate compatibility. Requires effort and understanding.',
      };

      (apiClient.post as jest.Mock).mockResolvedValue({ data: moderateCompatibility });

      const result = await relationshipApi.analyzeCompatibility('person_1', 'person_2');

      expect(result.compatibilityScores.overall).toBeGreaterThanOrEqual(50);
      expect(result.compatibilityScores.overall).toBeLessThan(80);
    });

    it('should return low compatibility scores', async () => {
      const lowCompatibility: RelationshipProfile = {
        ...mockRelationshipProfile,
        compatibilityScores: {
          overall: 35,
          emotional: 30,
          communication: 42,
          values: 28,
          physical: 40,
        },
        summary: 'Challenging compatibility. Significant differences to navigate.',
        challenges:
          'Fundamental differences in values, emotional needs, and communication styles.',
      };

      (apiClient.post as jest.Mock).mockResolvedValue({ data: lowCompatibility });

      const result = await relationshipApi.analyzeCompatibility('person_1', 'person_2');

      expect(result.compatibilityScores.overall).toBeLessThan(50);
    });

    it('should include all compatibility score categories', async () => {
      (apiClient.post as jest.Mock).mockResolvedValue({ data: mockRelationshipProfile });

      const result = await relationshipApi.analyzeCompatibility('person_1', 'person_2');

      expect(result.compatibilityScores.overall).toBeDefined();
      expect(result.compatibilityScores.emotional).toBeDefined();
      expect(result.compatibilityScores.communication).toBeDefined();
      expect(result.compatibilityScores.values).toBeDefined();
      expect(result.compatibilityScores.physical).toBeDefined();
    });

    it('should include timeline with past and future events', async () => {
      (apiClient.post as jest.Mock).mockResolvedValue({ data: mockRelationshipProfile });

      const result = await relationshipApi.analyzeCompatibility('person_1', 'person_2');

      expect(result.timeline).toBeDefined();
      expect(result.timeline?.past6Months).toBeDefined();
      expect(result.timeline?.next6Months).toBeDefined();
      expect(Array.isArray(result.timeline?.past6Months)).toBe(true);
      expect(Array.isArray(result.timeline?.next6Months)).toBe(true);
    });

    it('should include strengths and challenges', async () => {
      (apiClient.post as jest.Mock).mockResolvedValue({ data: mockRelationshipProfile });

      const result = await relationshipApi.analyzeCompatibility('person_1', 'person_2');

      expect(result.strengths).toBeDefined();
      expect(result.challenges).toBeDefined();
      expect(typeof result.strengths).toBe('string');
      expect(typeof result.challenges).toBe('string');
    });

    it('should include relationship advice', async () => {
      (apiClient.post as jest.Mock).mockResolvedValue({ data: mockRelationshipProfile });

      const result = await relationshipApi.analyzeCompatibility('person_1', 'person_2');

      expect(result.advice).toBeDefined();
      expect(typeof result.advice).toBe('string');
      if (result.advice) {
        expect(result.advice.length).toBeGreaterThan(20);
      }
    });

    it('should handle errors when analyzing compatibility', async () => {
      const mockError = new Error('Person not found');
      (apiClient.post as jest.Mock).mockRejectedValue(mockError);

      await expect(
        relationshipApi.analyzeCompatibility('invalid_1', 'invalid_2')
      ).rejects.toThrow('Person not found');
    });

    it('should handle same person comparison', async () => {
      const samePerson: RelationshipProfile = {
        ...mockRelationshipProfile,
        person1Id: 'person_same',
        person2Id: 'person_same',
        compatibilityScores: {
          overall: 100,
          emotional: 100,
          communication: 100,
          values: 100,
          physical: 100,
        },
        summary: 'Comparing with yourself. Perfect compatibility!',
      };

      (apiClient.post as jest.Mock).mockResolvedValue({ data: samePerson });

      const result = await relationshipApi.analyzeCompatibility('person_same', 'person_same');

      expect(result.compatibilityScores.overall).toBe(100);
    });
  });

  describe('getRelationship', () => {
    it('should fetch existing relationship profile', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockRelationshipProfile });

      const result = await relationshipApi.getRelationship('person_789', 'person_012');

      expect(apiClient.get).toHaveBeenCalledWith('/relationship', {
        params: { person1Id: 'person_789', person2Id: 'person_012' },
      });
      expect(result).toEqual(mockRelationshipProfile);
    });

    it('should handle relationship not found', async () => {
      const mockError = new Error('Relationship profile not found');
      (apiClient.get as jest.Mock).mockRejectedValue(mockError);

      await expect(
        relationshipApi.getRelationship('person_1', 'person_2')
      ).rejects.toThrow('Relationship profile not found');
    });

    it('should fetch relationship with null timeline', async () => {
      const noTimelineProfile: RelationshipProfile = {
        ...mockRelationshipProfile,
        timeline: null,
      };

      (apiClient.get as jest.Mock).mockResolvedValue({ data: noTimelineProfile });

      const result = await relationshipApi.getRelationship('person_1', 'person_2');

      expect(result.timeline).toBeNull();
    });

    it('should fetch relationship with null optional fields', async () => {
      const minimalProfile: RelationshipProfile = {
        ...mockRelationshipProfile,
        strengths: null,
        challenges: null,
        advice: null,
        timeline: null,
      };

      (apiClient.get as jest.Mock).mockResolvedValue({ data: minimalProfile });

      const result = await relationshipApi.getRelationship('person_1', 'person_2');

      expect(result.strengths).toBeNull();
      expect(result.challenges).toBeNull();
      expect(result.advice).toBeNull();
    });
  });

  describe('Timeline Events', () => {
    it('should include detailed past events', async () => {
      (apiClient.post as jest.Mock).mockResolvedValue({ data: mockRelationshipProfile });

      const result = await relationshipApi.analyzeCompatibility('person_1', 'person_2');

      if (result.timeline?.past6Months) {
        result.timeline.past6Months.forEach((event) => {
          expect(event.date).toBeDefined();
          expect(event.theme).toBeDefined();
          expect(event.description).toBeDefined();
        });
      }
    });

    it('should include predictive future events', async () => {
      (apiClient.post as jest.Mock).mockResolvedValue({ data: mockRelationshipProfile });

      const result = await relationshipApi.analyzeCompatibility('person_1', 'person_2');

      if (result.timeline?.next6Months) {
        result.timeline.next6Months.forEach((event) => {
          expect(event.date).toBeDefined();
          expect(event.theme).toBeDefined();
          expect(event.description).toBeDefined();
        });
      }
    });

    it('should have chronological order in timelines', async () => {
      (apiClient.post as jest.Mock).mockResolvedValue({ data: mockRelationshipProfile });

      const result = await relationshipApi.analyzeCompatibility('person_1', 'person_2');

      if (result.timeline?.past6Months && result.timeline.past6Months.length > 1) {
        const dates = result.timeline.past6Months.map((e) => new Date(e.date));
        for (let i = 1; i < dates.length; i++) {
          expect(dates[i].getTime()).toBeGreaterThanOrEqual(dates[i - 1].getTime());
        }
      }
    });
  });

  describe('Compatibility Score Validation', () => {
    it('should have scores between 0 and 100', async () => {
      (apiClient.post as jest.Mock).mockResolvedValue({ data: mockRelationshipProfile });

      const result = await relationshipApi.analyzeCompatibility('person_1', 'person_2');

      const scores = result.compatibilityScores;
      expect(scores.overall).toBeGreaterThanOrEqual(0);
      expect(scores.overall).toBeLessThanOrEqual(100);
      expect(scores.emotional).toBeGreaterThanOrEqual(0);
      expect(scores.emotional).toBeLessThanOrEqual(100);
      expect(scores.communication).toBeGreaterThanOrEqual(0);
      expect(scores.communication).toBeLessThanOrEqual(100);
      expect(scores.values).toBeGreaterThanOrEqual(0);
      expect(scores.values).toBeLessThanOrEqual(100);
      expect(scores.physical).toBeGreaterThanOrEqual(0);
      expect(scores.physical).toBeLessThanOrEqual(100);
    });

    it('should reflect overall score based on category scores', async () => {
      (apiClient.post as jest.Mock).mockResolvedValue({ data: mockRelationshipProfile });

      const result = await relationshipApi.analyzeCompatibility('person_1', 'person_2');

      const scores = result.compatibilityScores;
      const average =
        (scores.emotional + scores.communication + scores.values + scores.physical) / 4;

      // Overall score should be close to the average of other scores
      expect(Math.abs(scores.overall - average)).toBeLessThan(15);
    });
  });

  describe('Summary Quality', () => {
    it('should provide meaningful summary', async () => {
      (apiClient.post as jest.Mock).mockResolvedValue({ data: mockRelationshipProfile });

      const result = await relationshipApi.analyzeCompatibility('person_1', 'person_2');

      expect(result.summary).toBeDefined();
      expect(result.summary.length).toBeGreaterThan(30);
    });

    it('should provide actionable advice', async () => {
      (apiClient.post as jest.Mock).mockResolvedValue({ data: mockRelationshipProfile });

      const result = await relationshipApi.analyzeCompatibility('person_1', 'person_2');

      if (result.advice) {
        expect(result.advice.length).toBeGreaterThan(20);
      }
    });
  });
});
