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

@Entity('compatibility_reports')
export class CompatibilityReport {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => PersonProfile)
  @JoinColumn()
  profile1: PersonProfile;

  @ManyToOne(() => PersonProfile)
  @JoinColumn()
  profile2: PersonProfile;

  @Column({ type: 'enum', enum: ['romantic', 'friendship', 'business', 'family'] })
  compatibilityType: string;

  // Scores (0-100)
  @Column({ type: 'int' })
  overallScore: number;

  @Column({ type: 'int', nullable: true })
  emotionalScore: number;

  @Column({ type: 'int', nullable: true })
  intellectualScore: number;

  @Column({ type: 'int', nullable: true })
  physicalScore: number;

  @Column({ type: 'int', nullable: true })
  spiritualScore: number;

  // Interpretations
  @Column({ type: 'text' })
  summary: string;

  @Column({ type: 'text', nullable: true })
  strengths: string;

  @Column({ type: 'text', nullable: true })
  challenges: string;

  @Column({ type: 'text', nullable: true })
  advice: string;

  @Column({ type: 'jsonb', nullable: true })
  aspectAnalysis: any; // Detailed planetary aspects between charts

  @Column({ default: false })
  isPremium: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
