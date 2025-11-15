import { IsString, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCoffeeReadingDto {
  @ApiProperty({
    description: 'URL of the uploaded coffee cup image for analysis',
    example: 'https://storage.example.com/coffee-cups/abc123.jpg',
    format: 'uri',
  })
  @IsString()
  @IsUrl()
  imageUrl: string;
}
