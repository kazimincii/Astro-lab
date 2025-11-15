import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PaymentsService } from './payments.service';
import {
  Subscription,
  SubscriptionStatus,
  PlanType,
  BillingPeriod,
} from '../../entities/subscription.entity';
import { User } from '../../entities/user.entity';

describe('PaymentsService', () => {
  let service: PaymentsService;
  let subscriptionRepository: Repository<Subscription>;
  let userRepository: Repository<User>;
  let configService: ConfigService;

  const mockSubscriptionRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
  };

  const mockUserRepository = {
    findOne: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn((key: string) => {
      if (key === 'stripe.apiKey') return 'sk_test_mock';
      if (key === 'stripe.webhookSecret') return 'whsec_test_mock';
      if (key === 'stripe.prices') {
        return {
          standard: {
            monthly: 'price_standard_monthly',
            yearly: 'price_standard_yearly',
          },
          premium: {
            monthly: 'price_premium_monthly',
            yearly: 'price_premium_yearly',
          },
        };
      }
      return null;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentsService,
        {
          provide: getRepositoryToken(Subscription),
          useValue: mockSubscriptionRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<PaymentsService>(PaymentsService);
    subscriptionRepository = module.get<Repository<Subscription>>(getRepositoryToken(Subscription));
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    configService = module.get<ConfigService>(ConfigService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(subscriptionRepository).toBeDefined();
    expect(userRepository).toBeDefined();
    expect(configService).toBeDefined();
  });

  describe('createCheckoutSession', () => {
    it('should throw error when user not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(
        service.createCheckoutSession(
          'nonexistent-user',
          PlanType.STANDARD,
          BillingPeriod.MONTHLY,
          'https://success.url',
          'https://cancel.url',
        ),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('createPortalSession', () => {
    it('should throw error when no active subscription found', async () => {
      mockSubscriptionRepository.findOne.mockResolvedValue(null);

      await expect(service.createPortalSession('user-1', 'https://return.url')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw error when subscription has no Stripe customer ID', async () => {
      const mockSubscription = {
        id: 'sub-1',
        userId: 'user-1',
        status: SubscriptionStatus.ACTIVE,
        stripeCustomerId: null,
      };

      mockSubscriptionRepository.findOne.mockResolvedValue(mockSubscription);

      await expect(service.createPortalSession('user-1', 'https://return.url')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('cancelSubscription', () => {
    it('should throw error when no active subscription found', async () => {
      mockSubscriptionRepository.findOne.mockResolvedValue(null);

      await expect(service.cancelSubscription('user-1')).rejects.toThrow(BadRequestException);
    });

    it('should throw error when subscription has no Stripe subscription ID', async () => {
      const mockSubscription = {
        id: 'sub-1',
        userId: 'user-1',
        status: SubscriptionStatus.ACTIVE,
        stripeSubscriptionId: null,
      };

      mockSubscriptionRepository.findOne.mockResolvedValue(mockSubscription);

      await expect(service.cancelSubscription('user-1')).rejects.toThrow(BadRequestException);
    });
  });

  describe('getUpcomingInvoice', () => {
    it('should throw error when no active subscription found', async () => {
      mockSubscriptionRepository.findOne.mockResolvedValue(null);

      await expect(service.getUpcomingInvoice('user-1')).rejects.toThrow(BadRequestException);
    });

    it('should throw error when subscription has no Stripe subscription ID', async () => {
      const mockSubscription = {
        id: 'sub-1',
        userId: 'user-1',
        status: SubscriptionStatus.ACTIVE,
        stripeSubscriptionId: null,
      };

      mockSubscriptionRepository.findOne.mockResolvedValue(mockSubscription);

      await expect(service.getUpcomingInvoice('user-1')).rejects.toThrow(BadRequestException);
    });
  });
});
