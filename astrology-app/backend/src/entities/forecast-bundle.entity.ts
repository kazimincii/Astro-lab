import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { PersonProfile } from './person-profile.entity';

export enum ForecastType {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
  WESTERN_HOROSCOPE = 'western_horoscope',
  CHINESE_HOROSCOPE = 'chinese_horoscope',
}

export enum ForecastPeriod {
  THIS_WEEK = 'this_week',
  THIS_MONTH = 'this_month',
  THIS_YEAR = 'this_year',
}

@Entity('forecast_bundles')
export class ForecastBundle {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => PersonProfile)
  @JoinColumn()
  person: PersonProfile;

  @Column({ type: 'varchar' })
  personId: string;

  @Column({ type: 'enum', enum: ForecastType })
  type: ForecastType;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date' })
  endDate: Date;

  @Column({ nullable: true })
  sunSign: string;

  @Column({ nullable: true })
  chineseSign: string;

  @Column({ type: 'jsonb' })
  content: {
    general?: string;
    love?: string;
    career?: string;
    health?: string;
    money?: string;
    spiritual?: string;
    summary?: string;
    highlights?: string[];
    challenges?: string[];
    opportunities?: string[];
    luckyDays?: string[];
    luckyNumbers?: string[];
    luckyColors?: string[];
  };

  @Column({ type: 'jsonb', nullable: true })
  scores: {
    overall?: number;
    love?: number;
    career?: number;
    health?: number;
    money?: number;
  };

  @Column({ type: 'jsonb', nullable: true })
  keyDates: Array<{
    date: string;
    event: string;
    description: string;
    importance: number;
  }>;

  @Column({ type: 'jsonb', nullable: true })
  planetaryInfluences: Array<{
    planet: string;
    influence: string;
    impact: string;
  }>;

  @Column({ default: false })
  isRead: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
