export const configuration = () => ({
  app: {
    port: parseInt(process.env.APP_PORT ?? '3000', 10),
    clientUrl: process.env.CLIENT_URL,
  },
  database: {
    url: process.env.DB_URL,
    synchronize: process.env.DB_SYNCHRONIZE ?? false,
  },
  supabase: {
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_KEY,
    bucket: process.env.SUPABASE_BUCKET,
  },
  email: {
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT ?? '2525', 10),
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
    from: process.env.EMAIL_FROM,
  },
  gemini: {
    key: process.env.GEMINI_KEY,
    model: process.env.GEMINI_MODEL,
  },
});
