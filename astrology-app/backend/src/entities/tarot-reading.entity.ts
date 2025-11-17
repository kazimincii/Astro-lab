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

@Entity('tarot_readings')
export class TarotReading {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, user => user.tarotReadings)
  @JoinColumn()
  user: User;

  @Column({ type: 'enum', enum: ['single', 'three_card', 'celtic_cross', 'relationship'] })
  spreadType: string;

  @Column({ type: 'text' })
  question: string;

  @Column({ type: 'jsonb' })
  cards: any; // [{ name: 'The Fool', position: 'past', reversed: false }, ...]

  @Column({ type: 'text' })
  interpretation: string;

  @Column({ type: 'text', nullable: true })
  aiInsights: string;

  @Column({ default: false })
  isPremium: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
