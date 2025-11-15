import { SetMetadata } from '@nestjs/common';

export const CACHE_KEY_METADATA = 'cache:key';
export const CACHE_TTL_METADATA = 'cache:ttl';

/**
 * Decorator to enable caching for a method
 * @param keyPrefix - Cache key prefix
 * @param ttlSeconds - Time to live in seconds
 *
 * Example usage:
 * @Cacheable('user-profile', 300) // Cache for 5 minutes
 * async getUserProfile(userId: string) { ... }
 *
 * Cache key will be: user-profile:${userId}
 */
export const Cacheable = (keyPrefix: string, ttlSeconds: number = 300) => {
  return SetMetadata(CACHE_KEY_METADATA, { keyPrefix, ttlSeconds });
};

/**
 * Decorator to invalidate cache
 * @param keyPattern - Cache key pattern to invalidate
 *
 * Example usage:
 * @CacheEvict('user-profile:*')
 * async updateUserProfile(userId: string, data: any) { ... }
 */
export const CacheEvict = (keyPattern: string) => {
  return SetMetadata('cache:evict', keyPattern);
};
