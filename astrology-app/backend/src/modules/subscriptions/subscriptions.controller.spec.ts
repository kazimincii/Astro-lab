import { Test, TestingModule } from '@nestjs/testing';
import {
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { SubscriptionsController } from './subscriptions.controller';
import { SubscriptionsService } from './subscriptions.service';
import {
  CancelSubscriptionDto,
  ChangePlanDto,
  StartTrialDto,
} from './dto/manage-plan.dto';

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
    id: 'user-123',
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

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getPlans', () => {
    it('should return all available subscription plans', async () => {
      const mockPlans = [
        {
          key: 'basic',
          label: 'Basic',
          description: 'Free plan with basic features',
          trialEligible: false,
          features: ['2 daily actions', '2 profiles'],
          dailyActionLimit: 2,
          profileLimit: 2,
          unlimitedActions: false,
          prices: { monthly: 0, yearly: 0 },
        },
        {
          key: 'standard',
          label: 'Standard',
          description: 'More daily actions, more profiles',
          trialEligible: true,
          features: ['4 daily actions', '10 profiles'],
          dailyActionLimit: 4,
          profileLimit: 10,
          unlimitedActions: false,
          prices: { monthly: 10, yearly: 99 },
        },
        {
          key: 'premium',
          label: 'Premium',
          description: 'Unlimited everything',
          trialEligible: true,
          features: ['Unlimited actions', '50 profiles'],
          dailyActionLimit: 999,
          profileLimit: 50,
          unlimitedActions: true,
          prices: { monthly: 20, yearly: 189 },
        },
      ];

      mockSubscriptionsService.listPlans.mockResolvedValue(mockPlans);

      const result = await controller.getPlans();

      expect(result).toEqual(mockPlans);
      expect(mockSubscriptionsService.listPlans).toHaveBeenCalledTimes(1);
    });

    it('should include pricing for each plan', async () => {
      const mockPlans = [
        {
          key: 'standard',
          prices: { monthly: 10, yearly: 99 },
        },
      ];

      mockSubscriptionsService.listPlans.mockResolvedValue(mockPlans);

      const result = await controller.getPlans();

      expect(result[0].prices).toHaveProperty('monthly');
      expect(result[0].prices).toHaveProperty('yearly');
    });

    it('should include features list for each plan', async () => {
      const mockPlans = [
        {
          key: 'standard',
          features: ['4 daily actions', '10 profiles', 'Advanced insights'],
        },
      ];

      mockSubscriptionsService.listPlans.mockResolvedValue(mockPlans);

      const result = await controller.getPlans();

      expect(Array.isArray(result[0].features)).toBe(true);
      expect(result[0].features.length).toBeGreaterThan(0);
    });
  });

  describe('getCurrentSubscription', () => {
    it('should return current active subscription', async () => {
      const mockSubscription = {
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

      mockSubscriptionsService.getCurrentSubscription.mockResolvedValue(
        mockSubscription,
      );

      const mockRequest = { user: mockUser };
      const result = await controller.getCurrentSubscription(mockRequest);

      expect(result).toEqual(mockSubscription);
      expect(mockSubscriptionsService.getCurrentSubscription).toHaveBeenCalledWith(
        mockUser.id,
      );
    });

    it('should return trial subscription details', async () => {
      const mockTrialSubscription = {
        plan: 'standard',
        status: 'trial',
        isTrial: true,
        billingPeriod: null,
        price: 0,
        currentPeriodStart: new Date('2024-01-01'),
        currentPeriodEnd: new Date('2024-01-08'),
        cancelAtPeriodEnd: false,
        dailyActionLimit: 4,
        profileLimit: 10,
        unlimitedActions: false,
      };

      mockSubscriptionsService.getCurrentSubscription.mockResolvedValue(
        mockTrialSubscription,
      );

      const mockRequest = { user: mockUser };
      const result = await controller.getCurrentSubscription(mockRequest);

      expect(result.isTrial).toBe(true);
      expect(result.status).toBe('trial');
    });

    it('should throw NotFoundException when no subscription exists', async () => {
      mockSubscriptionsService.getCurrentSubscription.mockRejectedValue(
        new NotFoundException('No active subscription found'),
      );

      const mockRequest = { user: mockUser };

      await expect(controller.getCurrentSubscription(mockRequest)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should indicate if subscription will be cancelled', async () => {
      const mockCancelledSubscription = {
        plan: 'standard',
        status: 'active',
        isTrial: false,
        billingPeriod: 'monthly',
        price: 10,
        currentPeriodStart: new Date('2024-01-01'),
        currentPeriodEnd: new Date('2024-02-01'),
        cancelAtPeriodEnd: true,
        dailyActionLimit: 4,
        profileLimit: 10,
        unlimitedActions: false,
      };

      mockSubscriptionsService.getCurrentSubscription.mockResolvedValue(
        mockCancelledSubscription,
      );

      const mockRequest = { user: mockUser };
      const result = await controller.getCurrentSubscription(mockRequest);

      expect(result.cancelAtPeriodEnd).toBe(true);
    });
  });

  describe('getUsage', () => {
    it('should return usage summary for authenticated user', async () => {
      const mockUsage = {
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

      mockSubscriptionsService.getUsageSummary.mockResolvedValue(mockUsage);

      const mockRequest = { user: mockUser };
      const result = await controller.getUsage(mockRequest);

      expect(result).toEqual(mockUsage);
      expect(mockSubscriptionsService.getUsageSummary).toHaveBeenCalledWith(
        mockUser.id,
      );
    });

    it('should show unlimited actions for premium plan', async () => {
      const mockPremiumUsage = {
        plan: 'premium',
        dailyActionLimit: 999,
        actionsUsedToday: 50,
        actionsRemainingToday: 949,
        profileLimit: 50,
        profilesUsed: 5,
        profilesRemaining: 45,
        unlimitedActions: true,
        isTrial: false,
      };

      mockSubscriptionsService.getUsageSummary.mockResolvedValue(mockPremiumUsage);

      const mockRequest = { user: mockUser };
      const result = await controller.getUsage(mockRequest);

      expect(result.unlimitedActions).toBe(true);
    });

    it('should track action usage correctly', async () => {
      const mockUsage = {
        plan: 'standard',
        dailyActionLimit: 4,
        actionsUsedToday: 3,
        actionsRemainingToday: 1,
        profileLimit: 10,
        profilesUsed: 2,
        profilesRemaining: 8,
        unlimitedActions: false,
        isTrial: false,
      };

      mockSubscriptionsService.getUsageSummary.mockResolvedValue(mockUsage);

      const mockRequest = { user: mockUser };
      const result = await controller.getUsage(mockRequest);

      expect(result.actionsUsedToday + result.actionsRemainingToday).toBe(
        result.dailyActionLimit,
      );
    });
  });

  describe('startTrial', () => {
    const startTrialDto: StartTrialDto = {
      plan: 'standard',
    };

    it('should start free trial successfully', async () => {
      const mockTrialSubscription = {
        id: 'sub-trial-123',
        plan: 'standard',
        status: 'trial',
        isTrial: true,
        trialEndsAt: new Date('2024-01-08'),
        dailyActionLimit: 4,
        profileLimit: 10,
      };

      mockSubscriptionsService.startTrial.mockResolvedValue(mockTrialSubscription);

      const mockRequest = { user: mockUser };
      const result = await controller.startTrial(startTrialDto, mockRequest);

      expect(result).toEqual(mockTrialSubscription);
      expect(mockSubscriptionsService.startTrial).toHaveBeenCalledWith(
        mockUser.id,
        'standard',
      );
    });

    it('should start premium trial', async () => {
      const premiumTrialDto: StartTrialDto = {
        plan: 'premium',
      };

      const mockPremiumTrial = {
        id: 'sub-trial-456',
        plan: 'premium',
        status: 'trial',
        isTrial: true,
        trialEndsAt: new Date('2024-01-08'),
        dailyActionLimit: 999,
        profileLimit: 50,
      };

      mockSubscriptionsService.startTrial.mockResolvedValue(mockPremiumTrial);

      const mockRequest = { user: mockUser };
      const result = await controller.startTrial(premiumTrialDto, mockRequest);

      expect(result.plan).toBe('premium');
      expect(result.isTrial).toBe(true);
    });

    it('should throw BadRequestException if trial not eligible', async () => {
      mockSubscriptionsService.startTrial.mockRejectedValue(
        new BadRequestException('Trial not eligible for this plan'),
      );

      const mockRequest = { user: mockUser };

      await expect(controller.startTrial(startTrialDto, mockRequest)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw ConflictException if user already has subscription', async () => {
      mockSubscriptionsService.startTrial.mockRejectedValue(
        new ConflictException('User already has an active subscription or trial'),
      );

      const mockRequest = { user: mockUser };

      await expect(controller.startTrial(startTrialDto, mockRequest)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should throw BadRequestException if user already used trial', async () => {
      mockSubscriptionsService.startTrial.mockRejectedValue(
        new BadRequestException('User already used trial'),
      );

      const mockRequest = { user: mockUser };

      await expect(controller.startTrial(startTrialDto, mockRequest)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('changePlan', () => {
    const changePlanDto: ChangePlanDto = {
      plan: 'premium',
      billingCycle: 'yearly',
    };

    it('should upgrade to premium plan successfully', async () => {
      const mockUpgradedSubscription = {
        id: 'sub-789',
        plan: 'premium',
        status: 'active',
        billingPeriod: 'yearly',
        price: 189,
        stripeSubscriptionId: 'sub_stripe_123',
        currentPeriodStart: new Date('2024-01-01'),
        currentPeriodEnd: new Date('2025-01-01'),
        dailyActionLimit: 999,
        profileLimit: 50,
        unlimitedActions: true,
      };

      mockSubscriptionsService.changePlan.mockResolvedValue(mockUpgradedSubscription);

      const mockRequest = { user: mockUser };
      const result = await controller.changePlan(changePlanDto, mockRequest);

      expect(result).toEqual(mockUpgradedSubscription);
      expect(mockSubscriptionsService.changePlan).toHaveBeenCalledWith(
        mockUser.id,
        'premium',
        'yearly',
      );
    });

    it('should change billing cycle from monthly to yearly', async () => {
      const yearlyDto: ChangePlanDto = {
        plan: 'standard',
        billingCycle: 'yearly',
      };

      const mockYearlySubscription = {
        id: 'sub-yearly',
        plan: 'standard',
        status: 'active',
        billingPeriod: 'yearly',
        price: 99,
        stripeSubscriptionId: 'sub_stripe_yearly',
        currentPeriodStart: new Date('2024-01-01'),
        currentPeriodEnd: new Date('2025-01-01'),
        dailyActionLimit: 4,
        profileLimit: 10,
        unlimitedActions: false,
      };

      mockSubscriptionsService.changePlan.mockResolvedValue(mockYearlySubscription);

      const mockRequest = { user: mockUser };
      const result = await controller.changePlan(yearlyDto, mockRequest);

      expect(result.billingPeriod).toBe('yearly');
    });

    it('should throw BadRequestException for invalid plan', async () => {
      const invalidDto: ChangePlanDto = {
        plan: 'invalid-plan' as any,
        billingCycle: 'monthly',
      };

      mockSubscriptionsService.changePlan.mockRejectedValue(
        new BadRequestException('Invalid plan or billing cycle'),
      );

      const mockRequest = { user: mockUser };

      await expect(controller.changePlan(invalidDto, mockRequest)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should handle payment failure', async () => {
      mockSubscriptionsService.changePlan.mockRejectedValue(
        new Error('Payment required - Stripe payment failed'),
      );

      const mockRequest = { user: mockUser };

      await expect(controller.changePlan(changePlanDto, mockRequest)).rejects.toThrow(
        'Payment required - Stripe payment failed',
      );
    });
  });

  describe('cancelSubscription', () => {
    const cancelDto: CancelSubscriptionDto = {
      reason: 'Too expensive for my needs',
    };

    it('should cancel subscription successfully', async () => {
      const mockCancelledSubscription = {
        id: 'sub-123',
        plan: 'standard',
        status: 'active',
        cancelAtPeriodEnd: true,
        cancelledAt: new Date('2024-01-15'),
        cancellationReason: 'Too expensive for my needs',
        currentPeriodEnd: new Date('2024-02-01'),
        message: 'Subscription will be cancelled at the end of the current period',
      };

      mockSubscriptionsService.cancelSubscription.mockResolvedValue(
        mockCancelledSubscription,
      );

      const mockRequest = { user: mockUser };
      const result = await controller.cancelSubscription(cancelDto, mockRequest);

      expect(result).toEqual(mockCancelledSubscription);
      expect(mockSubscriptionsService.cancelSubscription).toHaveBeenCalledWith(
        mockUser.id,
        'Too expensive for my needs',
      );
    });

    it('should accept different cancellation reasons', async () => {
      const reasons = [
        'Too expensive',
        'Not using enough',
        'Found better alternative',
        'Technical issues',
      ];

      for (const reason of reasons) {
        const dto: CancelSubscriptionDto = { reason };
        mockSubscriptionsService.cancelSubscription.mockResolvedValue({
          id: 'sub-123',
          cancellationReason: reason,
          message: 'Cancelled',
        });

        const mockRequest = { user: mockUser };
        await controller.cancelSubscription(dto, mockRequest);

        expect(mockSubscriptionsService.cancelSubscription).toHaveBeenCalledWith(
          mockUser.id,
          reason,
        );
      }
    });

    it('should throw NotFoundException when no subscription exists', async () => {
      mockSubscriptionsService.cancelSubscription.mockRejectedValue(
        new NotFoundException('No active subscription found'),
      );

      const mockRequest = { user: mockUser };

      await expect(
        controller.cancelSubscription(cancelDto, mockRequest),
      ).rejects.toThrow(NotFoundException);
    });

    it('should set cancelAtPeriodEnd to true', async () => {
      const mockCancelledSubscription = {
        id: 'sub-123',
        plan: 'standard',
        status: 'active',
        cancelAtPeriodEnd: true,
        cancelledAt: new Date(),
        cancellationReason: cancelDto.reason,
        currentPeriodEnd: new Date('2024-02-01'),
        message: 'Subscription will be cancelled at the end of the current period',
      };

      mockSubscriptionsService.cancelSubscription.mockResolvedValue(
        mockCancelledSubscription,
      );

      const mockRequest = { user: mockUser };
      const result = await controller.cancelSubscription(cancelDto, mockRequest);

      expect(result.cancelAtPeriodEnd).toBe(true);
    });
  });

  describe('downgrade', () => {
    it('should downgrade to basic plan successfully', async () => {
      const mockBasicPlan = {
        plan: 'basic',
        status: 'active',
        dailyActionLimit: 2,
        profileLimit: 2,
        unlimitedActions: false,
        message: 'Successfully downgraded to Basic plan',
      };

      mockSubscriptionsService.downgradeToBasic.mockResolvedValue(mockBasicPlan);

      const mockRequest = { user: mockUser };
      const result = await controller.downgrade(mockRequest);

      expect(result).toEqual(mockBasicPlan);
      expect(mockSubscriptionsService.downgradeToBasic).toHaveBeenCalledWith(
        mockUser.id,
      );
    });

    it('should cancel paid subscription when downgrading', async () => {
      const mockBasicPlan = {
        plan: 'basic',
        status: 'active',
        dailyActionLimit: 2,
        profileLimit: 2,
        unlimitedActions: false,
        message: 'Successfully downgraded to Basic plan',
      };

      mockSubscriptionsService.downgradeToBasic.mockResolvedValue(mockBasicPlan);

      const mockRequest = { user: mockUser };
      const result = await controller.downgrade(mockRequest);

      expect(result.plan).toBe('basic');
    });

    it('should throw BadRequestException if already on basic plan', async () => {
      mockSubscriptionsService.downgradeToBasic.mockRejectedValue(
        new BadRequestException('Already on Basic plan'),
      );

      const mockRequest = { user: mockUser };

      await expect(controller.downgrade(mockRequest)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should set correct limits for basic plan', async () => {
      const mockBasicPlan = {
        plan: 'basic',
        status: 'active',
        dailyActionLimit: 2,
        profileLimit: 2,
        unlimitedActions: false,
        message: 'Successfully downgraded to Basic plan',
      };

      mockSubscriptionsService.downgradeToBasic.mockResolvedValue(mockBasicPlan);

      const mockRequest = { user: mockUser };
      const result = await controller.downgrade(mockRequest);

      expect(result.dailyActionLimit).toBe(2);
      expect(result.profileLimit).toBe(2);
      expect(result.unlimitedActions).toBe(false);
    });
  });

  describe('authorization', () => {
    it('should use authenticated user ID for all operations', async () => {
      const authenticatedUser = { id: 'auth-user-789' };
      const mockRequest = { user: authenticatedUser };

      mockSubscriptionsService.getCurrentSubscription.mockResolvedValue({});
      mockSubscriptionsService.getUsageSummary.mockResolvedValue({});
      mockSubscriptionsService.startTrial.mockResolvedValue({});
      mockSubscriptionsService.changePlan.mockResolvedValue({});
      mockSubscriptionsService.cancelSubscription.mockResolvedValue({});
      mockSubscriptionsService.downgradeToBasic.mockResolvedValue({});

      await controller.getCurrentSubscription(mockRequest);
      expect(mockSubscriptionsService.getCurrentSubscription).toHaveBeenCalledWith(
        'auth-user-789',
      );

      await controller.getUsage(mockRequest);
      expect(mockSubscriptionsService.getUsageSummary).toHaveBeenCalledWith(
        'auth-user-789',
      );

      await controller.startTrial({ plan: 'standard' }, mockRequest);
      expect(mockSubscriptionsService.startTrial).toHaveBeenCalledWith(
        'auth-user-789',
        'standard',
      );

      await controller.changePlan(
        { plan: 'premium', billingCycle: 'monthly' },
        mockRequest,
      );
      expect(mockSubscriptionsService.changePlan).toHaveBeenCalledWith(
        'auth-user-789',
        'premium',
        'monthly',
      );

      await controller.cancelSubscription({ reason: 'test' }, mockRequest);
      expect(mockSubscriptionsService.cancelSubscription).toHaveBeenCalledWith(
        'auth-user-789',
        'test',
      );

      await controller.downgrade(mockRequest);
      expect(mockSubscriptionsService.downgradeToBasic).toHaveBeenCalledWith(
        'auth-user-789',
      );
    });
  });
});
