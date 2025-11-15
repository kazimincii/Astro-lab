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

@Entity('numerology_reports')
export class NumerologyReport {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  @JoinColumn()
  user: User;

  @Column()
  fullName: string;

  @Column({ type: 'date' })
  birthDate: Date;

  // Calculated numbers
  @Column({ type: 'int' })
  lifePathNumber: number;

  @Column({ type: 'int' })
  destinyNumber: number;

  @Column({ type: 'int' })
  soulUrgeNumber: number;

  @Column({ type: 'int' })
  personalityNumber: number;

  @Column({ type: 'int', nullable: true })
  birthdayNumber: number;

  // Interpretations
  @Column({ type: 'text' })
  lifePathInterpretation: string;

  @Column({ type: 'text' })
  destinyInterpretation: string;

  @Column({ type: 'text', nullable: true })
  soulUrgeInterpretation: string;

  @Column({ type: 'text', nullable: true })
  personalityInterpretation: string;

  @Column({ type: 'text', nullable: true })
  overallSummary: string;

  @Column({ default: false })
  isPremium: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
