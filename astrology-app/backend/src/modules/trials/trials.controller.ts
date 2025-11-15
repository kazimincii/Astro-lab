import { Controller, Post, Get, Delete, Body, Req, UseGuards } from '@nestjs/common';
import { TrialsService } from './trials.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SubscriptionPlan } from '../../entities/subscription.entity';

@Controller('trials')
@UseGuards(JwtAuthGuard)
export class TrialsController {
  constructor(private readonly trialsService: TrialsService) {}

  @Post('start')
  async startTrial(@Req() req, @Body('planType') planType: SubscriptionPlan) {
    return await this.trialsService.startTrial(req.user.id, planType);
  }

  @Get('active')
  async getActiveTrial(@Req() req) {
    return await this.trialsService.getUserActiveTrial(req.user.id);
  }

  @Delete('cancel')
  async cancelTrial(@Req() req) {
    return await this.trialsService.cancelTrial(req.user.id);
  }
}
