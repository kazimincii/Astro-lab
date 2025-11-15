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
import { PersonProfile } from './person-profile.entity';

export enum ChatType {
  ASSISTANT = 'assistant',
  ASK_THE_STARS = 'ask_the_stars',
}

@Entity('ai_chat_threads')
export class AIChatThread {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  @JoinColumn()
  user: User;

  @Column({ type: 'varchar' })
  userId: string;

  @ManyToOne(() => PersonProfile, { nullable: true })
  @JoinColumn()
  person: PersonProfile;

  @Column({ type: 'varchar', nullable: true })
  personId: string;

  @Column({ type: 'enum', enum: ChatType })
  chatType: ChatType;

  @Column({ nullable: true })
  title: string;

  @Column({ nullable: true })
  assistantName: string;

  @Column({ nullable: true })
  assistantTone: string; // 'soft', 'direct', 'playful'

  @Column({ type: 'simple-array', nullable: true })
  categories: string[]; // For Ask the Stars: 'love', 'work', 'money', 'health', 'spiritual', 'general'

  @OneToMany(() => AIMessage, message => message.thread)
  messages: AIMessage[];

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'timestamp', nullable: true })
  lastMessageAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

export enum MessageRole {
  USER = 'user',
  ASSISTANT = 'assistant',
  SYSTEM = 'system',
}

@Entity('ai_messages')
export class AIMessage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => AIChatThread, thread => thread.messages)
  @JoinColumn()
  thread: AIChatThread;

  @Column({ type: 'varchar' })
  threadId: string;

  @Column({ type: 'enum', enum: MessageRole })
  role: MessageRole;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: {
    modelUsed?: string;
    tokensUsed?: number;
    contextData?: any;
  };

  @CreateDateColumn()
  createdAt: Date;
}
