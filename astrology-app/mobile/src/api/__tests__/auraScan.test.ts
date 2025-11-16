import { auraScanApi, AuraReading } from '../auraScan';
import { apiClient } from '../client';

// Mock apiClient
jest.mock('../client', () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
  },
}));

describe('auraScanApi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createReading', () => {
    it('should create an aura reading with uploaded image', async () => {
      const mockReading: AuraReading = {
        id: 'aura_123',
        archetype: 'The Healer',
        sections: {
          vibe: 'Your aura radiates calming energy and compassion.',
          communication: 'You express yourself with clarity and empathy.',
          relationship: 'You form deep, meaningful connections with others.',
          strengths: ['Empathy', 'Intuition', 'Healing abilities'],
          watchOuts: ['Energy drain', 'Boundary issues', 'Over-giving'],
        },
        imageUrl: 'https://storage.example.com/aura_123.jpg',
        createdAt: '2024-01-15T10:30:00Z',
      };

      (apiClient.post as jest.Mock).mockResolvedValue({ data: mockReading });

      const formData = new FormData();
      const result = await auraScanApi.createReading(formData);

      expect(apiClient.post).toHaveBeenCalledWith('/aura-scan', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      expect(result).toEqual(mockReading);
      expect(result.archetype).toBe('The Healer');
    });

    it('should handle different aura archetypes', async () => {
      const mockReading: AuraReading = {
        id: 'aura_456',
        archetype: 'The Warrior',
        sections: {
          vibe: 'Strong, determined energy with a powerful presence.',
          communication: 'Direct and assertive in your expression.',
          relationship: 'You value loyalty and strength in connections.',
          strengths: ['Courage', 'Leadership', 'Determination'],
          watchOuts: ['Aggression', 'Impatience', 'Burnout'],
        },
        imageUrl: 'https://storage.example.com/aura_456.jpg',
        createdAt: '2024-01-15T11:00:00Z',
      };

      (apiClient.post as jest.Mock).mockResolvedValue({ data: mockReading });

      const formData = new FormData();
      const result = await auraScanApi.createReading(formData);

      expect(result.archetype).toBe('The Warrior');
      expect(result.sections.strengths).toContain('Courage');
    });

    it('should include all required sections', async () => {
      const mockReading: AuraReading = {
        id: 'aura_789',
        archetype: 'The Mystic',
        sections: {
          vibe: 'Vibe section',
          communication: 'Communication section',
          relationship: 'Relationship section',
          strengths: ['Strength 1', 'Strength 2'],
          watchOuts: ['Watch out 1', 'Watch out 2'],
        },
        imageUrl: 'https://storage.example.com/aura_789.jpg',
        createdAt: '2024-01-15T12:00:00Z',
      };

      (apiClient.post as jest.Mock).mockResolvedValue({ data: mockReading });

      const formData = new FormData();
      const result = await auraScanApi.createReading(formData);

      expect(result.sections.vibe).toBeDefined();
      expect(result.sections.communication).toBeDefined();
      expect(result.sections.relationship).toBeDefined();
      expect(result.sections.strengths).toBeDefined();
      expect(result.sections.watchOuts).toBeDefined();
    });

    it('should handle upload errors', async () => {
      const mockError = new Error('Image upload failed');
      (apiClient.post as jest.Mock).mockRejectedValue(mockError);

      const formData = new FormData();

      await expect(auraScanApi.createReading(formData)).rejects.toThrow(
        'Image upload failed'
      );
    });

    it('should have multiple strengths', async () => {
      const mockReading: AuraReading = {
        id: 'aura_999',
        archetype: 'The Creator',
        sections: {
          vibe: 'Creative and innovative energy.',
          communication: 'Expressive and imaginative.',
          relationship: 'Inspiring to others.',
          strengths: ['Creativity', 'Innovation', 'Inspiration', 'Vision'],
          watchOuts: ['Perfectionism', 'Scattered focus'],
        },
        imageUrl: 'https://storage.example.com/aura_999.jpg',
        createdAt: '2024-01-15T13:00:00Z',
      };

      (apiClient.post as jest.Mock).mockResolvedValue({ data: mockReading });

      const formData = new FormData();
      const result = await auraScanApi.createReading(formData);

      expect(result.sections.strengths.length).toBeGreaterThan(2);
    });
  });

  describe('getReadingHistory', () => {
    it('should fetch aura reading history', async () => {
      const mockHistory: AuraReading[] = [
        {
          id: 'aura_1',
          archetype: 'The Healer',
          sections: {
            vibe: 'Calming energy',
            communication: 'Clear',
            relationship: 'Deep',
            strengths: ['Empathy'],
            watchOuts: ['Energy drain'],
          },
          imageUrl: 'https://storage.example.com/aura1.jpg',
          createdAt: '2024-01-15T10:00:00Z',
        },
        {
          id: 'aura_2',
          archetype: 'The Warrior',
          sections: {
            vibe: 'Strong energy',
            communication: 'Direct',
            relationship: 'Loyal',
            strengths: ['Courage'],
            watchOuts: ['Aggression'],
          },
          imageUrl: 'https://storage.example.com/aura2.jpg',
          createdAt: '2024-01-10T09:00:00Z',
        },
      ];

      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockHistory });

      const result = await auraScanApi.getReadingHistory();

      expect(apiClient.get).toHaveBeenCalledWith('/aura-scan/history');
      expect(result).toEqual(mockHistory);
      expect(result.length).toBe(2);
    });

    it('should return empty array when no history exists', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ data: [] });

      const result = await auraScanApi.getReadingHistory();

      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });

    it('should handle errors when fetching history', async () => {
      const mockError = new Error('Failed to fetch history');
      (apiClient.get as jest.Mock).mockRejectedValue(mockError);

      await expect(auraScanApi.getReadingHistory()).rejects.toThrow(
        'Failed to fetch history'
      );
    });

    it('should include different archetypes in history', async () => {
      const mockHistory: AuraReading[] = [
        {
          id: 'aura_1',
          archetype: 'The Healer',
          sections: {
            vibe: 'Calming',
            communication: 'Clear',
            relationship: 'Deep',
            strengths: ['Empathy'],
            watchOuts: ['Drain'],
          },
          imageUrl: 'https://storage.example.com/aura1.jpg',
          createdAt: '2024-01-15T10:00:00Z',
        },
        {
          id: 'aura_2',
          archetype: 'The Mystic',
          sections: {
            vibe: 'Spiritual',
            communication: 'Intuitive',
            relationship: 'Connected',
            strengths: ['Intuition'],
            watchOuts: ['Detachment'],
          },
          imageUrl: 'https://storage.example.com/aura2.jpg',
          createdAt: '2024-01-14T10:00:00Z',
        },
        {
          id: 'aura_3',
          archetype: 'The Creator',
          sections: {
            vibe: 'Creative',
            communication: 'Expressive',
            relationship: 'Inspiring',
            strengths: ['Creativity'],
            watchOuts: ['Perfectionism'],
          },
          imageUrl: 'https://storage.example.com/aura3.jpg',
          createdAt: '2024-01-13T10:00:00Z',
        },
      ];

      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockHistory });

      const result = await auraScanApi.getReadingHistory();

      const archetypes = result.map((r) => r.archetype);
      expect(archetypes).toContain('The Healer');
      expect(archetypes).toContain('The Mystic');
      expect(archetypes).toContain('The Creator');
    });
  });

  describe('getReading', () => {
    it('should fetch a single aura reading by id', async () => {
      const mockReading: AuraReading = {
        id: 'aura_123',
        archetype: 'The Sage',
        sections: {
          vibe: 'Wise and contemplative energy.',
          communication: 'Thoughtful and measured speech.',
          relationship: 'You offer guidance and wisdom to others.',
          strengths: ['Wisdom', 'Patience', 'Insight'],
          watchOuts: ['Isolation', 'Over-thinking', 'Rigidity'],
        },
        imageUrl: 'https://storage.example.com/aura_123.jpg',
        createdAt: '2024-01-15T10:00:00Z',
      };

      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockReading });

      const result = await auraScanApi.getReading('aura_123');

      expect(apiClient.get).toHaveBeenCalledWith('/aura-scan/aura_123');
      expect(result).toEqual(mockReading);
      expect(result.id).toBe('aura_123');
      expect(result.archetype).toBe('The Sage');
    });

    it('should handle reading not found', async () => {
      const mockError = new Error('Reading not found');
      (apiClient.get as jest.Mock).mockRejectedValue(mockError);

      await expect(auraScanApi.getReading('invalid_id')).rejects.toThrow(
        'Reading not found'
      );
    });

    it('should fetch reading with complete sections', async () => {
      const mockReading: AuraReading = {
        id: 'aura_456',
        archetype: 'The Explorer',
        sections: {
          vibe: 'Adventurous and curious energy.',
          communication: 'Enthusiastic and engaging.',
          relationship: 'You bring excitement and novelty.',
          strengths: ['Adaptability', 'Curiosity', 'Optimism', 'Freedom'],
          watchOuts: ['Restlessness', 'Commitment issues', 'Impulsiveness'],
        },
        imageUrl: 'https://storage.example.com/aura_456.jpg',
        createdAt: '2024-01-15T11:00:00Z',
      };

      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockReading });

      const result = await auraScanApi.getReading('aura_456');

      expect(result.sections.strengths.length).toBeGreaterThan(0);
      expect(result.sections.watchOuts.length).toBeGreaterThan(0);
    });
  });

  describe('Aura Archetype Validation', () => {
    it('should have valid archetype names', async () => {
      const validArchetypes = [
        'The Healer',
        'The Warrior',
        'The Mystic',
        'The Creator',
        'The Sage',
        'The Explorer',
      ];

      const mockReading: AuraReading = {
        id: 'aura_test',
        archetype: 'The Healer',
        sections: {
          vibe: 'Vibe',
          communication: 'Communication',
          relationship: 'Relationship',
          strengths: ['Strength'],
          watchOuts: ['Watch out'],
        },
        imageUrl: 'https://storage.example.com/aura.jpg',
        createdAt: '2024-01-15T10:00:00Z',
      };

      (apiClient.post as jest.Mock).mockResolvedValue({ data: mockReading });

      const formData = new FormData();
      const result = await auraScanApi.createReading(formData);

      expect(validArchetypes).toContain(result.archetype);
    });

    it('should have non-empty section content', async () => {
      const mockReading: AuraReading = {
        id: 'aura_content',
        archetype: 'The Healer',
        sections: {
          vibe: 'Your aura shows healing energy...',
          communication: 'You communicate with compassion...',
          relationship: 'In relationships, you are nurturing...',
          strengths: ['Empathy', 'Compassion', 'Healing'],
          watchOuts: ['Boundaries', 'Energy management'],
        },
        imageUrl: 'https://storage.example.com/aura.jpg',
        createdAt: '2024-01-15T10:00:00Z',
      };

      (apiClient.post as jest.Mock).mockResolvedValue({ data: mockReading });

      const formData = new FormData();
      const result = await auraScanApi.createReading(formData);

      expect(result.sections.vibe.length).toBeGreaterThan(0);
      expect(result.sections.communication.length).toBeGreaterThan(0);
      expect(result.sections.relationship.length).toBeGreaterThan(0);
    });

    it('should have valid timestamp', async () => {
      const mockReading: AuraReading = {
        id: 'aura_timestamp',
        archetype: 'The Mystic',
        sections: {
          vibe: 'Vibe',
          communication: 'Communication',
          relationship: 'Relationship',
          strengths: ['Strength'],
          watchOuts: ['Watch out'],
        },
        imageUrl: 'https://storage.example.com/aura.jpg',
        createdAt: new Date().toISOString(),
      };

      (apiClient.post as jest.Mock).mockResolvedValue({ data: mockReading });

      const formData = new FormData();
      const result = await auraScanApi.createReading(formData);

      expect(new Date(result.createdAt).getTime()).toBeLessThanOrEqual(
        new Date().getTime()
      );
    });
  });
});
