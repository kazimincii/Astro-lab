import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TarotService } from './tarot.service';
import { TarotReading } from '../../entities/tarot-reading.entity';

describe('TarotService', () => {
  let service: TarotService;
  let tarotRepository: Repository<TarotReading>;

  const mockTarotRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TarotService,
        {
          provide: getRepositoryToken(TarotReading),
          useValue: mockTarotRepository,
        },
      ],
    }).compile();

    service = module.get<TarotService>(TarotService);
    tarotRepository = module.get<Repository<TarotReading>>(getRepositoryToken(TarotReading));
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(tarotRepository).toBeDefined();
  });

  describe('createReading', () => {
    it('should create a tarot reading', async () => {
      const userId = 'user-1';
      const question = 'What does my future hold?';
      const spreadType = 'three-card';

      const mockReading = {
        id: 'reading-1',
        user: { id: userId },
        question,
        spreadType,
        cards: [],
        interpretation: 'Your tarot reading...',
      };

      mockTarotRepository.create.mockReturnValue(mockReading);
      mockTarotRepository.save.mockResolvedValue(mockReading);

      const result = await service.createReading(userId, question, spreadType);

      expect(mockTarotRepository.create).toHaveBeenCalledWith({
        user: { id: userId },
        question,
        spreadType,
        cards: [],
        interpretation: 'Your tarot reading...',
      });
      expect(mockTarotRepository.save).toHaveBeenCalledWith(mockReading);
      expect(result).toBe(mockReading);
    });
  });

  describe('getReadings', () => {
    it('should retrieve all readings for a user', async () => {
      const userId = 'user-1';
      const mockReadings = [
        {
          id: 'reading-1',
          user: { id: userId },
          question: 'Question 1',
          spreadType: 'three-card',
          cards: [],
          interpretation: 'Interpretation 1',
          createdAt: new Date('2025-01-01'),
        },
        {
          id: 'reading-2',
          user: { id: userId },
          question: 'Question 2',
          spreadType: 'celtic-cross',
          cards: [],
          interpretation: 'Interpretation 2',
          createdAt: new Date('2025-01-02'),
        },
      ];

      mockTarotRepository.find.mockResolvedValue(mockReadings);

      const result = await service.getReadings(userId);

      expect(mockTarotRepository.find).toHaveBeenCalledWith({
        where: { user: { id: userId } },
        order: { createdAt: 'DESC' },
      });
      expect(result).toBe(mockReadings);
      expect(result).toHaveLength(2);
    });

    it('should return empty array if no readings exist', async () => {
      mockTarotRepository.find.mockResolvedValue([]);

      const result = await service.getReadings('user-1');

      expect(result).toEqual([]);
    });
  });
});
