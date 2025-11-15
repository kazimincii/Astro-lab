import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

export enum ConnectionType {
  FRIEND = 'friend',
  SOULMATE_MATCH = 'soulmate_match',
  BLOCKED = 'blocked',
}

export enum ConnectionStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
}

@Entity('user_connections')
export class UserConnection {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  @JoinColumn()
  user1: User;

  @Column({ type: 'varchar' })
  user1Id: string;

  @ManyToOne(() => User)
  @JoinColumn()
  user2: User;

  @Column({ type: 'varchar' })
  user2Id: string;

  @Column({ type: 'enum', enum: ConnectionType })
  type: ConnectionType;

  @Column({ type: 'enum', enum: ConnectionStatus, default: ConnectionStatus.PENDING })
  status: ConnectionStatus;

  @Column({ type: 'int', nullable: true })
  compatibilityScore: number;

  @Column({ type: 'text', nullable: true })
  note: string;

  @Column({ type: 'boolean', default: false })
  isMutual: boolean;

  @Column({ type: 'timestamp', nullable: true })
  acceptedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
