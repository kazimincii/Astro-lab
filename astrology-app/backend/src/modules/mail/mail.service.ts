import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: Transporter;
  private readonly logger = new Logger(MailService.name);

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('MAIL_HOST', 'localhost'),
      port: this.configService.get<number>('MAIL_PORT', 1025),
      secure: this.configService.get<boolean>('MAIL_SECURE', false),
      auth: this.configService.get<string>('MAIL_USER')
        ? {
            user: this.configService.get<string>('MAIL_USER'),
            pass: this.configService.get<string>('MAIL_PASSWORD'),
          }
        : undefined,
    });
  }

  async sendVerificationEmail(email: string, userId: string, token: string) {
    const verificationUrl = `${this.configService.get<string>(
      'FRONTEND_URL',
      'http://localhost:3000',
    )}/verify-email?userId=${userId}&token=${token}`;

    try {
      await this.transporter.sendMail({
        from: this.configService.get<string>(
          'MAIL_FROM',
          'noreply@astrology-app.com',
        ),
        to: email,
        subject: 'Verify Your Email Address',
        html: `
          <h1>Welcome to Astrology App!</h1>
          <p>Thank you for registering. Please verify your email address by clicking the link below:</p>
          <p><a href="${verificationUrl}">Verify Email</a></p>
          <p>Or copy and paste this link into your browser:</p>
          <p>${verificationUrl}</p>
          <p>This link will expire in 24 hours.</p>
          <p>If you didn't create this account, you can safely ignore this email.</p>
        `,
      });

      this.logger.log(`Verification email sent to ${email}`);
    } catch (error) {
      this.logger.error(`Failed to send verification email to ${email}`, error);
      // Don't throw error to avoid breaking registration flow
    }
  }

  async sendPasswordResetEmail(email: string, token: string) {
    const resetUrl = `${this.configService.get<string>(
      'FRONTEND_URL',
      'http://localhost:3000',
    )}/reset-password?token=${token}`;

    try {
      await this.transporter.sendMail({
        from: this.configService.get<string>(
          'MAIL_FROM',
          'noreply@astrology-app.com',
        ),
        to: email,
        subject: 'Reset Your Password',
        html: `
          <h1>Password Reset Request</h1>
          <p>You requested to reset your password. Click the link below to reset it:</p>
          <p><a href="${resetUrl}">Reset Password</a></p>
          <p>Or copy and paste this link into your browser:</p>
          <p>${resetUrl}</p>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request this password reset, you can safely ignore this email.</p>
        `,
      });

      this.logger.log(`Password reset email sent to ${email}`);
    } catch (error) {
      this.logger.error(`Failed to send password reset email to ${email}`, error);
      // Don't throw error to maintain security (don't reveal if email exists)
    }
  }
}
