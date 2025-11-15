import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Sentry from '@sentry/node';

@Injectable()
export class SentryService implements OnModuleInit {
  constructor(private configService: ConfigService) {}

  onModuleInit() {
    const sentryDsn = this.configService.get<string>('SENTRY_DSN');
    const nodeEnv = this.configService.get<string>('NODE_ENV', 'development');

    if (!sentryDsn) {
      console.log('ℹ️  Sentry DSN not configured, error tracking disabled');
      return;
    }

    Sentry.init({
      dsn: sentryDsn,
      environment: nodeEnv,
      tracesSampleRate: nodeEnv === 'production' ? 0.1 : 1.0,
      // Filter sensitive data
      beforeSend(event, hint) {
        // Remove sensitive headers
        if (event.request?.headers) {
          delete event.request.headers['authorization'];
          delete event.request.headers['cookie'];
        }

        // Remove sensitive body data
        if (event.request?.data) {
          if (typeof event.request.data === 'object' && event.request.data !== null) {
            const data = event.request.data as Record<string, any>;
            delete data.password;
            delete data.token;
            delete data.apiKey;
          }
        }

        return event;
      },
    });

    console.log('✅ Sentry error tracking initialized');
  }

  captureException(error: Error, context?: Record<string, any>) {
    Sentry.captureException(error, {
      extra: context,
    });
  }

  captureMessage(message: string, level: Sentry.SeverityLevel = 'info') {
    Sentry.captureMessage(message, level);
  }

  setUser(user: { id: string; email?: string; username?: string }) {
    Sentry.setUser(user);
  }

  setContext(name: string, context: Record<string, any>) {
    Sentry.setContext(name, context);
  }

  addBreadcrumb(breadcrumb: Sentry.Breadcrumb) {
    Sentry.addBreadcrumb(breadcrumb);
  }
}
