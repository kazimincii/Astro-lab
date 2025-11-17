import { Controller, Get, Post, Param, Body, UseGuards, Req } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { BiorhythmService } from './biorhythm.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ActionsService } from '../actions/actions.service';
import { CalculateBiorhythmDto } from './dto/calculate-biorhythm.dto';

@ApiTags('biorhythm')
@ApiBearerAuth('JWT-auth')
@Controller('biorhythm')
@UseGuards(JwtAuthGuard)
export class BiorhythmController {
  constructor(
    private readonly biorhythmService: BiorhythmService,
    private readonly actionsService: ActionsService,
  ) {}

  @Post(':personId/calculate')
  @ApiOperation({
    summary: 'Calculate biorhythm cycles',
    description: 'Calculate physical, emotional, and intellectual biorhythm cycles for a specific person and date. This is a premium action that consumes one action credit.',
  })
  @ApiParam({
    name: 'personId',
    description: 'Person profile ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 201,
    description: 'Biorhythm calculated successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        personId: { type: 'string' },
        calculationDate: { type: 'string', format: 'date-time' },
        physical: { type: 'number', example: 85.5, description: 'Physical cycle percentage (0-100)' },
        emotional: { type: 'number', example: 62.3, description: 'Emotional cycle percentage (0-100)' },
        intellectual: { type: 'number', example: 45.8, description: 'Intellectual cycle percentage (0-100)' },
        interpretation: { type: 'string', example: 'Your physical energy is very high today...' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Insufficient action credits' })
  @ApiResponse({ status: 404, description: 'Person profile not found' })
  async calculateBiorhythm(
    @Req() req,
    @Param('personId') personId: string,
    @Body() dto: CalculateBiorhythmDto,
  ) {
    // Check and consume premium action
    await this.actionsService.checkAndConsumeAction(req.user.id);

    const targetDate = dto.date ? new Date(dto.date) : new Date();
    return await this.biorhythmService.calculateBiorhythm(personId, targetDate);
  }

  @Get(':personId/latest')
  @ApiOperation({
    summary: 'Get latest biorhythm calculation',
    description: 'Retrieve the most recent biorhythm calculation for a specific person.',
  })
  @ApiParam({
    name: 'personId',
    description: 'Person profile ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Latest biorhythm retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        personId: { type: 'string' },
        calculationDate: { type: 'string', format: 'date-time' },
        physical: { type: 'number', example: 85.5 },
        emotional: { type: 'number', example: 62.3 },
        intellectual: { type: 'number', example: 45.8 },
        interpretation: { type: 'string' },
        createdAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'No biorhythm calculations found' })
  async getLatestBiorhythm(@Param('personId') personId: string) {
    return await this.biorhythmService.getLatestBiorhythm(personId);
  }
}
