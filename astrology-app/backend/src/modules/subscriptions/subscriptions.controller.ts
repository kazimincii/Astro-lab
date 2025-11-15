import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('subscriptions')
@UseGuards(JwtAuthGuard)
export class SubscriptionsController {
  constructor(private subscriptionsService: SubscriptionsService) {}

  @Get('current')
  async getCurrentSubscription(@Request() req) {
    return this.subscriptionsService.getCurrentSubscription(req.user.id);
  }

  @Get('usage')
  async getUsage(@Request() req) {
    return this.subscriptionsService.getUsageSummary(req.user.id);
  }
}
