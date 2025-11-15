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
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PaymentsService } from './payments.service';
import { PlanType, BillingPeriod } from '../../entities/subscription.entity';

class CreateCheckoutDto {
  planType: PlanType;
  billingPeriod: BillingPeriod;
  successUrl: string;
  cancelUrl: string;
}

class CreatePortalDto {
  returnUrl: string;
}

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('checkout')
  @UseGuards(JwtAuthGuard)
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
  async createPortal(@Req() req: any, @Body() dto: CreatePortalDto) {
    return this.paymentsService.createPortalSession(req.user.userId, dto.returnUrl);
  }

  @Delete('subscription')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async cancelSubscription(@Req() req: any) {
    await this.paymentsService.cancelSubscription(req.user.userId);
  }

  @Get('upcoming-invoice')
  @UseGuards(JwtAuthGuard)
  async getUpcomingInvoice(@Req() req: any) {
    return this.paymentsService.getUpcomingInvoice(req.user.userId);
  }

  @Post('webhook')
  @HttpCode(HttpStatus.OK)
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
