import * as dotenv from 'dotenv';

dotenv.config();

export const ENV = {
  APP_PORT: process.env.APP_PORT,
  CLIENT_URL: process.env.CLIENT_URL,
  NODE_ENV: process.env.NODE_ENV,
  DATABASE: {
    HOST: process.env.DB_HOST,
    PORT: Number(process.env.DB_PORT),
    USERNAME: process.env.DB_USERNAME,
    PASSWORD: process.env.DB_PASSWORD,
    NAME: process.env.DB_DATABASE,
  },
  SUPABASE: {
    URL: process.env.SUPABASE_URL ?? '',
    KEY: process.env.SUPABASE_KEY ?? '',
    BUCKET: process.env.SUPABASE_BUCKET ?? '',
  },
  EMAIL: {
    HOST: process.env.EMAIL_HOST ?? '',
    PORT: process.env.EMAIL_PORT ?? '',
    USER: process.env.EMAIL_USER ?? '',
    PASS: process.env.EMAIL_PASS ?? '',
    FROM: process.env.EMAIL_FROM ?? '',
  },
};
