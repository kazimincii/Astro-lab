import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AiAssistantService } from './ai-assistant.service';
import { AiAssistantController } from './ai-assistant.controller';
import { AiConversation, AiMessage } from '@/entities/ai-conversation.entity';
import { PersonProfile } from '@/entities/person-profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AiConversation, AiMessage, PersonProfile])],
  controllers: [AiAssistantController],
  providers: [AiAssistantService],
})
export class AiAssistantModule {}
