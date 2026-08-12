import { RateLimiterRedis } from "rate-limiter-flexible";
import { redisClient } from "../cache/redis";
import { AppError } from "../errors/AppError";

let rateLimiter: RateLimiterRedis | null = null;

if (redisClient) {
  rateLimiter = new RateLimiterRedis({
    storeClient: redisClient,
    keyPrefix: "rate_limit",
    points: 5, // 5 requests
    duration: 15 * 60, // per 15 minutes by IP
  });
}

/**
 * Rate limiting middleware.
 * Use this on endpoints that need protection, like auth endpoints.
 */
export const checkRateLimit = async (ip: string) => {
  if (!rateLimiter) return; // Skip if no Redis

  try {
    await rateLimiter.consume(ip);
  } catch (rejRes) {
    throw new AppError("Too Many Requests", 429);
  }
};
