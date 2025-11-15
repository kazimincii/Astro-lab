import { Controller, Get, Post, Param, Body, Query } from '@nestjs/common';
import { CosmicClimateService } from './cosmic-climate.service';

@Controller('cosmic-climate')
export class CosmicClimateController {
  constructor(private readonly climateService: CosmicClimateService) {}

  @Get('today')
  async getTodayPost() {
    return await this.climateService.getTodayPost();
  }

  @Get('range')
  async getPostsByDateRange(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return await this.climateService.getPostsByDateRange(
      new Date(startDate),
      new Date(endDate),
    );
  }

  @Post(':postId/react')
  async addReaction(@Param('postId') postId: string, @Body('emoji') emoji: string) {
    return await this.climateService.addReaction(postId, emoji);
  }
}
