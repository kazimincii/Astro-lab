import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { TarotController } from './tarot.controller';
import { TarotService } from './tarot.service';
import { TarotSpreadType, CreateTarotReadingDto } from './dto/create-reading.dto';

describe('TarotController', () => {
  let controller: TarotController;
  let tarotService: TarotService;

  const mockTarotService = {
    createReading: jest.fn(),
    getReadings: jest.fn(),
  };

  const mockUser = {
    id: 'user-123',
    email: 'user@example.com',
  };

  const mockRequest = {
    user: mockUser,
  };

  const mockTarotCard = {
    name: 'The Fool',
    position: 'Present',
    reversed: false,
    meaning: 'New beginnings, spontaneity, and free spirit',
    image: '/cards/the-fool.jpg',
  };

  const mockThreeCardReading = {
    id: 'reading-123',
    userId: 'user-123',
    question: 'What does the future hold for my career?',
    spreadType: TarotSpreadType.THREE_CARD,
    cards: [
      {
        name: 'The Fool',
        position: 'Past',
        reversed: false,
        meaning: 'New beginnings and spontaneous adventures',
        image: '/cards/the-fool.jpg',
      },
      {
        name: 'The Magician',
        position: 'Present',
        reversed: false,
        meaning: 'Manifestation and resourcefulness',
        image: '/cards/the-magician.jpg',
      },
      {
        name: 'The High Priestess',
        position: 'Future',
        reversed: true,
        meaning: 'Intuition and inner wisdom (reversed: disconnection from intuition)',
        image: '/cards/the-high-priestess.jpg',
      },
    ],
    interpretation:
      'Your reading suggests a journey from new beginnings toward manifesting your goals, with a reminder to trust your intuition.',
    advice: 'Stay open to new opportunities while maintaining connection with your inner wisdom.',
    createdAt: new Date('2024-01-15T10:00:00Z'),
  };

  const mockSingleCardReading = {
    id: 'reading-456',
    userId: 'user-123',
    question: 'What energy should I focus on today?',
    spreadType: TarotSpreadType.SINGLE_CARD,
    cards: [mockTarotCard],
    interpretation: 'The Fool encourages you to embrace spontaneity and take a leap of faith.',
    advice: 'Trust in the journey and remain open to unexpected opportunities.',
    createdAt: new Date('2024-01-16T10:00:00Z'),
  };

  const mockCelticCrossReading = {
    id: 'reading-789',
    userId: 'user-123',
    question: 'What is the overall situation in my life right now?',
    spreadType: TarotSpreadType.CELTIC_CROSS,
    cards: [
      { name: 'The Emperor', position: 'Present', reversed: false },
      { name: 'Two of Cups', position: 'Challenge', reversed: false },
      { name: 'Three of Pentacles', position: 'Past', reversed: false },
      { name: 'The Star', position: 'Future', reversed: false },
      { name: 'Five of Wands', position: 'Above', reversed: true },
      { name: 'Ace of Swords', position: 'Below', reversed: false },
      { name: 'Knight of Cups', position: 'Advice', reversed: false },
      { name: 'Four of Pentacles', position: 'External', reversed: false },
      { name: 'Page of Wands', position: 'Hopes', reversed: false },
      { name: 'The World', position: 'Outcome', reversed: false },
    ],
    interpretation: 'A comprehensive look at your life shows growth and eventual completion.',
    advice: 'Balance structure with spontaneity.',
    createdAt: new Date('2024-01-17T10:00:00Z'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TarotController],
      providers: [
        {
          provide: TarotService,
          useValue: mockTarotService,
        },
      ],
    }).compile();

    controller = module.get<TarotController>(TarotController);
    tarotService = module.get<TarotService>(TarotService);
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createReading', () => {
    it('should create three-card reading successfully', async () => {
      mockTarotService.createReading.mockResolvedValue(mockThreeCardReading);

      const dto: CreateTarotReadingDto = {
        question: 'What does the future hold for my career?',
        spreadType: TarotSpreadType.THREE_CARD,
      };

      const result = await controller.createReading(mockRequest, dto);

      expect(result).toEqual(mockThreeCardReading);
      expect(mockTarotService.createReading).toHaveBeenCalledWith(
        mockUser.id,
        dto.question,
        dto.spreadType,
      );
      expect(mockTarotService.createReading).toHaveBeenCalledTimes(1);
    });

    it('should create single-card reading successfully', async () => {
      mockTarotService.createReading.mockResolvedValue(mockSingleCardReading);

      const dto: CreateTarotReadingDto = {
        question: 'What energy should I focus on today?',
        spreadType: TarotSpreadType.SINGLE_CARD,
      };

      const result = await controller.createReading(mockRequest, dto);

      expect(result).toEqual(mockSingleCardReading);
      expect(result.cards.length).toBe(1);
      expect(result.spreadType).toBe(TarotSpreadType.SINGLE_CARD);
    });

    it('should create celtic cross reading successfully', async () => {
      mockTarotService.createReading.mockResolvedValue(mockCelticCrossReading);

      const dto: CreateTarotReadingDto = {
        question: 'What is the overall situation in my life right now?',
        spreadType: TarotSpreadType.CELTIC_CROSS,
      };

      const result = await controller.createReading(mockRequest, dto);

      expect(result).toEqual(mockCelticCrossReading);
      expect(result.cards.length).toBe(10);
      expect(result.spreadType).toBe(TarotSpreadType.CELTIC_CROSS);
    });

    it('should create love spread reading successfully', async () => {
      const mockLoveReading = {
        ...mockThreeCardReading,
        id: 'reading-love',
        question: 'What is the future of my relationship?',
        spreadType: TarotSpreadType.LOVE_SPREAD,
        cards: [
          { name: 'The Lovers', position: 'You', reversed: false },
          { name: 'Two of Cups', position: 'Partner', reversed: false },
          { name: 'Ten of Cups', position: 'Relationship', reversed: false },
        ],
      };

      mockTarotService.createReading.mockResolvedValue(mockLoveReading);

      const dto: CreateTarotReadingDto = {
        question: 'What is the future of my relationship?',
        spreadType: TarotSpreadType.LOVE_SPREAD,
      };

      const result = await controller.createReading(mockRequest, dto);

      expect(result.spreadType).toBe(TarotSpreadType.LOVE_SPREAD);
      expect(result.cards.length).toBe(3);
    });

    it('should create career spread reading successfully', async () => {
      const mockCareerReading = {
        ...mockThreeCardReading,
        id: 'reading-career',
        question: 'What should I focus on in my career?',
        spreadType: TarotSpreadType.CAREER_SPREAD,
        cards: [
          { name: 'Three of Pentacles', position: 'Current Position', reversed: false },
          { name: 'Eight of Pentacles', position: 'Skills to Develop', reversed: false },
          { name: 'The Emperor', position: 'Future Success', reversed: false },
        ],
      };

      mockTarotService.createReading.mockResolvedValue(mockCareerReading);

      const dto: CreateTarotReadingDto = {
        question: 'What should I focus on in my career?',
        spreadType: TarotSpreadType.CAREER_SPREAD,
      };

      const result = await controller.createReading(mockRequest, dto);

      expect(result.spreadType).toBe(TarotSpreadType.CAREER_SPREAD);
      expect(result.cards.length).toBe(3);
    });

    it('should return reading with card details', async () => {
      mockTarotService.createReading.mockResolvedValue(mockThreeCardReading);

      const dto: CreateTarotReadingDto = {
        question: 'Test question',
        spreadType: TarotSpreadType.THREE_CARD,
      };

      const result = await controller.createReading(mockRequest, dto);

      expect(Array.isArray(result.cards)).toBe(true);
      expect(result.cards.length).toBeGreaterThan(0);
      expect(result.cards[0]).toHaveProperty('name');
      expect(result.cards[0]).toHaveProperty('position');
      expect(result.cards[0]).toHaveProperty('reversed');
      expect(result.cards[0]).toHaveProperty('meaning');
      expect(result.cards[0]).toHaveProperty('image');
    });

    it('should return reading with interpretation', async () => {
      mockTarotService.createReading.mockResolvedValue(mockThreeCardReading);

      const dto: CreateTarotReadingDto = {
        question: 'Test question',
        spreadType: TarotSpreadType.THREE_CARD,
      };

      const result = await controller.createReading(mockRequest, dto);

      expect(result.interpretation).toBeDefined();
      expect(typeof result.interpretation).toBe('string');
      expect(result.interpretation.length).toBeGreaterThan(0);
    });

    it('should return reading with advice', async () => {
      mockTarotService.createReading.mockResolvedValue(mockThreeCardReading);

      const dto: CreateTarotReadingDto = {
        question: 'Test question',
        spreadType: TarotSpreadType.THREE_CARD,
      };

      const result = await controller.createReading(mockRequest, dto);

      expect(result.advice).toBeDefined();
      expect(typeof result.advice).toBe('string');
    });

    it('should include reversed card meanings', async () => {
      mockTarotService.createReading.mockResolvedValue(mockThreeCardReading);

      const dto: CreateTarotReadingDto = {
        question: 'Test question',
        spreadType: TarotSpreadType.THREE_CARD,
      };

      const result = await controller.createReading(mockRequest, dto);

      const reversedCard = result.cards.find((card) => card.reversed === true);
      expect(reversedCard).toBeDefined();
      expect(reversedCard.reversed).toBe(true);
    });

    it('should include upright card meanings', async () => {
      mockTarotService.createReading.mockResolvedValue(mockThreeCardReading);

      const dto: CreateTarotReadingDto = {
        question: 'Test question',
        spreadType: TarotSpreadType.THREE_CARD,
      };

      const result = await controller.createReading(mockRequest, dto);

      const uprightCard = result.cards.find((card) => card.reversed === false);
      expect(uprightCard).toBeDefined();
      expect(uprightCard.reversed).toBe(false);
    });

    it('should return reading with creation timestamp', async () => {
      mockTarotService.createReading.mockResolvedValue(mockThreeCardReading);

      const dto: CreateTarotReadingDto = {
        question: 'Test question',
        spreadType: TarotSpreadType.THREE_CARD,
      };

      const result = await controller.createReading(mockRequest, dto);

      expect(result.createdAt).toBeDefined();
      expect(result.createdAt).toBeInstanceOf(Date);
    });

    it('should handle different questions', async () => {
      mockTarotService.createReading.mockResolvedValue(mockThreeCardReading);

      const questions = [
        'What does the future hold for my career?',
        'How can I improve my relationships?',
        'What should I focus on today?',
        'What challenges will I face?',
      ];

      for (const question of questions) {
        const dto: CreateTarotReadingDto = {
          question,
          spreadType: TarotSpreadType.THREE_CARD,
        };

        await controller.createReading(mockRequest, dto);

        expect(mockTarotService.createReading).toHaveBeenCalledWith(
          mockUser.id,
          question,
          TarotSpreadType.THREE_CARD,
        );
      }
    });

    it('should throw BadRequestException for invalid question', async () => {
      mockTarotService.createReading.mockRejectedValue(
        new BadRequestException('Question is required'),
      );

      const dto: CreateTarotReadingDto = {
        question: '',
        spreadType: TarotSpreadType.THREE_CARD,
      };

      await expect(controller.createReading(mockRequest, dto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException for invalid spread type', async () => {
      mockTarotService.createReading.mockRejectedValue(
        new BadRequestException('Invalid spread type'),
      );

      const dto: any = {
        question: 'Test question',
        spreadType: 'invalid_spread',
      };

      await expect(controller.createReading(mockRequest, dto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw UnauthorizedException for unauthenticated user', async () => {
      mockTarotService.createReading.mockRejectedValue(
        new UnauthorizedException('Authentication required'),
      );

      const dto: CreateTarotReadingDto = {
        question: 'Test question',
        spreadType: TarotSpreadType.THREE_CARD,
      };

      await expect(controller.createReading(mockRequest, dto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw ForbiddenException when action limit reached', async () => {
      mockTarotService.createReading.mockRejectedValue(
        new ForbiddenException('Daily tarot reading limit reached'),
      );

      const dto: CreateTarotReadingDto = {
        question: 'Test question',
        spreadType: TarotSpreadType.THREE_CARD,
      };

      await expect(controller.createReading(mockRequest, dto)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should throw ForbiddenException for premium spreads on free tier', async () => {
      mockTarotService.createReading.mockRejectedValue(
        new ForbiddenException('Celtic Cross is a premium feature'),
      );

      const dto: CreateTarotReadingDto = {
        question: 'Test question',
        spreadType: TarotSpreadType.CELTIC_CROSS,
      };

      await expect(controller.createReading(mockRequest, dto)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should associate reading with authenticated user', async () => {
      mockTarotService.createReading.mockResolvedValue(mockThreeCardReading);

      const dto: CreateTarotReadingDto = {
        question: 'Test question',
        spreadType: TarotSpreadType.THREE_CARD,
      };

      await controller.createReading(mockRequest, dto);

      expect(mockTarotService.createReading).toHaveBeenCalledWith(
        mockUser.id,
        expect.any(String),
        expect.any(String),
      );
    });
  });

  describe('getReadings', () => {
    it('should retrieve all readings for user', async () => {
      const mockReadings = [
        mockThreeCardReading,
        mockSingleCardReading,
        mockCelticCrossReading,
      ];

      mockTarotService.getReadings.mockResolvedValue(mockReadings);

      const result = await controller.getReadings(mockRequest);

      expect(result).toEqual(mockReadings);
      expect(mockTarotService.getReadings).toHaveBeenCalledWith(mockUser.id);
      expect(mockTarotService.getReadings).toHaveBeenCalledTimes(1);
    });

    it('should return array of readings', async () => {
      const mockReadings = [mockThreeCardReading, mockSingleCardReading];

      mockTarotService.getReadings.mockResolvedValue(mockReadings);

      const result = await controller.getReadings(mockRequest);

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(2);
    });

    it('should return readings ordered by creation date', async () => {
      const mockReadings = [
        mockCelticCrossReading, // 2024-01-17
        mockSingleCardReading,  // 2024-01-16
        mockThreeCardReading,   // 2024-01-15
      ];

      mockTarotService.getReadings.mockResolvedValue(mockReadings);

      const result = await controller.getReadings(mockRequest);

      expect(result[0].createdAt.getTime()).toBeGreaterThanOrEqual(
        result[1].createdAt.getTime(),
      );
      expect(result[1].createdAt.getTime()).toBeGreaterThanOrEqual(
        result[2].createdAt.getTime(),
      );
    });

    it('should return empty array when no readings exist', async () => {
      mockTarotService.getReadings.mockResolvedValue([]);

      const result = await controller.getReadings(mockRequest);

      expect(result).toEqual([]);
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(0);
    });

    it('should return readings with complete structure', async () => {
      mockTarotService.getReadings.mockResolvedValue([mockThreeCardReading]);

      const result = await controller.getReadings(mockRequest);

      expect(result[0]).toHaveProperty('id');
      expect(result[0]).toHaveProperty('userId');
      expect(result[0]).toHaveProperty('question');
      expect(result[0]).toHaveProperty('spreadType');
      expect(result[0]).toHaveProperty('cards');
      expect(result[0]).toHaveProperty('interpretation');
      expect(result[0]).toHaveProperty('advice');
      expect(result[0]).toHaveProperty('createdAt');
    });

    it('should return readings with all spread types', async () => {
      const mockReadings = [
        { ...mockThreeCardReading, spreadType: TarotSpreadType.SINGLE_CARD },
        { ...mockThreeCardReading, spreadType: TarotSpreadType.THREE_CARD },
        { ...mockThreeCardReading, spreadType: TarotSpreadType.CELTIC_CROSS },
        { ...mockThreeCardReading, spreadType: TarotSpreadType.LOVE_SPREAD },
        { ...mockThreeCardReading, spreadType: TarotSpreadType.CAREER_SPREAD },
      ];

      mockTarotService.getReadings.mockResolvedValue(mockReadings);

      const result = await controller.getReadings(mockRequest);

      expect(result.length).toBe(5);
      expect(result.map((r) => r.spreadType)).toContain(TarotSpreadType.SINGLE_CARD);
      expect(result.map((r) => r.spreadType)).toContain(TarotSpreadType.THREE_CARD);
      expect(result.map((r) => r.spreadType)).toContain(TarotSpreadType.CELTIC_CROSS);
      expect(result.map((r) => r.spreadType)).toContain(TarotSpreadType.LOVE_SPREAD);
      expect(result.map((r) => r.spreadType)).toContain(TarotSpreadType.CAREER_SPREAD);
    });

    it('should only return readings for authenticated user', async () => {
      mockTarotService.getReadings.mockResolvedValue([mockThreeCardReading]);

      await controller.getReadings(mockRequest);

      expect(mockTarotService.getReadings).toHaveBeenCalledWith(mockUser.id);
    });

    it('should throw UnauthorizedException for unauthenticated user', async () => {
      mockTarotService.getReadings.mockRejectedValue(
        new UnauthorizedException('Authentication required'),
      );

      await expect(controller.getReadings(mockRequest)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should handle large number of readings', async () => {
      const mockReadings = Array.from({ length: 50 }, (_, i) => ({
        ...mockThreeCardReading,
        id: `reading-${i}`,
      }));

      mockTarotService.getReadings.mockResolvedValue(mockReadings);

      const result = await controller.getReadings(mockRequest);

      expect(result.length).toBe(50);
    });

    it('should preserve card data in readings history', async () => {
      mockTarotService.getReadings.mockResolvedValue([mockThreeCardReading]);

      const result = await controller.getReadings(mockRequest);

      expect(result[0].cards).toBeDefined();
      expect(Array.isArray(result[0].cards)).toBe(true);
      expect(result[0].cards[0]).toHaveProperty('name');
      expect(result[0].cards[0]).toHaveProperty('position');
      expect(result[0].cards[0]).toHaveProperty('reversed');
    });
  });

  describe('spread types', () => {
    it('should support all spread type enums', () => {
      expect(TarotSpreadType.SINGLE_CARD).toBe('single_card');
      expect(TarotSpreadType.THREE_CARD).toBe('three_card');
      expect(TarotSpreadType.CELTIC_CROSS).toBe('celtic_cross');
      expect(TarotSpreadType.LOVE_SPREAD).toBe('love_spread');
      expect(TarotSpreadType.CAREER_SPREAD).toBe('career_spread');
    });

    it('should have different card counts for different spreads', async () => {
      const readingsWithCounts = [
        { ...mockSingleCardReading, cards: [mockTarotCard] }, // 1 card
        { ...mockThreeCardReading, cards: [{}, {}, {}] }, // 3 cards
        { ...mockCelticCrossReading }, // 10 cards
      ];

      for (const reading of readingsWithCounts) {
        mockTarotService.createReading.mockResolvedValue(reading);

        const dto: CreateTarotReadingDto = {
          question: 'Test',
          spreadType: reading.spreadType as TarotSpreadType,
        };

        const result = await controller.createReading(mockRequest, dto);

        expect(result.cards.length).toBe(reading.cards.length);
      }
    });
  });
});
