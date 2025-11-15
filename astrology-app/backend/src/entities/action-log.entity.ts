import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

export enum ActionType {
  AI_ASSISTANT = 'ai_assistant',
  DETAILED_CHART = 'detailed_chart',
  TAROT_READING = 'tarot_reading',
  COFFEE_READING = 'coffee_reading',
  NUMEROLOGY = 'numerology',
  COMPATIBILITY = 'compatibility',
  AURA_SCAN = 'aura_scan',
  DAILY_FORECAST = 'daily_forecast',
}

@Entity('action_logs')
export class ActionLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, user => user.actions)
  @JoinColumn()
  user: User;

  @Column({ type: 'enum', enum: ActionType })
  actionType: ActionType;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: any;

  @Column({ default: false })
  isPremiumAction: boolean;

  @Column({ type: 'date' })
  actionDate: Date;

  @CreateDateColumn()
  createdAt: Date;
}
