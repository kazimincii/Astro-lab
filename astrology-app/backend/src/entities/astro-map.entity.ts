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

export enum AstroMapTheme {
  LIFE = 'life',
  LOVE = 'love',
  CAREER = 'career',
}

@Entity('astro_maps')
export class AstroMap {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => PersonProfile)
  @JoinColumn()
  person: PersonProfile;

  @Column({ type: 'varchar' })
  personId: string;

  @Column({ type: 'jsonb' })
  planetaryLines: {
    sun: any[];
    moon: any[];
    mercury: any[];
    venus: any[];
    mars: any[];
    jupiter: any[];
    saturn: any[];
    uranus?: any[];
    neptune?: any[];
    pluto?: any[];
  };

  @Column({ type: 'jsonb', nullable: true })
  cityAnalyses: Array<{
    city: string;
    latitude: number;
    longitude: number;
    lifeRating: number;
    loveRating: number;
    careerRating: number;
    summary: string;
    planetInfluences: string[];
  }>;

  @Column({ type: 'enum', enum: AstroMapTheme, nullable: true })
  lastViewedTheme: AstroMapTheme;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
