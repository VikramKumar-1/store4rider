import pino from "pino";

const isDev = process.env.NODE_ENV !== "production";

/**
 * Singleton pino logger instance.
 * Uses pino-pretty in development for better readability.
 */
export const logger = pino({
  level: process.env.LOG_LEVEL || "info",
  transport: isDev
    ? {
        target: "pino-pretty",
        options: {
          colorize: true,
          ignore: "pid,hostname",
        },
      }
    : undefined,
});
