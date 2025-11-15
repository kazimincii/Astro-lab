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
import { User } from './user.entity';

export enum AdvancedChartType {
  TRANSIT = 'transit',
  PROGRESSED = 'progressed',
  SYNASTRY = 'synastry',
  COMPOSITE = 'composite',
  DAVISON = 'davison',
  SOLAR_RETURN = 'solar_return',
  LUNAR_RETURN = 'lunar_return',
  SOLAR_ARCS = 'solar_arcs',
}

export enum ChartMode {
  BASIC = 'basic',
  PRO = 'pro',
}

@Entity('advanced_charts')
export class AdvancedChart {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  @JoinColumn()
  user: User;

  @Column({ type: 'varchar' })
  userId: string;

  @ManyToOne(() => PersonProfile, { nullable: true })
  @JoinColumn()
  person1: PersonProfile;

  @Column({ type: 'varchar', nullable: true })
  person1Id: string;

  @ManyToOne(() => PersonProfile, { nullable: true })
  @JoinColumn()
  person2: PersonProfile;

  @Column({ type: 'varchar', nullable: true })
  person2Id: string;

  @Column({ type: 'enum', enum: AdvancedChartType })
  chartType: AdvancedChartType;

  @Column({ type: 'enum', enum: ChartMode, default: ChartMode.BASIC })
  mode: ChartMode;

  @Column({ type: 'date', nullable: true })
  targetDate: Date;

  @Column({ type: 'jsonb' })
  chartData: any;

  @Column({ type: 'text', nullable: true })
  interpretation: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: any;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
