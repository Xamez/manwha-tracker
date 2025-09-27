import { env } from "$env/dynamic/private";
import { dev } from "$app/environment";

export const SERVER_ENV = {
  MONGODB_URI: env.MONGODB_URI || "mongodb://localhost:27017/manwha-tracker",
  JWT_SECRET: env.JWT_SECRET || "fallback-secret-key-change-this",
  JWT_EXPIRES_IN: env.JWT_EXPIRES_IN || "7d",
  NODE_ENV: env.NODE_ENV || (dev ? "development" : "production"),
};
