import { Test, TestingModule } from '@nestjs/testing';
import {
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { CreateCheckoutDto, CreatePortalDto } from './dto/payment.dto';

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
    userId: 'user-123',
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

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createCheckout', () => {
    const createCheckoutDto: CreateCheckoutDto = {
      planType: 'standard',
      billingPeriod: 'monthly',
      successUrl: 'https://app.example.com/success',
      cancelUrl: 'https://app.example.com/cancel',
    };

    it('should create checkout session successfully', async () => {
      const mockCheckoutResponse = {
        sessionId: 'cs_test_1234567890',
        url: 'https://checkout.stripe.com/c/pay/cs_test_1234567890',
      };

      mockPaymentsService.createCheckoutSession.mockResolvedValue(
        mockCheckoutResponse,
      );

      const mockRequest = { user: mockUser };
      const result = await controller.createCheckout(mockRequest, createCheckoutDto);

      expect(result).toEqual(mockCheckoutResponse);
      expect(mockPaymentsService.createCheckoutSession).toHaveBeenCalledWith(
        mockUser.userId,
        createCheckoutDto.planType,
        createCheckoutDto.billingPeriod,
        createCheckoutDto.successUrl,
        createCheckoutDto.cancelUrl,
      );
      expect(mockPaymentsService.createCheckoutSession).toHaveBeenCalledTimes(1);
    });

    it('should create checkout for annual billing', async () => {
      const annualDto: CreateCheckoutDto = {
        planType: 'premium',
        billingPeriod: 'annual',
        successUrl: 'https://app.example.com/success',
        cancelUrl: 'https://app.example.com/cancel',
      };

      const mockCheckoutResponse = {
        sessionId: 'cs_test_annual',
        url: 'https://checkout.stripe.com/c/pay/cs_test_annual',
      };

      mockPaymentsService.createCheckoutSession.mockResolvedValue(
        mockCheckoutResponse,
      );

      const mockRequest = { user: mockUser };
      const result = await controller.createCheckout(mockRequest, annualDto);

      expect(result).toEqual(mockCheckoutResponse);
      expect(mockPaymentsService.createCheckoutSession).toHaveBeenCalledWith(
        mockUser.userId,
        'premium',
        'annual',
        annualDto.successUrl,
        annualDto.cancelUrl,
      );
    });

    it('should throw BadRequestException for invalid plan type', async () => {
      const invalidDto: CreateCheckoutDto = {
        planType: 'invalid-plan' as any,
        billingPeriod: 'monthly',
        successUrl: 'https://app.example.com/success',
        cancelUrl: 'https://app.example.com/cancel',
      };

      mockPaymentsService.createCheckoutSession.mockRejectedValue(
        new BadRequestException('Invalid plan or billing period'),
      );

      const mockRequest = { user: mockUser };

      await expect(
        controller.createCheckout(mockRequest, invalidDto),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw ConflictException when user already has active subscription', async () => {
      mockPaymentsService.createCheckoutSession.mockRejectedValue(
        new ConflictException('User already has active subscription'),
      );

      const mockRequest = { user: mockUser };

      await expect(
        controller.createCheckout(mockRequest, createCheckoutDto),
      ).rejects.toThrow(ConflictException);
    });

    it('should handle different plan types', async () => {
      const plans = ['free', 'standard', 'premium'];
      const mockRequest = { user: mockUser };

      for (const planType of plans) {
        const dto: CreateCheckoutDto = {
          planType: planType as any,
          billingPeriod: 'monthly',
          successUrl: 'https://app.example.com/success',
          cancelUrl: 'https://app.example.com/cancel',
        };

        mockPaymentsService.createCheckoutSession.mockResolvedValue({
          sessionId: `cs_${planType}`,
          url: `https://checkout.stripe.com/${planType}`,
        });

        await controller.createCheckout(mockRequest, dto);

        expect(mockPaymentsService.createCheckoutSession).toHaveBeenCalledWith(
          mockUser.userId,
          planType,
          'monthly',
          dto.successUrl,
          dto.cancelUrl,
        );
      }
    });

    it('should include custom success and cancel URLs', async () => {
      const customUrlsDto: CreateCheckoutDto = {
        planType: 'standard',
        billingPeriod: 'monthly',
        successUrl: 'https://custom.example.com/payment-success',
        cancelUrl: 'https://custom.example.com/payment-cancelled',
      };

      mockPaymentsService.createCheckoutSession.mockResolvedValue({
        sessionId: 'cs_test',
        url: 'https://checkout.stripe.com/test',
      });

      const mockRequest = { user: mockUser };
      await controller.createCheckout(mockRequest, customUrlsDto);

      expect(mockPaymentsService.createCheckoutSession).toHaveBeenCalledWith(
        mockUser.userId,
        customUrlsDto.planType,
        customUrlsDto.billingPeriod,
        'https://custom.example.com/payment-success',
        'https://custom.example.com/payment-cancelled',
      );
    });
  });

  describe('createPortal', () => {
    const createPortalDto: CreatePortalDto = {
      returnUrl: 'https://app.example.com/account',
    };

    it('should create customer portal session successfully', async () => {
      const mockPortalResponse = {
        url: 'https://billing.stripe.com/session/1234567890',
      };

      mockPaymentsService.createPortalSession.mockResolvedValue(mockPortalResponse);

      const mockRequest = { user: mockUser };
      const result = await controller.createPortal(mockRequest, createPortalDto);

      expect(result).toEqual(mockPortalResponse);
      expect(mockPaymentsService.createPortalSession).toHaveBeenCalledWith(
        mockUser.userId,
        createPortalDto.returnUrl,
      );
      expect(mockPaymentsService.createPortalSession).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundException when no active subscription exists', async () => {
      mockPaymentsService.createPortalSession.mockRejectedValue(
        new NotFoundException('No active subscription found'),
      );

      const mockRequest = { user: mockUser };

      await expect(
        controller.createPortal(mockRequest, createPortalDto),
      ).rejects.toThrow(NotFoundException);
      expect(mockPaymentsService.createPortalSession).toHaveBeenCalledWith(
        mockUser.userId,
        createPortalDto.returnUrl,
      );
    });

    it('should handle custom return URLs', async () => {
      const customReturnDto: CreatePortalDto = {
        returnUrl: 'https://custom.example.com/billing',
      };

      mockPaymentsService.createPortalSession.mockResolvedValue({
        url: 'https://billing.stripe.com/session/custom',
      });

      const mockRequest = { user: mockUser };
      await controller.createPortal(mockRequest, customReturnDto);

      expect(mockPaymentsService.createPortalSession).toHaveBeenCalledWith(
        mockUser.userId,
        'https://custom.example.com/billing',
      );
    });

    it('should use user ID from authenticated request', async () => {
      const differentUser = { userId: 'user-456', email: 'other@example.com' };
      const mockRequest = { user: differentUser };

      mockPaymentsService.createPortalSession.mockResolvedValue({
        url: 'https://billing.stripe.com/session/456',
      });

      await controller.createPortal(mockRequest, createPortalDto);

      expect(mockPaymentsService.createPortalSession).toHaveBeenCalledWith(
        'user-456',
        createPortalDto.returnUrl,
      );
    });
  });

  describe('cancelSubscription', () => {
    it('should cancel subscription successfully', async () => {
      mockPaymentsService.cancelSubscription.mockResolvedValue(undefined);

      const mockRequest = { user: mockUser };
      const result = await controller.cancelSubscription(mockRequest);

      expect(result).toBeUndefined();
      expect(mockPaymentsService.cancelSubscription).toHaveBeenCalledWith(
        mockUser.userId,
      );
      expect(mockPaymentsService.cancelSubscription).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundException when no active subscription exists', async () => {
      mockPaymentsService.cancelSubscription.mockRejectedValue(
        new NotFoundException('No active subscription found'),
      );

      const mockRequest = { user: mockUser };

      await expect(controller.cancelSubscription(mockRequest)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockPaymentsService.cancelSubscription).toHaveBeenCalledWith(
        mockUser.userId,
      );
    });

    it('should use user ID from authenticated request', async () => {
      const differentUser = { userId: 'user-789', email: 'another@example.com' };
      const mockRequest = { user: differentUser };

      mockPaymentsService.cancelSubscription.mockResolvedValue(undefined);

      await controller.cancelSubscription(mockRequest);

      expect(mockPaymentsService.cancelSubscription).toHaveBeenCalledWith('user-789');
    });

    it('should handle already cancelled subscriptions gracefully', async () => {
      mockPaymentsService.cancelSubscription.mockResolvedValue(undefined);

      const mockRequest = { user: mockUser };
      await controller.cancelSubscription(mockRequest);

      expect(mockPaymentsService.cancelSubscription).toHaveBeenCalled();
    });
  });

  describe('getUpcomingInvoice', () => {
    it('should retrieve upcoming invoice successfully', async () => {
      const mockInvoice = {
        amount: 1000,
        currency: 'usd',
        dueDate: new Date('2024-02-01').toISOString(),
        periodStart: new Date('2024-01-01').toISOString(),
        periodEnd: new Date('2024-01-31').toISOString(),
        plan: 'standard',
        billingPeriod: 'monthly',
      };

      mockPaymentsService.getUpcomingInvoice.mockResolvedValue(mockInvoice);

      const mockRequest = { user: mockUser };
      const result = await controller.getUpcomingInvoice(mockRequest);

      expect(result).toEqual(mockInvoice);
      expect(mockPaymentsService.getUpcomingInvoice).toHaveBeenCalledWith(
        mockUser.userId,
      );
      expect(mockPaymentsService.getUpcomingInvoice).toHaveBeenCalledTimes(1);
    });

    it('should return invoice with correct structure', async () => {
      const mockInvoice = {
        amount: 2000,
        currency: 'usd',
        dueDate: new Date('2024-03-01').toISOString(),
        periodStart: new Date('2024-02-01').toISOString(),
        periodEnd: new Date('2024-02-29').toISOString(),
        plan: 'premium',
        billingPeriod: 'annual',
      };

      mockPaymentsService.getUpcomingInvoice.mockResolvedValue(mockInvoice);

      const mockRequest = { user: mockUser };
      const result = await controller.getUpcomingInvoice(mockRequest);

      expect(result).toHaveProperty('amount');
      expect(result).toHaveProperty('currency');
      expect(result).toHaveProperty('dueDate');
      expect(result).toHaveProperty('periodStart');
      expect(result).toHaveProperty('periodEnd');
      expect(result).toHaveProperty('plan');
      expect(result).toHaveProperty('billingPeriod');
    });

    it('should throw NotFoundException when no active subscription exists', async () => {
      mockPaymentsService.getUpcomingInvoice.mockRejectedValue(
        new NotFoundException('No active subscription found'),
      );

      const mockRequest = { user: mockUser };

      await expect(controller.getUpcomingInvoice(mockRequest)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should handle different currencies', async () => {
      const currencies = ['usd', 'eur', 'gbp'];

      for (const currency of currencies) {
        const mockInvoice = {
          amount: 1000,
          currency,
          dueDate: new Date().toISOString(),
          periodStart: new Date().toISOString(),
          periodEnd: new Date().toISOString(),
          plan: 'standard',
          billingPeriod: 'monthly',
        };

        mockPaymentsService.getUpcomingInvoice.mockResolvedValue(mockInvoice);

        const mockRequest = { user: mockUser };
        const result = await controller.getUpcomingInvoice(mockRequest);

        expect(result.currency).toBe(currency);
      }
    });

    it('should handle different billing periods', async () => {
      const monthlyInvoice = {
        amount: 1000,
        currency: 'usd',
        dueDate: new Date().toISOString(),
        periodStart: new Date().toISOString(),
        periodEnd: new Date().toISOString(),
        plan: 'standard',
        billingPeriod: 'monthly',
      };

      mockPaymentsService.getUpcomingInvoice.mockResolvedValue(monthlyInvoice);

      const mockRequest = { user: mockUser };
      const result = await controller.getUpcomingInvoice(mockRequest);

      expect(result.billingPeriod).toBe('monthly');
    });
  });

  describe('handleWebhook', () => {
    it('should handle webhook successfully', async () => {
      const mockSignature = 'whsec_test_signature';
      const mockPayload = Buffer.from('{"type":"checkout.session.completed"}');
      const mockRequest: any = {
        rawBody: mockPayload,
      };

      mockPaymentsService.handleWebhook.mockResolvedValue(undefined);

      const result = await controller.handleWebhook(mockSignature, mockRequest);

      expect(result).toEqual({ received: true });
      expect(mockPaymentsService.handleWebhook).toHaveBeenCalledWith(
        mockSignature,
        mockPayload,
      );
      expect(mockPaymentsService.handleWebhook).toHaveBeenCalledTimes(1);
    });

    it('should throw BadRequestException for invalid signature', async () => {
      const mockSignature = 'invalid_signature';
      const mockPayload = Buffer.from('{"type":"test"}');
      const mockRequest: any = {
        rawBody: mockPayload,
      };

      mockPaymentsService.handleWebhook.mockRejectedValue(
        new BadRequestException('Invalid signature or payload'),
      );

      await expect(
        controller.handleWebhook(mockSignature, mockRequest),
      ).rejects.toThrow(BadRequestException);
    });

    it('should handle checkout.session.completed event', async () => {
      const mockSignature = 'whsec_checkout_completed';
      const mockPayload = Buffer.from(
        JSON.stringify({
          type: 'checkout.session.completed',
          data: {
            object: {
              id: 'cs_test_123',
              customer: 'cus_test_456',
            },
          },
        }),
      );
      const mockRequest: any = {
        rawBody: mockPayload,
      };

      mockPaymentsService.handleWebhook.mockResolvedValue(undefined);

      const result = await controller.handleWebhook(mockSignature, mockRequest);

      expect(result).toEqual({ received: true });
      expect(mockPaymentsService.handleWebhook).toHaveBeenCalledWith(
        mockSignature,
        mockPayload,
      );
    });

    it('should handle customer.subscription.deleted event', async () => {
      const mockSignature = 'whsec_subscription_deleted';
      const mockPayload = Buffer.from(
        JSON.stringify({
          type: 'customer.subscription.deleted',
          data: {
            object: {
              id: 'sub_test_789',
            },
          },
        }),
      );
      const mockRequest: any = {
        rawBody: mockPayload,
      };

      mockPaymentsService.handleWebhook.mockResolvedValue(undefined);

      const result = await controller.handleWebhook(mockSignature, mockRequest);

      expect(result.received).toBe(true);
    });

    it('should handle invoice.payment_succeeded event', async () => {
      const mockSignature = 'whsec_payment_succeeded';
      const mockPayload = Buffer.from(
        JSON.stringify({
          type: 'invoice.payment_succeeded',
          data: {
            object: {
              id: 'in_test_123',
              amount_paid: 1000,
            },
          },
        }),
      );
      const mockRequest: any = {
        rawBody: mockPayload,
      };

      mockPaymentsService.handleWebhook.mockResolvedValue(undefined);

      const result = await controller.handleWebhook(mockSignature, mockRequest);

      expect(result.received).toBe(true);
    });

    it('should use raw body for signature verification', async () => {
      const mockSignature = 'whsec_raw_body_test';
      const rawBodyContent = '{"type":"test","raw":"data"}';
      const mockPayload = Buffer.from(rawBodyContent);
      const mockRequest: any = {
        rawBody: mockPayload,
      };

      mockPaymentsService.handleWebhook.mockResolvedValue(undefined);

      await controller.handleWebhook(mockSignature, mockRequest);

      expect(mockPaymentsService.handleWebhook).toHaveBeenCalledWith(
        mockSignature,
        mockPayload,
      );
    });

    it('should handle malformed webhook payload', async () => {
      const mockSignature = 'whsec_malformed';
      const mockPayload = Buffer.from('invalid json{');
      const mockRequest: any = {
        rawBody: mockPayload,
      };

      mockPaymentsService.handleWebhook.mockRejectedValue(
        new BadRequestException('Invalid signature or payload'),
      );

      await expect(
        controller.handleWebhook(mockSignature, mockRequest),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
