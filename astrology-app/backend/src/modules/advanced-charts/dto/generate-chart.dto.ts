import { IsString, IsEnum, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AdvancedChartType, ChartMode } from '../../../entities/advanced-chart.entity';
import { Type } from 'class-transformer';

export class GenerateAdvancedChartDto {
  @ApiProperty({
    description: 'Type of advanced chart',
    enum: AdvancedChartType,
    example: AdvancedChartType.TRANSIT,
    enumName: 'AdvancedChartType',
  })
  @IsEnum(AdvancedChartType)
  chartType: AdvancedChartType;

  @ApiProperty({
    description: 'Primary person profile ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsString()
  person1Id: string;

  @ApiPropertyOptional({
    description: 'Second person profile ID (required for synastry, composite, davison)',
    example: '660e8400-e29b-41d4-a716-446655440001',
  })
  @IsString()
  @IsOptional()
  person2Id?: string;

  @ApiPropertyOptional({
    description: 'Target date for the chart (for transit, solar/lunar return)',
    example: '2025-11-15',
    format: 'date',
  })
  @IsDateString()
  @IsOptional()
  @Type(() => Date)
  targetDate?: Date;

  @ApiPropertyOptional({
    description: 'Chart mode (basic or pro)',
    enum: ChartMode,
    example: ChartMode.BASIC,
    default: ChartMode.BASIC,
  })
  @IsEnum(ChartMode)
  @IsOptional()
  mode?: ChartMode;
}
