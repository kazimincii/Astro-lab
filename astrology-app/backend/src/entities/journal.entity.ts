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
import { PersonProfile } from './person-profile.entity';

export enum MoodLevel {
  VERY_BAD = 1,
  BAD = 2,
  NEUTRAL = 3,
  GOOD = 4,
  VERY_GOOD = 5,
}

@Entity('journal_entries')
export class JournalEntry {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  @JoinColumn()
  user: User;

  @Column({ type: 'varchar' })
  userId: string;

  @ManyToOne(() => PersonProfile, { nullable: true })
  @JoinColumn()
  person: PersonProfile;

  @Column({ type: 'varchar', nullable: true })
  personId: string;

  @Column({ type: 'date' })
  entryDate: Date;

  @Column({ type: 'enum', enum: MoodLevel, nullable: true })
  mood: MoodLevel;

  @Column({ type: 'text', nullable: true })
  content: string;

  @Column({ type: 'simple-array', nullable: true })
  tags: string[];

  @Column({ type: 'text', nullable: true })
  reflectionPrompt: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: {
    weatherMood: string;
    majorTransits: string[];
    moonPhase: string;
  };

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
