import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('experts')
export class Expert {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  type: string;

  @Column({ type: 'text' })
  bio: string;

  @Column({ type: 'decimal', precision: 3, scale: 1, default: 0 })
  rating: number;

  @Column({ type: 'int', default: 0 })
  reviewCount: number;

  @Column({ type: 'varchar', nullable: true })
  imageUrl: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  pricePerSession: number;

  @Column({ type: 'boolean', default: true })
  isAvailable: boolean;

  @Column({ type: 'simple-array', nullable: true })
  specialties: string[];

  @Column({ type: 'int', default: 0 })
  yearsOfExperience: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
