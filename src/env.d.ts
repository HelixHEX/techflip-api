declare namespace NodeJS {
  export interface ProcessEnv {
    PORT: string;
    DATABASE_URL: string;
    SESSION_SECRET: string;
    REDIS_URL: string;
  }
}