import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { SubscriptionPlan } from './subscription.entity';

export enum TrialStatus {
  ACTIVE = 'active',
  EXPIRED = 'expired',
  CONVERTED = 'converted',
  CANCELLED = 'cancelled',
}

@Entity('trials')
export class Trial {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  @JoinColumn()
  user: User;

  @Column({ type: 'varchar' })
  userId: string;

  @Column({ type: 'enum', enum: SubscriptionPlan })
  planType: SubscriptionPlan;

  @Column({ type: 'enum', enum: TrialStatus, default: TrialStatus.ACTIVE })
  status: TrialStatus;

  @Column({ type: 'timestamp' })
  startDate: Date;

  @Column({ type: 'timestamp' })
  endDate: Date;

  @Column({ default: 7 })
  durationDays: number;

  @Column({ type: 'timestamp', nullable: true })
  convertedAt: Date;

  @Column({ nullable: true })
  convertedSubscriptionId: string;

  @Column({ type: 'timestamp', nullable: true })
  cancelledAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
