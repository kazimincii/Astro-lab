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

export enum WidgetType {
  MOON_PHASE = 'moon_phase',
  STAR_MESSAGE = 'star_message',
  TODAY_SUMMARY = 'today_summary',
  DAILY_FORECAST = 'daily_forecast',
}

@Entity('widget_configs')
export class WidgetConfig {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  @JoinColumn()
  user: User;

  @Column({ type: 'varchar' })
  userId: string;

  @Column({ type: 'enum', enum: WidgetType })
  widgetType: WidgetType;

  @Column({ type: 'jsonb' })
  data: {
    primaryPersonId?: string;
    refreshInterval?: number;
    theme?: string;
    size?: string;
    customization?: any;
  };

  @Column({ type: 'boolean', default: true })
  isEnabled: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
