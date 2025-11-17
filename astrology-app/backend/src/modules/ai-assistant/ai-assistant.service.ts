import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AiConversation, AiMessage } from '@/entities/ai-conversation.entity';

@Injectable()
export class AiAssistantService {
  constructor(
    @InjectRepository(AiConversation)
    private conversationsRepository: Repository<AiConversation>,
    @InjectRepository(AiMessage)
    private messagesRepository: Repository<AiMessage>,
  ) {}

  async createConversation(userId: string, title: string) {
    const conversation = this.conversationsRepository.create({
      user: { id: userId } as any,
      title,
    });

    return this.conversationsRepository.save(conversation);
  }

  async sendMessage(conversationId: string, message: string) {
    // TODO: Implement AI response generation
    const userMessage = this.messagesRepository.create({
      conversation: { id: conversationId } as any,
      role: 'user',
      content: message,
    });

    await this.messagesRepository.save(userMessage);

    const assistantMessage = this.messagesRepository.create({
      conversation: { id: conversationId } as any,
      role: 'assistant',
      content: 'AI response...',
    });

    return this.messagesRepository.save(assistantMessage);
  }
}
