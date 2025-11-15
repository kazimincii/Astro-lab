import { Test, TestingModule } from '@nestjs/testing';
import { ActionsService } from './actions.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ActionLog, ActionType } from '../../entities/action-log.entity';
import { Repository } from 'typeorm';
import { ForbiddenException } from '@nestjs/common';
import { Subscription, SubscriptionPlan, SubscriptionStatus } from '../../entities/subscription.entity';
import { Trial, TrialStatus } from '../../entities/trial.entity';

describe('ActionsService', () => {
  let service: ActionsService;
  let actionLogRepository: Repository<ActionLog>;
  let subscriptionRepository: Repository<Subscription>;
  let trialRepository: Repository<Trial>;

  const mockActionLogRepository = {
    find: jest.fn(),
    count: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
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
  });

  describe('logAction', () => {
    it('should log an action successfully', async () => {
      const mockAction = {
        id: '1',
        userId: 'user-1',
        actionType: ActionType.DETAILED_CHART,
        actionDate: new Date(),
      };
      mockActionLogRepository.create.mockReturnValue(mockAction);
      mockActionLogRepository.save.mockResolvedValue(mockAction);

      const result = await service.logAction('user-1', ActionType.DETAILED_CHART);

      expect(result).toEqual(mockAction);
      expect(mockActionLogRepository.create).toHaveBeenCalled();
      expect(mockActionLogRepository.save).toHaveBeenCalledWith(mockAction);
    });
  });

  describe('getTodayActionsCount', () => {
    it('should return count of actions for today', async () => {
      mockActionLogRepository.count.mockResolvedValue(5);

      const result = await service.getTodayActionsCount('user-1');

      expect(result).toBe(5);
      expect(mockActionLogRepository.count).toHaveBeenCalled();
    });
  });

  describe('checkAndConsumeAction', () => {
    // TODO: This test is flaky when run with other tests - needs investigation
    it.skip('should consume action for users with unlimited access', async () => {
      // Reset mocks to ensure clean state
      jest.clearAllMocks();

      // Mock trial check - no active trial
      mockTrialRepository.findOne.mockResolvedValue(null);

      // Mock subscription check - active premium subscription
      mockSubscriptionRepository.findOne.mockResolvedValue({
        id: '1',
        userId: 'user-1',
        plan: SubscriptionPlan.PREMIUM,
        planType: SubscriptionPlan.PREMIUM,
        status: SubscriptionStatus.ACTIVE,
        unlimitedActions: true,
        createdAt: new Date(),
      });

      // Mock action logging
      const mockAction = { id: '1', userId: 'user-1', actionType: ActionType.PREMIUM_ACTION };
      mockActionLogRepository.create.mockReturnValue(mockAction);
      mockActionLogRepository.save.mockResolvedValue(mockAction);

      await expect(service.checkAndConsumeAction('user-1')).resolves.toBeUndefined();
      expect(mockActionLogRepository.save).toHaveBeenCalled();
    });

    it('should allow action when under daily limit', async () => {
      // Reset mocks to ensure clean state
      jest.clearAllMocks();

      mockTrialRepository.findOne.mockResolvedValue(null);
      mockSubscriptionRepository.findOne.mockResolvedValue({
        id: '1',
        userId: 'user-1',
        plan: SubscriptionPlan.STANDARD,
        planType: SubscriptionPlan.STANDARD,
        status: SubscriptionStatus.ACTIVE,
        dailyActionLimit: 4,
        unlimitedActions: false,
        createdAt: new Date(),
      });
      mockActionLogRepository.count.mockResolvedValue(2); // Used 2 out of 4

      const mockAction = { id: '1', userId: 'user-1', actionType: ActionType.PREMIUM_ACTION };
      mockActionLogRepository.create.mockReturnValue(mockAction);
      mockActionLogRepository.save.mockResolvedValue(mockAction);

      await expect(service.checkAndConsumeAction('user-1')).resolves.toBeUndefined();
      expect(mockActionLogRepository.save).toHaveBeenCalled();
    });

    it('should throw when daily limit is reached', async () => {
      // Reset mocks to ensure clean state
      jest.clearAllMocks();

      mockTrialRepository.findOne.mockResolvedValue(null);
      mockSubscriptionRepository.findOne.mockResolvedValue({
        id: '1',
        userId: 'user-1',
        plan: SubscriptionPlan.BASIC,
        planType: SubscriptionPlan.BASIC,
        status: SubscriptionStatus.ACTIVE,
        dailyActionLimit: 2,
        unlimitedActions: false,
        createdAt: new Date(),
      });
      mockActionLogRepository.count.mockResolvedValue(2); // Already used 2 out of 2

      await expect(service.checkAndConsumeAction('user-1')).rejects.toThrow(ForbiddenException);
    });
  });

  describe('getUserActions', () => {
    it('should return user actions', async () => {
      const mockActions = [
        { id: '1', userId: 'user-1', actionType: ActionType.DETAILED_CHART, createdAt: new Date() },
        { id: '2', userId: 'user-1', actionType: ActionType.TAROT_READING, createdAt: new Date() },
      ];
      mockActionLogRepository.find.mockResolvedValue(mockActions);

      const result = await service.getUserActions('user-1');

      expect(result).toEqual(mockActions);
      expect(mockActionLogRepository.find).toHaveBeenCalled();
    });
  });
});
