import { Controller, Get, Param } from '@nestjs/common';
import { SubscriptionPlansService } from './subscription-plans.service';
import { PlanType } from '../../entities/subscription-plan.entity';

@Controller('subscription-plans')
export class SubscriptionPlansController {
  constructor(private readonly plansService: SubscriptionPlansService) {}

  @Get()
  async getAllPlans() {
    return await this.plansService.getAllPlans();
  }

  @Get(':planType')
  async getPlanByType(@Param('planType') planType: PlanType) {
    return await this.plansService.getPlanByType(planType);
  }
}
