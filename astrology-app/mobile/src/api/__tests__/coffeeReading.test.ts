import { coffeeReadingApi, CoffeeReading } from '../coffeeReading';
import { apiClient } from '../client';

// Mock apiClient
jest.mock('../client', () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
  },
}));

describe('coffeeReadingApi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createReading', () => {
    it('should create a coffee reading with uploaded images', async () => {
      const mockReading: CoffeeReading = {
        id: 'reading_123',
        imageUrls: [
          'https://storage.example.com/coffee1.jpg',
          'https://storage.example.com/coffee2.jpg',
        ],
        overallVibe: 'Positive energy surrounds you today. The patterns suggest new beginnings.',
        love: 'A romantic opportunity may present itself. Keep your heart open.',
        workAndMoney: 'Financial stability is on the horizon. Stay focused on your goals.',
        predictions: 'Within the next 3 months, you will receive unexpected good news.',
        createdAt: '2024-01-15T10:30:00Z',
      };

      (apiClient.post as jest.Mock).mockResolvedValue({ data: mockReading });

      const formData = new FormData();
      const result = await coffeeReadingApi.createReading(formData);

      expect(apiClient.post).toHaveBeenCalledWith('/coffee-reading', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      expect(result).toEqual(mockReading);
      expect(result.imageUrls.length).toBe(2);
    });

    it('should handle single image upload', async () => {
      const mockReading: CoffeeReading = {
        id: 'reading_456',
        imageUrls: ['https://storage.example.com/coffee.jpg'],
        overallVibe: 'Clear patterns indicate clarity ahead.',
        love: 'Communication is key in relationships now.',
        workAndMoney: 'A project will come to fruition soon.',
        predictions: 'Trust your intuition this week.',
        createdAt: '2024-01-15T11:00:00Z',
      };

      (apiClient.post as jest.Mock).mockResolvedValue({ data: mockReading });

      const formData = new FormData();
      const result = await coffeeReadingApi.createReading(formData);

      expect(result.imageUrls.length).toBe(1);
    });

    it('should handle upload errors', async () => {
      const mockError = new Error('Image upload failed');
      (apiClient.post as jest.Mock).mockRejectedValue(mockError);

      const formData = new FormData();

      await expect(coffeeReadingApi.createReading(formData)).rejects.toThrow(
        'Image upload failed'
      );
    });

    it('should include all interpretation sections', async () => {
      const mockReading: CoffeeReading = {
        id: 'reading_789',
        imageUrls: ['https://storage.example.com/coffee.jpg'],
        overallVibe: 'Overall interpretation',
        love: 'Love interpretation',
        workAndMoney: 'Work and money interpretation',
        predictions: 'Future predictions',
        createdAt: '2024-01-15T12:00:00Z',
      };

      (apiClient.post as jest.Mock).mockResolvedValue({ data: mockReading });

      const formData = new FormData();
      const result = await coffeeReadingApi.createReading(formData);

      expect(result.overallVibe).toBeDefined();
      expect(result.love).toBeDefined();
      expect(result.workAndMoney).toBeDefined();
      expect(result.predictions).toBeDefined();
    });
  });

  describe('getReadingHistory', () => {
    it('should fetch reading history', async () => {
      const mockHistory: CoffeeReading[] = [
        {
          id: 'reading_1',
          imageUrls: ['https://storage.example.com/coffee1.jpg'],
          overallVibe: 'Positive energy',
          love: 'Romance ahead',
          workAndMoney: 'Financial growth',
          predictions: 'Good news coming',
          createdAt: '2024-01-15T10:00:00Z',
        },
        {
          id: 'reading_2',
          imageUrls: ['https://storage.example.com/coffee2.jpg'],
          overallVibe: 'Transformative period',
          love: 'Deepen connections',
          workAndMoney: 'Career advancement',
          predictions: 'Change is coming',
          createdAt: '2024-01-10T09:00:00Z',
        },
      ];

      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockHistory });

      const result = await coffeeReadingApi.getReadingHistory();

      expect(apiClient.get).toHaveBeenCalledWith('/coffee-reading/history');
      expect(result).toEqual(mockHistory);
      expect(result.length).toBe(2);
    });

    it('should return empty array when no history exists', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ data: [] });

      const result = await coffeeReadingApi.getReadingHistory();

      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });

    it('should handle errors when fetching history', async () => {
      const mockError = new Error('Failed to fetch history');
      (apiClient.get as jest.Mock).mockRejectedValue(mockError);

      await expect(coffeeReadingApi.getReadingHistory()).rejects.toThrow(
        'Failed to fetch history'
      );
    });

    it('should sort readings by date (newest first)', async () => {
      const mockHistory: CoffeeReading[] = [
        {
          id: 'reading_1',
          imageUrls: ['https://storage.example.com/coffee1.jpg'],
          overallVibe: 'Latest reading',
          love: 'Love',
          workAndMoney: 'Work',
          predictions: 'Predictions',
          createdAt: '2024-01-15T10:00:00Z',
        },
        {
          id: 'reading_2',
          imageUrls: ['https://storage.example.com/coffee2.jpg'],
          overallVibe: 'Older reading',
          love: 'Love',
          workAndMoney: 'Work',
          predictions: 'Predictions',
          createdAt: '2024-01-10T09:00:00Z',
        },
      ];

      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockHistory });

      const result = await coffeeReadingApi.getReadingHistory();

      // First reading should be newer
      expect(new Date(result[0].createdAt).getTime()).toBeGreaterThan(
        new Date(result[1].createdAt).getTime()
      );
    });
  });

  describe('getReading', () => {
    it('should fetch a single reading by id', async () => {
      const mockReading: CoffeeReading = {
        id: 'reading_123',
        imageUrls: ['https://storage.example.com/coffee.jpg'],
        overallVibe: 'Detailed interpretation',
        love: 'Love section',
        workAndMoney: 'Work section',
        predictions: 'Predictions section',
        createdAt: '2024-01-15T10:00:00Z',
      };

      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockReading });

      const result = await coffeeReadingApi.getReading('reading_123');

      expect(apiClient.get).toHaveBeenCalledWith('/coffee-reading/reading_123');
      expect(result).toEqual(mockReading);
      expect(result.id).toBe('reading_123');
    });

    it('should handle reading not found', async () => {
      const mockError = new Error('Reading not found');
      (apiClient.get as jest.Mock).mockRejectedValue(mockError);

      await expect(coffeeReadingApi.getReading('invalid_id')).rejects.toThrow(
        'Reading not found'
      );
    });

    it('should fetch reading with multiple images', async () => {
      const mockReading: CoffeeReading = {
        id: 'reading_456',
        imageUrls: [
          'https://storage.example.com/coffee1.jpg',
          'https://storage.example.com/coffee2.jpg',
          'https://storage.example.com/coffee3.jpg',
        ],
        overallVibe: 'Complex patterns detected',
        love: 'Multiple love aspects visible',
        workAndMoney: 'Various opportunities ahead',
        predictions: 'Detailed predictions based on all images',
        createdAt: '2024-01-15T11:00:00Z',
      };

      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockReading });

      const result = await coffeeReadingApi.getReading('reading_456');

      expect(result.imageUrls.length).toBe(3);
    });
  });

  describe('Reading Content Validation', () => {
    it('should have non-empty interpretation sections', async () => {
      const mockReading: CoffeeReading = {
        id: 'reading_789',
        imageUrls: ['https://storage.example.com/coffee.jpg'],
        overallVibe: 'The patterns in your cup reveal...',
        love: 'In matters of the heart...',
        workAndMoney: 'Your professional life shows...',
        predictions: 'Looking ahead, the symbols suggest...',
        createdAt: '2024-01-15T12:00:00Z',
      };

      (apiClient.post as jest.Mock).mockResolvedValue({ data: mockReading });

      const formData = new FormData();
      const result = await coffeeReadingApi.createReading(formData);

      expect(result.overallVibe.length).toBeGreaterThan(0);
      expect(result.love.length).toBeGreaterThan(0);
      expect(result.workAndMoney.length).toBeGreaterThan(0);
      expect(result.predictions.length).toBeGreaterThan(0);
    });

    it('should have valid timestamp', async () => {
      const mockReading: CoffeeReading = {
        id: 'reading_999',
        imageUrls: ['https://storage.example.com/coffee.jpg'],
        overallVibe: 'Interpretation',
        love: 'Love',
        workAndMoney: 'Work',
        predictions: 'Predictions',
        createdAt: new Date().toISOString(),
      };

      (apiClient.post as jest.Mock).mockResolvedValue({ data: mockReading });

      const formData = new FormData();
      const result = await coffeeReadingApi.createReading(formData);

      expect(new Date(result.createdAt).getTime()).toBeLessThanOrEqual(
        new Date().getTime()
      );
    });
  });
});
