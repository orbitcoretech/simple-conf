import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { eq } from 'drizzle-orm';
import * as schema from '../../src/db/schema/index';
import bcrypt from 'bcrypt';

const DATABASE_URL =
  process.env.DATABASE_URL || 'postgresql://simpleconf:simpleconf@localhost:5432/simpleconf';

describe('Database Integration Tests', () => {
  let client: ReturnType<typeof postgres>;
  let db: ReturnType<typeof drizzle<typeof schema>>;

  beforeAll(async () => {
    client = postgres(DATABASE_URL);
    db = drizzle(client, { schema });
  });

  afterAll(async () => {
    await client.end();
  });

  describe('Database Connection', () => {
    it('should establish connection to PostgreSQL', async () => {
      const result = await db.execute<{ version: string }>('SELECT version()');
      expect(result.length).toBeGreaterThan(0);
      expect(result[0].version).toContain('PostgreSQL');
    });
  });

  describe('Schema Verification', () => {
    it('should have users table with correct structure', async () => {
      const result = await db.execute<{ column_name: string }>(`
        SELECT column_name
        FROM information_schema.columns
        WHERE table_name = 'users'
        ORDER BY ordinal_position
      `);

      const columns = result.map((r) => r.column_name);
      expect(columns).toContain('id');
      expect(columns).toContain('email');
      expect(columns).toContain('password_hash');
      expect(columns).toContain('display_name');
      expect(columns).toContain('department');
      expect(columns).toContain('created_at');
    });

    it('should have folders table with correct structure', async () => {
      const result = await db.execute<{ column_name: string }>(`
        SELECT column_name
        FROM information_schema.columns
        WHERE table_name = 'folders'
        ORDER BY ordinal_position
      `);

      const columns = result.map((r) => r.column_name);
      expect(columns).toContain('id');
      expect(columns).toContain('name');
      expect(columns).toContain('parent_id');
      expect(columns).toContain('department');
      expect(columns).toContain('visibility');
      expect(columns).toContain('created_by');
      expect(columns).toContain('created_at');
    });

    it('should have documents table with correct structure', async () => {
      const result = await db.execute<{ column_name: string }>(`
        SELECT column_name
        FROM information_schema.columns
        WHERE table_name = 'documents'
        ORDER BY ordinal_position
      `);

      const columns = result.map((r) => r.column_name);
      expect(columns).toContain('id');
      expect(columns).toContain('title');
      expect(columns).toContain('content');
      expect(columns).toContain('folder_id');
      expect(columns).toContain('created_by');
      expect(columns).toContain('modified_by');
      expect(columns).toContain('view_count');
      expect(columns).toContain('created_at');
      expect(columns).toContain('updated_at');
    });
  });

  describe('Seed Data Verification', () => {
    it('should have admin user in database', async () => {
      const adminUsers = await db
        .select()
        .from(schema.users)
        .where(eq(schema.users.email, 'admin@simpleconf.local'));

      expect(adminUsers.length).toBe(1);
      expect(adminUsers[0].displayName).toBe('Admin User');
      expect(adminUsers[0].department).toBe('backend');
    });

    it('should have all department folders', async () => {
      const allFolders = await db.select().from(schema.folders);

      const expectedDepartments = ['Frontend', 'Backend', 'Sales', 'HR', 'Product'];
      const folderNames = allFolders.map((f) => f.name);

      for (const dept of expectedDepartments) {
        expect(folderNames).toContain(dept);
      }
    });

    it('should have department folders as root folders (no parent)', async () => {
      const rootFolders = await db
        .select()
        .from(schema.folders)
        .where(eq(schema.folders.parentId, null as unknown as string));

      expect(rootFolders.length).toBe(5);
    });
  });

  describe('Foreign Key Constraints', () => {
    it('should enforce folder.created_by references users.id', async () => {
      const fakeUserId = '00000000-0000-0000-0000-000000000000';

      await expect(
        db.insert(schema.folders).values({
          name: 'Test Folder',
          parentId: null,
          department: 'frontend',
          visibility: 'public',
          createdBy: fakeUserId,
        })
      ).rejects.toThrow();
    });

    it('should enforce document.folder_id references folders.id', async () => {
      const [adminUser] = await db
        .select()
        .from(schema.users)
        .where(eq(schema.users.email, 'admin@simpleconf.local'));

      const fakeFolderId = '00000000-0000-0000-0000-000000000000';

      await expect(
        db.insert(schema.documents).values({
          title: 'Test Document',
          content: 'Test content',
          folderId: fakeFolderId,
          createdBy: adminUser.id,
          viewCount: 0,
        })
      ).rejects.toThrow();
    });

    it('should cascade delete documents when folder is deleted', async () => {
      // Get admin user
      const [adminUser] = await db
        .select()
        .from(schema.users)
        .where(eq(schema.users.email, 'admin@simpleconf.local'));

      // Create a test folder
      const [testFolder] = await db
        .insert(schema.folders)
        .values({
          name: 'Cascade Test Folder',
          parentId: null,
          department: 'frontend',
          visibility: 'public',
          createdBy: adminUser.id,
        })
        .returning();

      // Create a document in that folder
      const [testDoc] = await db
        .insert(schema.documents)
        .values({
          title: 'Cascade Test Document',
          content: 'This document should be deleted with the folder',
          folderId: testFolder.id,
          createdBy: adminUser.id,
          viewCount: 0,
        })
        .returning();

      // Delete the folder
      await db.delete(schema.folders).where(eq(schema.folders.id, testFolder.id));

      // Verify document was also deleted
      const remainingDocs = await db
        .select()
        .from(schema.documents)
        .where(eq(schema.documents.id, testDoc.id));

      expect(remainingDocs.length).toBe(0);
    });
  });

  describe('CRUD Operations', () => {
    it('should create and retrieve a user', async () => {
      const passwordHash = await bcrypt.hash('testpassword', 10);

      const [newUser] = await db
        .insert(schema.users)
        .values({
          email: 'test@example.com',
          passwordHash,
          displayName: 'Test User',
          department: 'frontend',
        })
        .returning();

      expect(newUser.id).toBeDefined();
      expect(newUser.email).toBe('test@example.com');

      // Clean up
      await db.delete(schema.users).where(eq(schema.users.id, newUser.id));
    });

    it('should enforce unique email constraint', async () => {
      const passwordHash = await bcrypt.hash('testpassword', 10);

      // First insert should succeed
      const [user1] = await db
        .insert(schema.users)
        .values({
          email: 'unique-test@example.com',
          passwordHash,
          displayName: 'User 1',
          department: 'sales',
        })
        .returning();

      // Second insert with same email should fail
      await expect(
        db.insert(schema.users).values({
          email: 'unique-test@example.com',
          passwordHash,
          displayName: 'User 2',
          department: 'hr',
        })
      ).rejects.toThrow();

      // Clean up
      await db.delete(schema.users).where(eq(schema.users.id, user1.id));
    });
  });
});
