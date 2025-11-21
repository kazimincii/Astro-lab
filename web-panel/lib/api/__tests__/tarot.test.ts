import { tarotApi, TarotReading } from '../tarot';
import { apiClient } from '../client';

// Mock apiClient
jest.mock('../client', () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
  },
}));

describe('tarotApi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockTarotReading: TarotReading = {
    id: 'reading_123',
    spreadType: 'three-card',
    spreadName: 'Past-Present-Future',
    cards: [
      {
        name: 'The Fool',
        position: 'Past',
        reversed: false,
        meaning: 'New beginnings, innocence, and spontaneity in your past.',
      },
      {
        name: 'The Magician',
        position: 'Present',
        reversed: false,
        meaning: 'Manifestation and resourcefulness in your current situation.',
      },
      {
        name: 'The High Priestess',
        position: 'Future',
        reversed: true,
        meaning: 'Hidden knowledge may be revealed, but trust your intuition.',
      },
    ],
    interpretation:
      'Your journey has been one of new beginnings. Currently, you have the power to manifest your desires. Moving forward, pay attention to your inner wisdom.',
    createdAt: '2024-11-16T10:00:00Z',
  };

  describe('createReading', () => {
    it('should create a three-card tarot reading', async () => {
      (apiClient.post as jest.Mock).mockResolvedValue({ data: mockTarotReading });

      const result = await tarotApi.createReading('three-card');

      expect(apiClient.post).toHaveBeenCalledWith('/tarot/reading', {
        spreadType: 'three-card',
        question: undefined,
      });
      expect(result).toEqual(mockTarotReading);
      expect(result.cards.length).toBe(3);
    });

    it('should create a reading with a specific question', async () => {
      const questionReading: TarotReading = {
        ...mockTarotReading,
        interpretation: 'Regarding your career question: The cards suggest...',
      };

      (apiClient.post as jest.Mock).mockResolvedValue({ data: questionReading });

      const result = await tarotApi.createReading('three-card', 'What about my career?');

      expect(apiClient.post).toHaveBeenCalledWith('/tarot/reading', {
        spreadType: 'three-card',
        question: 'What about my career?',
      });
      expect(result.interpretation).toContain('career');
    });

    it('should create a Celtic Cross spread (10 cards)', async () => {
      const celticCross: TarotReading = {
        id: 'reading_456',
        spreadType: 'celtic-cross',
        spreadName: 'Celtic Cross',
        cards: Array(10).fill({
          name: 'Card',
          position: 'Position',
          reversed: false,
          meaning: 'Meaning',
        }),
        interpretation: 'A comprehensive Celtic Cross reading reveals...',
        createdAt: '2024-11-16T10:00:00Z',
      };

      (apiClient.post as jest.Mock).mockResolvedValue({ data: celticCross });

      const result = await tarotApi.createReading('celtic-cross');

      expect(result.spreadType).toBe('celtic-cross');
      expect(result.cards.length).toBe(10);
    });

    it('should create a single-card reading', async () => {
      const singleCard: TarotReading = {
        id: 'reading_789',
        spreadType: 'single-card',
        spreadName: 'Daily Card',
        cards: [
          {
            name: 'The Star',
            position: 'Daily Guidance',
            reversed: false,
            meaning: 'Hope, faith, and inspiration guide your day.',
          },
        ],
        interpretation: 'Today, the Star brings hope and renewal to your path.',
        createdAt: '2024-11-16T10:00:00Z',
      };

      (apiClient.post as jest.Mock).mockResolvedValue({ data: singleCard });

      const result = await tarotApi.createReading('single-card');

      expect(result.cards.length).toBe(1);
      expect(result.spreadName).toBe('Daily Card');
    });

    it('should handle reversed cards', async () => {
      const reversedReading: TarotReading = {
        ...mockTarotReading,
        cards: [
          {
            name: 'The Tower',
            position: 'Present',
            reversed: true,
            meaning: 'Avoiding necessary change, resisting transformation.',
          },
        ],
      };

      (apiClient.post as jest.Mock).mockResolvedValue({ data: reversedReading });

      const result = await tarotApi.createReading('single-card');

      expect(result.cards[0].reversed).toBe(true);
      expect(result.cards[0].name).toBe('The Tower');
    });

    it('should handle Major Arcana cards', async () => {
      const majorArcana: TarotReading = {
        ...mockTarotReading,
        cards: [
          {
            name: 'The Empress',
            position: 'Position 1',
            reversed: false,
            meaning: 'Abundance, nurturing, and fertility.',
          },
        ],
      };

      (apiClient.post as jest.Mock).mockResolvedValue({ data: majorArcana });

      const result = await tarotApi.createReading('single-card');

      expect(result.cards[0].name).toBe('The Empress');
    });

    it('should handle Minor Arcana cards', async () => {
      const minorArcana: TarotReading = {
        ...mockTarotReading,
        cards: [
          {
            name: 'Ace of Cups',
            position: 'Position 1',
            reversed: false,
            meaning: 'New emotional beginning, love, and intuition.',
          },
        ],
      };

      (apiClient.post as jest.Mock).mockResolvedValue({ data: minorArcana });

      const result = await tarotApi.createReading('single-card');

      expect(result.cards[0].name).toContain('Cups');
    });

    it('should provide interpretation for the reading', async () => {
      (apiClient.post as jest.Mock).mockResolvedValue({ data: mockTarotReading });

      const result = await tarotApi.createReading('three-card');

      expect(result.interpretation).toBeDefined();
      expect(typeof result.interpretation).toBe('string');
      expect(result.interpretation.length).toBeGreaterThan(0);
    });

    it('should handle errors when creating reading', async () => {
      const mockError = new Error('Invalid spread type');
      (apiClient.post as jest.Mock).mockRejectedValue(mockError);

      await expect(tarotApi.createReading('invalid-spread')).rejects.toThrow(
        'Invalid spread type'
      );
    });
  });

  describe('getReadingHistory', () => {
    it('should fetch user reading history', async () => {
      const mockHistory: TarotReading[] = [
        mockTarotReading,
        {
          ...mockTarotReading,
          id: 'reading_456',
          createdAt: '2024-11-15T10:00:00Z',
        },
        {
          ...mockTarotReading,
          id: 'reading_789',
          createdAt: '2024-11-14T10:00:00Z',
        },
      ];

      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockHistory });

      const result = await tarotApi.getReadingHistory();

      expect(apiClient.get).toHaveBeenCalledWith('/tarot/history');
      expect(result).toEqual(mockHistory);
      expect(result.length).toBe(3);
    });

    it('should return empty array when no history exists', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ data: [] });

      const result = await tarotApi.getReadingHistory();

      expect(result).toEqual([]);
      expect(Array.isArray(result)).toBe(true);
    });

    it('should fetch history with different spread types', async () => {
      const mixedHistory: TarotReading[] = [
        { ...mockTarotReading, spreadType: 'three-card' },
        { ...mockTarotReading, id: 'r2', spreadType: 'celtic-cross' },
        { ...mockTarotReading, id: 'r3', spreadType: 'single-card' },
      ];

      (apiClient.get as jest.Mock).mockResolvedValue({ data: mixedHistory });

      const result = await tarotApi.getReadingHistory();

      const spreadTypes = result.map((r) => r.spreadType);
      expect(spreadTypes).toContain('three-card');
      expect(spreadTypes).toContain('celtic-cross');
      expect(spreadTypes).toContain('single-card');
    });

    it('should handle errors when fetching history', async () => {
      const mockError = new Error('Server error');
      (apiClient.get as jest.Mock).mockRejectedValue(mockError);

      await expect(tarotApi.getReadingHistory()).rejects.toThrow('Server error');
    });
  });

  describe('getReading', () => {
    it('should fetch a specific reading by ID', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockTarotReading });

      const result = await tarotApi.getReading('reading_123');

      expect(apiClient.get).toHaveBeenCalledWith('/tarot/reading_123');
      expect(result).toEqual(mockTarotReading);
      expect(result.id).toBe('reading_123');
    });

    it('should handle reading not found', async () => {
      const mockError = new Error('Reading not found');
      (apiClient.get as jest.Mock).mockRejectedValue(mockError);

      await expect(tarotApi.getReading('invalid_id')).rejects.toThrow('Reading not found');
    });

    it('should fetch Celtic Cross reading with all positions', async () => {
      const celticReading: TarotReading = {
        id: 'reading_celtic',
        spreadType: 'celtic-cross',
        spreadName: 'Celtic Cross',
        cards: [
          { name: 'Card 1', position: 'Present', reversed: false, meaning: 'Meaning 1' },
          { name: 'Card 2', position: 'Challenge', reversed: false, meaning: 'Meaning 2' },
          { name: 'Card 3', position: 'Past', reversed: false, meaning: 'Meaning 3' },
          { name: 'Card 4', position: 'Future', reversed: false, meaning: 'Meaning 4' },
          { name: 'Card 5', position: 'Above', reversed: false, meaning: 'Meaning 5' },
          { name: 'Card 6', position: 'Below', reversed: false, meaning: 'Meaning 6' },
          { name: 'Card 7', position: 'Advice', reversed: false, meaning: 'Meaning 7' },
          {
            name: 'Card 8',
            position: 'External Influences',
            reversed: false,
            meaning: 'Meaning 8',
          },
          { name: 'Card 9', position: 'Hopes/Fears', reversed: false, meaning: 'Meaning 9' },
          { name: 'Card 10', position: 'Outcome', reversed: false, meaning: 'Meaning 10' },
        ],
        interpretation: 'Full Celtic Cross interpretation...',
        createdAt: '2024-11-16T10:00:00Z',
      };

      (apiClient.get as jest.Mock).mockResolvedValue({ data: celticReading });

      const result = await tarotApi.getReading('reading_celtic');

      expect(result.cards.length).toBe(10);
      expect(result.cards.map((c) => c.position)).toContain('Outcome');
      expect(result.cards.map((c) => c.position)).toContain('Present');
    });

    it('should preserve card order in reading', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockTarotReading });

      const result = await tarotApi.getReading('reading_123');

      expect(result.cards[0].position).toBe('Past');
      expect(result.cards[1].position).toBe('Present');
      expect(result.cards[2].position).toBe('Future');
    });
  });

  describe('Card information', () => {
    it('should include card names in readings', async () => {
      (apiClient.post as jest.Mock).mockResolvedValue({ data: mockTarotReading });

      const result = await tarotApi.createReading('three-card');

      result.cards.forEach((card) => {
        expect(card.name).toBeDefined();
        expect(typeof card.name).toBe('string');
        expect(card.name.length).toBeGreaterThan(0);
      });
    });

    it('should include meanings for each card', async () => {
      (apiClient.post as jest.Mock).mockResolvedValue({ data: mockTarotReading });

      const result = await tarotApi.createReading('three-card');

      result.cards.forEach((card) => {
        expect(card.meaning).toBeDefined();
        expect(typeof card.meaning).toBe('string');
        expect(card.meaning.length).toBeGreaterThan(0);
      });
    });

    it('should specify card positions', async () => {
      (apiClient.post as jest.Mock).mockResolvedValue({ data: mockTarotReading });

      const result = await tarotApi.createReading('three-card');

      result.cards.forEach((card) => {
        expect(card.position).toBeDefined();
        expect(typeof card.position).toBe('string');
      });
    });
  });
});
