# Testing Strategy

## Test Structure

```
apps/api/tests/
├── unit/
│   ├── services/
│   └── utils/
└── integration/
    ├── auth.test.ts
    ├── documents.test.ts
    └── search.test.ts

apps/web/__tests__/
├── components/
└── lib/
```

## Test Commands

```bash
pnpm test              # Run all tests
pnpm test:watch        # Watch mode
pnpm test:coverage     # With coverage
pnpm test:e2e          # E2E tests
```

---
