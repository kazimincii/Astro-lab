import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('famous_people')
export class FamousPerson {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  photoUrl: string;

  @Column({ type: 'text', nullable: true })
  biography: string;

  @Column()
  profession: string;

  @Column({ type: 'simple-array', nullable: true })
  categories: string[]; // 'scientist', 'leader', 'artist', 'entrepreneur', etc.

  @Column({ type: 'date' })
  birthDate: Date;

  @Column({ nullable: true })
  birthTime: string;

  @Column({ nullable: true })
  birthPlace: string;

  @Column({ nullable: true })
  sunSign: string;

  @Column({ nullable: true })
  moonSign: string;

  @Column({ nullable: true })
  risingSign: string;

  @Column({ type: 'jsonb', nullable: true })
  birthChart: any;

  @Column({ type: 'text', nullable: true })
  astroProfile: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'int', default: 0 })
  popularity: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
