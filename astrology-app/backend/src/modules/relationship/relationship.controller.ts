import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RelationshipService } from './relationship.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ActionsService } from '../actions/actions.service';
import { AnalyzeCompatibilityDto } from './dto/compatibility.dto';

@ApiTags('relationship')
@ApiBearerAuth('JWT-auth')
@Controller('relationship')
@UseGuards(JwtAuthGuard)
export class RelationshipController {
  constructor(
    private readonly relationshipService: RelationshipService,
    private readonly actionsService: ActionsService,
  ) {}

  @Post('analyze')
  @ApiOperation({
    summary: 'Analyze relationship compatibility',
    description:
      'Generate a comprehensive astrological compatibility analysis between two profiles. Includes synastry aspects, composite chart insights, and relationship dynamics.',
  })
  @ApiResponse({
    status: 201,
    description: 'Compatibility analysis created successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
        person1Id: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
        person2Id: { type: 'string', example: '987e6543-e21b-12d3-a456-426614174001' },
        overallScore: { type: 'number', example: 78, description: 'Compatibility score 0-100' },
        synastryAspects: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              planet1: { type: 'string', example: 'Sun' },
              planet2: { type: 'string', example: 'Moon' },
              aspect: { type: 'string', example: 'Trine' },
              orb: { type: 'number', example: 2.5 },
              interpretation: { type: 'string', example: 'Harmonious emotional connection' },
            },
          },
        },
        compatibility: {
          type: 'object',
          properties: {
            emotional: { type: 'number', example: 85 },
            intellectual: { type: 'number', example: 72 },
            physical: { type: 'number', example: 80 },
            spiritual: { type: 'number', example: 65 },
          },
        },
        strengths: {
          type: 'array',
          items: { type: 'string' },
          example: ['Strong emotional bond', 'Shared values'],
        },
        challenges: {
          type: 'array',
          items: { type: 'string' },
          example: ['Communication differences'],
        },
        advice: { type: 'string', example: 'Focus on open communication and mutual understanding' },
        createdAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid profile IDs' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Action limit reached or premium feature' })
  @ApiResponse({ status: 404, description: 'One or both profiles not found' })
  async analyzeCompatibility(@Req() req, @Body() body: AnalyzeCompatibilityDto) {
    // Check and consume premium action
    await this.actionsService.checkAndConsumeAction(req.user.id);

    return await this.relationshipService.analyzeCompatibility(
      req.user.id,
      body.person1Id,
      body.person2Id,
    );
  }

  @Get()
  @ApiOperation({
    summary: 'Get existing relationship analysis',
    description: 'Retrieve previously generated compatibility analysis between two profiles.',
  })
  @ApiResponse({
    status: 200,
    description: 'Relationship analysis retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        person1Id: { type: 'string' },
        person2Id: { type: 'string' },
        overallScore: { type: 'number' },
        compatibility: { type: 'object' },
        synastryAspects: { type: 'array', items: { type: 'object' } },
        createdAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Relationship analysis not found' })
  async getRelationship(
    @Req() req,
    @Body('person1Id') person1Id: string,
    @Body('person2Id') person2Id: string,
  ) {
    return await this.relationshipService.getRelationship(req.user.id, person1Id, person2Id);
  }
}
