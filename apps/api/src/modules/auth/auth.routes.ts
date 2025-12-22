import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import {
  registerSchema,
  loginSchema,
  type RegisterInput,
  type LoginInput,
  type RegisterResponse,
  type LoginResponse,
  type MeResponse,
  type ApiErrorResponse,
} from '@simpleconf/shared';
import { AuthService } from '../../services/auth.service.js';
import { authenticate } from '../../middleware/authenticate.js';
import { UserRepository } from '../../repositories/user.repository.js';

export async function authRoutes(fastify: FastifyInstance): Promise<void> {
  const authService = new AuthService(fastify);
  const userRepository = new UserRepository(fastify.db);

  // POST /auth/register
  fastify.post<{
    Body: RegisterInput;
    Reply: RegisterResponse | ApiErrorResponse;
  }>('/auth/register', async (request: FastifyRequest<{ Body: RegisterInput }>, reply: FastifyReply) => {
    const validation = registerSchema.safeParse(request.body);

    if (!validation.success) {
      const details: Record<string, string> = {};
      for (const issue of validation.error.issues) {
        details[issue.path.join('.')] = issue.message;
      }

      return reply.status(400).send({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid input',
          details,
        },
      });
    }

    try {
      const user = await authService.register(validation.data);
      return reply.status(201).send({ user });
    } catch (err) {
      const error = err as Error & { code?: string };
      if (error.code === 'CONFLICT') {
        return reply.status(409).send({
          error: {
            code: 'CONFLICT',
            message: error.message,
          },
        });
      }
      throw err;
    }
  });

  // POST /auth/login
  fastify.post<{
    Body: LoginInput;
    Reply: LoginResponse | ApiErrorResponse;
  }>('/auth/login', async (request: FastifyRequest<{ Body: LoginInput }>, reply: FastifyReply) => {
    const validation = loginSchema.safeParse(request.body);

    if (!validation.success) {
      const details: Record<string, string> = {};
      for (const issue of validation.error.issues) {
        details[issue.path.join('.')] = issue.message;
      }

      return reply.status(400).send({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid input',
          details,
        },
      });
    }

    try {
      const result = await authService.login(validation.data);
      return reply.send(result);
    } catch (err) {
      const error = err as Error & { code?: string };
      if (error.code === 'UNAUTHORIZED') {
        return reply.status(401).send({
          error: {
            code: 'UNAUTHORIZED',
            message: error.message,
          },
        });
      }
      throw err;
    }
  });

  // GET /auth/me
  fastify.get<{
    Reply: MeResponse | ApiErrorResponse;
  }>('/auth/me', { preHandler: [authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
    const user = await userRepository.findById(request.user.id);

    if (!user) {
      return reply.status(401).send({
        error: {
          code: 'UNAUTHORIZED',
          message: 'User not found',
        },
      });
    }

    return reply.send({ user });
  });
}
