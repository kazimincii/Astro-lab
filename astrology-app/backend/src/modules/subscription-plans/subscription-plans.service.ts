import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubscriptionPlanConfig, PlanType } from '../../entities/subscription-plan.entity';

@Injectable()
export class SubscriptionPlansService implements OnModuleInit {
  constructor(
    @InjectRepository(SubscriptionPlanConfig)
    private planRepository: Repository<SubscriptionPlanConfig>,
  ) {}

  async onModuleInit() {
    await this.seedPlans();
  }

  async seedPlans() {
    const plans = [
      {
        planType: PlanType.BASIC,
        name: 'Basic',
        description: 'Free plan with limited features',
        monthlyPrice: 0,
        yearlyPrice: 0,
        dailyActionLimit: 2,
        maxProfiles: 2,
        unlimitedActions: false,
        hasFullChartInterpretation: false,
        hasAdvancedCharts: false,
        hasFullForecasts: false,
        hasUnlimitedTarot: false,
        hasCoffeeReading: false,
        hasFullNumerology: false,
        hasBiorhythm: false,
        hasChakraAnalysis: false,
        hasCalendars: false,
        hasAstroMap: false,
        hasFamousPeople: false,
        hasSoulmateMatching: false,
        hasAuraScan: false,
        hasJournaling: false,
        hasLiveServices: false,
        hasProMode: false,
        sortOrder: 1,
      },
      {
        planType: PlanType.STANDARD,
        name: 'Standard',
        description: 'Great for enthusiasts',
        monthlyPrice: 10.00,
        yearlyPrice: 99.00,
        dailyActionLimit: 4,
        maxProfiles: 10,
        unlimitedActions: false,
        hasFullChartInterpretation: true,
        hasAdvancedCharts: true,
        hasFullForecasts: true,
        hasUnlimitedTarot: false,
        hasCoffeeReading: true,
        hasFullNumerology: true,
        hasBiorhythm: true,
        hasChakraAnalysis: true,
        hasCalendars: true,
        hasAstroMap: true,
        hasFamousPeople: true,
        hasSoulmateMatching: true,
        hasAuraScan: true,
        hasJournaling: true,
        hasLiveServices: true,
        hasProMode: false,
        sortOrder: 2,
      },
      {
        planType: PlanType.PREMIUM,
        name: 'Premium',
        description: 'Unlimited access to all features',
        monthlyPrice: 19.00,
        yearlyPrice: 189.00,
        dailyActionLimit: 0,
        maxProfiles: 50,
        unlimitedActions: true,
        hasFullChartInterpretation: true,
        hasAdvancedCharts: true,
        hasFullForecasts: true,
        hasUnlimitedTarot: true,
        hasCoffeeReading: true,
        hasFullNumerology: true,
        hasBiorhythm: true,
        hasChakraAnalysis: true,
        hasCalendars: true,
        hasAstroMap: true,
        hasFamousPeople: true,
        hasSoulmateMatching: true,
        hasAuraScan: true,
        hasJournaling: true,
        hasLiveServices: true,
        hasProMode: true,
        sortOrder: 3,
      },
    ];

    for (const planData of plans) {
      const existingPlan = await this.planRepository.findOne({
        where: { planType: planData.planType },
      });

      if (!existingPlan) {
        const plan = this.planRepository.create(planData);
        await this.planRepository.save(plan);
      }
    }
  }

  async getAllPlans(): Promise<SubscriptionPlanConfig[]> {
    return await this.planRepository.find({
      where: { isActive: true },
      order: { sortOrder: 'ASC' },
    });
  }

  async getPlanByType(planType: PlanType): Promise<SubscriptionPlanConfig> {
    return await this.planRepository.findOne({ where: { planType } });
  }
}
