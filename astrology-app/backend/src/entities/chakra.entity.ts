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

export enum ChakraStatus {
  UNDERACTIVE = 'underactive',
  BALANCED = 'balanced',
  OVERACTIVE = 'overactive',
}

export interface ChakraState {
  name: string;
  status: ChakraStatus;
  score: number;
  tips: string[];
}

@Entity('chakra_profiles')
export class ChakraProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => PersonProfile)
  @JoinColumn()
  person: PersonProfile;

  @Column({ type: 'varchar' })
  personId: string;

  @Column({ type: 'jsonb' })
  chakraStates: {
    root: ChakraState;
    sacral: ChakraState;
    solarPlexus: ChakraState;
    heart: ChakraState;
    throat: ChakraState;
    thirdEye: ChakraState;
    crown: ChakraState;
  };

  @Column({ type: 'text', nullable: true })
  overallGuidance: string;

  @Column({ type: 'jsonb', nullable: true })
  meditation: {
    recommended: string[];
    breathwork: string[];
  };

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
