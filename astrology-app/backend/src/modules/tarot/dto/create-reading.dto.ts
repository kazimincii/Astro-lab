import { IsString, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum TarotSpreadType {
  SINGLE_CARD = 'single_card',
  THREE_CARD = 'three_card',
  CELTIC_CROSS = 'celtic_cross',
  LOVE_SPREAD = 'love_spread',
  CAREER_SPREAD = 'career_spread',
}

export class CreateTarotReadingDto {
  @ApiProperty({
    description: 'Question or focus for the tarot reading',
    example: 'What does the future hold for my career?',
  })
  @IsString()
  question: string;

  @ApiProperty({
    description: 'Type of tarot spread to use',
    enum: TarotSpreadType,
    example: TarotSpreadType.THREE_CARD,
    enumName: 'TarotSpreadType',
  })
  @IsEnum(TarotSpreadType)
  spreadType: TarotSpreadType;

  @ApiPropertyOptional({
    description: 'Optional profile ID for personalized reading',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  @IsOptional()
  profileId?: string;
}
