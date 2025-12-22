import bcrypt from 'bcrypt';
import type { FastifyInstance } from 'fastify';
import type { User } from '@simpleconf/shared';
import type { RegisterInput, LoginInput } from '@simpleconf/shared';
import { UserRepository } from '../repositories/user.repository.js';

const BCRYPT_COST_FACTOR = 10;

export interface LoginResult {
  token: string;
  user: User;
}

export class AuthService {
  private userRepository: UserRepository;

  constructor(private app: FastifyInstance) {
    this.userRepository = new UserRepository(app.db);
  }

  async register(data: RegisterInput): Promise<User> {
    const emailExists = await this.userRepository.emailExists(data.email);

    if (emailExists) {
      const error = new Error('Email already registered');
      (error as Error & { code: string }).code = 'CONFLICT';
      throw error;
    }

    const passwordHash = await this.hashPassword(data.password);

    return this.userRepository.create({
      email: data.email,
      passwordHash,
      displayName: data.displayName,
      department: data.department,
    });
  }

  async login(data: LoginInput): Promise<LoginResult> {
    const user = await this.userRepository.findByEmail(data.email);

    if (!user) {
      const error = new Error('Invalid email or password');
      (error as Error & { code: string }).code = 'UNAUTHORIZED';
      throw error;
    }

    const isValidPassword = await this.verifyPassword(data.password, user.passwordHash);

    if (!isValidPassword) {
      const error = new Error('Invalid email or password');
      (error as Error & { code: string }).code = 'UNAUTHORIZED';
      throw error;
    }

    const token = this.app.jwt.sign({
      id: user.id,
      email: user.email,
      department: user.department,
    });

    const { passwordHash: _, ...userWithoutPassword } = user;

    return {
      token,
      user: userWithoutPassword,
    };
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, BCRYPT_COST_FACTOR);
  }

  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
