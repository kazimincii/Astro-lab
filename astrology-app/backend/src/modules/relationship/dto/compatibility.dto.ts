import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AnalyzeCompatibilityDto {
  @ApiProperty({
    description: 'First person profile ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  person1Id: string;

  @ApiProperty({
    description: 'Second person profile ID',
    example: '987e6543-e21b-12d3-a456-426614174001',
  })
  @IsUUID()
  person2Id: string;
}
