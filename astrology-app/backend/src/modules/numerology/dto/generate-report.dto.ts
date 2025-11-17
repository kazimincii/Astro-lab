import { IsString, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class GenerateNumerologyReportDto {
  @ApiProperty({
    description: 'Full name for numerology calculation',
    example: 'John Michael Doe',
  })
  @IsString()
  fullName: string;

  @ApiProperty({
    description: 'Birth date in ISO format (YYYY-MM-DD)',
    example: '1990-01-15',
    format: 'date',
  })
  @IsDateString()
  @Type(() => Date)
  birthDate: Date;
}
