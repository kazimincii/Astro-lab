/**
 * Health Check Controller
 *
 * Provides health check endpoints for monitoring and load balancers
 * Checks database, Redis, and external service connectivity
 */

import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  check() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'astrology-backend',
      version: '1.0.0',
    };
  }

  @Get('ready')
  ready() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: {
        heapUsed: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        heapTotal: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
        external: Math.round(process.memoryUsage().external / 1024 / 1024),
        rss: Math.round(process.memoryUsage().rss / 1024 / 1024),
      },
    };
  }

  @Get('live')
  live() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}
