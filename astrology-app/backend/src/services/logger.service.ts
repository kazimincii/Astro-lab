import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as winston from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';

@Injectable()
export class LoggerService implements NestLoggerService {
  private logger: winston.Logger;
  private context = 'Application';

  constructor(private configService: ConfigService) {
    this.initializeLogger();
  }

  private initializeLogger() {
    const nodeEnv = this.configService.get<string>('NODE_ENV', 'development');
    const logLevel = this.configService.get<string>('LOG_LEVEL', 'info');
    const logJson = this.configService.get<boolean>('LOG_JSON', false);
    const logToFile = this.configService.get<boolean>('LOG_TO_FILE', true);
    const logPath = this.configService.get<string>('LOG_FILE_PATH', './logs');

    const transports: winston.transport[] = [];

    // Console transport
    transports.push(
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
          winston.format.errors({ stack: true }),
          winston.format.colorize(),
          logJson
            ? winston.format.json()
            : winston.format.printf(({ timestamp, level, message, context, ...meta }) => {
                const metaString = Object.keys(meta).length ? JSON.stringify(meta) : '';
                return `${timestamp} [${context || 'App'}] ${level}: ${message} ${metaString}`;
              }),
        ),
      }),
    );

    // File transports (only in production or if explicitly enabled)
    if (logToFile && nodeEnv !== 'test') {
      // Error logs - daily rotation
      transports.push(
        new DailyRotateFile({
          filename: `${logPath}/error-%DATE%.log`,
          datePattern: 'YYYY-MM-DD',
          level: 'error',
          maxFiles: '30d',
          maxSize: '20m',
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.errors({ stack: true }),
            winston.format.json(),
          ),
        }),
      );

      // Combined logs - daily rotation
      transports.push(
        new DailyRotateFile({
          filename: `${logPath}/combined-%DATE%.log`,
          datePattern: 'YYYY-MM-DD',
          maxFiles: '14d',
          maxSize: '20m',
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.errors({ stack: true }),
            winston.format.json(),
          ),
        }),
      );

      // HTTP access logs - daily rotation
      transports.push(
        new DailyRotateFile({
          filename: `${logPath}/http-%DATE%.log`,
          datePattern: 'YYYY-MM-DD',
          level: 'http',
          maxFiles: '7d',
          maxSize: '20m',
          format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
        }),
      );
    }

    this.logger = winston.createLogger({
      level: logLevel,
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.splat(),
        winston.format.json(),
      ),
      defaultMeta: {
        service: 'astrology-backend',
        environment: nodeEnv,
      },
      transports,
      // Don't exit on error
      exitOnError: false,
    });
  }

  setContext(context: string) {
    this.context = context;
  }

  log(message: any, context?: string) {
    this.logger.info(message, { context: context || this.context });
  }

  error(message: any, trace?: string, context?: string) {
    this.logger.error(message, {
      context: context || this.context,
      trace,
    });
  }

  warn(message: any, context?: string) {
    this.logger.warn(message, { context: context || this.context });
  }

  debug(message: any, context?: string) {
    this.logger.debug(message, { context: context || this.context });
  }

  verbose(message: any, context?: string) {
    this.logger.verbose(message, { context: context || this.context });
  }

  // Custom method for HTTP access logging
  http(message: any, meta?: Record<string, any>) {
    this.logger.http(message, { ...meta, context: 'HTTP' });
  }

  // Custom method for structured logging
  logStructured(level: string, message: string, meta: Record<string, any> = {}) {
    this.logger.log(level, message, { ...meta, context: this.context });
  }

  // Get Winston logger instance (for advanced usage)
  getLogger(): winston.Logger {
    return this.logger;
  }
}
