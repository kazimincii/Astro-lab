import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum AstroEventType {
  RETROGRADE = 'retrograde',
  ECLIPSE = 'eclipse',
  MAJOR_TRANSIT = 'major_transit',
  NEW_MOON = 'new_moon',
  FULL_MOON = 'full_moon',
  INGRESS = 'ingress',
  STATION = 'station',
}

@Entity('astro_events')
export class AstroEvent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: AstroEventType })
  type: AstroEventType;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'timestamp' })
  startDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  endDate: Date;

  @Column({ nullable: true })
  planet: string;

  @Column({ nullable: true })
  sign: string;

  @Column({ type: 'decimal', precision: 10, scale: 6, nullable: true })
  degree: number;

  @Column({ type: 'int', default: 0 })
  importance: number; // 1-10 scale

  @Column({ type: 'text', nullable: true })
  globalImpact: string;

  @Column({ type: 'simple-array', nullable: true })
  affectedSigns: string[];

  @Column({ type: 'jsonb', nullable: true })
  metadata: any;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
