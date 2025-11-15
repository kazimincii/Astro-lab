import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam } from '@nestjs/swagger';
import { FamousPeopleService } from './famous-people.service';

@ApiTags('famous-people')
@Controller('famous-people')
export class FamousPeopleController {
  constructor(private readonly famousPeopleService: FamousPeopleService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all famous people',
    description:
      'Retrieve a paginated list of famous people with their birth charts and astrological data.',
  })
  @ApiQuery({
    name: 'skip',
    required: false,
    description: 'Number of records to skip (default: 0)',
    example: 0,
    type: Number,
  })
  @ApiQuery({
    name: 'take',
    required: false,
    description: 'Number of records to take (default: 50)',
    example: 50,
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Famous people retrieved successfully',
  })
  async getAllFamousPeople(@Query('skip') skip?: string, @Query('take') take?: string) {
    const skipNum = skip ? parseInt(skip) : 0;
    const takeNum = take ? parseInt(take) : 50;

    return await this.famousPeopleService.getAllFamousPeople(skipNum, takeNum);
  }

  @Get('matches/:personId')
  @ApiOperation({
    summary: 'Find celebrity astrological matches',
    description:
      'Find famous people who have similar astrological patterns to the given person profile.',
  })
  @ApiParam({
    name: 'personId',
    description: 'Person profile ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Maximum number of matches to return (default: 10)',
    example: 10,
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Celebrity matches found successfully',
  })
  async findMatches(@Param('personId') personId: string, @Query('limit') limit?: string) {
    const limitNum = limit ? parseInt(limit) : 10;
    return await this.famousPeopleService.findMatches(personId, limitNum);
  }

  @Get('category/:category')
  @ApiOperation({
    summary: 'Search famous people by category',
    description: 'Find famous people filtered by category (e.g., Actor, Musician, Politician).',
  })
  @ApiParam({
    name: 'category',
    description: 'Category name',
    example: 'Actor',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Maximum number of results (default: 20)',
    example: 20,
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Famous people in category retrieved successfully',
  })
  async searchByCategory(@Param('category') category: string, @Query('limit') limit?: string) {
    const limitNum = limit ? parseInt(limit) : 20;
    return await this.famousPeopleService.searchByCategory(category, limitNum);
  }

  @Get('sign/:sign')
  @ApiOperation({
    summary: 'Search famous people by sun sign',
    description: 'Find famous people with a specific sun sign.',
  })
  @ApiParam({
    name: 'sign',
    description: 'Zodiac sign',
    example: 'Leo',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Maximum number of results (default: 20)',
    example: 20,
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Famous people with sign retrieved successfully',
  })
  async searchBySign(@Param('sign') sign: string, @Query('limit') limit?: string) {
    const limitNum = limit ? parseInt(limit) : 20;
    return await this.famousPeopleService.searchBySign(sign, limitNum);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get famous person by ID',
    description:
      'Retrieve detailed information about a specific famous person including their complete birth chart.',
  })
  @ApiParam({
    name: 'id',
    description: 'Famous person ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Famous person retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Famous person not found' })
  async getFamousPerson(@Param('id') id: string) {
    return await this.famousPeopleService.getFamousPerson(id);
  }
}
