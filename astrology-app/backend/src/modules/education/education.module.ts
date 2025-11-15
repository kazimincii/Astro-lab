import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EducationService } from './education.service';
import { EducationController } from './education.controller';
import { EducationContent } from '../../entities/education-content.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EducationContent])],
  controllers: [EducationController],
  providers: [EducationService],
  exports: [EducationService],
})
export class EducationModule {}
