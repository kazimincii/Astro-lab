import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { BirthChart } from './birth-chart.entity';
import { DailyForecast } from './daily-forecast.entity';

@Entity('person_profiles')
export class PersonProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, user => user.profiles)
  @JoinColumn()
  owner: User;

  @Column()
  name: string;

  @Column({ type: 'date' })
  birthDate: Date;

  @Column({ type: 'time' })
  birthTime: string;

  @Column()
  birthCity: string;

  @Column()
  birthCountry: string;

  @Column({ type: 'decimal', precision: 10, scale: 7 })
  birthLatitude: number;

  @Column({ type: 'decimal', precision: 10, scale: 7 })
  birthLongitude: number;

  @Column({ nullable: true })
  timezone: string;

  @Column({
    type: 'enum',
    enum: ['male', 'female', 'other', 'prefer_not_to_say'],
    default: 'prefer_not_to_say',
  })
  gender: string;

  @Column({ nullable: true })
  profilePicture: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ default: false })
  isMainProfile: boolean;

  @Column({ type: 'enum', enum: ['self', 'partner', 'family', 'friend', 'other'], default: 'self' })
  relationship: string;

  // Cached zodiac data (computed from birth data)
  @Column({ nullable: true })
  sunSign: string;

  @Column({ nullable: true })
  moonSign: string;

  @Column({ nullable: true })
  ascendant: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @OneToMany(() => BirthChart, chart => chart.profile)
  birthCharts: BirthChart[];

  @OneToMany(() => DailyForecast, forecast => forecast.profile)
  forecasts: DailyForecast[];
}
