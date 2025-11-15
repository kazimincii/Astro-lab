import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { CoffeeReadingService } from './coffee-reading.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('coffee-reading')
@UseGuards(JwtAuthGuard)
export class CoffeeReadingController {
  constructor(private coffeeReadingService: CoffeeReadingService) {}

  @Post()
  async createReading(@Request() req, @Body() body: any) {
    return this.coffeeReadingService.createReading(req.user.id, body.imageUrl);
  }
}
