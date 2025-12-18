# SimpleConf Fullstack Architecture Document

## Introduction

This document outlines the complete fullstack architecture for **SimpleConf**, including backend systems, frontend implementation, and their integration. It serves as the single source of truth for AI-driven development, ensuring consistency across the entire technology stack.

This unified approach combines what would traditionally be separate backend and frontend architecture documents, streamlining the development process for modern fullstack applications where these concerns are increasingly intertwined.

### Starter Template / Existing Project

**Existing Frontend:** The project leverages a v0.dev-generated Next.js application located at `/app-shell-layout/` with the following pre-configured choices:

| Aspect | Pre-configured Choice |
|--------|----------------------|
| Framework | Next.js 16 (App Router) |
| React | React 19 |
| UI Library | shadcn/ui (Radix + Tailwind CSS 4) |
| Styling | Tailwind CSS 4 with PostCSS |
| Forms | react-hook-form + zod |
| Markdown | react-markdown + react-syntax-highlighter |
| State | React Context + useState |
| Toasts | sonner |

**Architectural Constraints from Frontend:**
- Must integrate with separate Fastify backend via REST API
- Frontend expects REST-like endpoints (based on component structure)
- Authentication UI already built — backend must match expected auth flow

### Change Log

| Date | Version | Description | Author |
|------|---------|-------------|--------|
| 2024-12-18 | 1.0 | Initial architecture document | Winston (Architect Agent) |

---

## High Level Architecture

### Technical Summary

SimpleConf follows a **decoupled fullstack architecture** with a Next.js frontend communicating with a standalone Fastify backend via REST APIs. The backend handles all business logic, authentication (JWT), and data persistence in PostgreSQL with pgvector for semantic search. Local embedding generation via `@xenova/transformers` eliminates external API costs. The system deploys on a single Azure VM with Nginx as reverse proxy and PM2 for process management. This separation enables clean concerns while keeping deployment simple.

### Platform and Infrastructure Choice

**Platform:** Single Azure VM with Nginx reverse proxy

**Key Services:**

| Service | Technology | Purpose |
|---------|------------|---------|
| Frontend | Next.js on PM2 | React application server |
| Backend API | Fastify on PM2 | REST API server |
| Database | PostgreSQL 16 + pgvector | Primary data store + vector search |
| Reverse Proxy | Nginx | Route traffic, SSL termination |
| Process Manager | PM2 | Keep Node processes alive |

