import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AiAssistantService } from './ai-assistant.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('ai-assistant')
@UseGuards(JwtAuthGuard)
export class AiAssistantController {
  constructor(private aiAssistantService: AiAssistantService) {}

  @Post('conversation')
  async createConversation(@Request() req, @Body() body: any) {
    return this.aiAssistantService.createConversation(req.user.id, body.title);
  }

  @Post('message')
  async sendMessage(@Body() body: any) {
    return this.aiAssistantService.sendMessage(body.conversationId, body.message);
  }
}
