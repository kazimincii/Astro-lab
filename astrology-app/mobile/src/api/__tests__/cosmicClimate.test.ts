import { cosmicClimateApi, CosmicClimatePost } from '../cosmicClimate';
import { apiClient } from '../client';

// Mock apiClient
jest.mock('../client', () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
  },
}));

describe('cosmicClimateApi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getToday', () => {
    it('should fetch today\'s cosmic climate post', async () => {
      const mockPost: CosmicClimatePost = {
        id: 'post_123',
        date: '2024-01-15',
        moonPhase: 'Waxing Crescent',
        moonSign: 'Taurus',
        energy: 'Grounding and stable energy today. Focus on practical matters.',
        majorAspects: [
          'Venus trine Jupiter - favorable for love and abundance',
          'Mars square Saturn - patience needed in actions',
        ],
        retrogrades: ['Mercury retrograde until Jan 18'],
        themes: ['Patience', 'Practicality', 'Building foundations'],
        recommendations: [
          'Focus on financial planning',
          'Avoid impulsive decisions',
          'Practice gratitude',
        ],
        reactionCounts: {
          '❤️': 45,
          '🌟': 32,
          '🙏': 28,
        },
      };

      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockPost });

      const result = await cosmicClimateApi.getToday();

      expect(apiClient.get).toHaveBeenCalledWith('/cosmic-climate/today');
      expect(result).toEqual(mockPost);
      expect(result.date).toBe('2024-01-15');
    });

    it('should include all required fields', async () => {
      const mockPost: CosmicClimatePost = {
        id: 'post_456',
        date: '2024-01-16',
        moonPhase: 'First Quarter',
        moonSign: 'Leo',
        energy: 'Creative and expressive energy.',
        majorAspects: ['Sun conjunct Mercury'],
        retrogrades: [],
        themes: ['Creativity', 'Expression'],
        recommendations: ['Express yourself', 'Take action'],
        reactionCounts: {},
      };

      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockPost });

      const result = await cosmicClimateApi.getToday();

      expect(result.moonPhase).toBeDefined();
      expect(result.moonSign).toBeDefined();
      expect(result.energy).toBeDefined();
      expect(result.majorAspects).toBeDefined();
      expect(result.retrogrades).toBeDefined();
      expect(result.themes).toBeDefined();
      expect(result.recommendations).toBeDefined();
    });

    it('should handle errors when fetching today\'s post', async () => {
      const mockError = new Error('Failed to fetch cosmic climate');
      (apiClient.get as jest.Mock).mockRejectedValue(mockError);

      await expect(cosmicClimateApi.getToday()).rejects.toThrow(
        'Failed to fetch cosmic climate'
      );
    });

    it('should include multiple major aspects', async () => {
      const mockPost: CosmicClimatePost = {
        id: 'post_789',
        date: '2024-01-17',
        moonPhase: 'Waxing Gibbous',
        moonSign: 'Virgo',
        energy: 'Analytical and detail-oriented energy.',
        majorAspects: [
          'Sun trine Mars - high energy',
          'Venus square Neptune - clarity in love needed',
          'Jupiter sextile Pluto - transformative growth',
        ],
        retrogrades: ['Mercury retrograde'],
        themes: ['Analysis', 'Health', 'Organization'],
        recommendations: ['Review details', 'Health checkup', 'Organize workspace'],
        reactionCounts: { '✨': 20 },
      };

      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockPost });

      const result = await cosmicClimateApi.getToday();

      expect(result.majorAspects.length).toBeGreaterThan(2);
    });
  });

  describe('getRecent', () => {
    it('should fetch recent posts with default limit', async () => {
      const mockPosts: CosmicClimatePost[] = [
        {
          id: 'post_1',
          date: '2024-01-15',
          moonPhase: 'Waxing Crescent',
          moonSign: 'Taurus',
          energy: 'Energy 1',
          majorAspects: ['Aspect 1'],
          retrogrades: [],
          themes: ['Theme 1'],
          recommendations: ['Rec 1'],
          reactionCounts: {},
        },
        {
          id: 'post_2',
          date: '2024-01-14',
          moonPhase: 'New Moon',
          moonSign: 'Aries',
          energy: 'Energy 2',
          majorAspects: ['Aspect 2'],
          retrogrades: [],
          themes: ['Theme 2'],
          recommendations: ['Rec 2'],
          reactionCounts: {},
        },
      ];

      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockPosts });

      const result = await cosmicClimateApi.getRecent();

      expect(apiClient.get).toHaveBeenCalledWith('/cosmic-climate/recent', {
        params: { limit: 7 },
      });
      expect(result).toEqual(mockPosts);
      expect(result.length).toBe(2);
    });

    it('should fetch recent posts with custom limit', async () => {
      const mockPosts: CosmicClimatePost[] = [
        {
          id: 'post_1',
          date: '2024-01-15',
          moonPhase: 'Full Moon',
          moonSign: 'Cancer',
          energy: 'Emotional intensity',
          majorAspects: [],
          retrogrades: [],
          themes: ['Emotions'],
          recommendations: ['Release'],
          reactionCounts: {},
        },
      ];

      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockPosts });

      const result = await cosmicClimateApi.getRecent(3);

      expect(apiClient.get).toHaveBeenCalledWith('/cosmic-climate/recent', {
        params: { limit: 3 },
      });
    });

    it('should return posts in chronological order (newest first)', async () => {
      const mockPosts: CosmicClimatePost[] = [
        {
          id: 'post_1',
          date: '2024-01-15',
          moonPhase: 'Waxing Gibbous',
          moonSign: 'Libra',
          energy: 'Energy 1',
          majorAspects: [],
          retrogrades: [],
          themes: [],
          recommendations: [],
          reactionCounts: {},
        },
        {
          id: 'post_2',
          date: '2024-01-14',
          moonPhase: 'First Quarter',
          moonSign: 'Virgo',
          energy: 'Energy 2',
          majorAspects: [],
          retrogrades: [],
          themes: [],
          recommendations: [],
          reactionCounts: {},
        },
        {
          id: 'post_3',
          date: '2024-01-13',
          moonPhase: 'Waxing Crescent',
          moonSign: 'Leo',
          energy: 'Energy 3',
          majorAspects: [],
          retrogrades: [],
          themes: [],
          recommendations: [],
          reactionCounts: {},
        },
      ];

      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockPosts });

      const result = await cosmicClimateApi.getRecent(3);

      expect(new Date(result[0].date).getTime()).toBeGreaterThan(
        new Date(result[1].date).getTime()
      );
      expect(new Date(result[1].date).getTime()).toBeGreaterThan(
        new Date(result[2].date).getTime()
      );
    });

    it('should handle errors when fetching recent posts', async () => {
      const mockError = new Error('Failed to fetch recent posts');
      (apiClient.get as jest.Mock).mockRejectedValue(mockError);

      await expect(cosmicClimateApi.getRecent()).rejects.toThrow(
        'Failed to fetch recent posts'
      );
    });

    it('should include reaction counts for each post', async () => {
      const mockPosts: CosmicClimatePost[] = [
        {
          id: 'post_1',
          date: '2024-01-15',
          moonPhase: 'Full Moon',
          moonSign: 'Scorpio',
          energy: 'Intense energy',
          majorAspects: [],
          retrogrades: [],
          themes: ['Transformation'],
          recommendations: ['Deep work'],
          reactionCounts: {
            '❤️': 50,
            '🌟': 35,
            '🔥': 20,
          },
        },
      ];

      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockPosts });

      const result = await cosmicClimateApi.getRecent();

      expect(result[0].reactionCounts).toBeDefined();
      expect(Object.keys(result[0].reactionCounts).length).toBeGreaterThan(0);
    });
  });

  describe('getByDate', () => {
    it('should fetch cosmic climate post by specific date', async () => {
      const mockPost: CosmicClimatePost = {
        id: 'post_specific',
        date: '2024-01-10',
        moonPhase: 'New Moon',
        moonSign: 'Capricorn',
        energy: 'New beginnings in career and ambition.',
        majorAspects: ['Sun conjunct Moon - New Moon energy'],
        retrogrades: [],
        themes: ['New beginnings', 'Career', 'Ambition'],
        recommendations: ['Set intentions', 'Start projects', 'Plan goals'],
        reactionCounts: { '🌙': 100, '✨': 75 },
      };

      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockPost });

      const result = await cosmicClimateApi.getByDate('2024-01-10');

      expect(apiClient.get).toHaveBeenCalledWith('/cosmic-climate/date/2024-01-10');
      expect(result).toEqual(mockPost);
      expect(result.date).toBe('2024-01-10');
    });

    it('should handle post not found for date', async () => {
      const mockError = new Error('Post not found for this date');
      (apiClient.get as jest.Mock).mockRejectedValue(mockError);

      await expect(cosmicClimateApi.getByDate('2020-01-01')).rejects.toThrow(
        'Post not found for this date'
      );
    });

    it('should fetch post with retrograde information', async () => {
      const mockPost: CosmicClimatePost = {
        id: 'post_retro',
        date: '2024-01-12',
        moonPhase: 'Waxing Crescent',
        moonSign: 'Pisces',
        energy: 'Reflective and introspective.',
        majorAspects: [],
        retrogrades: [
          'Mercury retrograde until Jan 18',
          'Uranus retrograde until Jan 27',
        ],
        themes: ['Reflection', 'Review', 'Patience'],
        recommendations: [
          'Review past decisions',
          'Avoid signing contracts',
          'Back up data',
        ],
        reactionCounts: {},
      };

      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockPost });

      const result = await cosmicClimateApi.getByDate('2024-01-12');

      expect(result.retrogrades.length).toBeGreaterThan(0);
      expect(result.retrogrades).toContain('Mercury retrograde until Jan 18');
    });

    it('should fetch post with no retrogrades', async () => {
      const mockPost: CosmicClimatePost = {
        id: 'post_clear',
        date: '2024-02-01',
        moonPhase: 'Full Moon',
        moonSign: 'Aquarius',
        energy: 'Clear skies, all planets direct.',
        majorAspects: ['Sun opposite Moon - Full Moon illumination'],
        retrogrades: [],
        themes: ['Clarity', 'Progress', 'Forward movement'],
        recommendations: ['Move forward', 'Launch projects', 'Take action'],
        reactionCounts: { '🚀': 60 },
      };

      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockPost });

      const result = await cosmicClimateApi.getByDate('2024-02-01');

      expect(result.retrogrades.length).toBe(0);
    });
  });

  describe('react', () => {
    it('should add a reaction to a post', async () => {
      (apiClient.post as jest.Mock).mockResolvedValue({ data: {} });

      await cosmicClimateApi.react('post_123', '❤️');

      expect(apiClient.post).toHaveBeenCalledWith('/cosmic-climate/post_123/react', {
        emoji: '❤️',
      });
    });

    it('should handle different emoji reactions', async () => {
      (apiClient.post as jest.Mock).mockResolvedValue({ data: {} });

      const emojis = ['❤️', '🌟', '🙏', '✨', '🔥'];

      for (const emoji of emojis) {
        await cosmicClimateApi.react('post_456', emoji);
        expect(apiClient.post).toHaveBeenCalledWith('/cosmic-climate/post_456/react', {
          emoji,
        });
      }
    });

    it('should handle reaction errors', async () => {
      const mockError = new Error('Failed to add reaction');
      (apiClient.post as jest.Mock).mockRejectedValue(mockError);

      await expect(cosmicClimateApi.react('post_789', '❤️')).rejects.toThrow(
        'Failed to add reaction'
      );
    });

    it('should handle post not found when reacting', async () => {
      const mockError = new Error('Post not found');
      (apiClient.post as jest.Mock).mockRejectedValue(mockError);

      await expect(cosmicClimateApi.react('invalid_post', '🌟')).rejects.toThrow(
        'Post not found'
      );
    });
  });

  describe('Moon Phase and Sign Validation', () => {
    it('should have valid moon phases', async () => {
      const validPhases = [
        'New Moon',
        'Waxing Crescent',
        'First Quarter',
        'Waxing Gibbous',
        'Full Moon',
        'Waning Gibbous',
        'Last Quarter',
        'Waning Crescent',
      ];

      const mockPost: CosmicClimatePost = {
        id: 'post_phase',
        date: '2024-01-15',
        moonPhase: 'Full Moon',
        moonSign: 'Leo',
        energy: 'Energy',
        majorAspects: [],
        retrogrades: [],
        themes: [],
        recommendations: [],
        reactionCounts: {},
      };

      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockPost });

      const result = await cosmicClimateApi.getToday();

      expect(validPhases).toContain(result.moonPhase);
    });

    it('should have valid moon signs', async () => {
      const validSigns = [
        'Aries',
        'Taurus',
        'Gemini',
        'Cancer',
        'Leo',
        'Virgo',
        'Libra',
        'Scorpio',
        'Sagittarius',
        'Capricorn',
        'Aquarius',
        'Pisces',
      ];

      const mockPost: CosmicClimatePost = {
        id: 'post_sign',
        date: '2024-01-15',
        moonPhase: 'Waxing Crescent',
        moonSign: 'Gemini',
        energy: 'Energy',
        majorAspects: [],
        retrogrades: [],
        themes: [],
        recommendations: [],
        reactionCounts: {},
      };

      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockPost });

      const result = await cosmicClimateApi.getToday();

      expect(validSigns).toContain(result.moonSign);
    });

    it('should have meaningful themes', async () => {
      const mockPost: CosmicClimatePost = {
        id: 'post_themes',
        date: '2024-01-15',
        moonPhase: 'First Quarter',
        moonSign: 'Sagittarius',
        energy: 'Adventurous energy',
        majorAspects: [],
        retrogrades: [],
        themes: ['Adventure', 'Growth', 'Exploration', 'Learning'],
        recommendations: ['Try new things', 'Expand horizons', 'Study'],
        reactionCounts: {},
      };

      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockPost });

      const result = await cosmicClimateApi.getToday();

      expect(result.themes.length).toBeGreaterThan(0);
      expect(result.recommendations.length).toBeGreaterThan(0);
    });
  });
});
