import { IsString, IsEnum, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SessionType } from '../../../entities/live-session.entity';
import { Type } from 'class-transformer';

export class RequestSessionDto {
  @ApiProperty({
    description: 'Expert user ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsString()
  expertId: string;

  @ApiProperty({
    description: 'Type of session',
    enum: SessionType,
    example: SessionType.ASTROLOGY,
    enumName: 'SessionType',
  })
  @IsEnum(SessionType)
  type: SessionType;

  @ApiProperty({
    description: 'Session topic or question',
    example: 'Career guidance and life path analysis',
  })
  @IsString()
  topic: string;

  @ApiPropertyOptional({
    description: 'Preferred date and time for the session',
    example: '2025-11-20T14:00:00Z',
    format: 'date-time',
  })
  @IsDateString()
  @IsOptional()
  @Type(() => Date)
  preferredDateTime?: Date;
}
