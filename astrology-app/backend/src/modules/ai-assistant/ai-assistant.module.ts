import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AiAssistantService } from './ai-assistant.service';
import { AiAssistantController } from './ai-assistant.controller';
import { AiConversation, AiMessage } from '@/entities/ai-conversation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AiConversation, AiMessage])],
  controllers: [AiAssistantController],
  providers: [AiAssistantService],
})
export class AiAssistantModule {}
