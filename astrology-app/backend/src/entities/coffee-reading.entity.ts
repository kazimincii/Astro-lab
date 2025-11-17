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

@Entity('coffee_readings')
export class CoffeeReading {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, user => user.coffeeReadings)
  @JoinColumn()
  user: User;

  @Column()
  imageUrl: string; // S3 URL of uploaded coffee cup image

  @Column({ type: 'jsonb', nullable: true })
  detectedSymbols: any; // AI vision detected symbols

  @Column({ type: 'text' })
  interpretation: string;

  @Column({ type: 'text', nullable: true })
  pastInterpretation: string;

  @Column({ type: 'text', nullable: true })
  presentInterpretation: string;

  @Column({ type: 'text', nullable: true })
  futureInterpretation: string;

  @Column({ default: false })
  isPremium: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
