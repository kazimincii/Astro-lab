import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { ProfilesService } from './profiles.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@ApiTags('profiles')
@ApiBearerAuth('JWT-auth')
@Controller('profiles')
@UseGuards(JwtAuthGuard)
export class ProfilesController {
  constructor(private profilesService: ProfilesService) {}

  @Post()
  @ApiOperation({
    summary: 'Create new profile',
    description: 'Create a new person profile for birth chart calculations. Each user can create multiple profiles (family members, friends, etc.).',
  })
  @ApiResponse({
    status: 201,
    description: 'Profile created successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
        name: { type: 'string', example: 'John Doe' },
        birthDate: { type: 'string', example: '1990-01-15' },
        birthTime: { type: 'string', example: '14:30' },
        birthCity: { type: 'string', example: 'New York' },
        birthCountry: { type: 'string', example: 'United States' },
        birthLatitude: { type: 'number', example: 40.7128 },
        birthLongitude: { type: 'number', example: -74.0060 },
        isMainProfile: { type: 'boolean', example: false },
        createdAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Profile limit reached for current plan' })
  async create(@Request() req, @Body() createData: CreateProfileDto) {
    return this.profilesService.create(req.user.id, createData);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all profiles',
    description: 'Retrieve all profiles belonging to the authenticated user',
  })
  @ApiResponse({
    status: 200,
    description: 'Profiles retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          birthDate: { type: 'string' },
          birthTime: { type: 'string' },
          birthCity: { type: 'string' },
          isMainProfile: { type: 'boolean' },
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAll(@Request() req) {
    return this.profilesService.findAll(req.user.id);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get profile by ID',
    description: 'Retrieve a specific profile by its ID. User can only access their own profiles.',
  })
  @ApiParam({
    name: 'id',
    description: 'Profile ID (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Profile retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        birthDate: { type: 'string' },
        birthTime: { type: 'string' },
        birthCity: { type: 'string' },
        birthCountry: { type: 'string' },
        birthLatitude: { type: 'number' },
        birthLongitude: { type: 'number' },
        timezone: { type: 'string' },
        gender: { type: 'string' },
        notes: { type: 'string' },
        isMainProfile: { type: 'boolean' },
        createdAt: { type: 'string' },
        updatedAt: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Profile not found' })
  async findOne(@Request() req, @Param('id') id: string) {
    return this.profilesService.findOne(id, req.user.id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update profile',
    description: 'Update an existing profile. All fields are optional.',
  })
  @ApiParam({
    name: 'id',
    description: 'Profile ID (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Profile updated successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        birthDate: { type: 'string' },
        birthTime: { type: 'string' },
        updatedAt: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Profile not found' })
  async update(@Request() req, @Param('id') id: string, @Body() updateData: UpdateProfileDto) {
    return this.profilesService.update(id, req.user.id, updateData);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete profile',
    description: 'Permanently delete a profile. This action cannot be undone.',
  })
  @ApiParam({
    name: 'id',
    description: 'Profile ID (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Profile deleted successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Profile deleted successfully' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Profile not found' })
  async remove(@Request() req, @Param('id') id: string) {
    return this.profilesService.remove(id, req.user.id);
  }
}
