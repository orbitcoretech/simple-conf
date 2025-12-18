# SimpleConf

Internal knowledge base with conversational search.

## Prerequisites

- **Node.js** >= 20.0.0
- **pnpm** >= 9.0.0
- **Docker** and Docker Compose

## Initial Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd simple-conf
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Setup environment variables**

   ```bash
   # Root environment
   cp .env.example .env

   # API environment
   cp apps/api/.env.example apps/api/.env

   # Web environment
   cp apps/web/.env.local.example apps/web/.env.local
   ```

4. **Start PostgreSQL**

   ```bash
   docker compose up -d postgres
   ```

5. **Verify PostgreSQL is running**

   ```bash
   docker compose ps
   ```

## Development

### Start all services

```bash
pnpm dev
```

### Start individual services

```bash
# Frontend only (port 3000)
pnpm dev:web

# API only (port 3001)
pnpm dev:api
```

### Build all packages

```bash
pnpm build
```

### Run tests

```bash
pnpm test
```

### Run linting

```bash
pnpm lint
```

## Project Structure

```
simple-conf/
├── apps/
│   ├── web/           # Next.js frontend (port 3000)
│   └── api/           # Fastify backend (port 3001)
├── packages/
│   └── shared/        # Shared types and utilities
├── docs/              # Documentation
└── docker-compose.yml # Local development services
```

## Services

| Service    | Port | Description         |
| ---------- | ---- | ------------------- |
| Frontend   | 3000 | Next.js application |
| API        | 3001 | Fastify REST API    |
| PostgreSQL | 5432 | Database            |

## Database Commands

```bash
# Run migrations
pnpm db:migrate

# Seed database
pnpm db:seed

# Reset database
pnpm db:reset
```

## Health Check

Verify the API is running:

```bash
curl http://localhost:3001/health
# Response: {"status":"ok"}
```
