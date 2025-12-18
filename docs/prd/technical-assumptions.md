# Technical Assumptions

## Repository Structure: Monorepo

The project will use a **monorepo structure** with the following layout:
```
/
├── frontend/     # React application
├── backend/      # Node.js API server
├── shared/       # Shared TypeScript types and utilities
└── docs/         # Project documentation
```

Monorepo enables shared type definitions between frontend and backend, simplified dependency management, and atomic commits across the full stack.

## Service Architecture

**Monolith with Modular Design** — The MVP will be built as a single deployable unit with clear internal separation of concerns:

- **API Layer:** RESTful endpoints for documents, folders, users, search, and comments
- **Search Service Module:** Encapsulated semantic search logic (embeddings generation, vector queries)
- **Auth Module:** Basic authentication with JWT tokens
- **Data Access Layer:** PostgreSQL interactions abstracted for future service extraction

## Testing Requirements

**Unit + Integration Testing** with the following approach:

- **Unit Tests:** Core business logic, utility functions, data transformations
- **Integration Tests:** API endpoint testing with test database, search functionality verification
- **Manual Testing Convenience:** Seed scripts for populating test data, Postman/Insomnia collection for API exploration
- **E2E Tests:** Deferred to post-MVP; manual QA sufficient for initial release

## Additional Technical Assumptions and Requests

- **Frontend Framework:** React 18+ with TypeScript, using Vite as the build tool
- **UI Component Library:** shadcn/ui (Radix primitives + Tailwind CSS)
- **Backend Framework:** Node.js with Fastify for TypeScript support and performance
- **Database:** PostgreSQL 15+ with pgvector extension for semantic search
- **Embeddings:** Local Sentence Transformers via `@xenova/transformers` (all-MiniLM-L6-v2, 384 dimensions) — zero API costs
- **External Search Fallback:** DuckDuckGo Instant Answer API (free, no API key required)
- **Authentication:** JWT-based session management with bcrypt password hashing
- **Markdown Rendering:** react-markdown with syntax highlighting
- **Containerization:** Docker with docker-compose for local development
- **Hosting Target:** Cloud-agnostic containerized deployment (AWS ECS, GCP Cloud Run, or Azure Container Apps)
- **Logging:** Structured JSON logging with pino for observability
- **Environment Configuration:** dotenv for local; environment variables for production
