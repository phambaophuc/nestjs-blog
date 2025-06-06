import { AppConfig } from './config.interface';

export const configuration = (): AppConfig => ({
  app: {
    port: parseInt(process.env.APP_PORT ?? '3000', 10),
    clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
    nodeEnv:
      (process.env.NODE_ENV as 'development' | 'production' | 'test') ||
      'development',
  },
  database: {
    url: process.env.DB_URL,
  },
  supabase: {
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_KEY,
    bucket: process.env.SUPABASE_BUCKET,
  },
  email: {
    host: process.env.EMAIL_HOST || 'sandbox.smtp.mailtrap.io',
    port: parseInt(process.env.EMAIL_PORT ?? '2525', 10),
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
    from: process.env.EMAIL_FROM,
  },
  gemini: {
    key: process.env.GEMINI_KEY,
    model: process.env.GEMINI_MODEL,
  },
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET,
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },
  cookie: {
    secure: process.env.COOKIE_SECURE === 'true',
    sameSite:
      (process.env.COOKIE_SAME_SITE as 'strict' | 'lax' | 'none') || 'strict',
  },
  auth: {
    refreshTokenPath: process.env.AUTH_REFRESH_TOKEN_PATH || '/auth/refresh',
    refreshTokenMaxAge: parseInt(
      process.env.AUTH_REFRESH_TOKEN_MAX_AGE ?? '604800000',
    ),
  },
});
