import { Controller, Post, Get, Put, Param, Body, UseGuards, Req } from '@nestjs/common';
import { LiveServicesService } from './live-services.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SessionType } from '../../entities/live-session.entity';

@Controller('live-services')
@UseGuards(JwtAuthGuard)
export class LiveServicesController {
  constructor(private readonly liveServicesService: LiveServicesService) {}

  @Post('request')
  async requestSession(
    @Req() req,
    @Body('expertId') expertId: string,
    @Body('type') type: SessionType,
    @Body('topic') topic: string,
    @Body('preferredDateTime') preferredDateTime?: string,
  ) {
    const dateTime = preferredDateTime ? new Date(preferredDateTime) : undefined;
    return await this.liveServicesService.requestSession(
      req.user.id,
      expertId,
      type,
      topic,
      dateTime,
    );
  }

  @Put(':sessionId/schedule')
  async scheduleSession(
    @Param('sessionId') sessionId: string,
    @Body('scheduledDateTime') scheduledDateTime: string,
    @Body('durationMinutes') durationMinutes: number,
    @Body('price') price?: number,
  ) {
    return await this.liveServicesService.scheduleSession(
      sessionId,
      new Date(scheduledDateTime),
      durationMinutes,
      price,
    );
  }

  @Put(':sessionId/start')
  async startSession(
    @Param('sessionId') sessionId: string,
    @Body('meetingLink') meetingLink: string,
  ) {
    return await this.liveServicesService.startSession(sessionId, meetingLink);
  }

  @Put(':sessionId/complete')
  async completeSession(
    @Param('sessionId') sessionId: string,
    @Body('expertNotes') expertNotes?: string,
  ) {
    return await this.liveServicesService.completeSession(sessionId, expertNotes);
  }

  @Put(':sessionId/cancel')
  async cancelSession(@Param('sessionId') sessionId: string) {
    return await this.liveServicesService.cancelSession(sessionId);
  }

  @Put(':sessionId/rate')
  async rateSession(
    @Param('sessionId') sessionId: string,
    @Body('rating') rating: number,
    @Body('review') review: string,
  ) {
    return await this.liveServicesService.rateSession(sessionId, rating, review);
  }

  @Get('my-sessions')
  async getUserSessions(@Req() req) {
    return await this.liveServicesService.getUserSessions(req.user.id);
  }

  @Get(':sessionId')
  async getSession(@Param('sessionId') sessionId: string) {
    return await this.liveServicesService.getSession(sessionId);
  }
}
