import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { StripeService } from './stripe.service';
import { User } from '../../entities/user.entity';

describe('StripeService', () => {
  let service: StripeService;
  let configService: ConfigService;

  const mockConfigService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StripeService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<StripeService>(StripeService);
    configService = module.get<ConfigService>(ConfigService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(configService).toBeDefined();
  });

  describe('isEnabled', () => {
    it('should return true when Stripe is configured', () => {
      mockConfigService.get.mockReturnValue('sk_test_123');
      const newService = new StripeService(configService);
      expect(newService.isEnabled()).toBe(true);
    });

    it('should return false when Stripe secret key is missing', () => {
      mockConfigService.get.mockReturnValue(null);
      const newService = new StripeService(configService);
      expect(newService.isEnabled()).toBe(false);
    });
  });

  describe('syncSubscription', () => {
    it('should return null IDs when Stripe is not enabled', async () => {
      mockConfigService.get.mockReturnValue(null);
      const serviceWithoutStripe = new StripeService(configService);

      const mockUser = {
        id: 'user-1',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
      } as User;

      const result = await serviceWithoutStripe.syncSubscription({
        user: mockUser,
        priceId: 'price_123',
      });

      expect(result).toEqual({
        stripeCustomerId: null,
        stripeSubscriptionId: null,
      });
    });

    it('should return null IDs when priceId is not provided', async () => {
      mockConfigService.get.mockReturnValue('sk_test_123');
      const newService = new StripeService(configService);

      const mockUser = {
        id: 'user-1',
        email: 'test@example.com',
      } as User;

      const result = await newService.syncSubscription({
        user: mockUser,
        priceId: null,
      });

      expect(result).toEqual({
        stripeCustomerId: null,
        stripeSubscriptionId: null,
      });
    });

    it('should return existing customer and subscription IDs when provided', async () => {
      mockConfigService.get.mockReturnValue(null);
      const serviceWithoutStripe = new StripeService(configService);

      const mockUser = {
        id: 'user-1',
        email: 'test@example.com',
      } as User;

      const result = await serviceWithoutStripe.syncSubscription({
        user: mockUser,
        currentCustomerId: 'cus_existing',
        currentSubscriptionId: 'sub_existing',
      });

      expect(result).toEqual({
        stripeCustomerId: 'cus_existing',
        stripeSubscriptionId: 'sub_existing',
      });
    });
  });

  describe('cancelSubscription', () => {
    it('should handle cancellation when Stripe is not enabled', async () => {
      mockConfigService.get.mockReturnValue(null);
      const serviceWithoutStripe = new StripeService(configService);

      // Should not throw error
      await expect(serviceWithoutStripe.cancelSubscription('sub_123')).resolves.toBeUndefined();
    });

    it('should handle cancellation when subscription ID is null', async () => {
      mockConfigService.get.mockReturnValue('sk_test_123');
      const newService = new StripeService(configService);

      // Should not throw error
      await expect(newService.cancelSubscription(null)).resolves.toBeUndefined();
    });

    it('should handle cancellation when subscription ID is undefined', async () => {
      mockConfigService.get.mockReturnValue('sk_test_123');
      const newService = new StripeService(configService);

      // Should not throw error
      await expect(newService.cancelSubscription(undefined)).resolves.toBeUndefined();
    });
  });
});
