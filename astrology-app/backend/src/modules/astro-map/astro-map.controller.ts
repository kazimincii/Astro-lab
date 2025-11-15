import { Controller, Get, Post, Put, Param, Body, UseGuards, Req } from '@nestjs/common';
import { AstroMapService } from './astro-map.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ActionsService } from '../actions/actions.service';
import { AstroMapTheme } from '../../entities/astro-map.entity';

@Controller('astro-map')
@UseGuards(JwtAuthGuard)
export class AstroMapController {
  constructor(
    private readonly astroMapService: AstroMapService,
    private readonly actionsService: ActionsService,
  ) {}

  @Post(':personId/generate')
  async generateAstroMap(@Req() req, @Param('personId') personId: string) {
    // Check and consume premium action
    await this.actionsService.checkAndConsumeAction(req.user.id);

    return await this.astroMapService.generateAstroMap(personId);
  }

  @Post(':personId/analyze-city')
  async analyzeCityForPerson(
    @Req() req,
    @Param('personId') personId: string,
    @Body('city') city: string,
    @Body('latitude') latitude: number,
    @Body('longitude') longitude: number,
  ) {
    // Check and consume premium action for city analysis
    await this.actionsService.checkAndConsumeAction(req.user.id);

    return await this.astroMapService.analyzeCityForPerson(personId, city, latitude, longitude);
  }

  @Get(':personId')
  async getAstroMap(@Param('personId') personId: string) {
    return await this.astroMapService.getAstroMap(personId);
  }

  @Put(':personId/theme')
  async updateViewedTheme(
    @Param('personId') personId: string,
    @Body('theme') theme: AstroMapTheme,
  ) {
    return await this.astroMapService.updateViewedTheme(personId, theme);
  }
}
