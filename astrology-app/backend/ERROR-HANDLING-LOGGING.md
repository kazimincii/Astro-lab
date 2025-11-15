# Error Handling & Logging Guide

## Overview

This guide covers the centralized error handling and logging infrastructure implemented in the Astrology Backend API.

## Architecture

### 1. LoggerService (Winston-based)

The `LoggerService` provides structured logging with multiple transports:

**Features**:
- Daily rotating file logs (automatic cleanup)
- Console logging with colors (development)
- Structured JSON logs (production)
- Multiple log levels (error, warn, info, debug, verbose)
- Context-aware logging

**Log Files**:
```
logs/
├── error-YYYY-MM-DD.log     (errors only, 30 day retention)
├── combined-YYYY-MM-DD.log  (all logs, 14 day retention)
└── http-YYYY-MM-DD.log      (HTTP requests, 7 day retention)
```

### 2. SentryService

The `SentryService` provides error tracking and monitoring:

**Features**:
- Automatic error capture and reporting
- Performance monitoring (traces)
- User context tracking
- Breadcrumb trails
- Sensitive data filtering

**Configuration** (`.env`):
```env
SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
NODE_ENV=production
```

### 3. Exception Filters

Two global exception filters handle all errors:

**AllExceptionsFilter**:
- Catches ALL exceptions (HTTP and non-HTTP)
- Formats error responses consistently
- Logs to Winston
- Reports critical errors (500+) to Sentry

**HttpExceptionFilter**:
- Catches HTTP exceptions specifically
- Provides detailed HTTP error responses
- Logs based on severity

## Usage

### Basic Logging

```typescript
import { Injectable } from '@nestjs/common';
import { LoggerService } from '@/services/logger.service';

@Injectable()
export class MyService {
  constructor(private readonly logger: LoggerService) {}

  async doSomething() {
    // Info logging
    this.logger.log('Operation started', 'MyService');

    try {
      // Your code here
      this.logger.debug('Processing data...', 'MyService');
    } catch (error) {
      // Error logging with stack trace
      this.logger.error('Operation failed', error.stack, 'MyService');
      throw error;
    }

    // Warning
    this.logger.warn('Unusual condition detected', 'MyService');
  }
}
```

### Log Levels

```typescript
// Error - Critical issues that need immediate attention
this.logger.error('Database connection failed', error.stack, 'DatabaseService');

// Warn - Warning conditions that should be addressed
this.logger.warn('API rate limit approaching', 'StripeService');

// Log (Info) - General informational messages
this.logger.log('User registered successfully', 'AuthService');

// Debug - Detailed debugging information
this.logger.debug('Request payload: ' + JSON.stringify(payload), 'PaymentService');

// Verbose - Very detailed information
this.logger.verbose('Cache hit for key: user:123', 'CacheService');
```

### Sentry Error Tracking

```typescript
import { Injectable } from '@nestjs/common';
import { SentryService } from '@/services/sentry.service';

@Injectable()
export class PaymentService {
  constructor(private readonly sentry: SentryService) {}

  async processPayment(userId: string, amount: number) {
    try {
      // Payment processing logic
    } catch (error) {
      // Capture exception with context
      this.sentry.captureException(error, {
        userId,
        amount,
        operation: 'processPayment',
      });
      throw error;
    }
  }

  async criticalOperation() {
    // Set user context (persists across errors)
    this.sentry.setUser({
      id: 'user-123',
      email: 'user@example.com',
      username: 'johndoe',
    });

    // Add breadcrumbs for debugging
    this.sentry.addBreadcrumb({
      message: 'Started critical operation',
      level: 'info',
      data: { step: 1 },
    });

    // Capture custom messages
    this.sentry.captureMessage('Critical operation completed', 'info');
  }
}
```

### HTTP Exception Handling

Exceptions are automatically caught and formatted:

```typescript
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';

@Injectable()
export class UserService {
  async getUser(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      // Automatically logged and formatted
      throw new NotFoundException(`User ${id} not found`);
    }

    return user;
  }

  async createUser(data: CreateUserDto) {
    if (await this.emailExists(data.email)) {
      // Automatically logged with context
      throw new BadRequestException('Email already exists');
    }

    return this.userRepository.save(data);
  }
}
```

