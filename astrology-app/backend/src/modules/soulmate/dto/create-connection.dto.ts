import { IsString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ConnectionType } from '../../../entities/user-connection.entity';

export class CreateConnectionDto {
  @ApiProperty({
    description: 'User ID to connect with',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsString()
  user2Id: string;

  @ApiProperty({
    description: 'Type of connection',
    enum: ConnectionType,
    example: ConnectionType.SOULMATE_MATCH,
    enumName: 'ConnectionType',
  })
  @IsEnum(ConnectionType)
  type: ConnectionType;
}
