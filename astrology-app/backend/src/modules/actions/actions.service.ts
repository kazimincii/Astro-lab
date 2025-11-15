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

  async logAction(userId: string, actionType: ActionType, metadata?: any) {
    const action = this.actionsRepository.create({
      user: { id: userId } as any,
      actionType,
      actionDate: new Date(),
      metadata,
    });

    return this.actionsRepository.save(action);
  }

  async getTodayActionsCount(userId: string): Promise<number> {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
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
}
