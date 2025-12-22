import { eq } from 'drizzle-orm';
import type { Database } from '../db/index.js';
import { users, type NewUserRecord, type UserRecord } from '../db/schema/index.js';
import type { User, UserWithPassword, Department } from '@simpleconf/shared';

export interface CreateUserData {
  email: string;
  passwordHash: string;
  displayName: string;
  department: Department;
}

function mapToUser(record: UserRecord): User {
  return {
    id: record.id,
    email: record.email,
    displayName: record.displayName,
    department: record.department as Department,
    createdAt: record.createdAt,
  };
}

function mapToUserWithPassword(record: UserRecord): UserWithPassword {
  return {
    ...mapToUser(record),
    passwordHash: record.passwordHash,
  };
}

export class UserRepository {
  constructor(private db: Database) {}

  async findByEmail(email: string): Promise<UserWithPassword | null> {
    const result = await this.db.select().from(users).where(eq(users.email, email)).limit(1);

    if (result.length === 0) {
      return null;
    }

    return mapToUserWithPassword(result[0]);
  }

  async findById(id: string): Promise<User | null> {
    const result = await this.db.select().from(users).where(eq(users.id, id)).limit(1);

    if (result.length === 0) {
      return null;
    }

    return mapToUser(result[0]);
  }

  async create(data: CreateUserData): Promise<User> {
    const newUser: NewUserRecord = {
      email: data.email,
      passwordHash: data.passwordHash,
      displayName: data.displayName,
      department: data.department,
    };

    const result = await this.db.insert(users).values(newUser).returning();

    return mapToUser(result[0]);
  }

  async emailExists(email: string): Promise<boolean> {
    const result = await this.db.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1);

    return result.length > 0;
  }
}
