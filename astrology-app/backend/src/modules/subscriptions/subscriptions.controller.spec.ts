import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionsController } from './subscriptions.controller';
import { SubscriptionsService } from './subscriptions.service';
import { CancelSubscriptionDto, ChangePlanDto, StartTrialDto } from './dto/manage-plan.dto';
import { PlanType, BillingPeriod } from '../../entities/subscription.entity';

describe('SubscriptionsController', () => {
  let controller: SubscriptionsController;
  let subscriptionsService: SubscriptionsService;

  const mockSubscriptionsService = {
    listPlans: jest.fn(),
    getCurrentSubscription: jest.fn(),
    getUsageSummary: jest.fn(),
    startTrial: jest.fn(),
    changePlan: jest.fn(),
    cancelSubscription: jest.fn(),
    downgradeToBasic: jest.fn(),
  };

  const mockUser = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    email: 'test@example.com',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubscriptionsController],
      providers: [
        {
          provide: SubscriptionsService,
          useValue: mockSubscriptionsService,
        },
      ],
    }).compile();

    controller = module.get<SubscriptionsController>(SubscriptionsController);
    subscriptionsService = module.get<SubscriptionsService>(SubscriptionsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getPlans', () => {
    it('should return all available subscription plans', async () => {
      const expectedPlans = [
        {
          key: 'basic',
          label: 'Basic',
          description: 'Free plan with basic features',
          trialEligible: false,
          features: ['2 daily actions', 'Up to 2 profiles'],
          dailyActionLimit: 2,
          profileLimit: 2,
          unlimitedActions: false,
          prices: { monthly: 0, yearly: 0 },
        },
        {
          key: 'standard',
          label: 'Standard',
          description: 'More daily actions, more profiles, deeper insights.',
          trialEligible: true,
          features: ['4 premium actions per day', 'Up to 10 profiles'],
          dailyActionLimit: 4,
          profileLimit: 10,
          unlimitedActions: false,
          prices: { monthly: 10, yearly: 99 },
        },
        {
          key: 'premium',
          label: 'Premium',
          description: 'Unlimited everything, all features.',
          trialEligible: true,
          features: ['Unlimited actions', 'Up to 50 profiles'],
          dailyActionLimit: 999,
          profileLimit: 50,
          unlimitedActions: true,
          prices: { monthly: 20, yearly: 189 },
        },
      ];

      mockSubscriptionsService.listPlans.mockResolvedValue(expectedPlans);

      const result = await controller.getPlans();

      expect(result).toEqual(expectedPlans);
      expect(subscriptionsService.listPlans).toHaveBeenCalledTimes(1);
    });
  });

  describe('getCurrentSubscription', () => {
    it('should return current active subscription', async () => {
      const mockRequest = { user: mockUser };
      const expectedSubscription = {
        plan: 'standard',
        status: 'active',
        isTrial: false,
        billingPeriod: 'monthly',
        price: 10,
        currentPeriodStart: new Date('2024-01-01'),
        currentPeriodEnd: new Date('2024-02-01'),
        cancelAtPeriodEnd: false,
        dailyActionLimit: 4,
        profileLimit: 10,
        unlimitedActions: false,
      };

      mockSubscriptionsService.getCurrentSubscription.mockResolvedValue(expectedSubscription);

      const result = await controller.getCurrentSubscription(mockRequest);

      expect(result).toEqual(expectedSubscription);
      expect(subscriptionsService.getCurrentSubscription).toHaveBeenCalledWith(mockUser.id);
      expect(subscriptionsService.getCurrentSubscription).toHaveBeenCalledTimes(1);
    });

    it('should return trial subscription', async () => {
      const mockRequest = { user: mockUser };
      const expectedSubscription = {
        plan: 'standard',
        status: 'trial',
        isTrial: true,
        trialEndsAt: new Date('2024-02-01'),
        dailyActionLimit: 4,
        profileLimit: 10,
      };

      mockSubscriptionsService.getCurrentSubscription.mockResolvedValue(expectedSubscription);

      const result = await controller.getCurrentSubscription(mockRequest);

      expect(result.isTrial).toBe(true);
      expect(result).toHaveProperty('trialEndsAt');
    });
  });

  describe('getUsage', () => {
    it('should return usage summary', async () => {
      const mockRequest = { user: mockUser };
      const expectedUsage = {
        plan: 'standard',
        dailyActionLimit: 4,
        actionsUsedToday: 2,
        actionsRemainingToday: 2,
        profileLimit: 10,
        profilesUsed: 3,
        profilesRemaining: 7,
        unlimitedActions: false,
        isTrial: false,
      };

      mockSubscriptionsService.getUsageSummary.mockResolvedValue(expectedUsage);

      const result = await controller.getUsage(mockRequest);

      expect(result).toEqual(expectedUsage);
      expect(subscriptionsService.getUsageSummary).toHaveBeenCalledWith(mockUser.id);
      expect(subscriptionsService.getUsageSummary).toHaveBeenCalledTimes(1);
    });

    it('should handle unlimited actions plan', async () => {
      const mockRequest = { user: mockUser };
      const expectedUsage = {
        plan: 'premium',
        dailyActionLimit: 999,
        actionsUsedToday: 50,
        actionsRemainingToday: 949,
        profileLimit: 50,
        profilesUsed: 10,
        profilesRemaining: 40,
        unlimitedActions: true,
        isTrial: false,
      };

      mockSubscriptionsService.getUsageSummary.mockResolvedValue(expectedUsage);

      const result = await controller.getUsage(mockRequest);

      expect(result.unlimitedActions).toBe(true);
    });
  });

  describe('startTrial', () => {
    it('should start trial successfully', async () => {
      const mockRequest = { user: mockUser };
      const startTrialDto: StartTrialDto = { plan: PlanType.STANDARD };
      const expectedResponse = {
        id: mockUser.id,
        plan: 'standard',
        status: 'trial',
        isTrial: true,
        trialEndsAt: new Date('2024-02-08'),
        dailyActionLimit: 4,
        profileLimit: 10,
      };

      mockSubscriptionsService.startTrial.mockResolvedValue(expectedResponse);

      const result = await controller.startTrial(startTrialDto, mockRequest);

      expect(result).toEqual(expectedResponse);
      expect(subscriptionsService.startTrial).toHaveBeenCalledWith(
        mockUser.id,
        PlanType.STANDARD,
      );
      expect(subscriptionsService.startTrial).toHaveBeenCalledTimes(1);
    });

    it('should handle trial errors', async () => {
      const mockRequest = { user: mockUser };
      const startTrialDto: StartTrialDto = { plan: PlanType.PREMIUM };

      mockSubscriptionsService.startTrial.mockRejectedValue(
        new Error('User already used trial'),
      );

      await expect(controller.startTrial(startTrialDto, mockRequest)).rejects.toThrow(
        'User already used trial',
      );
    });
  });

  describe('changePlan', () => {
    it('should upgrade plan successfully', async () => {
      const mockRequest = { user: mockUser };
      const changePlanDto: ChangePlanDto = {
        plan: PlanType.PREMIUM,
        billingCycle: BillingPeriod.YEARLY,
      };
      const expectedResponse = {
        id: mockUser.id,
        plan: 'premium',
        status: 'active',
        billingPeriod: 'yearly',
        price: 189,
        stripeSubscriptionId: 'sub_1234567890',
        currentPeriodStart: new Date('2024-01-01'),
        currentPeriodEnd: new Date('2025-01-01'),
        dailyActionLimit: 999,
        profileLimit: 50,
        unlimitedActions: true,
      };

      mockSubscriptionsService.changePlan.mockResolvedValue(expectedResponse);

      const result = await controller.changePlan(changePlanDto, mockRequest);

      expect(result).toEqual(expectedResponse);
      expect(subscriptionsService.changePlan).toHaveBeenCalledWith(
        mockUser.id,
        PlanType.PREMIUM,
        BillingPeriod.YEARLY,
      );
      expect(subscriptionsService.changePlan).toHaveBeenCalledTimes(1);
    });

    it('should handle plan change errors', async () => {
      const mockRequest = { user: mockUser };
      const changePlanDto: ChangePlanDto = {
        plan: PlanType.STANDARD,
        billingCycle: BillingPeriod.MONTHLY,
      };

      mockSubscriptionsService.changePlan.mockRejectedValue(
        new Error('Payment required'),
      );

      await expect(controller.changePlan(changePlanDto, mockRequest)).rejects.toThrow(
        'Payment required',
      );
    });
  });

  describe('cancelSubscription', () => {
    it('should cancel subscription successfully', async () => {
      const mockRequest = { user: mockUser };
      const cancelDto: CancelSubscriptionDto = {
        reason: 'Too expensive for my needs',
      };
      const expectedResponse = {
        id: mockUser.id,
        plan: 'standard',
        status: 'active',
        cancelAtPeriodEnd: true,
        cancelledAt: new Date(),
        cancellationReason: 'Too expensive for my needs',
        currentPeriodEnd: new Date('2024-02-01'),
        message: 'Subscription will be cancelled at the end of the current period',
      };

      mockSubscriptionsService.cancelSubscription.mockResolvedValue(expectedResponse);

      const result = await controller.cancelSubscription(cancelDto, mockRequest);

      expect(result).toEqual(expectedResponse);
      expect(subscriptionsService.cancelSubscription).toHaveBeenCalledWith(
        mockUser.id,
        'Too expensive for my needs',
      );
      expect(subscriptionsService.cancelSubscription).toHaveBeenCalledTimes(1);
    });

    it('should cancel without reason', async () => {
      const mockRequest = { user: mockUser };
      const cancelDto: CancelSubscriptionDto = { reason: undefined };
      const expectedResponse = {
        id: mockUser.id,
        plan: 'standard',
        status: 'active',
        cancelAtPeriodEnd: true,
        cancelledAt: new Date(),
        currentPeriodEnd: new Date('2024-02-01'),
        message: 'Subscription will be cancelled at the end of the current period',
      };

      mockSubscriptionsService.cancelSubscription.mockResolvedValue(expectedResponse);

      const result = await controller.cancelSubscription(cancelDto, mockRequest);

      expect(subscriptionsService.cancelSubscription).toHaveBeenCalledWith(
        mockUser.id,
        undefined,
      );
    });
  });

  describe('downgrade', () => {
    it('should downgrade to basic plan successfully', async () => {
      const mockRequest = { user: mockUser };
      const expectedResponse = {
        plan: 'basic',
        status: 'active',
        dailyActionLimit: 2,
        profileLimit: 2,
        unlimitedActions: false,
        message: 'Successfully downgraded to Basic plan',
      };

      mockSubscriptionsService.downgradeToBasic.mockResolvedValue(expectedResponse);

      const result = await controller.downgrade(mockRequest);

      expect(result).toEqual(expectedResponse);
      expect(subscriptionsService.downgradeToBasic).toHaveBeenCalledWith(mockUser.id);
      expect(subscriptionsService.downgradeToBasic).toHaveBeenCalledTimes(1);
    });

    it('should handle downgrade errors', async () => {
      const mockRequest = { user: mockUser };

      mockSubscriptionsService.downgradeToBasic.mockRejectedValue(
        new Error('Already on Basic plan'),
      );

      await expect(controller.downgrade(mockRequest)).rejects.toThrow(
        'Already on Basic plan',
      );
    });
  });
});