### Custom Exception Classes

Create domain-specific exceptions:

```typescript
// src/common/exceptions/payment.exception.ts
import { HttpException, HttpStatus } from '@nestjs/common';

export class PaymentFailedException extends HttpException {
  constructor(reason: string, chargeId?: string) {
    super(
      {
        statusCode: HttpStatus.PAYMENT_REQUIRED,
        message: 'Payment processing failed',
        reason,
        chargeId,
      },
      HttpStatus.PAYMENT_REQUIRED,
    );
  }
}

// Usage
throw new PaymentFailedException('Insufficient funds', 'ch_123');
```

## Error Response Format

All errors follow a consistent format:

```json
{
  "statusCode": 404,
  "timestamp": "2024-01-15T10:30:00.000Z",
  "path": "/api/v1/users/123",
  "method": "GET",
  "message": "User 123 not found",
  "error": "NotFoundException"
}
```

In development, stack traces are included:

```json
{
  "statusCode": 500,
  "timestamp": "2024-01-15T10:30:00.000Z",
  "path": "/api/v1/payments",
  "method": "POST",
  "message": "Database connection failed",
  "error": "InternalServerError",
  "stack": "Error: Database connection failed\n    at PaymentService.create..."
}
```

## Sensitive Data Protection

Both logging systems automatically redact sensitive information:

**Filtered Fields**:
- `password`
- `token`
- `secret`
- `apiKey`
- `refreshToken`
- `accessToken`
- `authorization` header
- `cookie` header

**Example**:
```typescript
// Request body
{
  "email": "user@example.com",
  "password": "secret123",
  "apiKey": "sk_live_abc123"
}

// Logged as
{
  "email": "user@example.com",
  "password": "[REDACTED]",
  "apiKey": "[REDACTED]"
}
```

## Monitoring Production Errors

### Sentry Dashboard

1. Login to Sentry dashboard
2. View real-time errors and performance metrics
3. Group similar errors automatically
4. Track error trends over time
5. Set up alerts for critical errors

### Log File Analysis

**View recent errors**:
```bash
tail -f logs/error-$(date +%Y-%m-%d).log
```

**Search for specific errors**:
```bash
grep "StripeService" logs/combined-*.log
```

**Count errors by type**:
```bash
grep -h "error" logs/error-*.log | jq -r '.error' | sort | uniq -c | sort -rn
```

**Monitor HTTP requests**:
```bash
tail -f logs/http-$(date +%Y-%m-%d).log | jq
```

## Performance Considerations

### Winston Performance

- **Async writes**: All file writes are non-blocking
- **Log rotation**: Automatic cleanup prevents disk space issues
- **Production optimization**: JSON format for faster parsing

### Sentry Performance

- **Sampling**: 10% trace sampling in production (configurable)
- **Before-send hook**: Filters sensitive data before transmission
- **Async reporting**: Doesn't block request processing

**Configuration**:
```typescript
// src/services/sentry.service.ts
Sentry.init({
  dsn: sentryDsn,
  environment: nodeEnv,
  tracesSampleRate: nodeEnv === 'production' ? 0.1 : 1.0, // 10% in prod
  beforeSend(event) {
    // Filter sensitive data
    return event;
  },
});
```

## Best Practices

### 1. Always Provide Context

```typescript
// ❌ Bad - No context
this.logger.error('Error occurred');

// ✅ Good - With context
this.logger.error('Failed to process payment', error.stack, 'PaymentService');
```

### 2. Use Appropriate Log Levels

```typescript
// ❌ Bad - Everything is an error
this.logger.error('User logged in');
this.logger.error('Cache miss');

// ✅ Good - Appropriate levels
this.logger.log('User logged in', 'AuthService');
this.logger.debug('Cache miss for key: user:123', 'CacheService');
```

### 3. Don't Log Sensitive Data

