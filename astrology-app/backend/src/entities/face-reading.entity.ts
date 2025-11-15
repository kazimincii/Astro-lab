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

@Entity('face_readings')
export class FaceReading {
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

  @Column()
  imageUrl: string;

  @Column()
  archetype: string;

  @Column({ type: 'text' })
  summary: string;

  @Column({ type: 'jsonb' })
  sections: {
    vibeAndPresence: string;
    communicationStyle: string;
    relationshipStyle: string;
    strengths: string[];
    watchOuts: string[];
  };

  @Column({ type: 'jsonb', nullable: true })
  metadata: {
    modelUsed: string;
    confidence: number;
    processingTime: number;
  };

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
