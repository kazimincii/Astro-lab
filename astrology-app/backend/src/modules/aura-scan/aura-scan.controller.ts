import { Controller, Post, Get, Param, Body, UseGuards, Req } from '@nestjs/common';
import { AuraScanService } from './aura-scan.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ActionsService } from '../actions/actions.service';

@Controller('aura-scan')
@UseGuards(JwtAuthGuard)
export class AuraScanController {
  constructor(
    private readonly auraScanService: AuraScanService,
    private readonly actionsService: ActionsService,
  ) {}

  @Post('scan')
  async performAuraScan(
    @Req() req,
    @Body('imageUrl') imageUrl: string,
    @Body('personId') personId?: string,
  ) {
    // Check and consume premium action
    await this.actionsService.checkAndConsumeAction(req.user.id);

    return await this.auraScanService.performAuraScan(req.user.id, imageUrl, personId);
  }

  @Get()
  async getUserAuraScans(@Req() req) {
    return await this.auraScanService.getUserAuraScans(req.user.id);
  }

  @Get(':id')
  async getAuraScan(@Param('id') id: string) {
    return await this.auraScanService.getAuraScan(id);
  }
}
