import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam } from '@nestjs/swagger';
import { EducationService } from './education.service';
import { ContentCategory } from '../../entities/education-content.entity';

@ApiTags('education')
@Controller('education')
export class EducationController {
  constructor(private readonly educationService: EducationService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all educational content',
    description: 'Retrieve all published educational content, optionally filtered by category.',
  })
  @ApiQuery({
    name: 'category',
    required: false,
    description: 'Filter by category',
    enum: [
      'planets',
      'houses',
      'aspects',
      'signs',
      'retrogrades',
      'transits',
      'basics',
      'advanced',
    ],
    example: 'planets',
  })
  @ApiResponse({
    status: 200,
    description: 'Educational content retrieved successfully',
  })
  async getAllContent(@Query('category') category?: ContentCategory) {
    return await this.educationService.getAllContent(category);
  }

  @Get('category/:category')
  @ApiOperation({
    summary: 'Get content by category',
    description: 'Retrieve all educational content for a specific category.',
  })
  @ApiParam({
    name: 'category',
    description: 'Content category',
    enum: [
      'planets',
      'houses',
      'aspects',
      'signs',
      'retrogrades',
      'transits',
      'basics',
      'advanced',
    ],
    example: 'planets',
  })
  @ApiResponse({
    status: 200,
    description: 'Educational content retrieved successfully',
  })
  async getByCategory(@Param('category') category: ContentCategory) {
    return await this.educationService.getContentByCategory(category);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get content by ID',
    description: 'Retrieve detailed information about a specific educational content piece.',
  })
  @ApiParam({
    name: 'id',
    description: 'Content ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Educational content retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Content not found' })
  async getContentById(@Param('id') id: string) {
    return await this.educationService.getContentById(id);
  }
}
