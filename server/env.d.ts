declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: "development" | "production";
    PORT: string;
    REDIS_URL: string;
    DATABASE_URL: string;
    SESSION_SECRET: string;
    CORS_ORIGIN: string;
    USE_HTTPS: "true" | "false";
    USE_PROXY: "true" | "false";
  }
}
