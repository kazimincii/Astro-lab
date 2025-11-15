import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { WidgetsService } from './widgets.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { WidgetType } from '../../entities/widget-config.entity';

@ApiTags('widgets')
@ApiBearerAuth('JWT-auth')
@Controller('widgets')
@UseGuards(JwtAuthGuard)
export class WidgetsController {
  constructor(private readonly widgetsService: WidgetsService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all user widgets',
    description: 'Retrieve all widget configurations for the authenticated user.',
  })
  @ApiResponse({
    status: 200,
    description: 'Widgets retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getUserWidgets(@Req() req) {
    return await this.widgetsService.getUserWidgets(req.user.id);
  }

  @Get(':widgetType')
  @ApiOperation({
    summary: 'Get widget configuration',
    description: 'Retrieve configuration for a specific widget type.',
  })
  @ApiParam({
    name: 'widgetType',
    description: 'Widget type',
    enum: ['moon_phase', 'star_message', 'today_summary', 'daily_forecast'],
    example: 'moon_phase',
  })
  @ApiResponse({
    status: 200,
    description: 'Widget configuration retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Widget not found' })
  async getWidget(@Req() req, @Param('widgetType') widgetType: WidgetType) {
    return await this.widgetsService.getWidget(req.user.id, widgetType);
  }

  @Get(':widgetType/data')
  @ApiOperation({
    summary: 'Get widget data',
    description: 'Retrieve the actual data to display in the widget (for Android widgets).',
  })
  @ApiParam({
    name: 'widgetType',
    description: 'Widget type',
    enum: ['moon_phase', 'star_message', 'today_summary', 'daily_forecast'],
    example: 'today_summary',
  })
  @ApiResponse({
    status: 200,
    description: 'Widget data retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getWidgetData(@Req() req, @Param('widgetType') widgetType: WidgetType) {
    return await this.widgetsService.getWidgetData(req.user.id, widgetType);
  }

  @Post(':widgetType')
  @ApiOperation({
    summary: 'Create or update widget',
    description: 'Create or update widget configuration with custom settings.',
  })
  @ApiParam({
    name: 'widgetType',
    description: 'Widget type',
    enum: ['moon_phase', 'star_message', 'today_summary', 'daily_forecast'],
    example: 'moon_phase',
  })
  @ApiResponse({
    status: 201,
    description: 'Widget created/updated successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async createOrUpdateWidget(
    @Req() req,
    @Param('widgetType') widgetType: WidgetType,
    @Body('data') data: any,
  ) {
    return await this.widgetsService.createOrUpdateWidget(req.user.id, widgetType, data);
  }

  @Put(':widgetType/toggle')
  @ApiOperation({
    summary: 'Toggle widget enabled state',
    description: 'Enable or disable a widget.',
  })
  @ApiParam({
    name: 'widgetType',
    description: 'Widget type',
    enum: ['moon_phase', 'star_message', 'today_summary', 'daily_forecast'],
    example: 'daily_forecast',
  })
  @ApiResponse({
    status: 200,
    description: 'Widget toggled successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async toggleWidget(
    @Req() req,
    @Param('widgetType') widgetType: WidgetType,
    @Body('isEnabled') isEnabled: boolean,
  ) {
    return await this.widgetsService.toggleWidget(req.user.id, widgetType, isEnabled);
  }

  @Delete(':widgetType')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete widget',
    description: 'Delete a widget configuration.',
  })
  @ApiParam({
    name: 'widgetType',
    description: 'Widget type',
    enum: ['moon_phase', 'star_message', 'today_summary', 'daily_forecast'],
    example: 'star_message',
  })
  @ApiResponse({
    status: 204,
    description: 'Widget deleted successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Widget not found' })
  async deleteWidget(@Req() req, @Param('widgetType') widgetType: WidgetType) {
    await this.widgetsService.deleteWidget(req.user.id, widgetType);
  }
}
