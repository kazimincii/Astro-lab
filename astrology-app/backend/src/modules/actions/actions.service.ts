import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { ActionLog, ActionType } from '@/entities/action-log.entity';

@Injectable()
export class ActionsService {
  constructor(
    @InjectRepository(ActionLog)
    private actionsRepository: Repository<ActionLog>,
  ) {}

  async logAction(
    userId: string,
    actionType: ActionType,
    metadata?: any,
    options: { isPremium?: boolean; description?: string } = {},
  ) {
    const { isPremium = false, description } = options;
    const actionDate = this.normalizeDate(new Date());

    const action = this.actionsRepository.create({
      user: { id: userId } as any,
      actionType,
      actionDate,
      metadata,
      description,
      isPremiumAction: isPremium,
    });

    return this.actionsRepository.save(action);
  }

  async logPremiumAction(
    userId: string,
    actionType: ActionType,
    metadata?: any,
    description?: string,
  ) {
    return this.logAction(userId, actionType, metadata, {
      isPremium: true,
      description,
    });
  }

  async getTodayActionsCount(userId: string): Promise<number> {
    const start = this.normalizeDate(new Date());
    const end = new Date(start);
    end.setHours(23, 59, 59, 999);

    return this.countPremiumActionsBetween(userId, start, end);
  }

  async countPremiumActionsBetween(
    userId: string,
    start: Date,
    end: Date,
  ): Promise<number> {
    return this.actionsRepository.count({
      where: {
        user: { id: userId },
        isPremiumAction: true,
        actionDate: Between(start, end),
      },
    });
  }

  private normalizeDate(date: Date) {
    const normalized = new Date(date);
    normalized.setHours(0, 0, 0, 0);
    return normalized;
  }
}
