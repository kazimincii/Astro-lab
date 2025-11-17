import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('cosmic_climate_posts')
export class CosmicClimatePost {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'date', unique: true })
  date: Date;

  @Column()
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'jsonb' })
  skyHighlights: {
    moonPhase: string;
    moonSign: string;
    majorAspects: Array<{
      aspect: string;
      planets: string[];
      description: string;
    }>;
    retrogrades: string[];
    voidOfCourseMoon: boolean;
  };

  @Column({ type: 'text', nullable: true })
  energyTheme: string;

  @Column({ type: 'simple-array', nullable: true })
  recommendations: string[];

  @Column({ type: 'int', default: 0 })
  reactionsCount: number;

  @Column({ type: 'jsonb', default: {} })
  reactions: Record<string, number>;

  @Column({ type: 'boolean', default: true })
  isPublished: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
