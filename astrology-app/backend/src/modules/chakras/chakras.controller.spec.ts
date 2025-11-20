import { Test, TestingModule } from '@nestjs/testing';
import {
  NotFoundException,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { ChakrasController } from './chakras.controller';
import { ChakrasService } from './chakras.service';
import { ActionsService } from '../actions/actions.service';

describe('ChakrasController', () => {
  let controller: ChakrasController;
  let chakrasService: ChakrasService;
  let actionsService: ActionsService;

  const mockChakrasService = {
    generateChakraProfile: jest.fn(),
    getChakraProfile: jest.fn(),
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

  const mockChakraProfile = {
    id: 'chakra-profile-123',
    personId: 'person-456',
    chakras: [
      {
        name: 'Root Chakra',
        sanskrit: 'Muladhara',
        location: 'Base of spine',
        color: '#FF0000',
        energyLevel: 75,
        balance: 'balanced',
        description:
          'Your root chakra shows healthy grounding and stability. You feel secure and connected to the physical world.',
        affirmations: [
          'I am grounded and stable',
          'I am safe and secure',
          'I trust in the process of life',
        ],
        healingActivities: ['Walking barefoot', 'Yoga', 'Gardening'],
      },
      {
        name: 'Sacral Chakra',
        sanskrit: 'Svadhisthana',
        location: 'Lower abdomen',
        color: '#FF7F00',
        energyLevel: 60,
        balance: 'balanced',
        description:
          'Your sacral chakra reflects healthy creativity and emotional flow.',
        affirmations: [
          'I embrace my creativity',
          'I honor my emotions',
          'I am open to pleasure and joy',
        ],
        healingActivities: ['Dancing', 'Swimming', 'Creative arts'],
      },
      {
        name: 'Solar Plexus Chakra',
        sanskrit: 'Manipura',
        location: 'Upper abdomen',
        color: '#FFFF00',
        energyLevel: 45,
        balance: 'blocked',
        description:
          'Your solar plexus chakra shows some blockage. Focus on building confidence and personal power.',
        affirmations: [
          'I am confident and powerful',
          'I honor my personal truth',
          'I stand in my power',
        ],
        healingActivities: ['Core exercises', 'Setting boundaries', 'Sun gazing'],
      },
      {
        name: 'Heart Chakra',
        sanskrit: 'Anahata',
        location: 'Center of chest',
        color: '#00FF00',
        energyLevel: 85,
        balance: 'balanced',
        description:
          'Your heart chakra is well-balanced. You give and receive love freely.',
        affirmations: [
          'I am open to love',
          'I forgive myself and others',
          'My heart is filled with compassion',
        ],
        healingActivities: ['Meditation', 'Acts of kindness', 'Heart-opening yoga'],
      },
      {
        name: 'Throat Chakra',
        sanskrit: 'Vishuddha',
        location: 'Throat',
        color: '#00FFFF',
        energyLevel: 70,
        balance: 'balanced',
        description:
          'Your throat chakra supports clear communication and authentic expression.',
        affirmations: [
          'I speak my truth',
          'I communicate clearly',
          'My voice matters',
        ],
        healingActivities: ['Singing', 'Writing', 'Speaking your truth'],
      },
      {
        name: 'Third Eye Chakra',
        sanskrit: 'Ajna',
        location: 'Between eyebrows',
        color: '#0000FF',
        energyLevel: 80,
        balance: 'balanced',
        description:
          'Your third eye chakra is strong. You have good intuition and insight.',
        affirmations: [
          'I trust my intuition',
          'I see clearly',
          'I am connected to my inner wisdom',
        ],
        healingActivities: ['Meditation', 'Visualization', 'Mindfulness'],
      },
      {
        name: 'Crown Chakra',
        sanskrit: 'Sahasrara',
        location: 'Top of head',
        color: '#8B00FF',
        energyLevel: 65,
        balance: 'balanced',
        description:
          'Your crown chakra shows good spiritual connection and consciousness.',
        affirmations: [
          'I am connected to the universe',
          'I am divine consciousness',
          'I am open to spiritual guidance',
        ],
        healingActivities: ['Meditation', 'Prayer', 'Spiritual practices'],
      },
    ],
    overallBalance: 68.5,
    recommendations: [
      'Focus on strengthening your Solar Plexus chakra through confidence-building exercises',
      'Continue nurturing your Heart and Third Eye chakras which are strong',
      'Practice daily grounding to maintain your Root chakra balance',
      'Consider meditation for overall chakra alignment',
    ],
    createdAt: new Date('2024-01-15T10:00:00Z'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChakrasController],
      providers: [
        {
          provide: ChakrasService,
          useValue: mockChakrasService,
        },
        {
          provide: ActionsService,
          useValue: mockActionsService,
        },
      ],
    }).compile();

    controller = module.get<ChakrasController>(ChakrasController);
    chakrasService = module.get<ChakrasService>(ChakrasService);
    actionsService = module.get<ActionsService>(ActionsService);
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('generateChakraProfile', () => {
    it('should generate chakra profile successfully', async () => {
      mockActionsService.checkAndConsumeAction.mockResolvedValue(undefined);
      mockChakrasService.generateChakraProfile.mockResolvedValue(mockChakraProfile);

      const result = await controller.generateChakraProfile(mockRequest, 'person-456');

      expect(result).toEqual(mockChakraProfile);
      expect(mockActionsService.checkAndConsumeAction).toHaveBeenCalledWith(mockUser.id);
      expect(mockChakrasService.generateChakraProfile).toHaveBeenCalledWith('person-456');
    });

    it('should return all 7 chakras', async () => {
      mockActionsService.checkAndConsumeAction.mockResolvedValue(undefined);
      mockChakrasService.generateChakraProfile.mockResolvedValue(mockChakraProfile);

      const result = await controller.generateChakraProfile(mockRequest, 'person-456');

      expect(Array.isArray(result.chakras)).toBe(true);
      expect(result.chakras.length).toBe(7);
    });

    it('should return chakras with correct names', async () => {
      mockActionsService.checkAndConsumeAction.mockResolvedValue(undefined);
      mockChakrasService.generateChakraProfile.mockResolvedValue(mockChakraProfile);

      const result = await controller.generateChakraProfile(mockRequest, 'person-456');

      const chakraNames = result.chakras.map((c) => c.name);
      expect(chakraNames).toContain('Root Chakra');
      expect(chakraNames).toContain('Sacral Chakra');
      expect(chakraNames).toContain('Solar Plexus Chakra');
      expect(chakraNames).toContain('Heart Chakra');
      expect(chakraNames).toContain('Throat Chakra');
      expect(chakraNames).toContain('Third Eye Chakra');
      expect(chakraNames).toContain('Crown Chakra');
    });

    it('should return energy levels between 0 and 100', async () => {
      mockActionsService.checkAndConsumeAction.mockResolvedValue(undefined);
      mockChakrasService.generateChakraProfile.mockResolvedValue(mockChakraProfile);

      const result = await controller.generateChakraProfile(mockRequest, 'person-456');

      result.chakras.forEach((chakra) => {
        expect(chakra.energyLevel).toBeGreaterThanOrEqual(0);
        expect(chakra.energyLevel).toBeLessThanOrEqual(100);
      });
    });

    it('should return balance states', async () => {
      mockActionsService.checkAndConsumeAction.mockResolvedValue(undefined);
      mockChakrasService.generateChakraProfile.mockResolvedValue(mockChakraProfile);

      const result = await controller.generateChakraProfile(mockRequest, 'person-456');

      const validBalanceStates = ['blocked', 'balanced', 'overactive'];

      result.chakras.forEach((chakra) => {
        expect(validBalanceStates).toContain(chakra.balance);
      });
    });

    it('should return chakra descriptions', async () => {
      mockActionsService.checkAndConsumeAction.mockResolvedValue(undefined);
      mockChakrasService.generateChakraProfile.mockResolvedValue(mockChakraProfile);

      const result = await controller.generateChakraProfile(mockRequest, 'person-456');

      result.chakras.forEach((chakra) => {
        expect(chakra.description).toBeDefined();
        expect(typeof chakra.description).toBe('string');
        expect(chakra.description.length).toBeGreaterThan(0);
      });
    });

    it('should return affirmations for each chakra', async () => {
      mockActionsService.checkAndConsumeAction.mockResolvedValue(undefined);
      mockChakrasService.generateChakraProfile.mockResolvedValue(mockChakraProfile);

      const result = await controller.generateChakraProfile(mockRequest, 'person-456');

      result.chakras.forEach((chakra) => {
        expect(Array.isArray(chakra.affirmations)).toBe(true);
        expect(chakra.affirmations.length).toBeGreaterThan(0);
      });
    });

    it('should return healing activities for each chakra', async () => {
      mockActionsService.checkAndConsumeAction.mockResolvedValue(undefined);
      mockChakrasService.generateChakraProfile.mockResolvedValue(mockChakraProfile);

      const result = await controller.generateChakraProfile(mockRequest, 'person-456');

      result.chakras.forEach((chakra) => {
        expect(Array.isArray(chakra.healingActivities)).toBe(true);
        expect(chakra.healingActivities.length).toBeGreaterThan(0);
      });
    });

    it('should return overall balance score', async () => {
      mockActionsService.checkAndConsumeAction.mockResolvedValue(undefined);
      mockChakrasService.generateChakraProfile.mockResolvedValue(mockChakraProfile);

      const result = await controller.generateChakraProfile(mockRequest, 'person-456');

      expect(result.overallBalance).toBeDefined();
      expect(typeof result.overallBalance).toBe('number');
      expect(result.overallBalance).toBeGreaterThanOrEqual(0);
      expect(result.overallBalance).toBeLessThanOrEqual(100);
    });

    it('should return recommendations', async () => {
      mockActionsService.checkAndConsumeAction.mockResolvedValue(undefined);
      mockChakrasService.generateChakraProfile.mockResolvedValue(mockChakraProfile);

      const result = await controller.generateChakraProfile(mockRequest, 'person-456');

      expect(Array.isArray(result.recommendations)).toBe(true);
      expect(result.recommendations.length).toBeGreaterThan(0);
    });

    it('should identify blocked chakras', async () => {
      mockActionsService.checkAndConsumeAction.mockResolvedValue(undefined);
      mockChakrasService.generateChakraProfile.mockResolvedValue(mockChakraProfile);

      const result = await controller.generateChakraProfile(mockRequest, 'person-456');

      const blockedChakras = result.chakras.filter((c) => c.balance === 'blocked');
      expect(blockedChakras.length).toBeGreaterThan(0);
      expect(blockedChakras[0].name).toBe('Solar Plexus Chakra');
    });

    it('should identify balanced chakras', async () => {
      mockActionsService.checkAndConsumeAction.mockResolvedValue(undefined);
      mockChakrasService.generateChakraProfile.mockResolvedValue(mockChakraProfile);

      const result = await controller.generateChakraProfile(mockRequest, 'person-456');

      const balancedChakras = result.chakras.filter((c) => c.balance === 'balanced');
      expect(balancedChakras.length).toBeGreaterThan(0);
    });

    it('should include Sanskrit names', async () => {
      mockActionsService.checkAndConsumeAction.mockResolvedValue(undefined);
      mockChakrasService.generateChakraProfile.mockResolvedValue(mockChakraProfile);

      const result = await controller.generateChakraProfile(mockRequest, 'person-456');

      const sanskritNames = result.chakras.map((c) => c.sanskrit);
      expect(sanskritNames).toContain('Muladhara');
      expect(sanskritNames).toContain('Svadhisthana');
      expect(sanskritNames).toContain('Manipura');
      expect(sanskritNames).toContain('Anahata');
      expect(sanskritNames).toContain('Vishuddha');
      expect(sanskritNames).toContain('Ajna');
      expect(sanskritNames).toContain('Sahasrara');
    });

    it('should include chakra locations', async () => {
      mockActionsService.checkAndConsumeAction.mockResolvedValue(undefined);
      mockChakrasService.generateChakraProfile.mockResolvedValue(mockChakraProfile);

      const result = await controller.generateChakraProfile(mockRequest, 'person-456');

      result.chakras.forEach((chakra) => {
        expect(chakra.location).toBeDefined();
        expect(typeof chakra.location).toBe('string');
      });
    });

    it('should include chakra colors', async () => {
      mockActionsService.checkAndConsumeAction.mockResolvedValue(undefined);
      mockChakrasService.generateChakraProfile.mockResolvedValue(mockChakraProfile);

      const result = await controller.generateChakraProfile(mockRequest, 'person-456');

      result.chakras.forEach((chakra) => {
        expect(chakra.color).toBeDefined();
        expect(chakra.color).toMatch(/^#[0-9A-F]{6}$/i);
      });
    });

    it('should consume action credit before generation', async () => {
      mockActionsService.checkAndConsumeAction.mockResolvedValue(undefined);
      mockChakrasService.generateChakraProfile.mockResolvedValue(mockChakraProfile);

      await controller.generateChakraProfile(mockRequest, 'person-456');

      expect(mockActionsService.checkAndConsumeAction).toHaveBeenCalledBefore(
        mockChakrasService.generateChakraProfile as any,
      );
    });

    it('should throw ForbiddenException when insufficient action credits', async () => {
      mockActionsService.checkAndConsumeAction.mockRejectedValue(
        new ForbiddenException('Insufficient action credits'),
      );

      await expect(
        controller.generateChakraProfile(mockRequest, 'person-456'),
      ).rejects.toThrow(ForbiddenException);

      expect(mockChakrasService.generateChakraProfile).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when person not found', async () => {
      mockActionsService.checkAndConsumeAction.mockResolvedValue(undefined);
      mockChakrasService.generateChakraProfile.mockRejectedValue(
        new NotFoundException('Person profile not found'),
      );

      await expect(
        controller.generateChakraProfile(mockRequest, 'non-existent'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw UnauthorizedException for unauthenticated user', async () => {
      mockActionsService.checkAndConsumeAction.mockRejectedValue(
        new UnauthorizedException('Authentication required'),
      );

      await expect(
        controller.generateChakraProfile(mockRequest, 'person-456'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should handle different person IDs', async () => {
      mockActionsService.checkAndConsumeAction.mockResolvedValue(undefined);
      mockChakrasService.generateChakraProfile.mockResolvedValue(mockChakraProfile);

      const personIds = ['person-1', 'person-2', 'person-3'];

      for (const personId of personIds) {
        await controller.generateChakraProfile(mockRequest, personId);

        expect(mockChakrasService.generateChakraProfile).toHaveBeenCalledWith(personId);
      }
    });

    it('should include creation timestamp', async () => {
      mockActionsService.checkAndConsumeAction.mockResolvedValue(undefined);
      mockChakrasService.generateChakraProfile.mockResolvedValue(mockChakraProfile);

      const result = await controller.generateChakraProfile(mockRequest, 'person-456');

      expect(result.createdAt).toBeDefined();
      expect(result.createdAt).toBeInstanceOf(Date);
    });
  });

  describe('getChakraProfile', () => {
    it('should retrieve chakra profile successfully', async () => {
      mockChakrasService.getChakraProfile.mockResolvedValue(mockChakraProfile);

      const result = await controller.getChakraProfile('person-456');

      expect(result).toEqual(mockChakraProfile);
      expect(mockChakrasService.getChakraProfile).toHaveBeenCalledWith('person-456');
      expect(mockChakrasService.getChakraProfile).toHaveBeenCalledTimes(1);
    });

    it('should return complete chakra profile structure', async () => {
      mockChakrasService.getChakraProfile.mockResolvedValue(mockChakraProfile);

      const result = await controller.getChakraProfile('person-456');

      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('personId');
      expect(result).toHaveProperty('chakras');
      expect(result).toHaveProperty('overallBalance');
      expect(result).toHaveProperty('recommendations');
      expect(result).toHaveProperty('createdAt');
    });

    it('should return all 7 chakras', async () => {
      mockChakrasService.getChakraProfile.mockResolvedValue(mockChakraProfile);

      const result = await controller.getChakraProfile('person-456');

      expect(result.chakras.length).toBe(7);
    });

    it('should throw NotFoundException when profile not found', async () => {
      mockChakrasService.getChakraProfile.mockRejectedValue(
        new NotFoundException('Chakra profile not found for this person'),
      );

      await expect(controller.getChakraProfile('person-456')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException when person not found', async () => {
      mockChakrasService.getChakraProfile.mockRejectedValue(
        new NotFoundException('Person profile not found'),
      );

      await expect(controller.getChakraProfile('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should handle different person IDs', async () => {
      mockChakrasService.getChakraProfile.mockResolvedValue(mockChakraProfile);

      const personIds = ['person-1', 'person-2', 'person-3'];

      for (const personId of personIds) {
        await controller.getChakraProfile(personId);

        expect(mockChakrasService.getChakraProfile).toHaveBeenCalledWith(personId);
      }
    });

    it('should not consume action credits for retrieval', async () => {
      mockChakrasService.getChakraProfile.mockResolvedValue(mockChakraProfile);

      await controller.getChakraProfile('person-456');

      expect(mockActionsService.checkAndConsumeAction).not.toHaveBeenCalled();
    });

    it('should return cached profile data', async () => {
      mockChakrasService.getChakraProfile.mockResolvedValue(mockChakraProfile);

      const result = await controller.getChakraProfile('person-456');

      expect(result.createdAt).toBeDefined();
    });
  });

  describe('chakra energy levels', () => {
    it('should identify high energy chakras', async () => {
      mockActionsService.checkAndConsumeAction.mockResolvedValue(undefined);
      mockChakrasService.generateChakraProfile.mockResolvedValue(mockChakraProfile);

      const result = await controller.generateChakraProfile(mockRequest, 'person-456');

      const highEnergyChakras = result.chakras.filter((c) => c.energyLevel >= 70);
      expect(highEnergyChakras.length).toBeGreaterThan(0);
    });

    it('should identify low energy chakras', async () => {
      mockActionsService.checkAndConsumeAction.mockResolvedValue(undefined);
      mockChakrasService.generateChakraProfile.mockResolvedValue(mockChakraProfile);

      const result = await controller.generateChakraProfile(mockRequest, 'person-456');

      const lowEnergyChakras = result.chakras.filter((c) => c.energyLevel < 50);
      expect(lowEnergyChakras.length).toBeGreaterThan(0);
    });

    it('should calculate overall balance from individual chakras', async () => {
      mockActionsService.checkAndConsumeAction.mockResolvedValue(undefined);
      mockChakrasService.generateChakraProfile.mockResolvedValue(mockChakraProfile);

      const result = await controller.generateChakraProfile(mockRequest, 'person-456');

      const averageEnergy =
        result.chakras.reduce((sum, chakra) => sum + chakra.energyLevel, 0) /
        result.chakras.length;

      expect(result.overallBalance).toBeCloseTo(averageEnergy, 0);
    });
  });

  describe('chakra recommendations', () => {
    it('should provide recommendations for blocked chakras', async () => {
      mockActionsService.checkAndConsumeAction.mockResolvedValue(undefined);
      mockChakrasService.generateChakraProfile.mockResolvedValue(mockChakraProfile);

      const result = await controller.generateChakraProfile(mockRequest, 'person-456');

      const hasBlockedRecommendation = result.recommendations.some((rec) =>
        rec.toLowerCase().includes('solar plexus'),
      );
      expect(hasBlockedRecommendation).toBe(true);
    });

    it('should provide meditation recommendations', async () => {
      mockActionsService.checkAndConsumeAction.mockResolvedValue(undefined);
      mockChakrasService.generateChakraProfile.mockResolvedValue(mockChakraProfile);

      const result = await controller.generateChakraProfile(mockRequest, 'person-456');

      const hasMeditationRecommendation = result.recommendations.some((rec) =>
        rec.toLowerCase().includes('meditation'),
      );
      expect(hasMeditationRecommendation).toBe(true);
    });

    it('should acknowledge strong chakras', async () => {
      mockActionsService.checkAndConsumeAction.mockResolvedValue(undefined);
      mockChakrasService.generateChakraProfile.mockResolvedValue(mockChakraProfile);

      const result = await controller.generateChakraProfile(mockRequest, 'person-456');

      const hasPositiveRecommendation = result.recommendations.some(
        (rec) =>
          rec.toLowerCase().includes('strong') || rec.toLowerCase().includes('nurturing'),
      );
      expect(hasPositiveRecommendation).toBe(true);
    });
  });

  describe('chakra order', () => {
    it('should return chakras in order from root to crown', async () => {
      mockActionsService.checkAndConsumeAction.mockResolvedValue(undefined);
      mockChakrasService.generateChakraProfile.mockResolvedValue(mockChakraProfile);

      const result = await controller.generateChakraProfile(mockRequest, 'person-456');

      const expectedOrder = [
        'Root Chakra',
        'Sacral Chakra',
        'Solar Plexus Chakra',
        'Heart Chakra',
        'Throat Chakra',
        'Third Eye Chakra',
        'Crown Chakra',
      ];

      const actualOrder = result.chakras.map((c) => c.name);
      expect(actualOrder).toEqual(expectedOrder);
    });
  });
});
