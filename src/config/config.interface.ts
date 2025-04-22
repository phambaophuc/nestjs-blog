export interface AppConfig {
  app: {
    port: number;
    clientUrl: string;
  };
  database: {
    url: string;
  };
  supabase: {
    url: string;
    key: string;
    bucket: string;
  };
  email: {
    host: string;
    port: number;
    user: string;
    pass: string;
    from: string;
  };
  gemini: {
    key: string;
    model: string;
  };
}
