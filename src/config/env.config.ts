import * as dotenv from 'dotenv';

dotenv.config();
export const ENV_VARIABLES = {
  // Server config
  PORT: parseInt(process.env.PORT),

  // Access & Refresh token config
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRATION: process.env.ACCESS_TOKEN_EXPIRATION,

  // Password hash
  BCRYPT_SALT_ROUND: parseInt(process.env.BCRYPT_SALT_ROUND),

  // Database credentials
  DB_HOST: process.env.DB_HOST,
  DB_PORT: parseInt(process.env.DB_PORT),
  DB_USERNAME: process.env.DB_USERNAME,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_DATABASE_NAME: process.env.DB_DATABASE_NAME,

  // Seed Admin details
  ADMIN_NAME: process.env.ADMIN_NAME,
  ADMIN_EMAIL: process.env.ADMIN_EMAIL,
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,

  // Cache config
  REDIS_HOST: process.env.REDIS_HOST,
  REDIS_PORT: parseInt(process.env.REDIS_PORT),
  REDIS_DEFAULT_TTL: parseInt(process.env.REDIS_DEFAULT_TTL),
} as const;
