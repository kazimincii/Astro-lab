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

@Entity('soulmate_profiles')
export class SoulmateProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => PersonProfile)
  @JoinColumn()
  person: PersonProfile;

  @Column({ type: 'varchar' })
  personId: string;

  @Column()
  archetype: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'jsonb' })
  meetingScenarios: Array<{
    context: string; // 'work', 'online', 'travel', 'spiritual', etc.
    description: string;
    probability: number;
  }>;

  @Column({ type: 'jsonb', nullable: true })
  partnerPreferences: {
    sunSigns: string[];
    moonSigns: string[];
    risingSigns: string[];
    venusSign: string;
    marsSign: string;
    traits: string[];
  };

  @Column({ type: 'jsonb', nullable: true })
  idealPartnerQualities: string[];

  @Column({ type: 'text', nullable: true })
  relationshipGuidance: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
