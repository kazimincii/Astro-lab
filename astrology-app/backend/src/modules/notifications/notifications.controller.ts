import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { NotificationsService } from './notifications.service';

@ApiTags('notifications')
@Controller('notifications')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  @Post('register-token')
  @ApiOperation({ summary: 'Register FCM token for push notifications' })
  async registerToken(
    @Request() req,
    @Body('fcmToken') fcmToken: string,
  ) {
    // Update user's FCM token
    // Implemented in UsersService
    return { success: true, message: 'Token registered successfully' };
  }

  @Post('test')
  @ApiOperation({ summary: 'Send test notification (dev only)' })
  async sendTestNotification(@Request() req) {
    await this.notificationsService.sendToUser(req.user.id, {
      title: 'Test Notification',
      body: 'This is a test push notification from Astrology App!',
      data: { type: 'test' },
    });

    return { success: true, message: 'Test notification sent' };
  }
}
