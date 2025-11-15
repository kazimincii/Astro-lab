import { Controller, Get, Post, Param, Body, UseGuards, Req } from '@nestjs/common';
import { SoulmateService } from './soulmate.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ActionsService } from '../actions/actions.service';
import { ConnectionType } from '../../entities/user-connection.entity';

@Controller('soulmate')
@UseGuards(JwtAuthGuard)
export class SoulmateController {
  constructor(
    private readonly soulmateService: SoulmateService,
    private readonly actionsService: ActionsService,
  ) {}

  @Post(':personId/generate')
  async generateSoulmateProfile(@Req() req, @Param('personId') personId: string) {
    // Check and consume premium action
    await this.actionsService.checkAndConsumeAction(req.user.id);

    return await this.soulmateService.generateSoulmateProfile(personId);
  }

  @Get(':personId')
  async getSoulmateProfile(@Param('personId') personId: string) {
    return await this.soulmateService.getSoulmateProfile(personId);
  }

  @Get('matches')
  async findMatches(@Req() req) {
    return await this.soulmateService.findMatches(req.user.id);
  }

  @Post('connect')
  async createConnection(
    @Req() req,
    @Body('user2Id') user2Id: string,
    @Body('type') type: ConnectionType,
  ) {
    return await this.soulmateService.createConnection(req.user.id, user2Id, type);
  }

  @Post('connection/:connectionId/accept')
  async acceptConnection(@Param('connectionId') connectionId: string) {
    return await this.soulmateService.acceptConnection(connectionId);
  }
}
