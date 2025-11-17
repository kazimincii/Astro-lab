import { Controller, Post, Get, Put, Param, Body, UseGuards, Req, HttpCode, HttpStatus } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { LiveServicesService } from './live-services.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RequestSessionDto } from './dto/request-session.dto';

@ApiTags('live-services')
@ApiBearerAuth('JWT-auth')
@Controller('live-services')
@UseGuards(JwtAuthGuard)
export class LiveServicesController {
  constructor(private readonly liveServicesService: LiveServicesService) {}

  @Post('request')
  @ApiOperation({
    summary: 'Request live astrology session',
    description: 'Request a live one-on-one session with an astrology expert (tarot, spiritual guidance, numerology, etc.).',
  })
  @ApiResponse({
    status: 201,
    description: 'Session request created successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async requestSession(@Req() req, @Body() dto: RequestSessionDto) {
    const dateTime = dto.preferredDateTime ? new Date(dto.preferredDateTime) : undefined;
    return await this.liveServicesService.requestSession(
      req.user.id,
      dto.expertId,
      dto.type,
      dto.topic,
      dateTime,
    );
  }

  @Put(':sessionId/schedule')
  @ApiOperation({
    summary: 'Schedule session',
    description: 'Schedule a confirmed session with date, time, duration, and pricing (expert only).',
  })
  @ApiParam({
    name: 'sessionId',
    description: 'Session ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Session scheduled successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Session not found' })
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
  @ApiOperation({
    summary: 'Start session',
    description: 'Mark session as started and provide meeting link (expert only).',
  })
  @ApiParam({
    name: 'sessionId',
    description: 'Session ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Session started successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Session not found' })
  async startSession(
    @Param('sessionId') sessionId: string,
    @Body('meetingLink') meetingLink: string,
  ) {
    return await this.liveServicesService.startSession(sessionId, meetingLink);
  }

  @Put(':sessionId/complete')
  @ApiOperation({
    summary: 'Complete session',
    description: 'Mark session as completed with optional expert notes.',
  })
  @ApiParam({
    name: 'sessionId',
    description: 'Session ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Session completed successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Session not found' })
  async completeSession(
    @Param('sessionId') sessionId: string,
    @Body('expertNotes') expertNotes?: string,
  ) {
    return await this.liveServicesService.completeSession(sessionId, expertNotes);
  }

  @Put(':sessionId/cancel')
  @ApiOperation({
    summary: 'Cancel session',
    description: 'Cancel a scheduled session.',
  })
  @ApiParam({
    name: 'sessionId',
    description: 'Session ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Session cancelled successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Session not found' })
  async cancelSession(@Param('sessionId') sessionId: string) {
    return await this.liveServicesService.cancelSession(sessionId);
  }

  @Put(':sessionId/rate')
  @ApiOperation({
    summary: 'Rate completed session',
    description: 'Rate and review a completed session.',
  })
  @ApiParam({
    name: 'sessionId',
    description: 'Session ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Session rated successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Session not found' })
  async rateSession(
    @Param('sessionId') sessionId: string,
    @Body('rating') rating: number,
    @Body('review') review: string,
  ) {
    return await this.liveServicesService.rateSession(sessionId, rating, review);
  }

  @Get('my-sessions')
  @ApiOperation({
    summary: 'Get user sessions',
    description: 'Retrieve all sessions for the authenticated user.',
  })
  @ApiResponse({
    status: 200,
    description: 'Sessions retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getUserSessions(@Req() req) {
    return await this.liveServicesService.getUserSessions(req.user.id);
  }

  @Get(':sessionId')
  @ApiOperation({
    summary: 'Get session by ID',
    description: 'Retrieve detailed information about a specific session.',
  })
  @ApiParam({
    name: 'sessionId',
    description: 'Session ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Session retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Session not found' })
  async getSession(@Param('sessionId') sessionId: string) {
    return await this.liveServicesService.getSession(sessionId);
  }
}
