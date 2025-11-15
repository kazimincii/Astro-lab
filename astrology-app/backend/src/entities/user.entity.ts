import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { PersonProfile } from './person-profile.entity';
import { Subscription } from './subscription.entity';
import { ActionLog } from './action-log.entity';
import { TarotReading } from './tarot-reading.entity';
import { CoffeeReading } from './coffee-reading.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ nullable: true })
  phoneNumber: string;

  @Column({ nullable: true })
  profilePicture: string;

  @Column({ type: 'enum', enum: ['active', 'inactive', 'suspended'], default: 'active' })
  status: string;

  @Column({ type: 'enum', enum: ['en', 'tr'], default: 'tr' })
  language: string;

  @Column({ nullable: true })
  timezone: string;

  @Column({ default: false })
  emailVerified: boolean;

  @Column({ nullable: true })
  emailVerificationToken: string;

  @Column({ nullable: true })
  passwordResetToken: string;

  @Column({ type: 'timestamp', nullable: true })
  passwordResetExpires: Date;

  @Column({ nullable: true })
  refreshToken: string;

  @Column({ type: 'timestamp', nullable: true })
  lastLoginAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @OneToOne(() => Subscription, { nullable: true })
  @JoinColumn()
  currentSubscription: Subscription;

  @OneToMany(() => PersonProfile, profile => profile.owner)
  profiles: PersonProfile[];

  @OneToMany(() => Subscription, subscription => subscription.user)
  subscriptions: Subscription[];

  @OneToMany(() => ActionLog, action => action.user)
  actions: ActionLog[];

  @OneToMany(() => TarotReading, reading => reading.user)
  tarotReadings: TarotReading[];

  @OneToMany(() => CoffeeReading, reading => reading.user)
  coffeeReadings: CoffeeReading[];
}
