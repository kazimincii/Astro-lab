import { IsString, IsUrl, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PerformAuraScanDto {
  @ApiProperty({
    description: 'URL of the image to analyze for aura reading',
    example: 'https://example.com/images/portrait.jpg',
    format: 'uri',
  })
  @IsUrl()
  imageUrl: string;

  @ApiPropertyOptional({
    description: 'Person profile ID to associate with this scan',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsString()
  @IsOptional()
  personId?: string;
}
