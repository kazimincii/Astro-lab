import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, Req } from '@nestjs/common';
import { WidgetsService } from './widgets.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { WidgetType } from '../../entities/widget-config.entity';

@Controller('widgets')
@UseGuards(JwtAuthGuard)
export class WidgetsController {
  constructor(private readonly widgetsService: WidgetsService) {}

  @Get()
  async getUserWidgets(@Req() req) {
    return await this.widgetsService.getUserWidgets(req.user.id);
  }

  @Get(':widgetType')
  async getWidget(@Req() req, @Param('widgetType') widgetType: WidgetType) {
    return await this.widgetsService.getWidget(req.user.id, widgetType);
  }

  @Get(':widgetType/data')
  async getWidgetData(@Req() req, @Param('widgetType') widgetType: WidgetType) {
    return await this.widgetsService.getWidgetData(req.user.id, widgetType);
  }

  @Post(':widgetType')
  async createOrUpdateWidget(
    @Req() req,
    @Param('widgetType') widgetType: WidgetType,
    @Body('data') data: any,
  ) {
    return await this.widgetsService.createOrUpdateWidget(req.user.id, widgetType, data);
  }

  @Put(':widgetType/toggle')
  async toggleWidget(
    @Req() req,
    @Param('widgetType') widgetType: WidgetType,
    @Body('isEnabled') isEnabled: boolean,
  ) {
    return await this.widgetsService.toggleWidget(req.user.id, widgetType, isEnabled);
  }

  @Delete(':widgetType')
  async deleteWidget(@Req() req, @Param('widgetType') widgetType: WidgetType) {
    await this.widgetsService.deleteWidget(req.user.id, widgetType);
    return { message: 'Widget deleted successfully' };
  }
}
