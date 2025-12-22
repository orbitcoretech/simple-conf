import { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach } from 'vitest';
import { buildApp } from '../../src/app';
import type { FastifyInstance } from 'fastify';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { eq } from 'drizzle-orm';
import * as schema from '../../src/db/schema/index';

const DATABASE_URL =
  process.env.DATABASE_URL || 'postgresql://simpleconf:simpleconf@localhost:5432/simpleconf';

describe('Auth Integration Tests', () => {
  let app: FastifyInstance;
  let dbClient: ReturnType<typeof postgres>;
  let db: ReturnType<typeof drizzle<typeof schema>>;

  const testUserEmail = 'auth-test@example.com';
  const testUserPassword = 'testPassword123';

  beforeAll(async () => {
    app = await buildApp();
    await app.ready();

    dbClient = postgres(DATABASE_URL);
    db = drizzle(dbClient, { schema });
  });

  afterAll(async () => {
    await app.close();
    await dbClient.end();
  });

  beforeEach(async () => {
    // Clean up test user before each test
    await db.delete(schema.users).where(eq(schema.users.email, testUserEmail));
  });

  afterEach(async () => {
    // Clean up test user after each test
    await db.delete(schema.users).where(eq(schema.users.email, testUserEmail));
  });

  describe('POST /api/auth/register', () => {
    it('should create user and return without password', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/auth/register',
        payload: {
          email: testUserEmail,
          password: testUserPassword,
          displayName: 'Test User',
          department: 'frontend',
        },
      });

      expect(response.statusCode).toBe(201);

      const body = JSON.parse(response.body);
      expect(body.user).toBeDefined();
      expect(body.user.email).toBe(testUserEmail);
      expect(body.user.displayName).toBe('Test User');
      expect(body.user.department).toBe('frontend');
      expect(body.user.id).toBeDefined();
      expect(body.user.password).toBeUndefined();
      expect(body.user.passwordHash).toBeUndefined();
    });

    it('should return 409 for duplicate email', async () => {
      // First registration
      await app.inject({
        method: 'POST',
        url: '/api/auth/register',
        payload: {
          email: testUserEmail,
          password: testUserPassword,
          displayName: 'Test User',
          department: 'frontend',
        },
      });

      // Second registration with same email
      const response = await app.inject({
        method: 'POST',
        url: '/api/auth/register',
        payload: {
          email: testUserEmail,
          password: testUserPassword,
          displayName: 'Another User',
          department: 'backend',
        },
      });

      expect(response.statusCode).toBe(409);

      const body = JSON.parse(response.body);
      expect(body.error.code).toBe('CONFLICT');
    });

    it('should return 400 for invalid email format', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/auth/register',
        payload: {
          email: 'invalid-email',
          password: testUserPassword,
          displayName: 'Test User',
          department: 'frontend',
        },
      });

      expect(response.statusCode).toBe(400);

      const body = JSON.parse(response.body);
      expect(body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should return 400 for password less than 8 characters', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/auth/register',
        payload: {
          email: testUserEmail,
          password: 'short',
          displayName: 'Test User',
          department: 'frontend',
        },
      });

      expect(response.statusCode).toBe(400);

      const body = JSON.parse(response.body);
      expect(body.error.code).toBe('VALIDATION_ERROR');
      expect(body.error.details.password).toBeDefined();
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Create test user for login tests
      await app.inject({
        method: 'POST',
        url: '/api/auth/register',
        payload: {
          email: testUserEmail,
          password: testUserPassword,
          displayName: 'Test User',
          department: 'frontend',
        },
      });
    });

    it('should return JWT for valid credentials', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/auth/login',
        payload: {
          email: testUserEmail,
          password: testUserPassword,
        },
      });

      expect(response.statusCode).toBe(200);

      const body = JSON.parse(response.body);
      expect(body.token).toBeDefined();
      expect(typeof body.token).toBe('string');
      expect(body.user).toBeDefined();
      expect(body.user.email).toBe(testUserEmail);
      expect(body.user.password).toBeUndefined();
      expect(body.user.passwordHash).toBeUndefined();
    });

    it('should return 401 for invalid password', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/auth/login',
        payload: {
          email: testUserEmail,
          password: 'wrongPassword',
        },
      });

      expect(response.statusCode).toBe(401);

      const body = JSON.parse(response.body);
      expect(body.error.code).toBe('UNAUTHORIZED');
    });

    it('should return 401 for non-existent email', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/auth/login',
        payload: {
          email: 'nonexistent@example.com',
          password: testUserPassword,
        },
      });

      expect(response.statusCode).toBe(401);

      const body = JSON.parse(response.body);
      expect(body.error.code).toBe('UNAUTHORIZED');
    });
  });

  describe('GET /api/auth/me', () => {
    let validToken: string;

    beforeEach(async () => {
      // Create and login test user
      await app.inject({
        method: 'POST',
        url: '/api/auth/register',
        payload: {
          email: testUserEmail,
          password: testUserPassword,
          displayName: 'Test User',
          department: 'frontend',
        },
      });

      const loginResponse = await app.inject({
        method: 'POST',
        url: '/api/auth/login',
        payload: {
          email: testUserEmail,
          password: testUserPassword,
        },
      });

      const loginBody = JSON.parse(loginResponse.body);
      validToken = loginBody.token;
    });

    it('should return user for valid token', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/auth/me',
        headers: {
          Authorization: `Bearer ${validToken}`,
        },
      });

      expect(response.statusCode).toBe(200);

      const body = JSON.parse(response.body);
      expect(body.user).toBeDefined();
      expect(body.user.email).toBe(testUserEmail);
      expect(body.user.displayName).toBe('Test User');
    });

    it('should return 401 for missing token', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/auth/me',
      });

      expect(response.statusCode).toBe(401);

      const body = JSON.parse(response.body);
      expect(body.error.code).toBe('UNAUTHORIZED');
    });

    it('should return 401 for invalid token', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/auth/me',
        headers: {
          Authorization: 'Bearer invalid-token',
        },
      });

      expect(response.statusCode).toBe(401);

      const body = JSON.parse(response.body);
      expect(body.error.code).toBe('UNAUTHORIZED');
    });

    it('should return 401 for malformed Authorization header', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/auth/me',
        headers: {
          Authorization: 'NotBearer token',
        },
      });

      expect(response.statusCode).toBe(401);
    });
  });
});
