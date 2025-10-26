/**
 * Filename: cache.js
 * Description: Generic caching utility using Redis.
 *
 * Author: Jesús Pichardo
 */

const client = require('../config/redis');
const config = require('../config');

const TTL = config.redis.ttl;

/**
 * Generic function to cache any data
 * @param {string} key - Cache key
 * @param {Function} fetchFunction - Function to execute if cache miss
 * @param {number} ttl - Time to live in seconds
 */
exports.cache = async (key, fetchFunction, ttl = TTL) => {
  try {
    const cachedData = await client.get(key);

    if (cachedData) {
      return JSON.parse(cachedData);
    }

    const data = await fetchFunction();

    // Save in cache
    await client.setEx(key, ttl, JSON.stringify(data));

    return data;
  } catch (error) {
    // In case Redis fails, still return fresh data
    return await fetchFunction();
  }
};

/**
 * Invalidate (delete) cache by key
 */
exports.invalidateCache = async (key) => {
  try {
    await client.del(key);
    return true;
  } catch (error) {
    return false;
  }
};
