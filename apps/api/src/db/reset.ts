import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { sql } from 'drizzle-orm';
import { execSync } from 'child_process';

const DATABASE_URL =
  process.env.DATABASE_URL || 'postgresql://simpleconf:simpleconf@localhost:5432/simpleconf';

async function reset() {
  console.log('Starting database reset...');

  const client = postgres(DATABASE_URL);
  const db = drizzle(client);

  try {
    // Drop all tables (in correct order due to foreign keys)
    console.log('Dropping existing tables...');

    await db.execute(sql`DROP TABLE IF EXISTS documents CASCADE`);
    await db.execute(sql`DROP TABLE IF EXISTS folders CASCADE`);
    await db.execute(sql`DROP TABLE IF EXISTS users CASCADE`);

    // Drop enums
    await db.execute(sql`DROP TYPE IF EXISTS department CASCADE`);
    await db.execute(sql`DROP TYPE IF EXISTS folder_visibility CASCADE`);

    // Drop drizzle migration table
    await db.execute(sql`DROP TABLE IF EXISTS __drizzle_migrations CASCADE`);

    console.log('Tables dropped successfully');

    // Close connection before running migrate
    await client.end();

    // Run migrations
    console.log('Running migrations...');
    execSync('pnpm db:migrate', { stdio: 'inherit', cwd: process.cwd() });

    // Run seed
    console.log('Running seed...');
    execSync('pnpm db:seed', { stdio: 'inherit', cwd: process.cwd() });

    console.log('Database reset completed successfully!');
  } catch (error) {
    console.error('Database reset failed:', error);
    await client.end();
    process.exit(1);
  }
}

reset();
