import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum CalendarCategory {
  BEAUTY = 'beauty',
  HEALTH = 'health',
  ACTIVITY = 'activity',
  SPIRITUAL = 'spiritual',
  TRANSIT = 'transit',
  MOON = 'moon',
}

@Entity('calendar_entries')
export class CalendarEntry {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'enum', enum: CalendarCategory })
  category: CalendarCategory;

  @Column({ type: 'int', nullable: true })
  rating: number; // 1-10 scale

  @Column({ type: 'text', nullable: true })
  tip: string;

  @Column({ type: 'jsonb', nullable: true })
  details: {
    moonPhase?: string;
    moonSign?: string;
    voidOfCourse?: boolean;
    planetaryHour?: string;
    favorableActivities?: string[];
    unfavorableActivities?: string[];
  };

  @Column({ type: 'simple-array', nullable: true })
  tags: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