**Deployment Region:** Single Azure VM (user's existing infrastructure)

### Repository Structure

**Structure:** Monorepo with separate packages

**Monorepo Tool:** pnpm workspaces

**Package Organization:**

```
simple-conf/
├── apps/
│   ├── web/          # Next.js frontend (existing v0.dev code)
│   └── api/          # Fastify backend
├── packages/
│   └── shared/       # Shared TypeScript types
└── docs/             # Project documentation
```

### High Level Architecture Diagram

```mermaid
graph TB
    subgraph "Client Layer"
        Browser[Web Browser]
    end

    subgraph "Azure VM"
        Nginx[Nginx<br/>:80/:443]

        subgraph "PM2 Process Manager"
            NextJS[Next.js App<br/>:3000]
            API[Fastify API Server<br/>:3001]
        end

        subgraph "Backend Modules"
            AuthMod[Auth Module]
            SearchMod[Search Module]
            DocMod[Document Module]
        end

        PG[(PostgreSQL 16<br/>+ pgvector)]
        Embeddings[Local Embeddings<br/>all-MiniLM-L6-v2]
    end

    subgraph "External"
        DDG[DuckDuckGo API<br/>External Fallback]
    end

    Browser -->|HTTPS| Nginx
    Nginx -->|/api/*| API
    Nginx -->|/*| NextJS
    API --> AuthMod
    API --> SearchMod
    API --> DocMod
    AuthMod --> PG
    DocMod --> PG
    SearchMod --> PG
    SearchMod --> Embeddings
    SearchMod -.->|Fallback| DDG
```

### Architectural Patterns

- **Decoupled Frontend/Backend:** Next.js serves UI, Fastify serves API — independent processes, clear contracts via REST
  _Rationale:_ Preserves existing frontend, enables independent scaling, follows PRD monolith-with-separation approach

- **Repository Pattern:** Data access abstracted behind repository classes (UserRepository, DocumentRepository, etc.)
  _Rationale:_ Testability, future database migration flexibility, clean separation from route handlers

- **Module-based Backend:** Fastify plugins for Auth, Documents, Search, Comments as encapsulated modules
  _Rationale:_ Clear boundaries, potential future service extraction per PRD NFR7

- **JWT Stateless Auth:** Token-based authentication with no server-side sessions
  _Rationale:_ Scalability, simplicity, standard approach for REST APIs

- **Local Embedding Pipeline:** Document embeddings generated on-server using `@xenova/transformers`
  _Rationale:_ Zero external API costs, fast inference (~50-200ms), privacy (no data leaves server)

---

## Tech Stack

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

## Data Models

### Summary of Models

| Model | Purpose | Key Fields |
|-------|---------|------------|
| **User** | Authenticated users | id, email, passwordHash, displayName, department |
| **Folder** | Hierarchical organization | id, name, parentId, department, visibility |
| **Document** | Markdown content + metadata | id, title, content, folderId, viewCount, embedding |
| **Comment** | Document feedback | id, documentId, userId, content |
| **DocumentView** | Deduplication tracking only | documentId, userId, viewedAt (composite PK) |

### User

```typescript
// packages/shared/src/types/user.ts

export enum Department {
  FRONTEND = 'frontend',
  BACKEND = 'backend',
  SALES = 'sales',
  HR = 'hr',
  PRODUCT = 'product',
}

export interface User {
  id: string;
  email: string;
  displayName: string;
  department: Department;
  createdAt: Date;
}

// Backend-only, never sent to frontend
export interface UserWithPassword extends User {
  passwordHash: string;
}

// For API responses (excludes sensitive data)
export type PublicUser = Pick<User, 'id' | 'displayName' | 'department'>;
```

### Folder

```typescript
// packages/shared/src/types/folder.ts

export type FolderVisibility = 'public' | 'department';

export interface Folder {
  id: string;
  name: string;
  parentId: string | null;
  department: Department | null;
  visibility: FolderVisibility;
  createdBy: string;
  createdAt: Date;
}

export interface FolderWithMeta extends Folder {
  documentCount: number;
  isAccessible: boolean;
  children?: FolderWithMeta[];
}

export interface FolderTreeNode {
  id: string;
  name: string;
  parentId: string | null;
  visibility: FolderVisibility;
  department: Department | null;
  documentCount: number;
  isAccessible: boolean;
  children: FolderTreeNode[];
}
```

### Document

```typescript
// packages/shared/src/types/document.ts

export interface Document {
  id: string;
  title: string;
  content: string;
  folderId: string;
  createdBy: string;
  modifiedBy: string | null;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface DocumentWithMeta extends Document {
  commentCount: number;
  createdByUser: PublicUser;
  modifiedByUser: PublicUser | null;
  folderPath: string;
}

export interface DocumentSummary {
  id: string;
  title: string;
  folderId: string;
  folderPath: string;
  createdBy: PublicUser;
  updatedAt: Date;
  viewCount: number;
  commentCount: number;
}

export interface SearchResult {
  document: DocumentSummary;
  snippet: string;
  similarityScore: number;
  matchHighlights: string[];
}
```

### Comment

```typescript
// packages/shared/src/types/comment.ts

export interface Comment {
  id: string;
  documentId: string;
  userId: string;
  content: string;
  createdAt: Date;
}

export interface CommentWithAuthor extends Comment {
  author: PublicUser;
}
```

### DocumentView

```typescript
// packages/shared/src/types/document-view.ts

// Used only for 30-minute deduplication
// Composite primary key: (documentId, userId)
export interface DocumentView {
  documentId: string;
  userId: string;
  viewedAt: Date;
}
```

### Entity Relationship Diagram

```mermaid
erDiagram
    USER ||--o{ DOCUMENT : creates
    USER ||--o{ COMMENT : writes
    USER ||--o{ DOCUMENT_VIEW : tracks

    FOLDER ||--o{ FOLDER : contains
    FOLDER ||--o{ DOCUMENT : contains

    DOCUMENT ||--o{ COMMENT : has
    DOCUMENT ||--o{ DOCUMENT_VIEW : deduplicates

    USER {
        uuid id PK
        varchar email UK
        varchar password_hash
        varchar display_name
        enum department
        timestamptz created_at
    }

    FOLDER {
        uuid id PK
        varchar name
        uuid parent_id FK
        enum department
        enum visibility
        uuid created_by FK
        timestamptz created_at
    }

    DOCUMENT {
        uuid id PK
        varchar title
        text content
        uuid folder_id FK
        uuid created_by FK
        uuid modified_by FK
        int view_count
        vector embedding
        timestamptz indexed_at
        timestamptz created_at
        timestamptz updated_at
    }

    COMMENT {
        uuid id PK
        uuid document_id FK
        uuid user_id FK
        text content
        timestamptz created_at
    }

    DOCUMENT_VIEW {
        uuid document_id PK_FK
        uuid user_id PK_FK
        timestamptz viewed_at
    }
```

---

## API Specification

### Base Configuration

- **Base URL (Development):** `http://localhost:3001/api`
- **Base URL (Production):** `https://simpleconf.yourdomain.com/api`
- **Authentication:** Bearer token in `Authorization` header

### Authentication Endpoints

| Method | Endpoint | Purpose | Auth Required |
|--------|----------|---------|---------------|
| POST | `/auth/register` | Create new user account | No |
| POST | `/auth/login` | Authenticate and get JWT | No |
| GET | `/auth/me` | Get current user profile | Yes |

```typescript
// POST /auth/register
interface RegisterRequest {
  email: string;
  password: string;      // Min 8 characters
  displayName: string;
  department: Department;
}

// POST /auth/login
interface LoginRequest {
  email: string;
  password: string;
}
interface LoginResponse {
  token: string;         // JWT, expires in 24h
  user: User;
}

// GET /auth/me
interface MeResponse {
  user: User;
}
```

### Folder Endpoints

| Method | Endpoint | Purpose | Auth Required |
|--------|----------|---------|---------------|
| GET | `/folders` | Get folder tree for current user | Yes |
| GET | `/folders/:id` | Get folder details with contents | Yes |
| POST | `/folders` | Create new folder | Yes |

```typescript
// GET /folders
interface FoldersResponse {
  folders: FolderTreeNode[];
}

// GET /folders/:id
interface FolderDetailResponse {
  folder: Folder;
  breadcrumbs: { id: string; name: string }[];
  subfolders: FolderWithMeta[];
  documents: DocumentSummary[];
}

// POST /folders
interface CreateFolderRequest {
  name: string;
  parentId: string | null;
}
```

### Document Endpoints

| Method | Endpoint | Purpose | Auth Required |
|--------|----------|---------|---------------|
| GET | `/documents/:id` | Get full document (increments view) | Yes |
| POST | `/documents` | Create new document | Yes |
| PUT | `/documents/:id` | Update document | Yes (owner) |
| DELETE | `/documents/:id` | Delete document | Yes (owner) |
| GET | `/documents/popular` | Top 5 documents by views | Yes |

```typescript
// GET /documents/:id
interface DocumentResponse {
  document: DocumentWithMeta;
}

// POST /documents
interface CreateDocumentRequest {
  title: string;
  content: string;
  folderId: string;
}

// PUT /documents/:id
interface UpdateDocumentRequest {
  title?: string;
  content?: string;
}
```

### Search Endpoints

| Method | Endpoint | Purpose | Auth Required |
|--------|----------|---------|---------------|
| POST | `/search` | Semantic search with optional external fallback | Yes |

```typescript
// POST /search
interface SearchRequest {
  query: string;
  limit?: number;           // Default: 10, max: 50
  internalOnly?: boolean;   // Default: true
}

interface SearchResponse {
  results: SearchResult[];
  totalCount: number;
  externalResults?: ExternalSearchResult[];
}

interface ExternalSearchResult {
  title: string;
  url: string;
  snippet: string;
  source: string;
}
```

### Comment Endpoints

| Method | Endpoint | Purpose | Auth Required |
|--------|----------|---------|---------------|
| GET | `/documents/:id/comments` | List comments for document | Yes |
| POST | `/documents/:id/comments` | Add comment | Yes |
| DELETE | `/documents/:id/comments/:commentId` | Delete comment | Yes (author) |

```typescript
// GET /documents/:id/comments
interface CommentsResponse {
  comments: CommentWithAuthor[];
}

// POST /documents/:id/comments
interface CreateCommentRequest {
  content: string;
}
```

### Utility Endpoints

| Method | Endpoint | Purpose | Auth Required |
|--------|----------|---------|---------------|
| GET | `/health` | Health check | No |

### Error Response Format

```typescript
interface ApiError {
  error: {
    code: string;           // e.g., "VALIDATION_ERROR", "NOT_FOUND"
    message: string;        // Human-readable message
    details?: Record<string, string>;  // Field-specific errors
  }
}
```

---

## Database Schema

### Database Setup

```sql
-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgvector";
```

### Users Table

```sql
CREATE TYPE department AS ENUM (
  'frontend',
  'backend',
  'sales',
  'hr',
  'product'
);

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  display_name VARCHAR(100) NOT NULL,
  department department NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
```

### Folders Table

```sql
CREATE TYPE folder_visibility AS ENUM ('public', 'department');

CREATE TABLE folders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  parent_id UUID REFERENCES folders(id) ON DELETE CASCADE,
  department department,
  visibility folder_visibility NOT NULL DEFAULT 'public',
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(parent_id, name)
);

CREATE INDEX idx_folders_parent ON folders(parent_id);
CREATE INDEX idx_folders_department ON folders(department);
```

### Documents Table

```sql
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(500) NOT NULL,
  content TEXT NOT NULL,
  folder_id UUID NOT NULL REFERENCES folders(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES users(id),
  modified_by UUID REFERENCES users(id),
  view_count INTEGER NOT NULL DEFAULT 0,
  embedding vector(384),
  indexed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_documents_folder ON documents(folder_id);
CREATE INDEX idx_documents_view_count ON documents(view_count DESC);
CREATE INDEX idx_documents_updated ON documents(updated_at DESC);

-- Vector similarity search index
CREATE INDEX idx_documents_embedding ON documents
  USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);
```

### Comments Table

```sql
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  CONSTRAINT comments_content_not_empty CHECK (length(trim(content)) > 0)
);

CREATE INDEX idx_comments_document ON comments(document_id, created_at);
```

### Document Views Table

```sql
CREATE TABLE document_views (
  document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  PRIMARY KEY (document_id, user_id)
);

CREATE INDEX idx_document_views_lookup ON document_views(document_id, user_id, viewed_at);
```

### Key Queries

**Vector Similarity Search:**
```sql
SELECT
  d.id, d.title, d.content, d.view_count,
  1 - (d.embedding <=> $1) as similarity_score
FROM documents d
JOIN folders f ON d.folder_id = f.id
WHERE
  d.embedding IS NOT NULL
  AND (f.visibility = 'public' OR f.department = $2)
  AND 1 - (d.embedding <=> $1) > 0.3
ORDER BY d.embedding <=> $1
LIMIT $3;
```

**View Tracking with Deduplication:**
```sql
WITH last_view AS (
  INSERT INTO document_views (document_id, user_id, viewed_at)
  VALUES ($1, $2, NOW())
  ON CONFLICT (document_id, user_id)
  DO UPDATE SET viewed_at = NOW()
  RETURNING (xmax = 0) as is_new
)
UPDATE documents
SET view_count = view_count + 1
WHERE id = $1
  AND (SELECT is_new FROM last_view);
```

---

## Components

### Frontend Components (Existing)

Located in `/apps/web/components/`:

| Category | Components |
|----------|------------|
| Layout | AppShell, Header, Sidebar, UserMenu |
| Home | HeroSearch, RecentSearches, PopularDocuments |
| Auth | LoginForm, RegisterForm, AuthLayout |
| Folder | FolderTree, DocumentList, DocumentPreview, Breadcrumbs |
| Document | DocumentViewPage, MetadataBar, MarkdownRenderer, CommentsSection |
| Search | SearchResultCard, ExternalResultCard |
| Editor | MarkdownEditor, EditorPreview |

### Frontend Services Layer (New)

Located in `/apps/web/lib/`:

| File | Purpose |
|------|---------|
| `api/client.ts` | Base API client with auth headers |
| `api/services/auth.ts` | Login, register, getMe |
| `api/services/documents.ts` | Document CRUD, popular docs |
| `api/services/folders.ts` | Folder tree, folder contents |
| `api/services/search.ts` | Semantic search |
| `api/services/comments.ts` | Comment CRUD |
| `contexts/auth-context.tsx` | Auth state management |
| `components/protected-route.tsx` | Route protection HOC |

### Backend Modules (New)

Located in `/apps/api/src/modules/`:

| Module | Responsibility |
|--------|----------------|
| `auth/` | User registration, login, JWT management |
| `folders/` | Folder CRUD, tree structure, access control |
| `documents/` | Document CRUD, view tracking, embedding generation |
| `search/` | Semantic search, external fallback |
| `comments/` | Comment CRUD |

### Backend Services

| Service | Responsibility |
|---------|----------------|
| `embedding.service.ts` | Generate 384-dimension vectors using local model |
| `external-search.service.ts` | DuckDuckGo API fallback |

---

## External APIs

### DuckDuckGo Instant Answer API

- **Purpose:** External search fallback when internal documents don't match
- **Base URL:** `https://api.duckduckgo.com/`
- **Authentication:** None required (free)
- **Rate Limits:** Recommend max 1 req/s, implement throttling

**Usage:**
```
GET https://api.duckduckgo.com/?q={query}&format=json&no_html=1
```

**Integration Notes:**
- Only called when `internalOnly: false` AND internal results < 3
- Timeout: 3 seconds (fail gracefully)
- Cache responses for 15 minutes

### No Other External APIs

| Potential Service | Decision | Rationale |
|-------------------|----------|-----------|
| OpenAI / Embeddings API | Not used | Local `@xenova/transformers` instead |
| Pinecone / Vector DB | Not used | pgvector in PostgreSQL |
| Auth0 / Clerk | Not used | Custom JWT auth |

---

## Core Workflows

### Natural Language Search Flow

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant API
    participant EmbedService
    participant PostgreSQL
    participant DuckDuckGo

    User->>Frontend: Types search query
    Frontend->>API: POST /api/search
    API->>EmbedService: generateEmbedding(query)
    EmbedService-->>API: number[384]
    API->>PostgreSQL: Vector similarity search
    PostgreSQL-->>API: Matching documents

    alt Internal results < 3 AND !internalOnly
        API->>DuckDuckGo: GET /?q=...
        DuckDuckGo-->>API: External results
    end

    API-->>Frontend: SearchResponse
    Frontend-->>User: Display results
```

### Document View with View Tracking

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant API
    participant PostgreSQL

    User->>Frontend: Click document
    Frontend->>API: GET /api/documents/:id
    API->>PostgreSQL: Check folder access
    API->>PostgreSQL: Fetch document
    API->>PostgreSQL: Check last view time

    alt No prior view OR > 30 min ago
        API->>PostgreSQL: UPSERT view + increment counter
    end

    API-->>Frontend: DocumentWithMeta
    Frontend-->>User: Render document
```

### Document Creation with Embedding

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant API
    participant EmbedService
    participant PostgreSQL

    User->>Frontend: Save document
    Frontend->>API: POST /api/documents
    API->>API: Validate request
    API->>PostgreSQL: Check folder access
    API->>EmbedService: generateEmbedding(title + content)
    EmbedService-->>API: number[384]
    API->>PostgreSQL: INSERT document with embedding
    API-->>Frontend: Created document
    Frontend-->>User: Redirect to document view
```

---

## Project Structure

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

### Workspace Configuration

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

## Development Workflow

### Prerequisites

```bash
node --version    # v20.0.0 or higher
pnpm --version    # v9.0.0 or higher
docker --version  # For local PostgreSQL
```

### Initial Setup

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

### Development Commands

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

### Environment Variables

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

## Deployment Architecture

### Server Architecture (Azure VM)

```mermaid
graph TB
    subgraph "Internet"
        Users[Users]
    end

    subgraph "Azure VM"
        Nginx[Nginx :80/:443]

        subgraph "PM2"
            Web[Next.js :3000]
            API[Fastify :3001]
        end

        PG[(PostgreSQL :5432)]
    end

    Users -->|HTTPS| Nginx
    Nginx -->|/api/*| API
    Nginx -->|/*| Web
    API --> PG
```

### Server Setup

```bash
# Install dependencies
sudo apt update && sudo apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs nginx postgresql postgresql-16-pgvector
sudo npm install -g pnpm@latest pm2
```

### PM2 Configuration

```javascript
// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'simpleconf-api',
      cwd: '/var/www/simpleconf/apps/api',
      script: 'dist/index.js',
      instances: 1,
      env: { NODE_ENV: 'production', PORT: 3001 },
      env_file: '/var/www/simpleconf/apps/api/.env',
    },
    {
      name: 'simpleconf-web',
      cwd: '/var/www/simpleconf/apps/web',
      script: 'node_modules/.bin/next',
      args: 'start -p 3000',
      instances: 1,
      env: { NODE_ENV: 'production', PORT: 3000 },
    },
  ],
};
```

### Nginx Configuration

```nginx
# /etc/nginx/sites-available/simpleconf
server {
    listen 80;
    server_name simpleconf.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name simpleconf.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/simpleconf.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/simpleconf.yourdomain.com/privkey.pem;

    # API routes
    location /api/ {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Frontend routes
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Deployment Script

```bash
#!/bin/bash
# deploy.sh
set -e
APP_DIR="/var/www/simpleconf"
cd $APP_DIR

echo "Pulling latest changes..."
git pull origin main

echo "Installing dependencies..."
pnpm install --frozen-lockfile

echo "Running migrations..."
pnpm db:migrate

echo "Building applications..."
pnpm build

echo "Restarting services..."
pm2 restart ecosystem.config.js

echo "Deployment complete!"
```

### Server Management Commands

```bash
# PM2
pm2 status                    # Check status
pm2 logs                      # View logs
pm2 restart all               # Restart all
pm2 monit                     # Real-time monitoring

# Nginx
sudo nginx -t                 # Test config
sudo systemctl reload nginx   # Reload

# PostgreSQL
sudo systemctl status postgresql
```

---

## Security and Performance

### Security Requirements

| Aspect | Implementation |
|--------|----------------|
| Input Validation | Zod schemas on all endpoints |
| SQL Injection | Drizzle ORM parameterized queries |
| XSS Prevention | React escaping + sanitized markdown |
| CORS | Strict origin whitelist |
| Password Storage | bcrypt (cost factor 10+) |
| Rate Limiting | Nginx (10 req/s per IP) |

### Performance Targets

| Metric | Target |
|--------|--------|
| API Response Time | < 200ms (p95) |
| Search Response Time | < 500ms (p95) |
| First Contentful Paint | < 1.5s |
| Time to Interactive | < 3s |

---

## Testing Strategy

### Test Structure

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

### Test Commands

```bash
pnpm test              # Run all tests
pnpm test:watch        # Watch mode
pnpm test:coverage     # With coverage
pnpm test:e2e          # E2E tests
```

---

## Coding Standards

### Critical Rules

| Rule | Description |
|------|-------------|
| Type Sharing | Always import from `@simpleconf/shared` |
| API Calls | Use service layer, never fetch directly |
| Environment | Access via `env.ts`, never `process.env` |
| Database | Use repository pattern |
| Authentication | Always use `authenticate` middleware |

### Naming Conventions

| Element | Convention | Example |
|---------|------------|---------|
| Components | PascalCase | `DocumentViewPage.tsx` |
| Hooks | camelCase with `use` | `useAuth.ts` |
| API Routes | kebab-case | `/api/documents/:id` |
| Database Tables | snake_case | `document_views` |
| Types | PascalCase | `DocumentWithMeta` |

---

## Error Handling

### Error Response Format

```typescript
interface ApiError {
  error: {
    code: string;       // VALIDATION_ERROR, NOT_FOUND, etc.
    message: string;
    details?: Record<string, string>;
  }
}
```

### Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| VALIDATION_ERROR | 400 | Invalid request |
| UNAUTHORIZED | 401 | Missing/invalid token |
| FORBIDDEN | 403 | Access denied |
| NOT_FOUND | 404 | Resource not found |
| CONFLICT | 409 | Duplicate resource |
| INTERNAL_ERROR | 500 | Server error |

---

## Monitoring

### Tools

| Aspect | Tool |
|--------|------|
| Process Management | PM2 |
| Application Logs | PM2 logs |
| Access Logs | Nginx |
| Server Metrics | htop, df, free |

### Commands

```bash
pm2 logs                      # Application logs
pm2 monit                     # Real-time monitoring
sudo tail -f /var/log/nginx/access.log
htop                          # Server resources
```

---

## Checklist Results

### Architecture Validation

| Category | Status |
|----------|--------|
| High Level Architecture | ✅ Complete |
| Tech Stack Definition | ✅ Complete |
| Data Models | ✅ Complete |
| API Specification | ✅ Complete |
| Database Schema | ✅ Complete |
| Frontend Architecture | ✅ Complete |
| Backend Architecture | ✅ Complete |
| Project Structure | ✅ Complete |
| Development Workflow | ✅ Complete |
| Deployment Strategy | ✅ Complete |
| Security Considerations | ✅ Complete |
| Testing Strategy | ✅ Complete |

### Key Decisions Summary

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Frontend Framework | Next.js 16 | Preserve v0.dev code |
| Backend Framework | Fastify | PRD spec, TypeScript-first |
| Database | PostgreSQL + pgvector | Semantic search requirement |
| Embeddings | Local @xenova/transformers | Zero API cost |
| Deployment | Azure VM + Nginx + PM2 | Simple, cost-effective |

### Implementation Order

1. Setup monorepo structure and shared package
2. Build backend API (auth → folders → documents → search)
3. Integrate frontend with API services
4. Deploy to Azure VM
5. Test end-to-end flows

---

**Status: ✅ APPROVED — Ready for implementation**
