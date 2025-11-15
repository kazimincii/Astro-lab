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

@Entity('biorhythm_profiles')
export class BiorhythmProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => PersonProfile)
  @JoinColumn()
  person: PersonProfile;

  @Column({ type: 'varchar' })
  personId: string;

  @Column({ type: 'date' })
  calculatedDate: Date;

  @Column({ type: 'jsonb' })
  data: {
    physical: number;
    emotional: number;
    intellectual: number;
    criticalDays: string[];
    nextPeaks: {
      physical: string;
      emotional: string;
      intellectual: string;
    };
  };

  @Column({ type: 'text', nullable: true })
  commentary: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
