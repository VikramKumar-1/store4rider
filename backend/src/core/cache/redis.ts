import Redis from "ioredis";
import { logger } from "../utils/logger";

const REDIS_URL = process.env.REDIS_URL;

let redisClient: Redis | null = null;

if (REDIS_URL) {
  redisClient = new Redis(REDIS_URL);
  redisClient.on("error", (err) => logger.warn(`Redis Error: ${err.message}`));
  redisClient.on("connect", () => logger.info("Connected to Redis"));
} else {
  logger.warn("REDIS_URL not set. Falling back to in-memory caching.");
}

/**
 * Sets a value in the Redis cache.
 */
export const setCache = async (key: string, value: any, ttlSeconds: number = 3600) => {
  if (redisClient) {
    await redisClient.set(key, JSON.stringify(value), "EX", ttlSeconds);
  }
};

/**
 * Gets a value from the Redis cache.
 */
export const getCache = async (key: string): Promise<any | null> => {
  if (redisClient) {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  }
  return null;
};

/**
 * Deletes a key from the Redis cache.
 */
export const deleteCache = async (key: string) => {
  if (redisClient) {
    await redisClient.del(key);
  }
};

export { redisClient };
