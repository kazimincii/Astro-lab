import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Trial, TrialStatus } from '../../entities/trial.entity';
import { SubscriptionPlan } from '../../entities/subscription.entity';

@Injectable()
export class TrialsService {
  constructor(
    @InjectRepository(Trial)
    private trialRepository: Repository<Trial>,
  ) {}

  async startTrial(userId: string, planType: SubscriptionPlan): Promise<Trial> {
    // Check if user already has an active trial
    const existingTrial = await this.trialRepository.findOne({
      where: { userId, status: TrialStatus.ACTIVE },
    });

    if (existingTrial) {
      throw new Error('User already has an active trial');
    }

    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 7);

    const trial = this.trialRepository.create({
      userId,
      planType,
      status: TrialStatus.ACTIVE,
      startDate,
      endDate,
      durationDays: 7,
    });

    return await this.trialRepository.save(trial);
  }

  async getUserActiveTrial(userId: string): Promise<Trial | null> {
    return await this.trialRepository.findOne({
      where: { userId, status: TrialStatus.ACTIVE },
    });
  }

  async cancelTrial(userId: string): Promise<Trial> {
    const trial = await this.getUserActiveTrial(userId);

    if (!trial) {
      throw new Error('No active trial found');
    }

    trial.status = TrialStatus.CANCELLED;
    trial.cancelledAt = new Date();

    return await this.trialRepository.save(trial);
  }

  async expireTrial(trialId: string): Promise<Trial> {
    const trial = await this.trialRepository.findOne({ where: { id: trialId } });

    if (!trial) {
      throw new Error('Trial not found');
    }

    trial.status = TrialStatus.EXPIRED;
    return await this.trialRepository.save(trial);
  }

  async convertTrial(trialId: string, subscriptionId: string): Promise<Trial> {
    const trial = await this.trialRepository.findOne({ where: { id: trialId } });

    if (!trial) {
      throw new Error('Trial not found');
    }

    trial.status = TrialStatus.CONVERTED;
    trial.convertedAt = new Date();
    trial.convertedSubscriptionId = subscriptionId;

    return await this.trialRepository.save(trial);
  }

  async checkExpiredTrials(): Promise<void> {
    const expiredTrials = await this.trialRepository
      .createQueryBuilder('trial')
      .where('trial.status = :status', { status: TrialStatus.ACTIVE })
      .andWhere('trial.endDate < :now', { now: new Date() })
      .getMany();

    for (const trial of expiredTrials) {
      await this.expireTrial(trial.id);
    }
  }
}
