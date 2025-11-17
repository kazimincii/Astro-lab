import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('ai_conversations')
export class AiConversation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  @JoinColumn()
  user: User;

  @Column()
  title: string;

  @Column({ type: 'enum', enum: ['active', 'archived'], default: 'active' })
  status: string;

  @OneToMany(() => AiMessage, message => message.conversation)
  messages: AiMessage[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity('ai_messages')
export class AiMessage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => AiConversation, conversation => conversation.messages)
  @JoinColumn()
  conversation: AiConversation;

  @Column({ type: 'enum', enum: ['user', 'assistant'] })
  role: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: any; // { model: 'gpt-4', tokens: 150, ... }

  @CreateDateColumn()
  createdAt: Date;
}
