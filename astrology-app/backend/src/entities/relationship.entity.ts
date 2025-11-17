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

@Entity('relationship_profiles')
export class RelationshipProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  @JoinColumn()
  user: User;

  @Column({ type: 'varchar' })
  userId: string;

  @ManyToOne(() => PersonProfile)
  @JoinColumn()
  person1: PersonProfile;

  @Column({ type: 'varchar' })
  person1Id: string;

  @ManyToOne(() => PersonProfile)
  @JoinColumn()
  person2: PersonProfile;

  @Column({ type: 'varchar' })
  person2Id: string;

  @Column({ type: 'jsonb' })
  compatibilityScores: {
    overall: number;
    emotional: number;
    communication: number;
    values: number;
    physical: number;
  };

  @Column({ type: 'text' })
  summary: string;

  @Column({ type: 'jsonb', nullable: true })
  timeline: {
    past6Months: Array<{
      date: string;
      theme: string;
      description: string;
    }>;
    next6Months: Array<{
      date: string;
      theme: string;
      description: string;
    }>;
  };

  @Column({ type: 'text', nullable: true })
  strengths: string;

  @Column({ type: 'text', nullable: true })
  challenges: string;

  @Column({ type: 'text', nullable: true })
  advice: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
