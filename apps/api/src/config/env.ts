import type { FastifyInstance } from "fastify";
import fastifyEnv from "@fastify/env";

export interface EnvConfig {
  DATABASE_URL: string;
  JWT_SECRET: string;
  CORS_ORIGIN: string;
  PORT: number;
  NODE_ENV: "development" | "production" | "test";
  LOG_LEVEL: string;
}

const schema = {
  type: "object",
  required: ["DATABASE_URL", "JWT_SECRET"],
  properties: {
    DATABASE_URL: {
      type: "string",
      default: "postgresql://simpleconf:simpleconf@localhost:5432/simpleconf",
    },
    JWT_SECRET: {
      type: "string",
      default: "6cf27331250750ae841a03da156dd509",
    },
    CORS_ORIGIN: {
      type: "string",
      default: "http://localhost:3000",
    },
    PORT: {
      type: "number",
      default: 3001,
    },
    NODE_ENV: {
      type: "string",
      default: "development",
    },
    LOG_LEVEL: {
      type: "string",
      default: "debug",
    },
  },
};

const options = {
  confKey: "config",
  schema,
  dotenv: true,
};

export async function registerEnv(app: FastifyInstance): Promise<void> {
  await app.register(fastifyEnv, options);
}

// Type augmentation for Fastify
declare module "fastify" {
  interface FastifyInstance {
    config: EnvConfig;
  }
}
