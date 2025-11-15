import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { ActionsService } from './actions.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('actions')
@UseGuards(JwtAuthGuard)
export class ActionsController {
  constructor(private readonly actionsService: ActionsService) {}

  @Get('remaining')
  async getRemainingActions(@Req() req) {
    return await this.actionsService.getRemainingActions(req.user.id);
  }

  @Get('plan')
  async getUserPlan(@Req() req) {
    const planType = await this.actionsService.getUserPlan(req.user.id);
    return { planType };
  }
}
