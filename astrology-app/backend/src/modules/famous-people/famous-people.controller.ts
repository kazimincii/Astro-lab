import { Controller, Get, Param, Query } from '@nestjs/common';
import { FamousPeopleService } from './famous-people.service';

@Controller('famous-people')
export class FamousPeopleController {
  constructor(private readonly famousPeopleService: FamousPeopleService) {}

  @Get()
  async getAllFamousPeople(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
  ) {
    const skipNum = skip ? parseInt(skip) : 0;
    const takeNum = take ? parseInt(take) : 50;

    return await this.famousPeopleService.getAllFamousPeople(skipNum, takeNum);
  }

  @Get('matches/:personId')
  async findMatches(
    @Param('personId') personId: string,
    @Query('limit') limit?: string,
  ) {
    const limitNum = limit ? parseInt(limit) : 10;
    return await this.famousPeopleService.findMatches(personId, limitNum);
  }

  @Get('category/:category')
  async searchByCategory(
    @Param('category') category: string,
    @Query('limit') limit?: string,
  ) {
    const limitNum = limit ? parseInt(limit) : 20;
    return await this.famousPeopleService.searchByCategory(category, limitNum);
  }

  @Get('sign/:sign')
  async searchBySign(
    @Param('sign') sign: string,
    @Query('limit') limit?: string,
  ) {
    const limitNum = limit ? parseInt(limit) : 20;
    return await this.famousPeopleService.searchBySign(sign, limitNum);
  }

  @Get(':id')
  async getFamousPerson(@Param('id') id: string) {
    return await this.famousPeopleService.getFamousPerson(id);
  }
}
