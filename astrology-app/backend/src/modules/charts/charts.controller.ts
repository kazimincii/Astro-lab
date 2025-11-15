import { Controller, Get, Post, Param, UseGuards } from '@nestjs/common';
import { ChartsService } from './charts.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('charts')
@UseGuards(JwtAuthGuard)
export class ChartsController {
  constructor(private chartsService: ChartsService) {}

  @Post('generate/:profileId')
  async generate(@Param('profileId') profileId: string) {
    return this.chartsService.generate(profileId);
  }

  @Get('profile/:profileId')
  async findByProfile(@Param('profileId') profileId: string) {
    return this.chartsService.findByProfile(profileId);
  }

  @Get(':chartId/detailed')
  async getDetailedInterpretation(@Param('chartId') chartId: string) {
    return this.chartsService.getDetailedInterpretation(chartId);
  }
}
