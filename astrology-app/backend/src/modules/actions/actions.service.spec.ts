import { Test, TestingModule } from '@nestjs/testing';
import { ActionsService } from './actions.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ActionLog, ActionType } from '../../entities/action-log.entity';
import { Repository } from 'typeorm';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';
import { ForbiddenException } from '@nestjs/common';
import { PlanType } from '../../entities/subscription.entity';

describe('ActionsService', () => {
  let service: ActionsService;
  let repository: Repository<ActionLog>;
  let subscriptionsService: SubscriptionsService;

  const mockRepository = {
    find: jest.fn(),
    count: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockSubscriptionsService = {
    getEffectivePlan: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ActionsService,
        {
          provide: getRepositoryToken(ActionLog),
          useValue: mockRepository,
        },
        {
          provide: SubscriptionsService,
          useValue: mockSubscriptionsService,
        },
      ],
    }).compile();

    service = module.get<ActionsService>(ActionsService);
    repository = module.get<Repository<ActionLog>>(getRepositoryToken(ActionLog));
    subscriptionsService = module.get<SubscriptionsService>(SubscriptionsService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('checkAndConsumeAction', () => {
    it('should allow action for premium users (unlimited)', async () => {
      mockSubscriptionsService.getEffectivePlan.mockResolvedValue({
        planType: PlanType.PREMIUM,
        premiumActionsPerDay: 0, // 0 = unlimited
      });
      mockRepository.create.mockReturnValue({});
      mockRepository.save.mockResolvedValue({});

      await expect(service.checkAndConsumeAction('user-1')).resolves.not.toThrow();
      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('should allow action when under daily limit', async () => {
      mockSubscriptionsService.getEffectivePlan.mockResolvedValue({
        planType: PlanType.STANDARD,
        premiumActionsPerDay: 4,
      });
      mockRepository.count.mockResolvedValue(2); // Used 2 out of 4
      mockRepository.create.mockReturnValue({});
      mockRepository.save.mockResolvedValue({});

      await expect(service.checkAndConsumeAction('user-1')).resolves.not.toThrow();
    });

    it('should throw ForbiddenException when daily limit is reached', async () => {
      mockSubscriptionsService.getEffectivePlan.mockResolvedValue({
        planType: PlanType.BASIC,
        premiumActionsPerDay: 2,
      });
      mockRepository.count.mockResolvedValue(2); // Already used 2 out of 2

      await expect(service.checkAndConsumeAction('user-1')).rejects.toThrow(ForbiddenException);
      await expect(service.checkAndConsumeAction('user-1')).rejects.toThrow(
        'Daily action limit reached',
      );
    });

    it('should include upgrade suggestion in error for basic users', async () => {
      mockSubscriptionsService.getEffectivePlan.mockResolvedValue({
        planType: PlanType.BASIC,
        premiumActionsPerDay: 2,
      });
      mockRepository.count.mockResolvedValue(2);

      try {
        await service.checkAndConsumeAction('user-1');
      } catch (error) {
        expect(error).toBeInstanceOf(ForbiddenException);
        expect(error.response.suggestUpgrade).toBe('standard');
      }
    });
  });

  describe('getUserActions', () => {
    it('should return user actions for specified date range', async () => {
      const mockActions = [
        { id: '1', userId: 'user-1', type: ActionType.PREMIUM_ACTION, createdAt: new Date() },
        { id: '2', userId: 'user-1', type: ActionType.PREMIUM_ACTION, createdAt: new Date() },
      ];
      mockRepository.find.mockResolvedValue(mockActions);

      const result = await service.getUserActions('user-1');

      expect(result).toEqual(mockActions);
      expect(mockRepository.find).toHaveBeenCalled();
    });
  });

  describe('getRemainingActions', () => {
    it('should return correct remaining actions for basic plan', async () => {
      mockSubscriptionsService.getEffectivePlan.mockResolvedValue({
        planType: PlanType.BASIC,
        premiumActionsPerDay: 2,
      });
      mockRepository.count.mockResolvedValue(1);

      const result = await service.getRemainingActions('user-1');

      expect(result).toEqual({
        dailyLimit: 2,
        used: 1,
        remaining: 1,
        planType: PlanType.BASIC,
      });
    });

    it('should return unlimited for premium plan', async () => {
      mockSubscriptionsService.getEffectivePlan.mockResolvedValue({
        planType: PlanType.PREMIUM,
        premiumActionsPerDay: 0,
      });

      const result = await service.getRemainingActions('user-1');

      expect(result).toEqual({
        dailyLimit: 0,
        used: 0,
        remaining: -1, // unlimited
        planType: PlanType.PREMIUM,
      });
    });
  });
});
