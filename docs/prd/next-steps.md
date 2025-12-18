# Next Steps

## UX Expert Prompt

> Review the SimpleConf PRD (`docs/prd.md`) and create UI/UX specifications. Focus on:
> - Wireframes for the 6 core screens (Home/Search, Results, Folder Browse, Document View, Editor, Login)
> - Search-first interaction design with prominent query bar
> - Folder tree with access indicators (🔒/🔓) and document preview panel
> - Mobile-responsive considerations for desktop-primary design
> - WCAG AA accessibility compliance
> - Component library alignment with shadcn/ui

## Architect Prompt

> Review the SimpleConf PRD (`docs/prd.md`) and create the technical architecture document. Key considerations:
> - Monorepo structure: `/frontend`, `/backend`, `/shared`
> - Tech stack: React + Vite, Fastify, PostgreSQL + pgvector
> - Local embeddings via `@xenova/transformers` (all-MiniLM-L6-v2, 384 dimensions)
> - JWT authentication with bcrypt
> - Docker containerization for development and deployment
> - Database schema for users, folders, documents, comments, document_views
> - Vector similarity search implementation with pgvector
> - API design following RESTful conventions

