# Coding Standards

## Critical Rules

| Rule | Description |
|------|-------------|
| Type Sharing | Always import from `@simpleconf/shared` |
| API Calls | Use service layer, never fetch directly |
| Environment | Access via `env.ts`, never `process.env` |
| Database | Use repository pattern |
| Authentication | Always use `authenticate` middleware |

## Naming Conventions

| Element | Convention | Example |
|---------|------------|---------|
| Components | PascalCase | `DocumentViewPage.tsx` |
| Hooks | camelCase with `use` | `useAuth.ts` |
| API Routes | kebab-case | `/api/documents/:id` |
| Database Tables | snake_case | `document_views` |
| Types | PascalCase | `DocumentWithMeta` |

---
