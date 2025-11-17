import { Controller, Get, Post, Put, Param, Body, UseGuards, Req } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { AstroMapService } from './astro-map.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ActionsService } from '../actions/actions.service';
import { AstroMapTheme } from '../../entities/astro-map.entity';
import { AnalyzeCityDto } from './dto/analyze-city.dto';

@ApiTags('astro-map')
@ApiBearerAuth('JWT-auth')
@Controller('astro-map')
@UseGuards(JwtAuthGuard)
export class AstroMapController {
  constructor(
    private readonly astroMapService: AstroMapService,
    private readonly actionsService: ActionsService,
  ) {}

  @Post(':personId/generate')
  @ApiOperation({
    summary: 'Generate astrocartography map',
    description: 'Generate a complete astrocartography map showing planetary lines across the world for relocation analysis. This is a premium action that consumes one action credit.',
  })
  @ApiParam({
    name: 'personId',
    description: 'Person profile ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 201,
    description: 'Astro map generated successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Insufficient action credits' })
  @ApiResponse({ status: 404, description: 'Person profile not found' })
  async generateAstroMap(@Req() req, @Param('personId') personId: string) {
    // Check and consume premium action
    await this.actionsService.checkAndConsumeAction(req.user.id);

    return await this.astroMapService.generateAstroMap(personId);
  }

  @Post(':personId/analyze-city')
  @ApiOperation({
    summary: 'Analyze city for person',
    description: 'Analyze how a specific city location affects a person based on their astrocartography. Provides life, love, and career ratings. This is a premium action that consumes one action credit.',
  })
  @ApiParam({
    name: 'personId',
    description: 'Person profile ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 201,
    description: 'City analysis completed successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Insufficient action credits' })
  @ApiResponse({ status: 404, description: 'Person profile not found' })
  async analyzeCityForPerson(
    @Req() req,
    @Param('personId') personId: string,
    @Body() dto: AnalyzeCityDto,
  ) {
    // Check and consume premium action for city analysis
    await this.actionsService.checkAndConsumeAction(req.user.id);

    return await this.astroMapService.analyzeCityForPerson(personId, dto.city, dto.latitude, dto.longitude);
  }

  @Get(':personId')
  @ApiOperation({
    summary: 'Get astro map',
    description: 'Retrieve the astrocartography map for a specific person.',
  })
  @ApiParam({
    name: 'personId',
    description: 'Person profile ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Astro map retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Astro map not found' })
  async getAstroMap(@Param('personId') personId: string) {
    return await this.astroMapService.getAstroMap(personId);
  }

  @Put(':personId/theme')
  @ApiOperation({
    summary: 'Update viewed theme',
    description: 'Update the last viewed theme (life, love, or career) for the astro map.',
  })
  @ApiParam({
    name: 'personId',
    description: 'Person profile ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Theme updated successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Astro map not found' })
  async updateViewedTheme(
    @Param('personId') personId: string,
    @Body('theme') theme: AstroMapTheme,
  ) {
    return await this.astroMapService.updateViewedTheme(personId, theme);
  }
}
