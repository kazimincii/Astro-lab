import { Controller, Get, Patch, Body, UseGuards, Request } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('users')
@ApiBearerAuth('JWT-auth')
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  @ApiOperation({
    summary: 'Get current user profile',
    description: 'Retrieve the authenticated user\'s profile information including subscription details and preferences.',
  })
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
        email: { type: 'string', example: 'user@example.com' },
        firstName: { type: 'string', example: 'John' },
        lastName: { type: 'string', example: 'Doe' },
        language: { type: 'string', example: 'en' },
        phone: { type: 'string', example: '+1234567890' },
        timezone: { type: 'string', example: 'America/New_York' },
        emailVerified: { type: 'boolean', example: true },
        subscription: {
          type: 'object',
          properties: {
            plan: { type: 'string', example: 'standard' },
            status: { type: 'string', example: 'active' },
            endDate: { type: 'string', format: 'date-time' },
          },
        },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getProfile(@Request() req) {
    return this.usersService.findOne(req.user.id);
  }

  @Patch('me')
  @ApiOperation({
    summary: 'Update user profile',
    description: 'Update the authenticated user\'s profile information. All fields are optional.',
  })
  @ApiResponse({
    status: 200,
    description: 'User profile updated successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
        email: { type: 'string', example: 'newemail@example.com' },
        firstName: { type: 'string', example: 'John' },
        lastName: { type: 'string', example: 'Doe' },
        language: { type: 'string', example: 'en' },
        phone: { type: 'string', example: '+1234567890' },
        timezone: { type: 'string', example: 'America/New_York' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  async updateProfile(@Request() req, @Body() updateData: UpdateUserDto) {
    return this.usersService.update(req.user.id, updateData);
  }
}
