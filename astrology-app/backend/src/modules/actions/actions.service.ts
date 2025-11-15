import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return this.actionsRepository.count({
      where: {
        user: { id: userId },
        actionDate: today,
        isPremiumAction: true,
      },
    });
  }
}
