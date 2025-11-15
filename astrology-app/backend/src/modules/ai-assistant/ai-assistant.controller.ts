import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AiAssistantService } from './ai-assistant.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateConversationDto, SendMessageDto } from './dto/conversation.dto';

@ApiTags('ai-assistant')
@ApiBearerAuth('JWT-auth')
@Controller('ai-assistant')
@UseGuards(JwtAuthGuard)
export class AiAssistantController {
  constructor(private aiAssistantService: AiAssistantService) {}

  @Post('conversation')
  @ApiOperation({
    summary: 'Create AI conversation',
    description:
      'Start a new conversation with the AI astrology assistant. The assistant has access to your birth chart and can answer personalized questions.',
  })
  @ApiResponse({
    status: 201,
    description: 'Conversation created successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
        userId: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
        title: { type: 'string', example: 'Questions about my birth chart' },
        createdAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid request data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Premium feature - upgrade required' })
  async createConversation(@Request() req, @Body() body: CreateConversationDto) {
    return this.aiAssistantService.createConversation(req.user.id, body.title);
  }

  @Post('message')
  @ApiOperation({
    summary: 'Send message to AI assistant',
    description:
      'Send a message to the AI astrology assistant and receive a personalized response based on your astrological data.',
  })
  @ApiResponse({
    status: 201,
    description: 'Message sent and response received',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
        conversationId: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
        userMessage: { type: 'string', example: 'What does my Sun in Aries mean for my career?' },
        aiResponse: {
          type: 'string',
          example: 'With your Sun in Aries, you have natural leadership qualities...',
        },
        createdAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid request data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Action limit reached or premium feature' })
  @ApiResponse({ status: 404, description: 'Conversation not found' })
  async sendMessage(@Body() body: SendMessageDto) {
    return this.aiAssistantService.sendMessage(body.conversationId, body.message);
  }
}
