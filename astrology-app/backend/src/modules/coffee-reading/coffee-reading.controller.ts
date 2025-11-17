import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CoffeeReadingService } from './coffee-reading.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateCoffeeReadingDto } from './dto/create-reading.dto';

@ApiTags('coffee-reading')
@ApiBearerAuth('JWT-auth')
@Controller('coffee-reading')
@UseGuards(JwtAuthGuard)
export class CoffeeReadingController {
  constructor(private coffeeReadingService: CoffeeReadingService) {}

  @Post()
  @ApiOperation({
    summary: 'Create coffee cup reading',
    description: 'Perform a Turkish coffee cup reading (tasseography) by analyzing an uploaded image. AI identifies symbols and provides interpretation.',
  })
  @ApiResponse({
    status: 201,
    description: 'Coffee reading created successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
        imageUrl: { type: 'string', example: 'https://storage.example.com/coffee-cups/abc123.jpg' },
        symbols: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string', example: 'Bird' },
              location: { type: 'string', example: 'Top right' },
              meaning: { type: 'string', example: 'Good news and positive changes coming' },
              area: { type: 'string', enum: ['past', 'present', 'future'], example: 'future' },
            },
          },
        },
        interpretation: {
          type: 'object',
          properties: {
            overall: { type: 'string', example: 'Your reading shows a period of positive transformation...' },
            love: { type: 'string', example: 'New romantic opportunities may appear' },
            career: { type: 'string', example: 'Professional growth and recognition ahead' },
            health: { type: 'string', example: 'Focus on emotional well-being' },
            advice: { type: 'string', example: 'Stay open to new opportunities' },
          },
        },
        createdAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid image URL or image processing failed' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Action limit reached or premium feature' })
  async createReading(@Request() req, @Body() body: CreateCoffeeReadingDto) {
    return this.coffeeReadingService.createReading(req.user.id, body.imageUrl);
  }
}
