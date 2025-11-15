import { IsString, IsDateString, IsEnum, IsArray, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { MoodLevel } from '../../../entities/journal.entity';

export class CreateJournalEntryDto {
  @ApiProperty({
    description: 'Date of the journal entry',
    example: '2025-11-15',
    format: 'date',
  })
  @IsDateString()
  @Type(() => Date)
  entryDate: Date;

  @ApiProperty({
    description: 'Mood level for the day',
    enum: MoodLevel,
    example: MoodLevel.GOOD,
    enumName: 'MoodLevel',
  })
  @IsEnum(MoodLevel)
  mood: MoodLevel;

  @ApiProperty({
    description: 'Journal entry content',
    example: 'Today was a great day! I felt energized and accomplished a lot.',
  })
  @IsString()
  content: string;

  @ApiPropertyOptional({
    description: 'Tags for categorizing the entry',
    type: [String],
    example: ['work', 'exercise', 'meditation'],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @ApiPropertyOptional({
    description: 'Person profile ID to associate with this entry',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsString()
  @IsOptional()
  personId?: string;
}
