import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  UseGuards,
  Req,
  Headers,
  RawBodyRequest,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiHeader,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PaymentsService } from './payments.service';
import { CreateCheckoutDto, CreatePortalDto } from './dto/payment.dto';

@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('checkout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Create Stripe checkout session',
    description: 'Create a Stripe checkout session for subscribing to a paid plan. Returns a session URL to redirect the user.',
  })
  @ApiResponse({
    status: 201,
    description: 'Checkout session created successfully',
    schema: {
      type: 'object',
      properties: {
        sessionId: { type: 'string', example: 'cs_test_1234567890' },
        url: { type: 'string', example: 'https://checkout.stripe.com/c/pay/cs_test_1234567890' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid plan or billing period' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 409, description: 'User already has active subscription' })
  async createCheckout(@Req() req: any, @Body() dto: CreateCheckoutDto) {
    return this.paymentsService.createCheckoutSession(
      req.user.userId,
      dto.planType,
      dto.billingPeriod,
      dto.successUrl,
      dto.cancelUrl,
    );
  }

  @Post('portal')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Create Stripe customer portal session',
    description: 'Create a Stripe customer portal session where users can manage their subscription, payment methods, and billing history.',
  })
  @ApiResponse({
    status: 201,
    description: 'Portal session created successfully',
    schema: {
      type: 'object',
      properties: {
        url: { type: 'string', example: 'https://billing.stripe.com/session/1234567890' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'No active subscription found' })
  async createPortal(@Req() req: any, @Body() dto: CreatePortalDto) {
    return this.paymentsService.createPortalSession(req.user.userId, dto.returnUrl);
  }

  @Delete('subscription')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Cancel active subscription',
    description: 'Cancel the user\'s active Stripe subscription. The subscription will remain active until the end of the current billing period.',
  })
  @ApiResponse({
    status: 204,
    description: 'Subscription cancelled successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'No active subscription found' })
  async cancelSubscription(@Req() req: any) {
    await this.paymentsService.cancelSubscription(req.user.userId);
  }

  @Get('upcoming-invoice')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Get upcoming invoice',
    description: 'Retrieve details about the next upcoming invoice for the user\'s subscription.',
  })
  @ApiResponse({
    status: 200,
    description: 'Upcoming invoice retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        amount: { type: 'number', example: 1000, description: 'Amount in cents' },
        currency: { type: 'string', example: 'usd' },
        dueDate: { type: 'string', format: 'date-time' },
        periodStart: { type: 'string', format: 'date-time' },
        periodEnd: { type: 'string', format: 'date-time' },
        plan: { type: 'string', example: 'standard' },
        billingPeriod: { type: 'string', example: 'monthly' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'No active subscription found' })
  async getUpcomingInvoice(@Req() req: any) {
    return this.paymentsService.getUpcomingInvoice(req.user.userId);
  }

  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Handle Stripe webhook events',
    description: 'Webhook endpoint for Stripe to send payment and subscription events. This endpoint is public and requires Stripe signature verification.',
  })
  @ApiHeader({
    name: 'stripe-signature',
    description: 'Stripe webhook signature for verification',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Webhook event processed successfully',
    schema: {
      type: 'object',
      properties: {
        received: { type: 'boolean', example: true },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid signature or payload' })
  async handleWebhook(
    @Headers('stripe-signature') signature: string,
    @Req() req: RawBodyRequest<Request>,
  ) {
    // Raw body is required for webhook signature verification
    const payload = req.rawBody as Buffer;
    await this.paymentsService.handleWebhook(signature, payload);
    return { received: true };
  }
}
