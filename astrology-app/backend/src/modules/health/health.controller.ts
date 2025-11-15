import { Controller, Get } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { ConfigService } from '@nestjs/config';

@Controller('health')
export class HealthController {
  constructor(
    @InjectConnection() private connection: Connection,
    private configService: ConfigService,
  ) {}

  @Get()
  async check() {
    const checks = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: this.configService.get('app.nodeEnv'),
      version: '1.0.0',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      database: 'unknown',
    };

    try {
      await this.connection.query('SELECT 1');
      checks.database = 'connected';
    } catch (error) {
      checks.database = 'disconnected';
      checks.status = 'degraded';
    }

    return checks;
  }

  @Get('ready')
  async readiness() {
    try {
      // Check if database is ready
      await this.connection.query('SELECT 1');

      return {
        status: 'ready',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        status: 'not ready',
        timestamp: new Date().toISOString(),
        error: error.message,
      };
    }
  }

  @Get('live')
  async liveness() {
    // Basic liveness check - app is running
    return {
      status: 'alive',
      timestamp: new Date().toISOString(),
    };
  }
}
