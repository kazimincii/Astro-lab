import { Controller, Get, Param, Query } from '@nestjs/common';
import { EducationService } from './education.service';
import { ContentCategory } from '../../entities/education-content.entity';

@Controller('education')
export class EducationController {
  constructor(private readonly educationService: EducationService) {}

  @Get()
  async getAllContent(@Query('category') category?: ContentCategory) {
    return await this.educationService.getAllContent(category);
  }

  @Get('category/:category')
  async getByCategory(@Param('category') category: ContentCategory) {
    return await this.educationService.getContentByCategory(category);
  }

  @Get(':id')
  async getContentById(@Param('id') id: string) {
    return await this.educationService.getContentById(id);
  }
}
