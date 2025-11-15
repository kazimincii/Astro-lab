import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { TarotService } from './tarot.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateTarotReadingDto } from './dto/create-reading.dto';

@ApiTags('tarot')
@ApiBearerAuth('JWT-auth')
@Controller('tarot')
@UseGuards(JwtAuthGuard)
export class TarotController {
  constructor(private tarotService: TarotService) {}

  @Post('reading')
  @ApiOperation({
    summary: 'Create tarot reading',
    description:
      'Perform a tarot card reading with AI-generated interpretation. Choose from various spread types for different areas of life.',
  })
  @ApiResponse({
    status: 201,
    description: 'Tarot reading created successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
        question: { type: 'string', example: 'What does the future hold for my career?' },
        spreadType: { type: 'string', example: 'three_card' },
        cards: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string', example: 'The Fool' },
              position: { type: 'string', example: 'Past' },
              reversed: { type: 'boolean', example: false },
              meaning: { type: 'string', example: 'New beginnings and spontaneous adventures' },
              image: { type: 'string', example: '/cards/the-fool.jpg' },
            },
          },
        },
        interpretation: {
          type: 'string',
          example: 'Your reading suggests a journey of new beginnings...',
        },
        advice: { type: 'string', example: 'Trust in the process and embrace change' },
        createdAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid request data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Action limit reached or premium feature' })
  async createReading(@Request() req, @Body() body: CreateTarotReadingDto) {
    return this.tarotService.createReading(req.user.id, body.question, body.spreadType);
  }

  @Get('readings')
  @ApiOperation({
    summary: 'Get user tarot readings',
    description: 'Retrieve all past tarot readings for the authenticated user.',
  })
  @ApiResponse({
    status: 200,
    description: 'Readings retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          question: { type: 'string' },
          spreadType: { type: 'string' },
          cards: { type: 'array', items: { type: 'object' } },
          interpretation: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getReadings(@Request() req) {
    return this.tarotService.getReadings(req.user.id);
  }
}
