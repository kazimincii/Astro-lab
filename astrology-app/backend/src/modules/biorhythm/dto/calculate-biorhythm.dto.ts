import { IsOptional, IsDateString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CalculateBiorhythmDto {
  @ApiPropertyOptional({
    description: 'Target date for biorhythm calculation (defaults to today)',
    example: '2025-11-15',
    format: 'date',
  })
  @IsDateString()
  @IsOptional()
  @Type(() => Date)
  date?: Date;
}
