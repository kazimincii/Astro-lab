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
import { AstroEvent } from './astro-event.entity';

@Entity('event_impacts')
export class EventImpact {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => PersonProfile)
  @JoinColumn()
  person: PersonProfile;

  @Column({ type: 'varchar' })
  personId: string;

  @ManyToOne(() => AstroEvent)
  @JoinColumn()
  event: AstroEvent;

  @Column({ type: 'varchar' })
  eventId: string;

  @Column({ type: 'int', default: 5 })
  impactLevel: number; // 1-10 scale

  @Column({ type: 'text' })
  personalImpact: string;

  @Column({ type: 'jsonb', nullable: true })
  affectedAreas: {
    love?: string;
    career?: string;
    health?: string;
    finances?: string;
    personal?: string;
  };

  @Column({ type: 'simple-array', nullable: true })
  recommendations: string[];

  @Column({ type: 'jsonb', nullable: true })
  housesAffected: number[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
