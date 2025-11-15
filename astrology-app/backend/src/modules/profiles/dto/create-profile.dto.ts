import { IsString, IsDateString, IsNumber, IsOptional, IsEnum, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateProfileDto {
  @ApiProperty({
    description: 'Profile name',
    example: 'John Doe',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Birth date in ISO format (YYYY-MM-DD)',
    example: '1990-01-15',
    format: 'date',
  })
  @IsDateString()
  @Type(() => Date)
  birthDate: Date;

  @ApiProperty({
    description: 'Birth time in HH:MM format (24-hour)',
    example: '14:30',
    pattern: '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$',
  })
  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'Birth time must be in HH:MM format',
  })
  birthTime: string;

  @ApiProperty({
    description: 'Birth city',
    example: 'New York',
  })
  @IsString()
  birthCity: string;

  @ApiProperty({
    description: 'Birth country',
    example: 'United States',
  })
  @IsString()
  birthCountry: string;

  @ApiProperty({
    description: 'Birth location latitude',
    example: 40.7128,
    type: Number,
  })
  @IsNumber()
  birthLatitude: number;

  @ApiProperty({
    description: 'Birth location longitude',
    example: -74.0060,
    type: Number,
  })
  @IsNumber()
  birthLongitude: number;

  @ApiPropertyOptional({
    description: 'Timezone (e.g., America/New_York)',
    example: 'America/New_York',
  })
  @IsString()
  @IsOptional()
  timezone?: string;

  @ApiPropertyOptional({
    description: 'Gender',
    enum: ['male', 'female', 'other', 'prefer_not_to_say'],
    example: 'male',
  })
  @IsEnum(['male', 'female', 'other', 'prefer_not_to_say'])
  @IsOptional()
  gender?: string;

  @ApiPropertyOptional({
    description: 'Additional notes',
    example: 'Twin born at same time',
  })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiPropertyOptional({
    description: 'Set as main profile',
    example: true,
    default: false,
  })
  @IsOptional()
  isMainProfile?: boolean;
}
