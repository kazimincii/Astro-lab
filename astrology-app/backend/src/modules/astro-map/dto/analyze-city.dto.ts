import { IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AnalyzeCityDto {
  @ApiProperty({
    description: 'City name',
    example: 'New York',
  })
  @IsString()
  city: string;

  @ApiProperty({
    description: 'City latitude',
    example: 40.7128,
    type: Number,
  })
  @IsNumber()
  latitude: number;

  @ApiProperty({
    description: 'City longitude',
    example: -74.0060,
    type: Number,
  })
  @IsNumber()
  longitude: number;
}
