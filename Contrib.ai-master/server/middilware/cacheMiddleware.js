import { getCached, setCached } from '../utils/redisClient.js';

/**
 * Generic cache middleware for GET requests
 * @param {string} keyPrefix - Prefix for cache key
 * @param {number} ttlSeconds - Time to live in seconds (default: 3600)
 * @param {function} keyGenerator - Function to generate unique cache key from request (optional)
 */
export const cacheMiddleware = (keyPrefix, ttlSeconds = 3600, keyGenerator = null) => {
  return async (req, res, next) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    try {
      // Generate cache key
      const cacheKey = keyGenerator 
        ? `${keyPrefix}:${keyGenerator(req)}`
        : `${keyPrefix}:${req.originalUrl}`;

      // Try to get from cache
      const cachedData = await getCached(cacheKey);
      
      if (cachedData) {
        return res.status(200).json(cachedData);
      }

      // If not in cache, store original res.json to cache the response
      const originalJson = res.json.bind(res);
      res.json = async (data) => {
        // Cache the response
        await setCached(cacheKey, data, ttlSeconds);
        return originalJson(data);
      };

      next();
    } catch (error) {
      console.error('Cache middleware error:', error.message);
      // Continue without caching if there's an error
      next();
    }
  };
};

/**
 * Cache invalidation middleware
 * @param {string} pattern - Cache key pattern to invalidate
 */
export const invalidateCache = (pattern) => {
  return async (req, res, next) => {
    try {
      const { deleteCachedPattern } = await import('../utils/redisClient.js');
      await deleteCachedPattern(pattern);
      next();
    } catch (error) {
      console.error('Cache invalidation error:', error.message);
      next();
    }
  };
};
