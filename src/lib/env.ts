import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters"),
  ADMIN_EMAIL: z.string().email("ADMIN_EMAIL must be a valid email"),
  ADMIN_PASSWORD: z.string().min(8, "ADMIN_PASSWORD must be at least 8 characters"),
  UPLOAD_DIR: z.string().min(1, "UPLOAD_DIR is required"),
  SESSION_IDLE_MINUTES: z.coerce.number().int().positive().default(30),
  LOGIN_RATE_LIMIT_MAX: z.coerce.number().int().positive().default(5),
  LOGIN_RATE_LIMIT_WINDOW_MINUTES: z.coerce.number().int().positive().default(15),
  BOOKING_RATE_LIMIT_MAX: z.coerce.number().int().positive().default(10),
  BOOKING_RATE_LIMIT_WINDOW_MINUTES: z.coerce.number().int().positive().default(60),
});

export const env = envSchema.parse({
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  ADMIN_EMAIL: process.env.ADMIN_EMAIL,
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
  UPLOAD_DIR: process.env.UPLOAD_DIR,
  SESSION_IDLE_MINUTES: process.env.SESSION_IDLE_MINUTES,
  LOGIN_RATE_LIMIT_MAX: process.env.LOGIN_RATE_LIMIT_MAX,
  LOGIN_RATE_LIMIT_WINDOW_MINUTES: process.env.LOGIN_RATE_LIMIT_WINDOW_MINUTES,
  BOOKING_RATE_LIMIT_MAX: process.env.BOOKING_RATE_LIMIT_MAX,
  BOOKING_RATE_LIMIT_WINDOW_MINUTES: process.env.BOOKING_RATE_LIMIT_WINDOW_MINUTES,
});

export type AppEnv = typeof env;