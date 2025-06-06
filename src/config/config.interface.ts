export interface AppConfig {
  app: {
    port: number;
    clientUrl: string;
    nodeEnv: 'development' | 'production' | 'test';
  };
  database: {
    url: string | undefined;
  };
  supabase: {
    url: string | undefined;
    key: string | undefined;
    bucket: string | undefined;
  };
  email: {
    host: string;
    port: number;
    user: string | undefined;
    pass: string | undefined;
    from: string | undefined;
  };
  gemini: {
    key: string | undefined;
    model: string | undefined;
  };
  jwt: {
    accessSecret: string | undefined;
    accessExpiresIn: string;
    refreshSecret: string | undefined;
    refreshExpiresIn: string;
  };
  cookie: {
    secure: boolean;
    sameSite: 'strict' | 'lax' | 'none';
  };
  auth: {
    refreshTokenPath: string;
    refreshTokenMaxAge: number;
  };
}
