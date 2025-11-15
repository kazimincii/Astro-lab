import { Controller, Get, Post, Param, UseGuards, Req } from '@nestjs/common';
import { ChakrasService } from './chakras.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ActionsService } from '../actions/actions.service';

@Controller('chakras')
@UseGuards(JwtAuthGuard)
export class ChakrasController {
  constructor(
    private readonly chakrasService: ChakrasService,
    private readonly actionsService: ActionsService,
  ) {}

  @Post(':personId/generate')
  async generateChakraProfile(@Req() req, @Param('personId') personId: string) {
    // Check and consume premium action for detailed guidance
    await this.actionsService.checkAndConsumeAction(req.user.id);

    return await this.chakrasService.generateChakraProfile(personId);
  }

  @Get(':personId')
  async getChakraProfile(@Param('personId') personId: string) {
    return await this.chakrasService.getChakraProfile(personId);
  }
}
