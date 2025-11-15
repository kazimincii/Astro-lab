import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('profiles')
@UseGuards(JwtAuthGuard)
export class ProfilesController {
  constructor(private profilesService: ProfilesService) {}

  @Post()
  async create(@Request() req, @Body() createData: any) {
    return this.profilesService.create(req.user.id, createData);
  }

  @Get()
  async findAll(@Request() req) {
    return this.profilesService.findAll(req.user.id);
  }

  @Get(':id')
  async findOne(@Request() req, @Param('id') id: string) {
    return this.profilesService.findOne(id, req.user.id);
  }

  @Patch(':id')
  async update(@Request() req, @Param('id') id: string, @Body() updateData: any) {
    return this.profilesService.update(id, req.user.id, updateData);
  }

  @Delete(':id')
  async remove(@Request() req, @Param('id') id: string) {
    return this.profilesService.remove(id, req.user.id);
  }
}
