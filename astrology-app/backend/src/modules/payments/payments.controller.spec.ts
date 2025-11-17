import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { CreateCheckoutDto, CreatePortalDto } from './dto/payment.dto';
import { PlanType, BillingPeriod } from '../../entities/subscription.entity';

describe('PaymentsController', () => {
  let controller: PaymentsController;
  let paymentsService: PaymentsService;

  const mockPaymentsService = {
    createCheckoutSession: jest.fn(),
    createPortalSession: jest.fn(),
    cancelSubscription: jest.fn(),
    getUpcomingInvoice: jest.fn(),
    handleWebhook: jest.fn(),
  };

  const mockUser = {
    userId: '123e4567-e89b-12d3-a456-426614174000',
    email: 'test@example.com',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentsController],
      providers: [
        {
          provide: PaymentsService,
          useValue: mockPaymentsService,
        },
      ],
    }).compile();

    controller = module.get<PaymentsController>(PaymentsController);
    paymentsService = module.get<PaymentsService>(PaymentsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createCheckout', () => {
    it('should create checkout session successfully', async () => {
      const createCheckoutDto: CreateCheckoutDto = {
        planType: PlanType.STANDARD,
        billingPeriod: BillingPeriod.MONTHLY,
        successUrl: 'https://example.com/success',
        cancelUrl: 'https://example.com/cancel',
      };

      const mockRequest = { user: mockUser };

      const expectedResponse = {
        sessionId: 'cs_test_1234567890',
        url: 'https://checkout.stripe.com/c/pay/cs_test_1234567890',
      };

      mockPaymentsService.createCheckoutSession.mockResolvedValue(expectedResponse);

      const result = await controller.createCheckout(mockRequest, createCheckoutDto);

      expect(result).toEqual(expectedResponse);
      expect(paymentsService.createCheckoutSession).toHaveBeenCalledWith(
        mockUser.userId,
        createCheckoutDto.planType,
        createCheckoutDto.billingPeriod,
        createCheckoutDto.successUrl,
        createCheckoutDto.cancelUrl,
      );
      expect(paymentsService.createCheckoutSession).toHaveBeenCalledTimes(1);
    });

    it('should create checkout for premium yearly plan', async () => {
      const createCheckoutDto: CreateCheckoutDto = {
        planType: PlanType.PREMIUM,
        billingPeriod: BillingPeriod.YEARLY,
        successUrl: 'https://example.com/success',
        cancelUrl: 'https://example.com/cancel',
      };

      const mockRequest = { user: mockUser };

      const expectedResponse = {
        sessionId: 'cs_test_premium_yearly',
        url: 'https://checkout.stripe.com/c/pay/cs_test_premium_yearly',
      };

      mockPaymentsService.createCheckoutSession.mockResolvedValue(expectedResponse);

      const result = await controller.createCheckout(mockRequest, createCheckoutDto);

      expect(paymentsService.createCheckoutSession).toHaveBeenCalledWith(
        mockUser.userId,
        PlanType.PREMIUM,
        BillingPeriod.YEARLY,
        createCheckoutDto.successUrl,
        createCheckoutDto.cancelUrl,
      );
    });

    it('should handle checkout creation errors', async () => {
      const createCheckoutDto: CreateCheckoutDto = {
        planType: PlanType.STANDARD,
        billingPeriod: BillingPeriod.MONTHLY,
        successUrl: 'https://example.com/success',
        cancelUrl: 'https://example.com/cancel',
      };

      const mockRequest = { user: mockUser };

      mockPaymentsService.createCheckoutSession.mockRejectedValue(
        new Error('Failed to create checkout session'),
      );

      await expect(
        controller.createCheckout(mockRequest, createCheckoutDto),
      ).rejects.toThrow('Failed to create checkout session');
    });
  });

  describe('createPortal', () => {
    it('should create portal session successfully', async () => {
      const createPortalDto: CreatePortalDto = {
        returnUrl: 'https://example.com/dashboard',
      };

      const mockRequest = { user: mockUser };

      const expectedResponse = {
        url: 'https://billing.stripe.com/session/1234567890',
      };

      mockPaymentsService.createPortalSession.mockResolvedValue(expectedResponse);

      const result = await controller.createPortal(mockRequest, createPortalDto);

      expect(result).toEqual(expectedResponse);
      expect(paymentsService.createPortalSession).toHaveBeenCalledWith(
        mockUser.userId,
        createPortalDto.returnUrl,
      );
      expect(paymentsService.createPortalSession).toHaveBeenCalledTimes(1);
    });

    it('should handle portal creation errors', async () => {
      const createPortalDto: CreatePortalDto = {
        returnUrl: 'https://example.com/dashboard',
      };

      const mockRequest = { user: mockUser };

      mockPaymentsService.createPortalSession.mockRejectedValue(
        new Error('No active subscription found'),
      );

      await expect(
        controller.createPortal(mockRequest, createPortalDto),
      ).rejects.toThrow('No active subscription found');
    });
  });

  describe('cancelSubscription', () => {
    it('should cancel subscription successfully', async () => {
      const mockRequest = { user: mockUser };

      mockPaymentsService.cancelSubscription.mockResolvedValue(undefined);

      await controller.cancelSubscription(mockRequest);

      expect(paymentsService.cancelSubscription).toHaveBeenCalledWith(mockUser.userId);
      expect(paymentsService.cancelSubscription).toHaveBeenCalledTimes(1);
    });

    it('should handle cancellation errors', async () => {
      const mockRequest = { user: mockUser };

      mockPaymentsService.cancelSubscription.mockRejectedValue(
        new Error('No active subscription found'),
      );

      await expect(controller.cancelSubscription(mockRequest)).rejects.toThrow(
        'No active subscription found',
      );
    });
  });

  describe('getUpcomingInvoice', () => {
    it('should retrieve upcoming invoice successfully', async () => {
      const mockRequest = { user: mockUser };

      const expectedResponse = {
        amount: 1000,
        currency: 'usd',
        dueDate: new Date('2024-02-01'),
        periodStart: new Date('2024-01-01'),
        periodEnd: new Date('2024-02-01'),
        plan: 'standard',
        billingPeriod: 'monthly',
      };

      mockPaymentsService.getUpcomingInvoice.mockResolvedValue(expectedResponse);

      const result = await controller.getUpcomingInvoice(mockRequest);

      expect(result).toEqual(expectedResponse);
      expect(paymentsService.getUpcomingInvoice).toHaveBeenCalledWith(mockUser.userId);
      expect(paymentsService.getUpcomingInvoice).toHaveBeenCalledTimes(1);
    });

    it('should handle errors when no subscription exists', async () => {
      const mockRequest = { user: mockUser };

      mockPaymentsService.getUpcomingInvoice.mockRejectedValue(
        new Error('No active subscription found'),
      );

      await expect(controller.getUpcomingInvoice(mockRequest)).rejects.toThrow(
        'No active subscription found',
      );
    });
  });

  describe('handleWebhook', () => {
    it('should handle webhook successfully', async () => {
      const signature = 'whsec_test_signature';
      const payload = Buffer.from(JSON.stringify({ type: 'checkout.session.completed' }));
      const mockRequest = { rawBody: payload } as any;

      mockPaymentsService.handleWebhook.mockResolvedValue(undefined);

      const result = await controller.handleWebhook(signature, mockRequest);

      expect(result).toEqual({ received: true });
      expect(paymentsService.handleWebhook).toHaveBeenCalledWith(signature, payload);
      expect(paymentsService.handleWebhook).toHaveBeenCalledTimes(1);
    });

    it('should handle invalid signature', async () => {
      const signature = 'invalid_signature';
      const payload = Buffer.from(JSON.stringify({ type: 'test.event' }));
      const mockRequest = { rawBody: payload } as any;

      mockPaymentsService.handleWebhook.mockRejectedValue(
        new Error('Invalid webhook signature'),
      );

      await expect(controller.handleWebhook(signature, mockRequest)).rejects.toThrow(
        'Invalid webhook signature',
      );
    });

    it('should handle different webhook event types', async () => {
      const events = [
        'checkout.session.completed',
        'customer.subscription.created',
        'customer.subscription.updated',
        'customer.subscription.deleted',
        'invoice.payment_succeeded',
        'invoice.payment_failed',
      ];

      for (const eventType of events) {
        const signature = `whsec_${eventType}`;
        const payload = Buffer.from(JSON.stringify({ type: eventType }));
        const mockRequest = { rawBody: payload } as any;

        mockPaymentsService.handleWebhook.mockResolvedValue(undefined);

        const result = await controller.handleWebhook(signature, mockRequest);

        expect(result).toEqual({ received: true });
        expect(paymentsService.handleWebhook).toHaveBeenCalledWith(signature, payload);
      }
    });
  });
});
