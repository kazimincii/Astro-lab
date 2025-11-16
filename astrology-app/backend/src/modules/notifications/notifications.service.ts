import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as admin from 'firebase-admin';

import { User } from '@/entities/user.entity';

export interface PushNotification {
  title: string;
  body: string;
  data?: Record<string, any>;
  imageUrl?: string;
}

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);
  private firebaseApp: admin.app.App | null = null;

  constructor(
    private configService: ConfigService,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {
    this.initializeFirebase();
  }

  /**
   * Initialize Firebase Admin SDK
   */
  private initializeFirebase() {
    try {
      const serviceAccountPath = this.configService.get<string>('FIREBASE_SERVICE_ACCOUNT_PATH');

      if (!serviceAccountPath) {
        this.logger.warn('Firebase service account not configured. Push notifications disabled.');
        return;
      }

      const serviceAccount = require(serviceAccountPath);

      this.firebaseApp = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });

      this.logger.log('Firebase Admin SDK initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize Firebase Admin SDK', error);
    }
  }

  /**
   * Send push notification to a single user
   */
  async sendToUser(userId: string, notification: PushNotification): Promise<boolean> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });

    if (!user?.fcmToken) {
      this.logger.warn(`No FCM token for user ${userId}`);
      return false;
    }

    return this.sendToToken(user.fcmToken, notification);
  }

  /**
   * Send push notification to multiple users
   */
  async sendToUsers(userIds: string[], notification: PushNotification): Promise<number> {
    const users = await this.usersRepository.find({
      where: { id: In(userIds) },
      select: ['id', 'fcmToken'],
    });

    const tokens = users
      .filter(user => user.fcmToken)
      .map(user => user.fcmToken!);

    if (tokens.length === 0) {
      this.logger.warn('No valid FCM tokens found');
      return 0;
    }

    return this.sendToTokens(tokens, notification);
  }

  /**
   * Send push notification to a single device token
   */
  async sendToToken(token: string, notification: PushNotification): Promise<boolean> {
    if (!this.firebaseApp) {
      this.logger.warn('Firebase not initialized. Cannot send notification.');
      return false;
    }

    try {
      const message: admin.messaging.Message = {
        notification: {
          title: notification.title,
          body: notification.body,
          imageUrl: notification.imageUrl,
        },
        data: notification.data || {},
        token,
      };

      const response = await admin.messaging().send(message);
      this.logger.log(`Notification sent successfully: ${response}`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to send notification: ${error.message}`);

      // Remove invalid tokens
      if (error.code === 'messaging/invalid-registration-token' ||
          error.code === 'messaging/registration-token-not-registered') {
        await this.removeInvalidToken(token);
      }

      return false;
    }
  }

  /**
   * Send push notification to multiple device tokens
   */
  async sendToTokens(tokens: string[], notification: PushNotification): Promise<number> {
    if (!this.firebaseApp) {
      this.logger.warn('Firebase not initialized. Cannot send notifications.');
      return 0;
    }

    try {
      const message: admin.messaging.MulticastMessage = {
        notification: {
          title: notification.title,
          body: notification.body,
          imageUrl: notification.imageUrl,
        },
        data: notification.data || {},
        tokens,
      };

      const response = await admin.messaging().sendMulticast(message);

      this.logger.log(`Sent ${response.successCount} notifications successfully`);

      if (response.failureCount > 0) {
        this.logger.warn(`Failed to send ${response.failureCount} notifications`);

        // Clean up invalid tokens
        response.responses.forEach((resp, idx) => {
          if (!resp.success &&
              (resp.error?.code === 'messaging/invalid-registration-token' ||
               resp.error?.code === 'messaging/registration-token-not-registered')) {
            this.removeInvalidToken(tokens[idx]);
          }
        });
      }

      return response.successCount;
    } catch (error) {
      this.logger.error(`Failed to send multicast notification: ${error.message}`);
      return 0;
    }
  }

  /**
   * Send to topic subscribers
   */
  async sendToTopic(topic: string, notification: PushNotification): Promise<boolean> {
    if (!this.firebaseApp) {
      this.logger.warn('Firebase not initialized. Cannot send notification.');
      return false;
    }

    try {
      const message: admin.messaging.Message = {
        notification: {
          title: notification.title,
          body: notification.body,
          imageUrl: notification.imageUrl,
        },
        data: notification.data || {},
        topic,
      };

      const response = await admin.messaging().send(message);
      this.logger.log(`Topic notification sent successfully: ${response}`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to send topic notification: ${error.message}`);
      return false;
    }
  }

  /**
   * Subscribe user to topic
   */
  async subscribeToTopic(userId: string, topic: string): Promise<boolean> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });

    if (!user?.fcmToken) {
      this.logger.warn(`No FCM token for user ${userId}`);
      return false;
    }

    if (!this.firebaseApp) {
      return false;
    }

    try {
      await admin.messaging().subscribeToTopic([user.fcmToken], topic);
      this.logger.log(`User ${userId} subscribed to topic ${topic}`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to subscribe to topic: ${error.message}`);
      return false;
    }
  }

  /**
   * Remove invalid FCM token from database
   */
  private async removeInvalidToken(token: string) {
    try {
      await this.usersRepository.update(
        { fcmToken: token },
        { fcmToken: null },
      );
      this.logger.log(`Removed invalid FCM token`);
    } catch (error) {
      this.logger.error(`Failed to remove invalid token: ${error.message}`);
    }
  }

  /**
   * Schedule notification for later (requires job queue)
   */
  async scheduleNotification(
    userId: string,
    notification: PushNotification,
    sendAt: Date,
  ): Promise<void> {
    // TODO: Implement with Bull/BullMQ job queue
    this.logger.log(`Scheduled notification for ${sendAt.toISOString()}`);
  }
}

// Import In operator for TypeORM
import { In } from 'typeorm';
