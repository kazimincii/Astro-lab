import { Controller, Get, Post, Param, Body, Query, UseGuards, Req } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { AdvancedChartsService } from './advanced-charts.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ActionsService } from '../actions/actions.service';
import { AdvancedChartType, ChartMode } from '../../entities/advanced-chart.entity';
import { GenerateAdvancedChartDto } from './dto/generate-chart.dto';

@ApiTags('advanced-charts')
@ApiBearerAuth('JWT-auth')
@Controller('advanced-charts')
@UseGuards(JwtAuthGuard)
export class AdvancedChartsController {
  constructor(
    private readonly chartsService: AdvancedChartsService,
    private readonly actionsService: ActionsService,
  ) {}

  @Post('generate')
  @ApiOperation({
    summary: 'Generate advanced astrological chart',
    description:
      'Generate advanced charts including transit, progressed, synastry, composite, davison, solar/lunar return, and solar arcs charts. This is a premium action that consumes one action credit.',
  })
  @ApiResponse({
    status: 201,
    description: 'Advanced chart generated successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Insufficient action credits' })
  @ApiResponse({ status: 404, description: 'Person profile not found' })
  async generateAdvancedChart(@Req() req, @Body() dto: GenerateAdvancedChartDto) {
    // Check and consume premium action
    await this.actionsService.checkAndConsumeAction(req.user.id);

    const date = dto.targetDate ? new Date(dto.targetDate) : undefined;
    return await this.chartsService.generateAdvancedChart(
      req.user.id,
      dto.chartType,
      dto.person1Id,
      dto.person2Id,
      date,
      dto.mode || ChartMode.BASIC,
    );
  }

  @Get()
  @ApiOperation({
    summary: 'Get user advanced charts',
    description:
      'Retrieve all advanced charts created by the user, optionally filtered by chart type.',
  })
  @ApiQuery({
    name: 'chartType',
    required: false,
    description: 'Filter by chart type',
    enum: [
      'transit',
      'progressed',
      'synastry',
      'composite',
      'davison',
      'solar_return',
      'lunar_return',
      'solar_arcs',
    ],
    example: 'transit',
  })
  @ApiResponse({
    status: 200,
    description: 'Advanced charts retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getUserCharts(@Req() req, @Query('chartType') chartType?: AdvancedChartType) {
    return await this.chartsService.getUserCharts(req.user.id, chartType);
  }

  @Get(':chartId')
  @ApiOperation({
    summary: 'Get advanced chart by ID',
    description: 'Retrieve detailed information about a specific advanced chart.',
  })
  @ApiParam({
    name: 'chartId',
    description: 'Chart ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Advanced chart retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Chart not found' })
  async getChart(@Param('chartId') chartId: string) {
    return await this.chartsService.getChart(chartId);
  }
}
