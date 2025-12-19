import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema/index';

let db: ReturnType<typeof drizzle<typeof schema>> | null = null;
let client: ReturnType<typeof postgres> | null = null;

export function createDatabaseConnection(connectionString: string) {
  if (db) {
    return db;
  }

  client = postgres(connectionString);
  db = drizzle(client, { schema });

  return db;
}

export function getDatabaseConnection() {
  if (!db) {
    throw new Error('Database connection not initialized. Call createDatabaseConnection first.');
  }
  return db;
}

export async function closeDatabaseConnection() {
  if (client) {
    await client.end();
    client = null;
    db = null;
  }
}

export type Database = ReturnType<typeof createDatabaseConnection>;
