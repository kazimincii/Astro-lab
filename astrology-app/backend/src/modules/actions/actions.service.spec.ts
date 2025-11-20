import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ActionsService } from './actions.service';
import { ActionLog, ActionType } from '../../entities/action-log.entity';
import { Subscription } from '../../entities/subscription.entity';
import { Trial } from '../../entities/trial.entity';

describe('ActionsService', () => {
  let service: ActionsService;
  let actionLogRepository: Repository<ActionLog>;
  let subscriptionRepository: Repository<Subscription>;
  let trialRepository: Repository<Trial>;

  const mockActionLogRepository = {
    create: jest.fn(),
    save: jest.fn(),
    count: jest.fn(),
  };

  const mockSubscriptionRepository = {
    findOne: jest.fn(),
  };

  const mockTrialRepository = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ActionsService,
        {
          provide: getRepositoryToken(ActionLog),
          useValue: mockActionLogRepository,
        },
        {
          provide: getRepositoryToken(Subscription),
          useValue: mockSubscriptionRepository,
        },
        {
          provide: getRepositoryToken(Trial),
          useValue: mockTrialRepository,
        },
      ],
    }).compile();

    service = module.get<ActionsService>(ActionsService);
    actionLogRepository = module.get<Repository<ActionLog>>(getRepositoryToken(ActionLog));
    subscriptionRepository = module.get<Repository<Subscription>>(getRepositoryToken(Subscription));
    trialRepository = module.get<Repository<Trial>>(getRepositoryToken(Trial));
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(actionLogRepository).toBeDefined();
    expect(subscriptionRepository).toBeDefined();
    expect(trialRepository).toBeDefined();
  });

  describe('logAction', () => {
    it('should create and persist an action log entry', async () => {
      const savedAction = { id: 'action-1' };
      mockActionLogRepository.create.mockReturnValue(savedAction);
      mockActionLogRepository.save.mockResolvedValue(savedAction);

      const result = await service.logAction('user-1', ActionType.AI_ASSISTANT, { prompt: 'hello' }, { isPremium: true });

      expect(mockActionLogRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          user: { id: 'user-1' },
          actionType: ActionType.AI_ASSISTANT,
          metadata: { prompt: 'hello' },
          isPremiumAction: true,
        }),
      );
      expect(mockActionLogRepository.save).toHaveBeenCalledWith(savedAction);
      expect(result).toBe(savedAction);
    });
  });

  describe('logPremiumAction', () => {
    it('should delegate to logAction with premium flag', async () => {
      mockActionLogRepository.create.mockReturnValue({});
      mockActionLogRepository.save.mockResolvedValue({});

      await service.logPremiumAction('user-1', ActionType.COFFEE_READING, { cupId: 'abc' }, 'Coffee reading');

      expect(mockActionLogRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          isPremiumAction: true,
          description: 'Coffee reading',
        }),
      );
    });
  });

  describe('getTodayActionsCount', () => {
    it('should return number of premium actions logged today', async () => {
      mockActionLogRepository.count.mockResolvedValue(3);
      const result = await service.getTodayActionsCount('user-1');
      expect(result).toBe(3);
      expect(mockActionLogRepository.count).toHaveBeenCalled();
    });
  });

  describe('countPremiumActionsBetween', () => {
    it('should return premium actions in the given window', async () => {
      const start = new Date('2025-01-01');
      const end = new Date('2025-01-02');
      mockActionLogRepository.count.mockResolvedValue(5);

      const result = await service.countPremiumActionsBetween('user-1', start, end);
      expect(result).toBe(5);
      expect(mockActionLogRepository.count).toHaveBeenCalledWith({
        where: {
          user: { id: 'user-1' },
          isPremiumAction: true,
          actionDate: expect.anything(),
        },
      });
    });
  });

  describe('getUserPlan', () => {
    it('should return BASIC plan when user has active BASIC subscription', async () => {
      mockSubscriptionRepository.findOne.mockResolvedValue({
        plan: 'BASIC',
        status: 'ACTIVE',
      });

      const result = await service.getUserPlan('user-1');
      expect(result).toBe('BASIC');
    });

    it('should return STANDARD plan when user has active STANDARD subscription', async () => {
      mockSubscriptionRepository.findOne.mockResolvedValue({
        plan: 'STANDARD',
        status: 'ACTIVE',
      });

      const result = await service.getUserPlan('user-1');
      expect(result).toBe('STANDARD');
    });

    it('should return PREMIUM plan when user has active PREMIUM subscription', async () => {
      mockSubscriptionRepository.findOne.mockResolvedValue({
        plan: 'PREMIUM',
        status: 'ACTIVE',
      });

      const result = await service.getUserPlan('user-1');
      expect(result).toBe('PREMIUM');
    });

    it('should return STANDARD plan for active trial with remaining actions', async () => {
      mockSubscriptionRepository.findOne.mockResolvedValue(null);
      mockTrialRepository.findOne.mockResolvedValue({
        status: 'ACTIVE',
        premiumActionsRemaining: 5,
      });

      const result = await service.getUserPlan('user-1');
      expect(result).toBe('STANDARD');
    });

    it('should return BASIC plan for active trial with 0 remaining actions', async () => {
      mockSubscriptionRepository.findOne.mockResolvedValue(null);
      mockTrialRepository.findOne.mockResolvedValue({
        status: 'ACTIVE',
        premiumActionsRemaining: 0,
      });

      const result = await service.getUserPlan('user-1');
      expect(result).toBe('BASIC');
    });

    it('should return BASIC plan when no subscription or trial exists', async () => {
      mockSubscriptionRepository.findOne.mockResolvedValue(null);
      mockTrialRepository.findOne.mockResolvedValue(null);

      const result = await service.getUserPlan('user-1');
      expect(result).toBe('BASIC');
    });

    it('should prioritize active subscription over trial', async () => {
      mockSubscriptionRepository.findOne.mockResolvedValue({
        plan: 'PREMIUM',
        status: 'ACTIVE',
      });
      mockTrialRepository.findOne.mockResolvedValue({
        status: 'ACTIVE',
        premiumActionsRemaining: 5,
      });

      const result = await service.getUserPlan('user-1');
      expect(result).toBe('PREMIUM');
      expect(mockTrialRepository.findOne).not.toHaveBeenCalled();
    });
  });

  describe('getRemainingActions', () => {
    it('should return correct info for BASIC plan with no usage', async () => {
      mockSubscriptionRepository.findOne.mockResolvedValue({
        plan: 'BASIC',
        status: 'ACTIVE',
      });
      mockTrialRepository.findOne.mockResolvedValue(null);
      mockActionLogRepository.count.mockResolvedValue(0);

      const result = await service.getRemainingActions('user-1');
      expect(result).toEqual({
        plan: 'BASIC',
        limit: 2,
        used: 0,
        remaining: 2,
        isTrial: false,
      });
    });

    it('should return correct info for BASIC plan with partial usage', async () => {
      mockSubscriptionRepository.findOne.mockResolvedValue({
        plan: 'BASIC',
        status: 'ACTIVE',
      });
      mockTrialRepository.findOne.mockResolvedValue(null);
      mockActionLogRepository.count.mockResolvedValue(1);

      const result = await service.getRemainingActions('user-1');
      expect(result).toEqual({
        plan: 'BASIC',
        limit: 2,
        used: 1,
        remaining: 1,
        isTrial: false,
      });
    });

    it('should return correct info for BASIC plan fully exhausted', async () => {
      mockSubscriptionRepository.findOne.mockResolvedValue({
        plan: 'BASIC',
        status: 'ACTIVE',
      });
      mockTrialRepository.findOne.mockResolvedValue(null);
      mockActionLogRepository.count.mockResolvedValue(2);

      const result = await service.getRemainingActions('user-1');
      expect(result).toEqual({
        plan: 'BASIC',
        limit: 2,
        used: 2,
        remaining: 0,
        isTrial: false,
      });
    });

    it('should return correct info for STANDARD plan with no usage', async () => {
      mockSubscriptionRepository.findOne.mockResolvedValue({
        plan: 'STANDARD',
        status: 'ACTIVE',
      });
      mockTrialRepository.findOne.mockResolvedValue(null);
      mockActionLogRepository.count.mockResolvedValue(0);

      const result = await service.getRemainingActions('user-1');
      expect(result).toEqual({
        plan: 'STANDARD',
        limit: 4,
        used: 0,
        remaining: 4,
        isTrial: false,
      });
    });

    it('should return correct info for STANDARD plan with partial usage', async () => {
      mockSubscriptionRepository.findOne.mockResolvedValue({
        plan: 'STANDARD',
        status: 'ACTIVE',
      });
      mockTrialRepository.findOne.mockResolvedValue(null);
      mockActionLogRepository.count.mockResolvedValue(3);

      const result = await service.getRemainingActions('user-1');
      expect(result).toEqual({
        plan: 'STANDARD',
        limit: 4,
        used: 3,
        remaining: 1,
        isTrial: false,
      });
    });

    it('should return correct info for PREMIUM plan (unlimited)', async () => {
      mockSubscriptionRepository.findOne.mockResolvedValue({
        plan: 'PREMIUM',
        status: 'ACTIVE',
      });
      mockTrialRepository.findOne.mockResolvedValue(null);
      mockActionLogRepository.count.mockResolvedValue(100);

      const result = await service.getRemainingActions('user-1');
      expect(result).toEqual({
        plan: 'PREMIUM',
        limit: 999999,
        used: 100,
        remaining: 999899,
        isTrial: false,
      });
    });

    it('should return trial info for active trial with remaining actions', async () => {
      mockSubscriptionRepository.findOne.mockResolvedValue(null);
      mockTrialRepository.findOne.mockResolvedValue({
        status: 'ACTIVE',
        premiumActionsTotal: 10,
        premiumActionsRemaining: 7,
      });

      const result = await service.getRemainingActions('user-1');
      expect(result).toEqual({
        plan: 'STANDARD',
        limit: 10,
        used: 3,
        remaining: 7,
        isTrial: true,
      });
    });

    it('should return trial info when trial actions exhausted', async () => {
      mockSubscriptionRepository.findOne.mockResolvedValue(null);
      mockTrialRepository.findOne.mockResolvedValue({
        status: 'ACTIVE',
        premiumActionsTotal: 10,
        premiumActionsRemaining: 0,
      });

      const result = await service.getRemainingActions('user-1');
      expect(result).toEqual({
        plan: 'BASIC',
        limit: 10,
        used: 10,
        remaining: 0,
        isTrial: true,
      });
    });

    it('should not return negative remaining actions', async () => {
      mockSubscriptionRepository.findOne.mockResolvedValue({
        plan: 'BASIC',
        status: 'ACTIVE',
      });
      mockTrialRepository.findOne.mockResolvedValue(null);
      mockActionLogRepository.count.mockResolvedValue(5); // More than limit

      const result = await service.getRemainingActions('user-1');
      expect(result.remaining).toBe(0);
      expect(result.remaining).not.toBeLessThan(0);
    });
  });

  describe('checkAndConsumeAction', () => {
    it('should succeed when user has remaining actions', async () => {
      mockSubscriptionRepository.findOne.mockResolvedValue({
        plan: 'BASIC',
        status: 'ACTIVE',
      });
      mockTrialRepository.findOne.mockResolvedValue(null);
      mockActionLogRepository.count.mockResolvedValue(1);

      await expect(service.checkAndConsumeAction('user-1')).resolves.not.toThrow();
    });

    it('should throw ForbiddenException when BASIC user has no remaining actions', async () => {
      mockSubscriptionRepository.findOne.mockResolvedValue({
        plan: 'BASIC',
        status: 'ACTIVE',
      });
      mockTrialRepository.findOne.mockResolvedValue(null);
      mockActionLogRepository.count.mockResolvedValue(2);

      await expect(service.checkAndConsumeAction('user-1')).rejects.toThrow(
        'Daily premium action limit reached. Upgrade to Standard or Premium plan for more actions.',
      );
    });

    it('should throw ForbiddenException when STANDARD user has no remaining actions', async () => {
      mockSubscriptionRepository.findOne.mockResolvedValue({
        plan: 'STANDARD',
        status: 'ACTIVE',
      });
      mockTrialRepository.findOne.mockResolvedValue(null);
      mockActionLogRepository.count.mockResolvedValue(4);

      await expect(service.checkAndConsumeAction('user-1')).rejects.toThrow(
        'Daily premium action limit reached. Upgrade to Premium plan for more actions.',
      );
    });

    it('should decrement trial actions when user is on trial', async () => {
      const mockTrial = {
        id: 'trial-1',
        status: 'ACTIVE',
        premiumActionsTotal: 10,
        premiumActionsRemaining: 5,
      };

      mockSubscriptionRepository.findOne.mockResolvedValue(null);
      mockTrialRepository.findOne.mockResolvedValue(mockTrial);
      mockTrialRepository.save = jest.fn().mockResolvedValue(mockTrial);

      await service.checkAndConsumeAction('user-1');

      expect(mockTrialRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          premiumActionsRemaining: 4,
          status: 'ACTIVE',
        }),
      );
    });

    it('should set trial to EXPIRED when last action is consumed', async () => {
      const mockTrial = {
        id: 'trial-1',
        status: 'ACTIVE',
        premiumActionsTotal: 10,
        premiumActionsRemaining: 1,
      };

      mockSubscriptionRepository.findOne.mockResolvedValue(null);
      mockTrialRepository.findOne.mockResolvedValue(mockTrial);
      mockTrialRepository.save = jest.fn().mockResolvedValue(mockTrial);

      await service.checkAndConsumeAction('user-1');

      expect(mockTrialRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          premiumActionsRemaining: 0,
          status: 'EXPIRED',
        }),
      );
    });

    it('should not modify trial when user has paid subscription', async () => {
      mockSubscriptionRepository.findOne.mockResolvedValue({
        plan: 'PREMIUM',
        status: 'ACTIVE',
      });
      mockTrialRepository.findOne.mockResolvedValue(null);
      mockActionLogRepository.count.mockResolvedValue(0);

      await service.checkAndConsumeAction('user-1');

      expect(mockTrialRepository.save).not.toHaveBeenCalled();
    });

    it('should throw when trial user has 0 remaining actions', async () => {
      mockSubscriptionRepository.findOne.mockResolvedValue(null);
      mockTrialRepository.findOne.mockResolvedValue({
        status: 'ACTIVE',
        premiumActionsTotal: 10,
        premiumActionsRemaining: 0,
      });

      await expect(service.checkAndConsumeAction('user-1')).rejects.toThrow(
        'Daily premium action limit reached',
      );
    });

    it('should allow unlimited actions for PREMIUM users', async () => {
      mockSubscriptionRepository.findOne.mockResolvedValue({
        plan: 'PREMIUM',
        status: 'ACTIVE',
      });
      mockTrialRepository.findOne.mockResolvedValue(null);
      mockActionLogRepository.count.mockResolvedValue(1000);

      await expect(service.checkAndConsumeAction('user-1')).resolves.not.toThrow();
    });
  });
});
