import { Controller, Get, Post, Param, Body, Query, UseGuards, Req } from '@nestjs/common';
import { AdvancedChartsService } from './advanced-charts.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ActionsService } from '../actions/actions.service';
import { AdvancedChartType, ChartMode } from '../../entities/advanced-chart.entity';

@Controller('advanced-charts')
@UseGuards(JwtAuthGuard)
export class AdvancedChartsController {
  constructor(
    private readonly chartsService: AdvancedChartsService,
    private readonly actionsService: ActionsService,
  ) {}

  @Post('generate')
  async generateAdvancedChart(
    @Req() req,
    @Body('chartType') chartType: AdvancedChartType,
    @Body('person1Id') person1Id: string,
    @Body('person2Id') person2Id?: string,
    @Body('targetDate') targetDate?: string,
    @Body('mode') mode?: ChartMode,
  ) {
    // Check and consume premium action
    await this.actionsService.checkAndConsumeAction(req.user.id);

    const date = targetDate ? new Date(targetDate) : undefined;
    return await this.chartsService.generateAdvancedChart(
      req.user.id,
      chartType,
      person1Id,
      person2Id,
      date,
      mode || ChartMode.BASIC,
    );
  }

  @Get()
  async getUserCharts(@Req() req, @Query('chartType') chartType?: AdvancedChartType) {
    return await this.chartsService.getUserCharts(req.user.id, chartType);
  }

  @Get(':chartId')
  async getChart(@Param('chartId') chartId: string) {
    return await this.chartsService.getChart(chartId);
  }
}
