declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: "development" | "production";
    PORT: string;
    REDIS_URL: string;
    DATABASE_HOST: string;
    DATABASE_PORT: string;
    DATABASE_NAME: string;
    DATABASE_USERNAME: string;
    DATABASE_PASSWORD: string;
    SESSION_SECRET: string;
    CORS_ORIGIN: string;
  }
}
