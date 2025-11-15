import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { TarotService } from './tarot.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('tarot')
@UseGuards(JwtAuthGuard)
export class TarotController {
  constructor(private tarotService: TarotService) {}

  @Post('reading')
  async createReading(@Request() req, @Body() body: any) {
    return this.tarotService.createReading(req.user.id, body.question, body.spreadType);
  }

  @Get('readings')
  async getReadings(@Request() req) {
    return this.tarotService.getReadings(req.user.id);
  }
}
