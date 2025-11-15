import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { RelationshipService } from './relationship.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ActionsService } from '../actions/actions.service';

@Controller('relationship')
@UseGuards(JwtAuthGuard)
export class RelationshipController {
  constructor(
    private readonly relationshipService: RelationshipService,
    private readonly actionsService: ActionsService,
  ) {}

  @Post('analyze')
  async analyzeCompatibility(
    @Req() req,
    @Body('person1Id') person1Id: string,
    @Body('person2Id') person2Id: string,
  ) {
    // Check and consume premium action
    await this.actionsService.checkAndConsumeAction(req.user.id);

    return await this.relationshipService.analyzeCompatibility(req.user.id, person1Id, person2Id);
  }

  @Get()
  async getRelationship(
    @Req() req,
    @Body('person1Id') person1Id: string,
    @Body('person2Id') person2Id: string,
  ) {
    return await this.relationshipService.getRelationship(req.user.id, person1Id, person2Id);
  }
}
