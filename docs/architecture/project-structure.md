# Project Structure

```
simple-conf/
├── .github/
│   └── workflows/
│       ├── ci.yaml                    # Test & lint on PR
│       └── deploy.yaml                # Deploy on main merge
├── apps/
│   ├── web/                           # Next.js frontend
│   │   ├── app/                       # App Router pages
│   │   ├── components/                # UI components
│   │   ├── lib/                       # API services layer (NEW)
│   │   │   ├── api/
│   │   │   │   ├── client.ts
│   │   │   │   └── services/
│   │   │   ├── contexts/
│   │   │   └── hooks/
│   │   ├── public/
│   │   ├── .env.local.example
│   │   └── package.json
│   │
│   └── api/                           # Fastify backend (NEW)
│       ├── src/
│       │   ├── index.ts
│       │   ├── app.ts
│       │   ├── config/
│       │   ├── plugins/
│       │   ├── middleware/
│       │   ├── modules/
│       │   ├── services/
│       │   ├── repositories/
│       │   └── db/
│       ├── drizzle/
│       ├── tests/
│       ├── .env.example
│       └── package.json
│
├── packages/
│   └── shared/                        # Shared types & schemas (NEW)
│       ├── src/
│       │   ├── types/
│       │   ├── schemas/
│       │   └── constants/
│       └── package.json
│
├── docs/
│   ├── prd.md
│   ├── front-end-spec.md
│   └── architecture.md
│
├── .env.example
├── docker-compose.yml
├── package.json
├── pnpm-workspace.yaml
├── ecosystem.config.js                # PM2 configuration
├── deploy.sh                          # Deployment script
└── README.md
```

## Workspace Configuration

```yaml
# pnpm-workspace.yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

```json
// package.json (root)
{
  "name": "simple-conf",
  "private": true,
  "scripts": {
    "dev": "pnpm run --parallel dev",
    "dev:web": "pnpm --filter @simpleconf/web dev",
    "dev:api": "pnpm --filter @simpleconf/api dev",
    "build": "pnpm run --parallel build",
    "test": "pnpm run --parallel test",
    "lint": "pnpm run --parallel lint",
    "db:migrate": "pnpm --filter @simpleconf/api db:migrate",
    "db:seed": "pnpm --filter @simpleconf/api db:seed",
    "db:reset": "pnpm --filter @simpleconf/api db:reset"
  },
  "engines": {
    "node": ">=20.0.0",
    "pnpm": ">=9.0.0"
  }
}
```

---
