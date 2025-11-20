import { Controller, Get, Post, Param, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { ChartsService } from './charts.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('charts')
@ApiBearerAuth('JWT-auth')
@Controller('charts')
@UseGuards(JwtAuthGuard)
export class ChartsController {
  constructor(private chartsService: ChartsService) {}

  @Post('generate/:profileId')
  @ApiOperation({
    summary: 'Generate birth chart',
    description: 'Generate a complete natal/birth chart for a profile using Swiss Ephemeris. Calculates planetary positions, houses, and aspects.',
  })
  @ApiParam({
    name: 'profileId',
    description: 'Profile ID (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 201,
    description: 'Birth chart generated successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
        profileId: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
        planets: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string', example: 'Sun' },
              sign: { type: 'string', example: 'Aries' },
              degree: { type: 'number', example: 15.5 },
              house: { type: 'number', example: 1 },
              longitude: { type: 'number', example: 15.5 },
              latitude: { type: 'number', example: 0.0 },
            },
          },
        },
        houses: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              number: { type: 'number', example: 1 },
              sign: { type: 'string', example: 'Aries' },
              degree: { type: 'number', example: 0.0 },
            },
          },
        },
        aspects: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              planet1: { type: 'string', example: 'Sun' },
              planet2: { type: 'string', example: 'Moon' },
              aspect: { type: 'string', example: 'Trine' },
              orb: { type: 'number', example: 2.5 },
            },
          },
        },
        createdAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid profile data or missing birth information' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Action limit reached' })
  @ApiResponse({ status: 404, description: 'Profile not found' })
  async generate(@Param('profileId') profileId: string) {
    return this.chartsService.generate(profileId);
  }

  @Get(':profileId')
  @ApiOperation({
    summary: 'Get birth chart by profile ID',
    description: 'Retrieve the generated birth chart for a specific profile (alias for /charts/profile/:profileId).',
  })
  @ApiParam({
    name: 'profileId',
    description: 'Profile ID (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Birth chart retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Chart not found for this profile' })
  async getByProfileId(@Param('profileId') profileId: string) {
    return this.chartsService.findByProfile(profileId);
  }

  @Get('profile/:profileId')
  @ApiOperation({
    summary: 'Get birth chart by profile',
    description: 'Retrieve the generated birth chart for a specific profile.',
  })
  @ApiParam({
    name: 'profileId',
    description: 'Profile ID (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Birth chart retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        profileId: { type: 'string' },
        planets: { type: 'array', items: { type: 'object' } },
        houses: { type: 'array', items: { type: 'object' } },
        aspects: { type: 'array', items: { type: 'object' } },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Chart not found for this profile' })
  async findByProfile(@Param('profileId') profileId: string) {
    return this.chartsService.findByProfile(profileId);
  }

  @Get(':chartId/detailed')
  @ApiOperation({
    summary: 'Get detailed chart interpretation',
    description: 'Retrieve AI-generated detailed interpretation of the birth chart including personality insights, strengths, challenges, and life themes.',
  })
  @ApiParam({
    name: 'chartId',
    description: 'Chart ID (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Detailed interpretation retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        chartId: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
        interpretation: {
          type: 'object',
          properties: {
            summary: { type: 'string', example: 'A comprehensive overview of your natal chart...' },
            sunSign: { type: 'string', example: 'Detailed Sun sign interpretation...' },
            moonSign: { type: 'string', example: 'Detailed Moon sign interpretation...' },
            risingSign: { type: 'string', example: 'Detailed Ascendant interpretation...' },
            majorAspects: { type: 'string', example: 'Analysis of key planetary aspects...' },
            strengths: { type: 'array', items: { type: 'string' }, example: ['Creative expression', 'Leadership'] },
            challenges: { type: 'array', items: { type: 'string' }, example: ['Impulsiveness', 'Patience'] },
            lifeThemes: { type: 'array', items: { type: 'string' }, example: ['Self-discovery', 'Communication'] },
          },
        },
        generatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Premium feature - upgrade required' })
  @ApiResponse({ status: 404, description: 'Chart not found' })
  async getDetailedInterpretation(@Param('chartId') chartId: string) {
    return this.chartsService.getDetailedInterpretation(chartId);
  }
}
