# Tech Stack

This is the **DEFINITIVE** technology selection for SimpleConf. All development must use these exact versions.

| Category | Technology | Version | Purpose | Rationale |
|----------|------------|---------|---------|-----------|
| Frontend Language | TypeScript | 5.x | Type-safe frontend development | PRD NFR8 requirement |
| Frontend Framework | Next.js | 16.x | React framework with App Router | Existing v0.dev frontend |
| UI Component Library | shadcn/ui | Latest | Accessible UI primitives | Already configured |
| State Management | React Context + useState | Built-in | Local and shared state | Sufficient for app complexity |
| Backend Language | TypeScript | 5.x | Type-safe backend development | Shared types with frontend |
| Backend Framework | Fastify | 5.x | High-performance Node.js API | PRD specification |
| API Style | REST | OpenAPI 3.0 | Client-server communication | Simple, well-understood |
| Database | PostgreSQL | 16+ | Primary relational data store | PRD specification |
| Vector Extension | pgvector | 0.7+ | Semantic search embeddings | Native PostgreSQL integration |
| ORM | Drizzle ORM | Latest | Type-safe database access | Lightweight, TypeScript-native |
| Embeddings | @xenova/transformers | Latest | Local ML inference | Zero API cost |
| Authentication | JWT + bcrypt | - | Stateless auth tokens | PRD specification |
| Frontend Testing | Vitest + Testing Library | Latest | Unit and component tests | Fast, React Testing Library |
| Backend Testing | Vitest | Latest | Unit and integration tests | Consistent with frontend |
| E2E Testing | Playwright | Latest | End-to-end user flows | Cross-browser, reliable |
| Package Manager | pnpm | 9.x | Dependency management | Fast, good monorepo support |
| Process Manager | PM2 | Latest | Production process management | Auto-restart, logging |
| Reverse Proxy | Nginx | Latest | Traffic routing, SSL | Battle-tested, performant |
| CSS Framework | Tailwind CSS | 4.x | Utility-first styling | Already in frontend |
| Form Validation | Zod | 3.x | Schema validation (shared) | Already in frontend |
| Markdown Rendering | react-markdown | 10.x | Document display | Already in frontend |

---
