import { Injectable, Logger, OnModuleDestroy, OnModuleInit, Optional, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, RedisClientType } from 'redis';
import { MetricsService } from './metrics.service';

@Injectable()
export class CacheService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(CacheService.name);
  private client: RedisClientType;
  private isConnected = false;
  private hits = 0;
  private misses = 0;

  constructor(
    private configService: ConfigService,
    @Optional() @Inject(MetricsService) private metricsService?: MetricsService,
  ) {}

  async onModuleInit() {
    const redisHost = this.configService.get<string>('REDIS_HOST', 'localhost');
    const redisPort = this.configService.get<number>('REDIS_PORT', 6379);
    const redisPassword = this.configService.get<string>('REDIS_PASSWORD');
    const redisUrl = this.configService.get<string>('REDIS_URL');

    try {
      this.client = createClient({
        url: redisUrl || `redis://${redisHost}:${redisPort}`,
        password: redisPassword,
        socket: {
          reconnectStrategy: (retries: number) => {
            if (retries > 10) {
              this.logger.error('Redis reconnection limit reached');
              return new Error('Redis reconnection limit reached');
            }
            return Math.min(retries * 100, 3000);
          },
        },
      });

      this.client.on('error', err => {
        this.logger.error(`Redis Client Error: ${err.message}`);
        this.isConnected = false;
      });

      this.client.on('connect', () => {
        this.logger.log('✅ Redis connected');
        this.isConnected = true;
      });

      this.client.on('ready', () => {
        this.logger.log('✅ Redis ready');
      });

      this.client.on('reconnecting', () => {
        this.logger.warn('⚠️  Redis reconnecting...');
      });

      await this.client.connect();
    } catch (error) {
      this.logger.error(`Failed to connect to Redis: ${error.message}`);
      this.isConnected = false;
    }
  }

  async onModuleDestroy() {
    if (this.client && this.isConnected) {
      await this.client.quit();
      this.logger.log('Redis connection closed');
    }
  }

  /**
   * Get value from cache
   */
  async get<T>(key: string): Promise<T | null> {
    if (!this.isConnected) {
      this.logger.warn('Redis not connected, skipping cache get');
      return null;
    }

    try {
      const value = await this.client.get(key);
      if (!value) {
        this.misses++;
        this.metricsService?.recordCacheOperation('miss', key);
        this.updateHitRatio();
        return null;
      }
      this.hits++;
      this.metricsService?.recordCacheOperation('hit', key);
      this.updateHitRatio();
      return JSON.parse(value) as T;
    } catch (error) {
      this.logger.error(`Cache get error for key ${key}: ${error.message}`);
      return null;
    }
  }

  /**
   * Set value in cache with optional TTL
   */
  async set(key: string, value: any, ttlSeconds?: number): Promise<boolean> {
    if (!this.isConnected) {
      this.logger.warn('Redis not connected, skipping cache set');
      return false;
    }

    try {
      const serialized = JSON.stringify(value);
      if (ttlSeconds) {
        await this.client.setEx(key, ttlSeconds, serialized);
      } else {
        await this.client.set(key, serialized);
      }
      this.metricsService?.recordCacheOperation('set', key);
      return true;
    } catch (error) {
      this.logger.error(`Cache set error for key ${key}: ${error.message}`);
      return false;
    }
  }

  /**
   * Delete key from cache
   */
  async del(key: string): Promise<boolean> {
    if (!this.isConnected) {
      return false;
    }

    try {
      await this.client.del(key);
      return true;
    } catch (error) {
      this.logger.error(`Cache delete error for key ${key}: ${error.message}`);
      return false;
    }
  }

  /**
   * Delete keys matching pattern
   */
  async delPattern(pattern: string): Promise<number> {
    if (!this.isConnected) {
      return 0;
    }

    try {
      const keys = await this.client.keys(pattern);
      if (keys.length === 0) {
        return 0;
      }
      await this.client.del(keys);
      return keys.length;
    } catch (error) {
      this.logger.error(`Cache delete pattern error for ${pattern}: ${error.message}`);
      return 0;
    }
  }

  /**
   * Check if key exists
   */
  async exists(key: string): Promise<boolean> {
    if (!this.isConnected) {
      return false;
    }

    try {
      const result = await this.client.exists(key);
      return result === 1;
    } catch (error) {
      this.logger.error(`Cache exists error for key ${key}: ${error.message}`);
      return false;
    }
  }

  /**
   * Set expiration on key
   */
  async expire(key: string, ttlSeconds: number): Promise<boolean> {
    if (!this.isConnected) {
      return false;
    }

    try {
      await this.client.expire(key, ttlSeconds);
      return true;
    } catch (error) {
      this.logger.error(`Cache expire error for key ${key}: ${error.message}`);
      return false;
    }
  }

  /**
   * Increment value (for counters, rate limiting)
   */
  async incr(key: string): Promise<number> {
    if (!this.isConnected) {
      return 0;
    }

    try {
      return await this.client.incr(key);
    } catch (error) {
      this.logger.error(`Cache incr error for key ${key}: ${error.message}`);
      return 0;
    }
  }

  /**
   * Decrement value
   */
  async decr(key: string): Promise<number> {
    if (!this.isConnected) {
      return 0;
    }

    try {
      return await this.client.decr(key);
    } catch (error) {
      this.logger.error(`Cache decr error for key ${key}: ${error.message}`);
      return 0;
    }
  }

  /**
   * Get or set pattern (cache-aside)
   */
  async getOrSet<T>(
    key: string,
    fetchFn: () => Promise<T>,
    ttlSeconds?: number,
  ): Promise<T> {
    // Try to get from cache first
    const cached = await this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    // Fetch from source
    const value = await fetchFn();

    // Store in cache
    await this.set(key, value, ttlSeconds);

    return value;
  }

  /**
   * Flush all cache (use with caution in production!)
   */
  async flushAll(): Promise<boolean> {
    if (!this.isConnected) {
      return false;
    }

    try {
      await this.client.flushAll();
      this.logger.warn('⚠️  Cache flushed!');
      return true;
    } catch (error) {
      this.logger.error(`Cache flush error: ${error.message}`);
      return false;
    }
  }

  /**
   * Get cache statistics
   */
  async getStats(): Promise<any> {
    if (!this.isConnected) {
      return { connected: false };
    }

    try {
      const info = await this.client.info('stats');
      const dbSize = await this.client.dbSize();
      return {
        connected: true,
        info,
        dbSize,
        hitRatio: this.hits + this.misses > 0 ? this.hits / (this.hits + this.misses) : 0,
      };
    } catch (error) {
      this.logger.error(`Cache stats error: ${error.message}`);
      return { connected: false, error: error.message };
    }
  }

  /**
   * Update cache hit ratio metric
   */
  private updateHitRatio() {
    const total = this.hits + this.misses;
    if (total > 0) {
      const ratio = this.hits / total;
      this.metricsService?.updateCacheHitRatio(ratio);
    }
  }
}
