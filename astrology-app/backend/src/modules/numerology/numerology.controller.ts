import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { NumerologyService } from './numerology.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('numerology')
@UseGuards(JwtAuthGuard)
export class NumerologyController {
  constructor(private numerologyService: NumerologyService) {}

  @Post('report')
  async generateReport(@Request() req, @Body() body: any) {
    return this.numerologyService.generateReport(req.user.id, body.fullName, body.birthDate);
  }
}
