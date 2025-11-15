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

@Entity('birth_charts')
export class BirthChart {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  personId: string;

  @ManyToOne(() => PersonProfile, profile => profile.birthCharts)
  @JoinColumn({ name: 'personId' })
  profile: PersonProfile;

  // Chart Data (JSON)
  @Column({ type: 'jsonb' })
  planets: any; // { Sun: { sign: 'Aries', degree: 15.5, house: 1 }, ... }

  @Column({ type: 'jsonb' })
  houses: any; // { 1: { sign: 'Aries', degree: 10.2 }, ... }

  @Column({ type: 'jsonb' })
  aspects: any; // [{ planet1: 'Sun', planet2: 'Moon', aspect: 'trine', angle: 120 }, ...]

  @Column({ nullable: true })
  sunSign: string;

  @Column({ nullable: true })
  moonSign: string;

  @Column({ nullable: true })
  ascendant: string;

  // AI Interpretations
  @Column({ type: 'text', nullable: true })
  basicInterpretation: string; // Free basic interpretation

  @Column({ type: 'text', nullable: true })
  detailedInterpretation: string; // Premium detailed interpretation

  @Column({ type: 'timestamp', nullable: true })
  detailedInterpretationAt: Date;

  @Column({ default: false })
  isPremiumAnalyzed: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
