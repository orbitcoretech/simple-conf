import Fastify, { type FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import { registerEnv } from './config/env.js';
import type { HealthResponse } from '@simpleconf/shared';

export async function buildApp(): Promise<FastifyInstance> {
  const app = Fastify({
    logger: {
      level: process.env.LOG_LEVEL || 'debug',
      transport:
        process.env.NODE_ENV === 'development'
          ? {
              target: 'pino-pretty',
              options: {
                colorize: true,
                translateTime: 'HH:MM:ss Z',
                ignore: 'pid,hostname',
              },
            }
          : undefined,
    },
  });

  // Register environment config
  await registerEnv(app);

  // Register CORS
  await app.register(cors, {
    origin: app.config.CORS_ORIGIN,
    credentials: true,
  });

  // Health check endpoint
  app.get<{ Reply: HealthResponse }>('/health', async (_request, _reply) => {
    return { status: 'ok' };
  });

  return app;
}
