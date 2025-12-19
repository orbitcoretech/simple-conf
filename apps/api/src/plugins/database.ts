import type { FastifyInstance, FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import { createDatabaseConnection, closeDatabaseConnection, type Database } from '../db/index.js';

declare module 'fastify' {
  interface FastifyInstance {
    db: Database;
  }
}

const databasePlugin: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  const db = createDatabaseConnection(fastify.config.DATABASE_URL);

  fastify.decorate('db', db);

  fastify.addHook('onClose', async () => {
    await closeDatabaseConnection();
    fastify.log.info('Database connection closed');
  });

  fastify.log.info('Database connection established');
};

export default fp(databasePlugin, {
  name: 'database',
  dependencies: [],
});
