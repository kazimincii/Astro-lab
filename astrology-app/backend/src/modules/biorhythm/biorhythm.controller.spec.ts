import { Test, TestingModule } from '@nestjs/testing';
import {
  NotFoundException,
  ForbiddenException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { BiorhythmController } from './biorhythm.controller';
import { BiorhythmService } from './biorhythm.service';
import { ActionsService } from '../actions/actions.service';
import { CalculateBiorhythmDto } from './dto/calculate-biorhythm.dto';

describe('BiorhythmController', () => {
  let controller: BiorhythmController;
  let biorhythmService: BiorhythmService;
  let actionsService: ActionsService;

  const mockBiorhythmService = {
    calculateBiorhythm: jest.fn(),
    getLatestBiorhythm: jest.fn(),
  };

  const mockActionsService = {
    checkAndConsumeAction: jest.fn(),
  };

  const mockUser = {
    id: 'user-123',
    email: 'user@example.com',
  };

  const mockRequest = {
    user: mockUser,
  };

  const mockBiorhythmResult = {
    id: 'biorhythm-123',
    personId: 'person-456',
    calculationDate: new Date('2024-01-15T10:00:00Z'),
    physical: 85.5,
    emotional: 62.3,
    intellectual: 45.8,
    interpretation:
      'Your physical energy is very high today. You feel strong and capable. Your emotional state is balanced and stable. Your intellectual clarity is moderate - good for routine tasks but challenging for complex problem-solving.',
    physicalPhase: 'High',
    emotionalPhase: 'Rising',
    intellectualPhase: 'Critical Day',
    recommendations: [
      'Engage in physical activities and exercise',
      'Good time for emotional connections',
      'Avoid making major analytical decisions',
    ],
    criticalDays: {
      physical: false,
      emotional: false,
      intellectual: true,
    },
    createdAt: new Date('2024-01-15T10:00:00Z'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BiorhythmController],
      providers: [
        {
          provide: BiorhythmService,
          useValue: mockBiorhythmService,
        },
        {
          provide: ActionsService,
          useValue: mockActionsService,
        },
      ],
    }).compile();

    controller = module.get<BiorhythmController>(BiorhythmController);
    biorhythmService = module.get<BiorhythmService>(BiorhythmService);
    actionsService = module.get<ActionsService>(ActionsService);
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('calculateBiorhythm', () => {
    it('should calculate biorhythm successfully', async () => {
      mockActionsService.checkAndConsumeAction.mockResolvedValue(undefined);
      mockBiorhythmService.calculateBiorhythm.mockResolvedValue(mockBiorhythmResult);

      const dto: CalculateBiorhythmDto = {
        date: new Date('2024-01-15'),
      };

      const result = await controller.calculateBiorhythm(mockRequest, 'person-456', dto);

      expect(result).toEqual(mockBiorhythmResult);
      expect(mockActionsService.checkAndConsumeAction).toHaveBeenCalledWith(mockUser.id);
      expect(mockBiorhythmService.calculateBiorhythm).toHaveBeenCalledWith(
        'person-456',
        expect.any(Date),
      );
    });

    it('should use current date when date not provided', async () => {
      mockActionsService.checkAndConsumeAction.mockResolvedValue(undefined);
      mockBiorhythmService.calculateBiorhythm.mockResolvedValue(mockBiorhythmResult);

      const dto: CalculateBiorhythmDto = {};

      await controller.calculateBiorhythm(mockRequest, 'person-456', dto);

      expect(mockBiorhythmService.calculateBiorhythm).toHaveBeenCalledWith(
        'person-456',
        expect.any(Date),
      );
    });

    it('should return physical cycle percentage', async () => {
      mockActionsService.checkAndConsumeAction.mockResolvedValue(undefined);
      mockBiorhythmService.calculateBiorhythm.mockResolvedValue(mockBiorhythmResult);

      const dto: CalculateBiorhythmDto = {
        date: new Date('2024-01-15'),
      };

      const result = await controller.calculateBiorhythm(mockRequest, 'person-456', dto);

      expect(result.physical).toBeDefined();
      expect(typeof result.physical).toBe('number');
      expect(result.physical).toBeGreaterThanOrEqual(0);
      expect(result.physical).toBeLessThanOrEqual(100);
    });

    it('should return emotional cycle percentage', async () => {
      mockActionsService.checkAndConsumeAction.mockResolvedValue(undefined);
      mockBiorhythmService.calculateBiorhythm.mockResolvedValue(mockBiorhythmResult);

      const dto: CalculateBiorhythmDto = {
        date: new Date('2024-01-15'),
      };

      const result = await controller.calculateBiorhythm(mockRequest, 'person-456', dto);

      expect(result.emotional).toBeDefined();
      expect(typeof result.emotional).toBe('number');
      expect(result.emotional).toBeGreaterThanOrEqual(0);
      expect(result.emotional).toBeLessThanOrEqual(100);
    });

    it('should return intellectual cycle percentage', async () => {
      mockActionsService.checkAndConsumeAction.mockResolvedValue(undefined);
      mockBiorhythmService.calculateBiorhythm.mockResolvedValue(mockBiorhythmResult);

      const dto: CalculateBiorhythmDto = {
        date: new Date('2024-01-15'),
      };

      const result = await controller.calculateBiorhythm(mockRequest, 'person-456', dto);

      expect(result.intellectual).toBeDefined();
      expect(typeof result.intellectual).toBe('number');
      expect(result.intellectual).toBeGreaterThanOrEqual(0);
      expect(result.intellectual).toBeLessThanOrEqual(100);
    });

    it('should return interpretation text', async () => {
      mockActionsService.checkAndConsumeAction.mockResolvedValue(undefined);
      mockBiorhythmService.calculateBiorhythm.mockResolvedValue(mockBiorhythmResult);

      const dto: CalculateBiorhythmDto = {
        date: new Date('2024-01-15'),
      };

      const result = await controller.calculateBiorhythm(mockRequest, 'person-456', dto);

      expect(result.interpretation).toBeDefined();
      expect(typeof result.interpretation).toBe('string');
      expect(result.interpretation.length).toBeGreaterThan(0);
    });

    it('should return phase descriptions', async () => {
      mockActionsService.checkAndConsumeAction.mockResolvedValue(undefined);
      mockBiorhythmService.calculateBiorhythm.mockResolvedValue(mockBiorhythmResult);

      const dto: CalculateBiorhythmDto = {
        date: new Date('2024-01-15'),
      };

      const result = await controller.calculateBiorhythm(mockRequest, 'person-456', dto);

      expect(result.physicalPhase).toBeDefined();
      expect(result.emotionalPhase).toBeDefined();
      expect(result.intellectualPhase).toBeDefined();
    });

    it('should identify critical days', async () => {
      mockActionsService.checkAndConsumeAction.mockResolvedValue(undefined);
      mockBiorhythmService.calculateBiorhythm.mockResolvedValue(mockBiorhythmResult);

      const dto: CalculateBiorhythmDto = {
        date: new Date('2024-01-15'),
      };

      const result = await controller.calculateBiorhythm(mockRequest, 'person-456', dto);

      expect(result.criticalDays).toBeDefined();
      expect(typeof result.criticalDays.physical).toBe('boolean');
      expect(typeof result.criticalDays.emotional).toBe('boolean');
      expect(typeof result.criticalDays.intellectual).toBe('boolean');
    });

    it('should return recommendations', async () => {
      mockActionsService.checkAndConsumeAction.mockResolvedValue(undefined);
      mockBiorhythmService.calculateBiorhythm.mockResolvedValue(mockBiorhythmResult);

      const dto: CalculateBiorhythmDto = {
        date: new Date('2024-01-15'),
      };

      const result = await controller.calculateBiorhythm(mockRequest, 'person-456', dto);

      expect(Array.isArray(result.recommendations)).toBe(true);
      expect(result.recommendations.length).toBeGreaterThan(0);
    });

    it('should calculate for different dates', async () => {
      mockActionsService.checkAndConsumeAction.mockResolvedValue(undefined);
      mockBiorhythmService.calculateBiorhythm.mockResolvedValue(mockBiorhythmResult);

      const dates = [
        new Date('2024-01-01'),
        new Date('2024-06-15'),
        new Date('2024-12-31'),
      ];

      for (const date of dates) {
        const dto: CalculateBiorhythmDto = { date };

        await controller.calculateBiorhythm(mockRequest, 'person-456', dto);

        expect(mockBiorhythmService.calculateBiorhythm).toHaveBeenCalledWith(
          'person-456',
          date,
        );
      }
    });

    it('should handle different person IDs', async () => {
      mockActionsService.checkAndConsumeAction.mockResolvedValue(undefined);
      mockBiorhythmService.calculateBiorhythm.mockResolvedValue(mockBiorhythmResult);

      const personIds = ['person-1', 'person-2', 'person-3'];

      for (const personId of personIds) {
        const dto: CalculateBiorhythmDto = {
          date: new Date('2024-01-15'),
        };

        await controller.calculateBiorhythm(mockRequest, personId, dto);

        expect(mockBiorhythmService.calculateBiorhythm).toHaveBeenCalledWith(
          personId,
          expect.any(Date),
        );
      }
    });

    it('should consume action credit before calculation', async () => {
      mockActionsService.checkAndConsumeAction.mockResolvedValue(undefined);
      mockBiorhythmService.calculateBiorhythm.mockResolvedValue(mockBiorhythmResult);

      const dto: CalculateBiorhythmDto = {
        date: new Date('2024-01-15'),
      };

      await controller.calculateBiorhythm(mockRequest, 'person-456', dto);

      expect(mockActionsService.checkAndConsumeAction).toHaveBeenCalledBefore(
        mockBiorhythmService.calculateBiorhythm as any,
      );
    });

    it('should throw ForbiddenException when insufficient action credits', async () => {
      mockActionsService.checkAndConsumeAction.mockRejectedValue(
        new ForbiddenException('Insufficient action credits'),
      );

      const dto: CalculateBiorhythmDto = {
        date: new Date('2024-01-15'),
      };

      await expect(
        controller.calculateBiorhythm(mockRequest, 'person-456', dto),
      ).rejects.toThrow(ForbiddenException);

      expect(mockBiorhythmService.calculateBiorhythm).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when person not found', async () => {
      mockActionsService.checkAndConsumeAction.mockResolvedValue(undefined);
      mockBiorhythmService.calculateBiorhythm.mockRejectedValue(
        new NotFoundException('Person profile not found'),
      );

      const dto: CalculateBiorhythmDto = {
        date: new Date('2024-01-15'),
      };

      await expect(
        controller.calculateBiorhythm(mockRequest, 'non-existent', dto),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException for invalid date', async () => {
      mockActionsService.checkAndConsumeAction.mockResolvedValue(undefined);
      mockBiorhythmService.calculateBiorhythm.mockRejectedValue(
        new BadRequestException('Invalid date format'),
      );

      const dto: any = {
        date: 'invalid-date',
      };

      await expect(
        controller.calculateBiorhythm(mockRequest, 'person-456', dto),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw UnauthorizedException for unauthenticated user', async () => {
      mockActionsService.checkAndConsumeAction.mockRejectedValue(
        new UnauthorizedException('Authentication required'),
      );

      const dto: CalculateBiorhythmDto = {
        date: new Date('2024-01-15'),
      };

      await expect(
        controller.calculateBiorhythm(mockRequest, 'person-456', dto),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should include calculation date in result', async () => {
      mockActionsService.checkAndConsumeAction.mockResolvedValue(undefined);
      mockBiorhythmService.calculateBiorhythm.mockResolvedValue(mockBiorhythmResult);

      const dto: CalculateBiorhythmDto = {
        date: new Date('2024-01-15'),
      };

      const result = await controller.calculateBiorhythm(mockRequest, 'person-456', dto);

      expect(result.calculationDate).toBeDefined();
      expect(result.calculationDate).toBeInstanceOf(Date);
    });

    it('should include creation timestamp', async () => {
      mockActionsService.checkAndConsumeAction.mockResolvedValue(undefined);
      mockBiorhythmService.calculateBiorhythm.mockResolvedValue(mockBiorhythmResult);

      const dto: CalculateBiorhythmDto = {
        date: new Date('2024-01-15'),
      };

      const result = await controller.calculateBiorhythm(mockRequest, 'person-456', dto);

      expect(result.createdAt).toBeDefined();
      expect(result.createdAt).toBeInstanceOf(Date);
    });
  });

  describe('getLatestBiorhythm', () => {
    it('should retrieve latest biorhythm calculation', async () => {
      mockBiorhythmService.getLatestBiorhythm.mockResolvedValue(mockBiorhythmResult);

      const result = await controller.getLatestBiorhythm('person-456');

      expect(result).toEqual(mockBiorhythmResult);
      expect(mockBiorhythmService.getLatestBiorhythm).toHaveBeenCalledWith('person-456');
      expect(mockBiorhythmService.getLatestBiorhythm).toHaveBeenCalledTimes(1);
    });

    it('should return complete biorhythm data', async () => {
      mockBiorhythmService.getLatestBiorhythm.mockResolvedValue(mockBiorhythmResult);

      const result = await controller.getLatestBiorhythm('person-456');

      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('personId');
      expect(result).toHaveProperty('calculationDate');
      expect(result).toHaveProperty('physical');
      expect(result).toHaveProperty('emotional');
      expect(result).toHaveProperty('intellectual');
      expect(result).toHaveProperty('interpretation');
    });

    it('should return cycle values in correct range', async () => {
      mockBiorhythmService.getLatestBiorhythm.mockResolvedValue(mockBiorhythmResult);

      const result = await controller.getLatestBiorhythm('person-456');

      expect(result.physical).toBeGreaterThanOrEqual(0);
      expect(result.physical).toBeLessThanOrEqual(100);
      expect(result.emotional).toBeGreaterThanOrEqual(0);
      expect(result.emotional).toBeLessThanOrEqual(100);
      expect(result.intellectual).toBeGreaterThanOrEqual(0);
      expect(result.intellectual).toBeLessThanOrEqual(100);
    });

    it('should throw NotFoundException when no calculations exist', async () => {
      mockBiorhythmService.getLatestBiorhythm.mockRejectedValue(
        new NotFoundException('No biorhythm calculations found for this person'),
      );

      await expect(controller.getLatestBiorhythm('person-456')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException when person not found', async () => {
      mockBiorhythmService.getLatestBiorhythm.mockRejectedValue(
        new NotFoundException('Person profile not found'),
      );

      await expect(controller.getLatestBiorhythm('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should handle different person IDs', async () => {
      mockBiorhythmService.getLatestBiorhythm.mockResolvedValue(mockBiorhythmResult);

      const personIds = ['person-1', 'person-2', 'person-3'];

      for (const personId of personIds) {
        await controller.getLatestBiorhythm(personId);

        expect(mockBiorhythmService.getLatestBiorhythm).toHaveBeenCalledWith(personId);
      }
    });

    it('should not consume action credits for retrieval', async () => {
      mockBiorhythmService.getLatestBiorhythm.mockResolvedValue(mockBiorhythmResult);

      await controller.getLatestBiorhythm('person-456');

      expect(mockActionsService.checkAndConsumeAction).not.toHaveBeenCalled();
    });

    it('should return timestamps', async () => {
      mockBiorhythmService.getLatestBiorhythm.mockResolvedValue(mockBiorhythmResult);

      const result = await controller.getLatestBiorhythm('person-456');

      expect(result.calculationDate).toBeDefined();
      expect(result.createdAt).toBeDefined();
    });
  });

  describe('biorhythm cycles', () => {
    it('should handle physical cycle (23 days)', async () => {
      mockActionsService.checkAndConsumeAction.mockResolvedValue(undefined);

      const physicalPeakResult = {
        ...mockBiorhythmResult,
        physical: 100,
        physicalPhase: 'Peak',
      };

      mockBiorhythmService.calculateBiorhythm.mockResolvedValue(physicalPeakResult);

      const dto: CalculateBiorhythmDto = {
        date: new Date('2024-01-15'),
      };

      const result = await controller.calculateBiorhythm(mockRequest, 'person-456', dto);

      expect(result.physical).toBe(100);
      expect(result.physicalPhase).toBe('Peak');
    });

    it('should handle emotional cycle (28 days)', async () => {
      mockActionsService.checkAndConsumeAction.mockResolvedValue(undefined);

      const emotionalPeakResult = {
        ...mockBiorhythmResult,
        emotional: 100,
        emotionalPhase: 'Peak',
      };

      mockBiorhythmService.calculateBiorhythm.mockResolvedValue(emotionalPeakResult);

      const dto: CalculateBiorhythmDto = {
        date: new Date('2024-01-15'),
      };

      const result = await controller.calculateBiorhythm(mockRequest, 'person-456', dto);

      expect(result.emotional).toBe(100);
      expect(result.emotionalPhase).toBe('Peak');
    });

    it('should handle intellectual cycle (33 days)', async () => {
      mockActionsService.checkAndConsumeAction.mockResolvedValue(undefined);

      const intellectualPeakResult = {
        ...mockBiorhythmResult,
        intellectual: 100,
        intellectualPhase: 'Peak',
      };

      mockBiorhythmService.calculateBiorhythm.mockResolvedValue(intellectualPeakResult);

      const dto: CalculateBiorhythmDto = {
        date: new Date('2024-01-15'),
      };

      const result = await controller.calculateBiorhythm(mockRequest, 'person-456', dto);

      expect(result.intellectual).toBe(100);
      expect(result.intellectualPhase).toBe('Peak');
    });

    it('should identify critical days (cycle crossings)', async () => {
      mockActionsService.checkAndConsumeAction.mockResolvedValue(undefined);

      const criticalDayResult = {
        ...mockBiorhythmResult,
        physical: 0,
        emotional: 0,
        intellectual: 0,
        criticalDays: {
          physical: true,
          emotional: true,
          intellectual: true,
        },
      };

      mockBiorhythmService.calculateBiorhythm.mockResolvedValue(criticalDayResult);

      const dto: CalculateBiorhythmDto = {
        date: new Date('2024-01-15'),
      };

      const result = await controller.calculateBiorhythm(mockRequest, 'person-456', dto);

      expect(result.criticalDays.physical).toBe(true);
      expect(result.criticalDays.emotional).toBe(true);
      expect(result.criticalDays.intellectual).toBe(true);
    });

    it('should provide cycle-specific recommendations', async () => {
      mockActionsService.checkAndConsumeAction.mockResolvedValue(undefined);

      const highEnergyResult = {
        ...mockBiorhythmResult,
        physical: 95,
        emotional: 85,
        intellectual: 90,
        recommendations: [
          'Excellent day for physical activities',
          'Strong emotional resilience',
          'Peak mental performance',
        ],
      };

      mockBiorhythmService.calculateBiorhythm.mockResolvedValue(highEnergyResult);

      const dto: CalculateBiorhythmDto = {
        date: new Date('2024-01-15'),
      };

      const result = await controller.calculateBiorhythm(mockRequest, 'person-456', dto);

      expect(result.recommendations).toContain('Excellent day for physical activities');
      expect(result.recommendations).toContain('Peak mental performance');
    });
  });

  describe('cycle phases', () => {
    it('should identify high phase', async () => {
      mockActionsService.checkAndConsumeAction.mockResolvedValue(undefined);

      const highPhaseResult = {
        ...mockBiorhythmResult,
        physical: 90,
        physicalPhase: 'High',
      };

      mockBiorhythmService.calculateBiorhythm.mockResolvedValue(highPhaseResult);

      const dto: CalculateBiorhythmDto = {
        date: new Date('2024-01-15'),
      };

      const result = await controller.calculateBiorhythm(mockRequest, 'person-456', dto);

      expect(result.physicalPhase).toBe('High');
    });

    it('should identify low phase', async () => {
      mockActionsService.checkAndConsumeAction.mockResolvedValue(undefined);

      const lowPhaseResult = {
        ...mockBiorhythmResult,
        emotional: 15,
        emotionalPhase: 'Low',
      };

      mockBiorhythmService.calculateBiorhythm.mockResolvedValue(lowPhaseResult);

      const dto: CalculateBiorhythmDto = {
        date: new Date('2024-01-15'),
      };

      const result = await controller.calculateBiorhythm(mockRequest, 'person-456', dto);

      expect(result.emotionalPhase).toBe('Low');
    });

    it('should identify rising phase', async () => {
      mockActionsService.checkAndConsumeAction.mockResolvedValue(undefined);

      const risingPhaseResult = {
        ...mockBiorhythmResult,
        intellectual: 60,
        intellectualPhase: 'Rising',
      };

      mockBiorhythmService.calculateBiorhythm.mockResolvedValue(risingPhaseResult);

      const dto: CalculateBiorhythmDto = {
        date: new Date('2024-01-15'),
      };

      const result = await controller.calculateBiorhythm(mockRequest, 'person-456', dto);

      expect(result.intellectualPhase).toBe('Rising');
    });

    it('should identify falling phase', async () => {
      mockActionsService.checkAndConsumeAction.mockResolvedValue(undefined);

      const fallingPhaseResult = {
        ...mockBiorhythmResult,
        physical: 40,
        physicalPhase: 'Falling',
      };

      mockBiorhythmService.calculateBiorhythm.mockResolvedValue(fallingPhaseResult);

      const dto: CalculateBiorhythmDto = {
        date: new Date('2024-01-15'),
      };

      const result = await controller.calculateBiorhythm(mockRequest, 'person-456', dto);

      expect(result.physicalPhase).toBe('Falling');
    });
  });
});