```typescript
// ❌ Bad - Logs password
this.logger.log(`User password: ${password}`);

// ✅ Good - No sensitive data
this.logger.log(`User authenticated successfully`);
```

### 4. Add Breadcrumbs for Complex Operations

```typescript
async complexOperation(userId: string) {
  this.sentry.addBreadcrumb({
    message: 'Started complex operation',
    level: 'info',
  });

  try {
    // Step 1
    this.sentry.addBreadcrumb({
      message: 'Fetched user data',
      data: { userId },
    });

    // Step 2
    this.sentry.addBreadcrumb({
      message: 'Calculated result',
      data: { result: 'success' },
    });
  } catch (error) {
    // Sentry will include all breadcrumbs in the error report
    this.sentry.captureException(error);
    throw error;
  }
}
```

### 5. Handle Known Errors Gracefully

```typescript
async fetchUserData(id: string) {
  try {
    return await this.api.get(`/users/${id}`);
  } catch (error) {
    if (error.response?.status === 404) {
      // Expected error - log as warning
      this.logger.warn(`User ${id} not found`, 'UserService');
      return null;
    }

    // Unexpected error - log as error and report to Sentry
    this.logger.error('Failed to fetch user', error.stack, 'UserService');
    this.sentry.captureException(error);
    throw error;
  }
}
```

## Testing Error Handling

### Unit Tests

```typescript
describe('UserService', () => {
  it('should log error when user not found', async () => {
    const loggerSpy = jest.spyOn(logger, 'warn');

    await service.getUser('invalid-id');

    expect(loggerSpy).toHaveBeenCalledWith(
      'User invalid-id not found',
      'UserService',
    );
  });
});
```

### Integration Tests

```typescript
describe('Exception Filter', () => {
  it('should format error response correctly', async () => {
    const response = await request(app.getHttpServer())
      .get('/users/invalid')
      .expect(404);

    expect(response.body).toMatchObject({
      statusCode: 404,
      message: expect.any(String),
      error: 'NotFoundException',
      timestamp: expect.any(String),
      path: '/users/invalid',
    });
  });
});
```

## Troubleshooting

### Issue: Logs not appearing

**Check**:
1. `logs/` directory exists and is writable
2. `NODE_ENV` is set correctly
3. Log level is appropriate

**Solution**:
```bash
mkdir -p logs
chmod 755 logs
```

### Issue: Sentry not receiving errors

**Check**:
1. `SENTRY_DSN` is set in `.env`
2. Network connectivity to Sentry
3. Error is actually thrown (not caught and swallowed)

**Solution**:
```bash
# Test Sentry connection
curl -X POST https://sentry.io/api/.../envelope/ -H "X-Sentry-Auth: ..."
```

### Issue: Too many log files

**Check**:
- Log rotation settings
- Disk space

**Solution**:
```typescript
// Adjust retention in logger.service.ts
new DailyRotateFile({
  maxFiles: '7d', // Reduce from 14d or 30d
  maxSize: '10m', // Reduce from 20m
});
```

## Environment Configuration

### Development

```env
NODE_ENV=development
LOG_LEVEL=debug
# Sentry optional in development
```

**Features**:
- Colorized console logs
- Verbose logging
- Stack traces in responses

### Production

```env
NODE_ENV=production
LOG_LEVEL=info
SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
```

**Features**:
- JSON-formatted logs
- File rotation with retention
- Sentry error tracking
- No stack traces in responses

## Maintenance

### Regular Tasks

**Weekly**:
- Check Sentry dashboard for error trends
- Review error logs for patterns

**Monthly**:
- Analyze log file sizes and adjust retention
- Review and update sensitive data filters
- Check Sentry quota usage

**Quarterly**:
- Audit exception handling coverage
- Review custom exception classes
- Update error handling documentation

## Resources

- [Winston Documentation](https://github.com/winstonjs/winston)
- [Sentry Node.js Guide](https://docs.sentry.io/platforms/node/)
- [NestJS Exception Filters](https://docs.nestjs.com/exception-filters)
- [Error Handling Best Practices](https://www.joyent.com/node-js/production/design/errors)

## License

MIT
