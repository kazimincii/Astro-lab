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
});
