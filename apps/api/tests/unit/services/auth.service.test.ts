import { describe, it, expect, beforeEach, vi } from 'vitest';
import bcrypt from 'bcrypt';

describe('AuthService', () => {
  describe('hashPassword', () => {
    it('should produce a valid bcrypt hash', async () => {
      const password = 'testPassword123';
      const hash = await bcrypt.hash(password, 10);

      expect(hash).toBeDefined();
      expect(hash).not.toBe(password);
      expect(hash.startsWith('$2b$')).toBe(true);
    });

    it('should produce different hashes for same password', async () => {
      const password = 'testPassword123';
      const hash1 = await bcrypt.hash(password, 10);
      const hash2 = await bcrypt.hash(password, 10);

      expect(hash1).not.toBe(hash2);
    });
  });

  describe('verifyPassword', () => {
    it('should return true for correct password', async () => {
      const password = 'testPassword123';
      const hash = await bcrypt.hash(password, 10);
      const result = await bcrypt.compare(password, hash);

      expect(result).toBe(true);
    });

    it('should return false for incorrect password', async () => {
      const password = 'testPassword123';
      const wrongPassword = 'wrongPassword';
      const hash = await bcrypt.hash(password, 10);
      const result = await bcrypt.compare(wrongPassword, hash);

      expect(result).toBe(false);
    });
  });

  describe('password hashing cost factor', () => {
    it('should use cost factor of at least 10', async () => {
      const password = 'testPassword123';
      const hash = await bcrypt.hash(password, 10);

      // bcrypt hash format: $2b$XX$... where XX is the cost factor
      const costFactor = parseInt(hash.split('$')[2], 10);
      expect(costFactor).toBeGreaterThanOrEqual(10);
    });
  });
});
