import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  CancelSubscriptionDto,
  ChangePlanDto,
  StartTrialDto,
} from './dto/manage-plan.dto';

@Controller('subscriptions')
@UseGuards(JwtAuthGuard)
export class SubscriptionsController {
  constructor(private subscriptionsService: SubscriptionsService) {}

  @Get('plans')
  async getPlans() {
    return this.subscriptionsService.listPlans();
  }

  @Get('current')
  async getCurrentSubscription(@Request() req) {
    return this.subscriptionsService.getCurrentSubscription(req.user.id);
  }

  @Get('usage')
  async getUsage(@Request() req) {
    return this.subscriptionsService.getUsageSummary(req.user.id);
  }

  @Post('trial')
  async startTrial(@Body() body: StartTrialDto, @Request() req) {
    return this.subscriptionsService.startTrial(req.user.id, body.plan);
  }

  @Post('upgrade')
  async changePlan(@Body() body: ChangePlanDto, @Request() req) {
    return this.subscriptionsService.changePlan(
      req.user.id,
      body.plan,
      body.billingCycle,
    );
  }

  @Post('cancel')
  async cancelSubscription(
    @Body() body: CancelSubscriptionDto,
    @Request() req,
  ) {
    return this.subscriptionsService.cancelSubscription(
      req.user.id,
      body.reason,
    );
  }

  @Post('downgrade')
  async downgrade(@Request() req) {
    return this.subscriptionsService.downgradeToBasic(req.user.id);
  }
}
