import { Controller, Post, Get, Param, Body, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { AuraScanService } from './aura-scan.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ActionsService } from '../actions/actions.service';
import { PerformAuraScanDto } from './dto/perform-scan.dto';

@ApiTags('aura-scan')
@ApiBearerAuth('JWT-auth')
@Controller('aura-scan')
@UseGuards(JwtAuthGuard)
export class AuraScanController {
  constructor(
    private readonly auraScanService: AuraScanService,
    private readonly actionsService: ActionsService,
  ) {}

  @Post('scan')
  @ApiOperation({
    summary: 'Perform aura scan',
    description:
      'Analyze an image to detect aura colors and energy patterns. Uses AI-powered image analysis to identify dominant colors, energy levels, and provide spiritual interpretations. This is a premium action that consumes one action credit.',
  })
  @ApiResponse({
    status: 201,
    description: 'Aura scan completed successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        userId: { type: 'string' },
        personId: { type: 'string', nullable: true },
        imageUrl: { type: 'string' },
        dominantColor: { type: 'string', example: 'Blue' },
        secondaryColors: { type: 'array', items: { type: 'string' }, example: ['Purple', 'Green'] },
        energyLevel: { type: 'number', example: 75, description: 'Energy level (0-100)' },
        interpretation: {
          type: 'string',
          example: 'Blue aura indicates calmness, communication, and spiritual awareness...',
        },
        characteristics: { type: 'array', items: { type: 'string' } },
        recommendations: { type: 'array', items: { type: 'string' } },
        chakraAlignment: {
          type: 'object',
          properties: {
            dominant: { type: 'string', example: 'Throat Chakra' },
            balanced: { type: 'array', items: { type: 'string' } },
          },
        },
        createdAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Insufficient action credits' })
  async performAuraScan(@Req() req, @Body() dto: PerformAuraScanDto) {
    // Check and consume premium action
    await this.actionsService.checkAndConsumeAction(req.user.id);

    return await this.auraScanService.performAuraScan(req.user.id, dto.imageUrl, dto.personId);
  }

  @Get()
  @ApiOperation({
    summary: 'Get user aura scans',
    description: 'Retrieve all aura scans performed by the authenticated user.',
  })
  @ApiResponse({
    status: 200,
    description: 'Aura scans retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          imageUrl: { type: 'string' },
          dominantColor: { type: 'string' },
          secondaryColors: { type: 'array', items: { type: 'string' } },
          energyLevel: { type: 'number' },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getUserAuraScans(@Req() req) {
    return await this.auraScanService.getUserAuraScans(req.user.id);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get aura scan by ID',
    description: 'Retrieve detailed information about a specific aura scan.',
  })
  @ApiParam({
    name: 'id',
    description: 'Aura scan ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Aura scan retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        userId: { type: 'string' },
        personId: { type: 'string', nullable: true },
        imageUrl: { type: 'string' },
        dominantColor: { type: 'string' },
        secondaryColors: { type: 'array', items: { type: 'string' } },
        energyLevel: { type: 'number' },
        interpretation: { type: 'string' },
        characteristics: { type: 'array', items: { type: 'string' } },
        recommendations: { type: 'array', items: { type: 'string' } },
        chakraAlignment: { type: 'object' },
        createdAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Aura scan not found' })
  async getAuraScan(@Param('id') id: string) {
    return await this.auraScanService.getAuraScan(id);
  }
}
