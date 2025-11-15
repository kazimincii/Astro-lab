import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum PlanType {
  BASIC = 'basic',
  STANDARD = 'standard',
  PREMIUM = 'premium',
}

@Entity('subscription_plans')
export class SubscriptionPlanConfig {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: PlanType, unique: true })
  planType: PlanType;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  // Pricing
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  monthlyPrice: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  yearlyPrice: number;

  @Column({ nullable: true })
  stripePriceIdMonthly: string;

  @Column({ nullable: true })
  stripePriceIdYearly: string;

  // Limits
  @Column({ default: 2 })
  dailyActionLimit: number;

  @Column({ default: 2 })
  maxProfiles: number;

  @Column({ default: false })
  unlimitedActions: boolean;

  // Feature flags
  @Column({ default: false })
  hasFullChartInterpretation: boolean;

  @Column({ default: false })
  hasAdvancedCharts: boolean;

  @Column({ default: false })
  hasFullForecasts: boolean;

  @Column({ default: false })
  hasUnlimitedTarot: boolean;

  @Column({ default: false })
  hasCoffeeReading: boolean;

  @Column({ default: false })
  hasFullNumerology: boolean;

  @Column({ default: false })
  hasBiorhythm: boolean;

  @Column({ default: false })
  hasChakraAnalysis: boolean;

  @Column({ default: false })
  hasCalendars: boolean;

  @Column({ default: false })
  hasAstroMap: boolean;

  @Column({ default: false })
  hasFamousPeople: boolean;

  @Column({ default: false })
  hasSoulmateMatching: boolean;

  @Column({ default: false })
  hasAuraScan: boolean;

  @Column({ default: false })
  hasJournaling: boolean;

  @Column({ default: false })
  hasLiveServices: boolean;

  @Column({ default: false })
  hasProMode: boolean;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'int', default: 0 })
  sortOrder: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
