import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum ContentCategory {
  PLANETS = 'planets',
  HOUSES = 'houses',
  ASPECTS = 'aspects',
  SIGNS = 'signs',
  RETROGRADES = 'retrogrades',
  TRANSITS = 'transits',
  BASICS = 'basics',
  ADVANCED = 'advanced',
}

export enum DifficultyLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
}

@Entity('education_contents')
export class EducationContent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'text', nullable: true })
  summary: string;

  @Column({ type: 'enum', enum: ContentCategory })
  category: ContentCategory;

  @Column({ type: 'enum', enum: DifficultyLevel, default: DifficultyLevel.BEGINNER })
  difficulty: DifficultyLevel;

  @Column({ type: 'simple-array', nullable: true })
  tags: string[];

  @Column({ type: 'int', default: 0 })
  readingTimeMinutes: number;

  @Column({ type: 'int', default: 0 })
  sortOrder: number;

  @Column({ nullable: true })
  iconUrl: string;

  @Column({ type: 'simple-array', nullable: true })
  relatedTopics: string[];

  @Column({ default: true })
  isPublished: boolean;

  @Column({ type: 'int', default: 0 })
  viewCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
