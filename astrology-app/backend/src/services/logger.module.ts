import { Global, Module } from '@nestjs/common';
import { LoggerService } from './logger.service';
import { SentryService } from './sentry.service';

@Global()
@Module({
  providers: [LoggerService, SentryService],
  exports: [LoggerService, SentryService],
})
export class LoggerModule {}
