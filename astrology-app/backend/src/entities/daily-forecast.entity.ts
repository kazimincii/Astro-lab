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

@Entity('daily_forecasts')
export class DailyForecast {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => PersonProfile, profile => profile.forecasts)
  @JoinColumn()
  profile: PersonProfile;

  @Column({ type: 'date' })
  date: Date;

  @Column()
  sunSign: string;

  // Forecast content
  @Column({ type: 'text' })
  generalForecast: string;

  @Column({ type: 'text', nullable: true })
  loveForecast: string;

  @Column({ type: 'text', nullable: true })
  careerForecast: string;

  @Column({ type: 'text', nullable: true })
  healthForecast: string;

  @Column({
    type: 'text',
    nullable: true,
    transformer: {
      to: (value?: string[]) => (value && value.length ? JSON.stringify(value) : null),
      from: (value?: string) => {
        if (!value) {
          return [];
        }
        try {
          const parsed = JSON.parse(value);
          return Array.isArray(parsed) ? parsed : [];
        } catch {
          return [];
        }
      },
    },
  })
  luckyNumbers: string[];

  @Column({ nullable: true })
  luckyColor: string;

  @Column({ nullable: true })
  luckyGem: string;

  // Ratings (0-5)
  @Column({ type: 'decimal', precision: 2, scale: 1, nullable: true })
  loveScore: number;

  @Column({ type: 'decimal', precision: 2, scale: 1, nullable: true })
  careerScore: number;

  @Column({ type: 'decimal', precision: 2, scale: 1, nullable: true })
  healthScore: number;

  @Column({ type: 'decimal', precision: 2, scale: 1, nullable: true })
  overallScore: number;

  // Astrological data for the day
  @Column({ type: 'jsonb', nullable: true })
  planetaryTransits: any;

  @Column({ default: false })
  isRead: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
