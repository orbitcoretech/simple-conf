# Development Workflow

## Prerequisites

```bash
node --version    # v20.0.0 or higher
pnpm --version    # v9.0.0 or higher
docker --version  # For local PostgreSQL
```

## Initial Setup

```bash
# Clone and install
git clone https://github.com/your-org/simple-conf.git
cd simple-conf
pnpm install

# Setup environment
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.local.example apps/web/.env.local

# Start PostgreSQL
docker compose up -d postgres

# Run migrations and seed
pnpm db:migrate
pnpm db:seed

# Start development
pnpm dev
```

## Development Commands

```bash
# Start all services
pnpm dev

# Start individual services
pnpm dev:web          # Frontend on :3000
pnpm dev:api          # Backend on :3001

# Database operations
pnpm db:generate      # Generate migration
pnpm db:migrate       # Apply migrations
pnpm db:seed          # Seed data
pnpm db:reset         # Reset database

# Testing
pnpm test             # Run all tests
pnpm test:watch       # Watch mode

# Code quality
pnpm lint             # Lint all packages
pnpm typecheck        # Type check
```

## Environment Variables

**apps/api/.env:**
```bash
DATABASE_URL=postgresql://simpleconf:simpleconf@localhost:5432/simpleconf
JWT_SECRET=your-secret-key-at-least-32-characters
CORS_ORIGIN=http://localhost:3000
PORT=3001
NODE_ENV=development
LOG_LEVEL=debug
```

**apps/web/.env.local:**
```bash
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

---
