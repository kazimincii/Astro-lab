import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BadRequestException } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { Subscription, SubscriptionPlan, SubscriptionStatus, BillingPeriod } from '../../entities/subscription.entity';
import { User } from '../../entities/user.entity';
import { PersonProfile } from '../../entities/person-profile.entity';
import { ActionsService } from '../actions/actions.service';
import { StripeService } from './stripe.service';
import { ActionType } from '../../entities/action-log.entity';

describe('SubscriptionsService', () => {
  let service: SubscriptionsService;
  let subscriptionsRepository: Repository<Subscription>;
  let usersRepository: Repository<User>;
  let profilesRepository: Repository<PersonProfile>;
  let actionsService: ActionsService;
  let stripeService: StripeService;

  const mockSubscriptionsRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    update: jest.fn(),
  };

  const mockUsersRepository = {
    findOne: jest.fn(),
    update: jest.fn(),
  };

  const mockProfilesRepository = {
    count: jest.fn(),
  };

  const mockActionsService = {
    getTodayActionsCount: jest.fn(),
    countPremiumActionsBetween: jest.fn(),
    logPremiumAction: jest.fn(),
  };

  const mockStripeService = {
    syncSubscription: jest.fn(),
    cancelSubscription: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubscriptionsService,
        {
          provide: getRepositoryToken(Subscription),
          useValue: mockSubscriptionsRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUsersRepository,
        },
        {
          provide: getRepositoryToken(PersonProfile),
          useValue: mockProfilesRepository,
        },
        {
          provide: ActionsService,
          useValue: mockActionsService,
        },
        {
          provide: StripeService,
          useValue: mockStripeService,
        },
      ],
    }).compile();

    service = module.get<SubscriptionsService>(SubscriptionsService);
    subscriptionsRepository = module.get<Repository<Subscription>>(getRepositoryToken(Subscription));
    usersRepository = module.get<Repository<User>>(getRepositoryToken(User));
    profilesRepository = module.get<Repository<PersonProfile>>(getRepositoryToken(PersonProfile));
    actionsService = module.get<ActionsService>(ActionsService);
    stripeService = module.get<StripeService>(StripeService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(subscriptionsRepository).toBeDefined();
    expect(usersRepository).toBeDefined();
    expect(profilesRepository).toBeDefined();
    expect(actionsService).toBeDefined();
    expect(stripeService).toBeDefined();
  });

  describe('listPlans', () => {
    it('should return all available subscription plans', async () => {
      const plans = await service.listPlans();

      expect(plans).toBeDefined();
      expect(Array.isArray(plans)).toBe(true);
      expect(plans.length).toBeGreaterThan(0);

      // Verify plan structure
      plans.forEach(plan => {
        expect(plan).toHaveProperty('plan');
        expect(plan).toHaveProperty('label');
        expect(plan).toHaveProperty('description');
        expect(plan).toHaveProperty('features');
        expect(plan).toHaveProperty('prices');
        expect(plan).toHaveProperty('dailyActionLimit');
        expect(plan).toHaveProperty('profileLimit');
      });
    });
  });

  describe('createBasicSubscription', () => {
    it('should create a basic subscription for a user', async () => {
      const userId = 'user-1';
      const mockSubscription = {
        id: 'sub-1',
        userId,
        plan: SubscriptionPlan.BASIC,
        status: SubscriptionStatus.ACTIVE,
      };

      mockSubscriptionsRepository.create.mockReturnValue(mockSubscription);
      mockSubscriptionsRepository.save.mockResolvedValue(mockSubscription);
      mockUsersRepository.update.mockResolvedValue({ affected: 1 });

      const result = await service.createBasicSubscription(userId);

      expect(mockSubscriptionsRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          userId,
          plan: SubscriptionPlan.BASIC,
          status: SubscriptionStatus.ACTIVE,
          autoRenew: true,
        }),
      );
      expect(mockSubscriptionsRepository.save).toHaveBeenCalled();
      expect(mockUsersRepository.update).toHaveBeenCalledWith(userId, {
        currentSubscription: { id: 'sub-1' },
      });
      expect(result).toBe(mockSubscription);
    });
  });

  describe('getCurrentSubscription', () => {
    it('should return active subscription for a user', async () => {
      const userId = 'user-1';
      const mockSubscription = {
        id: 'sub-1',
        userId,
        plan: SubscriptionPlan.STANDARD,
        status: SubscriptionStatus.ACTIVE,
      };

      mockSubscriptionsRepository.findOne.mockResolvedValue(mockSubscription);

      const result = await service.getCurrentSubscription(userId);

      expect(mockSubscriptionsRepository.findOne).toHaveBeenCalledWith({
        where: {
          user: { id: userId },
          status: expect.anything(),
        },
        order: { createdAt: 'DESC' },
      });
      expect(result).toBe(mockSubscription);
    });

    it('should return null if no active subscription exists', async () => {
      mockSubscriptionsRepository.findOne.mockResolvedValue(null);

      const result = await service.getCurrentSubscription('user-1');

      expect(result).toBeNull();
    });
  });

  describe('ensureDefaultSubscription', () => {
    it('should return existing subscription if available', async () => {
      const mockSubscription = {
        id: 'sub-1',
        userId: 'user-1',
        plan: SubscriptionPlan.STANDARD,
        status: SubscriptionStatus.ACTIVE,
      };

      mockSubscriptionsRepository.findOne.mockResolvedValue(mockSubscription);

      const result = await service.ensureDefaultSubscription('user-1');

      expect(result).toBe(mockSubscription);
    });

    it('should create basic subscription if none exists', async () => {
      const userId = 'user-1';
      const mockBasicSub = {
        id: 'sub-basic',
        userId,
        plan: SubscriptionPlan.BASIC,
        status: SubscriptionStatus.ACTIVE,
      };

      mockSubscriptionsRepository.findOne.mockResolvedValueOnce(null).mockResolvedValueOnce(null);
      mockSubscriptionsRepository.create.mockReturnValue(mockBasicSub);
      mockSubscriptionsRepository.save.mockResolvedValue(mockBasicSub);
      mockUsersRepository.update.mockResolvedValue({ affected: 1 });

      const result = await service.ensureDefaultSubscription(userId);

      expect(mockSubscriptionsRepository.save).toHaveBeenCalled();
      expect(result).toMatchObject({
        plan: SubscriptionPlan.BASIC,
        status: SubscriptionStatus.ACTIVE,
      });
    });
  });

  describe('getUsageSummary', () => {
    it('should return usage summary with actions and profiles count', async () => {
      const userId = 'user-1';
      const mockSubscription = {
        id: 'sub-1',
        userId,
        plan: SubscriptionPlan.STANDARD,
        status: SubscriptionStatus.ACTIVE,
        dailyActionLimit: 10,
        profileLimit: 5,
        unlimitedActions: false,
      };

      mockSubscriptionsRepository.findOne.mockResolvedValue(mockSubscription);
      mockActionsService.countPremiumActionsBetween.mockResolvedValue(3);
      mockProfilesRepository.count.mockResolvedValue(2);

      const result = await service.getUsageSummary(userId);

      expect(result).toEqual(
        expect.objectContaining({
          plan: SubscriptionPlan.STANDARD,
          dailyActionLimit: 10,
          unlimitedActions: false,
          profileLimit: 5,
          actionsUsedToday: 3,
          actionsRemaining: 7,
          profilesUsed: 2,
        }),
      );
    });

    it('should return null for remaining actions when unlimited', async () => {
      const mockSubscription = {
        id: 'sub-1',
        userId: 'user-1',
        plan: SubscriptionPlan.PREMIUM,
        status: SubscriptionStatus.ACTIVE,
        dailyActionLimit: 999,
        profileLimit: 999,
        unlimitedActions: true,
      };

      mockSubscriptionsRepository.findOne.mockResolvedValue(mockSubscription);
      mockActionsService.countPremiumActionsBetween.mockResolvedValue(50);
      mockProfilesRepository.count.mockResolvedValue(10);

      const result = await service.getUsageSummary('user-1');

      expect(result.actionsRemaining).toBeNull();
      expect(result.unlimitedActions).toBe(true);
    });
  });

  describe('consumePremiumAction', () => {
    it('should consume premium action when limit not reached', async () => {
      const userId = 'user-1';
      const mockSubscription = {
        id: 'sub-1',
        userId,
        plan: SubscriptionPlan.STANDARD,
        status: SubscriptionStatus.ACTIVE,
        dailyActionLimit: 10,
        unlimitedActions: false,
      };

      mockSubscriptionsRepository.findOne.mockResolvedValue(mockSubscription);
      mockActionsService.getTodayActionsCount.mockResolvedValue(5);
      mockActionsService.logPremiumAction.mockResolvedValue({});

      const result = await service.consumePremiumAction(
        userId,
        ActionType.AI_ASSISTANT,
        { query: 'test' },
        'AI query',
      );

      expect(mockActionsService.getTodayActionsCount).toHaveBeenCalledWith(userId);
      expect(mockActionsService.logPremiumAction).toHaveBeenCalledWith(
        userId,
        ActionType.AI_ASSISTANT,
        { query: 'test' },
        'AI query',
      );
      expect(result).toBe(mockSubscription);
    });

    it('should throw error when daily limit reached', async () => {
      const userId = 'user-1';
      const mockSubscription = {
        id: 'sub-1',
        userId,
        plan: SubscriptionPlan.STANDARD,
        status: SubscriptionStatus.ACTIVE,
        dailyActionLimit: 10,
        unlimitedActions: false,
      };

      mockSubscriptionsRepository.findOne.mockResolvedValue(mockSubscription);
      mockActionsService.getTodayActionsCount.mockResolvedValue(10);

      await expect(
        service.consumePremiumAction(userId, ActionType.AI_ASSISTANT, {}, 'Test'),
      ).rejects.toThrow(BadRequestException);

      expect(mockActionsService.logPremiumAction).not.toHaveBeenCalled();
    });

    it('should allow action when unlimited actions enabled', async () => {
      const userId = 'user-1';
      const mockSubscription = {
        id: 'sub-1',
        userId,
        plan: SubscriptionPlan.PREMIUM,
        status: SubscriptionStatus.ACTIVE,
        unlimitedActions: true,
      };

      mockSubscriptionsRepository.findOne.mockResolvedValue(mockSubscription);
      mockActionsService.logPremiumAction.mockResolvedValue({});

      await service.consumePremiumAction(userId, ActionType.TAROT_READING, {});

      expect(mockActionsService.getTodayActionsCount).not.toHaveBeenCalled();
      expect(mockActionsService.logPremiumAction).toHaveBeenCalled();
    });
  });

  describe('startTrial', () => {
    it('should start trial subscription for eligible plan', async () => {
      const userId = 'user-1';
      const mockUser = {
        id: userId,
        email: 'test@example.com',
        currentSubscription: null,
      };
      const mockTrialSub = {
        id: 'trial-1',
        userId,
        plan: SubscriptionPlan.STANDARD,
        status: SubscriptionStatus.TRIAL,
        isTrial: true,
      };

      mockSubscriptionsRepository.findOne.mockResolvedValue(null);
      mockSubscriptionsRepository.find.mockResolvedValue([]);
      mockUsersRepository.findOne.mockResolvedValue(mockUser);
      mockStripeService.syncSubscription.mockResolvedValue({
        stripeCustomerId: 'cus_123',
        stripeSubscriptionId: 'sub_123',
      });
      mockSubscriptionsRepository.create.mockReturnValue(mockTrialSub);
      mockSubscriptionsRepository.save.mockResolvedValue(mockTrialSub);
      mockUsersRepository.update.mockResolvedValue({ affected: 1 });

      const result = await service.startTrial(userId, SubscriptionPlan.STANDARD);

      expect(mockStripeService.syncSubscription).toHaveBeenCalled();
      expect(mockSubscriptionsRepository.save).toHaveBeenCalled();
      expect(result.status).toBe(SubscriptionStatus.TRIAL);
      expect(result.isTrial).toBe(true);
    });

    it('should throw error if trial already exists', async () => {
      const mockExistingTrial = {
        id: 'trial-1',
        status: SubscriptionStatus.TRIAL,
      };

      mockSubscriptionsRepository.findOne.mockResolvedValue(mockExistingTrial);

      await expect(
        service.startTrial('user-1', SubscriptionPlan.STANDARD),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw error for non-paid plan', async () => {
      await expect(
        service.startTrial('user-1', SubscriptionPlan.BASIC),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('changePlan', () => {
    it('should change subscription to new plan', async () => {
      const userId = 'user-1';
      const mockUser = {
        id: userId,
        email: 'test@example.com',
        currentSubscription: null,
      };
      const mockNewSub = {
        id: 'sub-new',
        userId,
        plan: SubscriptionPlan.PREMIUM,
        status: SubscriptionStatus.ACTIVE,
      };

      mockSubscriptionsRepository.find.mockResolvedValue([]);
      mockUsersRepository.findOne.mockResolvedValue(mockUser);
      mockStripeService.syncSubscription.mockResolvedValue({
        stripeCustomerId: 'cus_123',
        stripeSubscriptionId: 'sub_123',
      });
      mockSubscriptionsRepository.create.mockReturnValue(mockNewSub);
      mockSubscriptionsRepository.save.mockResolvedValue(mockNewSub);
      mockUsersRepository.update.mockResolvedValue({ affected: 1 });

      const result = await service.changePlan(userId, SubscriptionPlan.PREMIUM, 'monthly');

      expect(mockStripeService.syncSubscription).toHaveBeenCalled();
      expect(mockSubscriptionsRepository.save).toHaveBeenCalled();
      expect(result.plan).toBe(SubscriptionPlan.PREMIUM);
    });

    it('should downgrade to basic when basic plan selected', async () => {
      const userId = 'user-1';
      const mockCurrentSub = {
        id: 'sub-1',
        userId,
        plan: SubscriptionPlan.STANDARD,
        status: SubscriptionStatus.ACTIVE,
        stripeSubscriptionId: 'sub_123',
      };
      const mockBasicSub = {
        id: 'sub-basic',
        userId,
        plan: SubscriptionPlan.BASIC,
        status: SubscriptionStatus.ACTIVE,
      };

      // Sequence of findOne calls:
      // 1. downgradeToBasic -> getCurrentSubscription (returns STANDARD sub)
      // 2. cancelSubscription -> getCurrentSubscription (returns STANDARD sub)
      // 3. cancelSubscription -> ensureDefaultSubscription -> getCurrentSubscription (returns null)
      // 4. ensureDefaultSubscription -> findOne for existing basic (returns null)
      // 5. createBasicSubscription creates and saves basic sub
      // 6. changePlan -> ensureDefaultSubscription -> getCurrentSubscription (returns basic sub)
      mockSubscriptionsRepository.findOne
        .mockResolvedValueOnce(mockCurrentSub) // downgradeToBasic check
        .mockResolvedValueOnce(mockCurrentSub) // cancelSubscription check
        .mockResolvedValueOnce(null) // first ensureDefaultSubscription check
        .mockResolvedValueOnce(null) // ensureDefaultSubscription find existing basic
        .mockResolvedValueOnce(mockBasicSub); // second ensureDefaultSubscription at end of changePlan
      mockSubscriptionsRepository.update.mockResolvedValue({ affected: 1 });
      mockSubscriptionsRepository.create.mockReturnValue(mockBasicSub);
      mockSubscriptionsRepository.save.mockResolvedValue(mockBasicSub);
      mockStripeService.cancelSubscription.mockResolvedValue(undefined);
      mockUsersRepository.update.mockResolvedValue({ affected: 1 });

      const result = await service.changePlan(userId, SubscriptionPlan.BASIC, 'monthly');

      expect(mockStripeService.cancelSubscription).toHaveBeenCalledWith('sub_123');
      expect(result.plan).toBe(SubscriptionPlan.BASIC);
    });
  });

  describe('cancelSubscription', () => {
    it('should cancel paid subscription', async () => {
      const userId = 'user-1';
      const mockPaidSub = {
        id: 'sub-1',
        userId,
        plan: SubscriptionPlan.STANDARD,
        status: SubscriptionStatus.ACTIVE,
        stripeSubscriptionId: 'sub_stripe_123',
      };
      const mockBasicSub = {
        id: 'sub-basic',
        userId,
        plan: SubscriptionPlan.BASIC,
        status: SubscriptionStatus.ACTIVE,
      };

      mockSubscriptionsRepository.findOne
        .mockResolvedValueOnce(mockPaidSub)
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(null);
      mockSubscriptionsRepository.update.mockResolvedValue({ affected: 1 });
      mockSubscriptionsRepository.create.mockReturnValue(mockBasicSub);
      mockSubscriptionsRepository.save.mockResolvedValue(mockBasicSub);
      mockStripeService.cancelSubscription.mockResolvedValue(undefined);
      mockUsersRepository.update.mockResolvedValue({ affected: 1 });

      const result = await service.cancelSubscription(userId, 'User requested');

      expect(mockSubscriptionsRepository.update).toHaveBeenCalledWith(
        'sub-1',
        expect.objectContaining({
          status: SubscriptionStatus.CANCELLED,
          cancellationReason: 'User requested',
          autoRenew: false,
        }),
      );
      expect(mockStripeService.cancelSubscription).toHaveBeenCalledWith('sub_stripe_123');
    });

    it('should throw error if no paid subscription exists', async () => {
      const mockBasicSub = {
        id: 'sub-basic',
        plan: SubscriptionPlan.BASIC,
        status: SubscriptionStatus.ACTIVE,
      };

      mockSubscriptionsRepository.findOne.mockResolvedValue(mockBasicSub);

      await expect(
        service.cancelSubscription('user-1', 'Test'),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('downgradeToBasic', () => {
    it('should downgrade premium subscription to basic', async () => {
      const userId = 'user-1';
      const mockPremiumSub = {
        id: 'sub-premium',
        userId,
        plan: SubscriptionPlan.PREMIUM,
        status: SubscriptionStatus.ACTIVE,
        stripeSubscriptionId: 'sub_stripe_123',
      };
      const mockBasicSub = {
        id: 'sub-basic',
        userId,
        plan: SubscriptionPlan.BASIC,
        status: SubscriptionStatus.ACTIVE,
      };

      // Sequence of findOne calls:
      // 1. downgradeToBasic -> getCurrentSubscription (returns PREMIUM sub)
      // 2. cancelSubscription -> getCurrentSubscription (returns PREMIUM sub)
      // 3. ensureDefaultSubscription -> getCurrentSubscription (returns null)
      // 4. ensureDefaultSubscription -> findOne for existing basic (returns null)
      mockSubscriptionsRepository.findOne
        .mockResolvedValueOnce(mockPremiumSub) // downgradeToBasic check
        .mockResolvedValueOnce(mockPremiumSub) // cancelSubscription check
        .mockResolvedValueOnce(null) // ensureDefaultSubscription check
        .mockResolvedValueOnce(null); // ensureDefaultSubscription find basic
      mockSubscriptionsRepository.update.mockResolvedValue({ affected: 1 });
      mockSubscriptionsRepository.create.mockReturnValue(mockBasicSub);
      mockSubscriptionsRepository.save.mockResolvedValue(mockBasicSub);
      mockStripeService.cancelSubscription.mockResolvedValue(undefined);
      mockUsersRepository.update.mockResolvedValue({ affected: 1 });

      const result = await service.downgradeToBasic(userId);

      expect(mockStripeService.cancelSubscription).toHaveBeenCalledWith('sub_stripe_123');
      expect(result.plan).toBe(SubscriptionPlan.BASIC);
    });

    it('should return basic subscription if already on basic', async () => {
      const mockBasicSub = {
        id: 'sub-basic',
        plan: SubscriptionPlan.BASIC,
        status: SubscriptionStatus.ACTIVE,
      };

      mockSubscriptionsRepository.findOne.mockResolvedValue(mockBasicSub);

      const result = await service.downgradeToBasic('user-1');

      expect(result.plan).toBe(SubscriptionPlan.BASIC);
    });
  });
});
