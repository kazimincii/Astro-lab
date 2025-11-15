import { Controller, Get, Post, Param, Body, UseGuards, Req } from '@nestjs/common';
import { BiorhythmService } from './biorhythm.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ActionsService } from '../actions/actions.service';

@Controller('biorhythm')
@UseGuards(JwtAuthGuard)
export class BiorhythmController {
  constructor(
    private readonly biorhythmService: BiorhythmService,
    private readonly actionsService: ActionsService,
  ) {}

  @Post(':personId/calculate')
  async calculateBiorhythm(
    @Req() req,
    @Param('personId') personId: string,
    @Body('date') date?: string,
  ) {
    // Check and consume premium action
    await this.actionsService.checkAndConsumeAction(req.user.id);

    const targetDate = date ? new Date(date) : new Date();
    return await this.biorhythmService.calculateBiorhythm(personId, targetDate);
  }

  @Get(':personId/latest')
  async getLatestBiorhythm(@Param('personId') personId: string) {
    return await this.biorhythmService.getLatestBiorhythm(personId);
  }
}
