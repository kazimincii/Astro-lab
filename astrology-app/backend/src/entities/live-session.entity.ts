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

export enum SessionType {
  ASTROLOGY = 'astrology',
  TAROT = 'tarot',
  SPIRITUAL = 'spiritual',
  NUMEROLOGY = 'numerology',
  COACHING = 'coaching',
}

export enum SessionStatus {
  REQUESTED = 'requested',
  SCHEDULED = 'scheduled',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

@Entity('live_sessions')
export class LiveSession {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  @JoinColumn()
  user: User;

  @Column({ type: 'varchar' })
  userId: string;

  @Column({ type: 'varchar' })
  expertId: string;

  @Column({ type: 'enum', enum: SessionType })
  type: SessionType;

  @Column({ type: 'enum', enum: SessionStatus, default: SessionStatus.REQUESTED })
  status: SessionStatus;

  @Column({ type: 'text', nullable: true })
  topic: string;

  @Column({ type: 'timestamp', nullable: true })
  preferredDateTime: Date;

  @Column({ type: 'timestamp', nullable: true })
  scheduledDateTime: Date;

  @Column({ type: 'int', nullable: true })
  durationMinutes: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  price: number;

  @Column({ nullable: true })
  paymentId: string;

  @Column({ nullable: true })
  meetingLink: string;

  @Column({ type: 'text', nullable: true })
  userNotes: string;

  @Column({ type: 'text', nullable: true })
  expertNotes: string;

  @Column({ type: 'int', nullable: true })
  rating: number;

  @Column({ type: 'text', nullable: true })
  review: string;

  @Column({ type: 'timestamp', nullable: true })
  completedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
