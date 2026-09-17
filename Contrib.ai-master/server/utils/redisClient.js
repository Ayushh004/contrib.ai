import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

let redisClient = null;

/**
 * Initialize Redis client connection
 */
export const initRedis = async () => {
  try {
    redisClient = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379',
      socket: {
        reconnectStrategy: (retries) => {
          if (retries > 10) {
            console.error('Redis reconnection failed after 10 retries');
            return new Error('Redis reconnection failed');
          }
          return Math.min(retries * 100, 3000);
        }
      }
    });

    redisClient.on('error', (err) => {
      console.error('Redis Client Error:', err.message);
    });

    redisClient.on('connect', () => {
      console.log('✅ Redis connected successfully');
    });

    redisClient.on('disconnect', () => {
      console.log('⚠️ Redis disconnected');
    });

    await redisClient.connect();
    return redisClient;
  } catch (error) {
    console.error('❌ Redis initialization failed:', error.message);
    // Don't throw error - allow app to run without Redis
    return null;
  }
};

/**
 * Get Redis client instance
 */
export const getRedisClient = () => {
  return redisClient;
};

/**
 * Check if Redis is available
 */
export const isRedisAvailable = () => {
  return redisClient !== null && redisClient.isOpen;
};

/**
 * Get cached data
 */
export const getCached = async (key) => {
  if (!isRedisAvailable()) {
    return null;
  }

  try {
    const data = await redisClient.get(key);
    if (data) {
      console.log(`✅ Cache HIT: ${key}`);
      return JSON.parse(data);
    }
    console.log(`❌ Cache MISS: ${key}`);
    return null;
  } catch (error) {
    console.error(`❌ Redis GET error for key ${key}:`, error.message);
    return null;
  }
};

/**
 * Set cached data with TTL
 */
export const setCached = async (key, value, ttlSeconds = 3600) => {
  if (!isRedisAvailable()) {
    return false;
  }

  try {
    await redisClient.setEx(key, ttlSeconds, JSON.stringify(value));
    console.log(`✅ Cached: ${key} (TTL: ${ttlSeconds}s)`);
    return true;
  } catch (error) {
    console.error(`❌ Redis SET error for key ${key}:`, error.message);
    return false;
  }
};

/**
 * Delete cached data
 */
export const deleteCached = async (key) => {
  if (!isRedisAvailable()) {
    return false;
  }

  try {
    await redisClient.del(key);
    console.log(`✅ Deleted cache: ${key}`);
    return true;
  } catch (error) {
    console.error(`❌ Redis DEL error for key ${key}:`, error.message);
    return false;
  }
};

/**
 * Delete cached data by pattern
 */
export const deleteCachedPattern = async (pattern) => {
  if (!isRedisAvailable()) {
    return false;
  }

  try {
    const keys = await redisClient.keys(pattern);
    if (keys.length > 0) {
      await redisClient.del(keys);
      console.log(`✅ Deleted ${keys.length} cache entries matching: ${pattern}`);
    }
    return true;
  } catch (error) {
    console.error(`❌ Redis DEL pattern error for ${pattern}:`, error.message);
    return false;
  }
};

/**
 * Close Redis connection
 */
export const closeRedis = async () => {
  if (redisClient && redisClient.isOpen) {
    try {
      await redisClient.quit();
      console.log('✅ Redis connection closed');
    } catch (error) {
      console.error('❌ Redis close error:', error.message);
    }
  }
};
