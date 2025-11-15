import { IsString, IsUUID, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateConversationDto {
  @ApiPropertyOptional({
    description: 'Optional title for the conversation',
    example: 'Questions about my birth chart',
  })
  @IsString()
  @IsOptional()
  title?: string;
}

export class SendMessageDto {
  @ApiProperty({
    description: 'Conversation ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  conversationId: string;

  @ApiProperty({
    description: 'Message to send to the AI assistant',
    example: 'What does my Sun in Aries mean for my career?',
  })
  @IsString()
  message: string;
}
