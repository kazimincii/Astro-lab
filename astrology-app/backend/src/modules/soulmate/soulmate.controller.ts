import { Controller, Get, Post, Param, Body, UseGuards, Req } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { SoulmateService } from './soulmate.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ActionsService } from '../actions/actions.service';
import { CreateConnectionDto } from './dto/create-connection.dto';

@ApiTags('soulmate')
@ApiBearerAuth('JWT-auth')
@Controller('soulmate')
@UseGuards(JwtAuthGuard)
export class SoulmateController {
  constructor(
    private readonly soulmateService: SoulmateService,
    private readonly actionsService: ActionsService,
  ) {}

  @Post(':personId/generate')
  @ApiOperation({
    summary: 'Generate soulmate profile',
    description: 'Generate a detailed soulmate profile with ideal partner characteristics, compatibility factors, and relationship guidance based on astrological analysis. This is a premium action that consumes one action credit.',
  })
  @ApiParam({
    name: 'personId',
    description: 'Person profile ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 201,
    description: 'Soulmate profile generated successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        personId: { type: 'string' },
        idealTraits: { type: 'array', items: { type: 'string' } },
        compatibleSigns: { type: 'array', items: { type: 'string' } },
        relationshipAdvice: { type: 'string' },
        karmicConnections: { type: 'array', items: { type: 'string' } },
        timing: { type: 'string', example: 'Favorable time for meeting: Spring 2026' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Insufficient action credits' })
  @ApiResponse({ status: 404, description: 'Person profile not found' })
  async generateSoulmateProfile(@Req() req, @Param('personId') personId: string) {
    // Check and consume premium action
    await this.actionsService.checkAndConsumeAction(req.user.id);

    return await this.soulmateService.generateSoulmateProfile(personId);
  }

  @Get(':personId')
  @ApiOperation({
    summary: 'Get soulmate profile',
    description: 'Retrieve the soulmate profile for a specific person.',
  })
  @ApiParam({
    name: 'personId',
    description: 'Person profile ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Soulmate profile retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        personId: { type: 'string' },
        idealTraits: { type: 'array', items: { type: 'string' } },
        compatibleSigns: { type: 'array', items: { type: 'string' } },
        relationshipAdvice: { type: 'string' },
        karmicConnections: { type: 'array', items: { type: 'string' } },
        timing: { type: 'string' },
        createdAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Soulmate profile not found' })
  async getSoulmateProfile(@Param('personId') personId: string) {
    return await this.soulmateService.getSoulmateProfile(personId);
  }

  @Get('matches')
  @ApiOperation({
    summary: 'Find potential soulmate matches',
    description: 'Find other users who have high compatibility scores based on astrological analysis.',
  })
  @ApiResponse({
    status: 200,
    description: 'Matches found successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          userId: { type: 'string' },
          firstName: { type: 'string' },
          compatibilityScore: { type: 'number', example: 85.5, description: 'Compatibility score (0-100)' },
          sunSign: { type: 'string', example: 'Leo' },
          moonSign: { type: 'string', example: 'Pisces' },
          matchReason: { type: 'string', example: 'Venus-Mars harmony' },
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findMatches(@Req() req) {
    return await this.soulmateService.findMatches(req.user.id);
  }

  @Post('connect')
  @ApiOperation({
    summary: 'Create user connection',
    description: 'Send a connection request to another user (friend, soulmate match, etc.).',
  })
  @ApiResponse({
    status: 201,
    description: 'Connection request created successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        user1Id: { type: 'string' },
        user2Id: { type: 'string' },
        type: { type: 'string', example: 'soulmate_match' },
        status: { type: 'string', example: 'pending' },
        compatibilityScore: { type: 'number' },
        createdAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 409, description: 'Connection already exists' })
  async createConnection(@Req() req, @Body() dto: CreateConnectionDto) {
    return await this.soulmateService.createConnection(req.user.id, dto.user2Id, dto.type);
  }

  @Post('connection/:connectionId/accept')
  @ApiOperation({
    summary: 'Accept connection request',
    description: 'Accept a pending connection request from another user.',
  })
  @ApiParam({
    name: 'connectionId',
    description: 'Connection ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Connection accepted successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        user1Id: { type: 'string' },
        user2Id: { type: 'string' },
        type: { type: 'string' },
        status: { type: 'string', example: 'accepted' },
        acceptedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Connection not found' })
  @ApiResponse({ status: 409, description: 'Connection already accepted or rejected' })
  async acceptConnection(@Param('connectionId') connectionId: string) {
    return await this.soulmateService.acceptConnection(connectionId);
  }
}
