# SimpleConf Product Requirements Document (PRD)

## Goals and Background Context

### Goals

- Enable users to discover internal documentation through natural language queries, reducing search time by 50%
- Achieve 80% weekly active usage across all target departments within 2 months of launch
- Provide cross-departmental knowledge accessibility where Sales docs become discoverable by developers through plain English questions
- Deliver 70%+ query success rate where users find relevant documents on their first attempt
- Establish a living knowledge base with visible engagement signals (view counts, comments, active maintenance)

### Background Context

Internal documentation across the organization is currently siloed by department, making discovery friction-heavy and dependent on knowing exact folder structures or document names. Teams waste significant time searching for or recreating documentation that already exists, while new hires face steep onboarding curves without clear paths to institutional knowledge.

SimpleConf addresses this by prioritizing **discoverability over features** — a natural language query bar as the primary interface, a clean folder hierarchy with visual access indicators, and minimal collaboration features to keep documentation alive without complexity creep. Unlike Confluence or Notion which are powerful but overwhelming, SimpleConf is deliberately scoped for the specific needs of a tech organization with cross-functional teams.

### Change Log

| Date | Version | Description | Author |
|------|---------|-------------|--------|
| 2024-12-18 | 0.1 | Initial PRD draft from Project Brief | John (PM Agent) |

## Requirements

### Functional

- **FR1:** The system shall provide a natural language query bar as the primary search interface, accepting conversational queries (e.g., "Find PRDs for e-commerce projects", "How to integrate Razorpay")
- **FR2:** The system shall return relevant documents with context snippets highlighting matched content within 2 seconds of query submission
- **FR3:** The system shall display a hierarchical folder tree structure with visual access indicators (🔒 locked / 🔓 open) and document counts per folder
- **FR4:** The system shall show a preview panel on folder click displaying document title, summary, last updated timestamp, and owner
- **FR5:** The system shall display a document metadata bar showing: Created by, Modified by, Last updated timestamp, View count badge, and Comment count
- **FR6:** The system shall support simple commenting on documents with Name + Timestamp + Text format in chronological display (no reply threads or reactions)
- **FR7:** The system shall automatically track and display view counts for each document
- **FR8:** The system shall provide an external resource fallback when no internal documents match a query, with a toggle between "Search internal only" and "Search everywhere"
- **FR9:** The system shall enforce role-based access control at the department level with visual indicators in the folder tree
- **FR10:** The system shall support Markdown format for document content
- **FR11:** The system shall allow users to create, edit, and delete documents within their authorized folders
- **FR12:** The system shall provide user authentication with basic auth (username/password)

### Non-Functional

- **NFR1:** Query results shall be returned in less than 2 seconds under normal load
- **NFR2:** Page load time shall not exceed 3 seconds on standard broadband connections
- **NFR3:** The system shall support 100+ concurrent users without performance degradation
- **NFR4:** The system shall support the latest 2 versions of Chrome, Firefox, Safari, and Edge browsers
- **NFR5:** The system shall be deployable via containerized infrastructure (Docker)
- **NFR6:** The system shall maintain audit logging for document access events
- **NFR7:** The system shall be designed as a monolith with clear separation of concerns to allow future service extraction
- **NFR8:** The codebase shall use TypeScript for type safety across frontend and backend
- **NFR9:** The system shall minimize external service costs by leveraging cost-effective NLP/embedding solutions

## User Interface Design Goals

### Overall UX Vision

SimpleConf embodies the principle of **"discoverability over features"** — the interface should feel like having a conversation with a knowledgeable colleague rather than navigating a complex document management system. The primary interaction is a prominent search bar that invites natural language queries, supported by a clean folder hierarchy for visual browsing. Every UI element serves discovery; if it doesn't help users find or understand documents faster, it doesn't belong in the MVP.

### Key Interaction Paradigms

- **Search-first navigation:** The natural language query bar is the hero element, prominently placed and always accessible. Users should instinctively reach for the search bar before browsing folders.
- **Progressive disclosure:** Folder tree shows structure at a glance; clicking reveals preview panels with document summaries before committing to full document view.
- **Visual access signals:** Lock/unlock icons provide instant clarity on what users can access without trial-and-error clicking.
- **Minimal friction commenting:** Single-click comment addition without modal dialogs or formatting options — just type and submit.
- **Contextual metadata:** View counts and timestamps are visible but unobtrusive, providing social proof and freshness signals without cluttering the reading experience.

### Core Screens and Views

1. **Home / Search Dashboard** — Central query bar with recent/popular documents below; folder tree in sidebar
2. **Search Results View** — List of matched documents with context snippets highlighting query matches
3. **Folder Browse View** — Expanded folder tree with document preview panel on selection
4. **Document View** — Full document display with metadata bar, Markdown rendering, and comment section
5. **Document Editor** — Markdown editor for creating/editing documents with live preview
6. **Login Screen** — Simple username/password authentication form

### Accessibility: WCAG AA

The application will conform to WCAG 2.1 Level AA standards, ensuring sufficient color contrast ratios, keyboard navigation support, screen reader compatibility for core workflows, and focus indicators on interactive elements.

### Branding

No specific corporate branding guidelines have been established. The UI should adopt a clean, professional, developer-friendly aesthetic — think modern SaaS documentation tools (Notion, GitBook, Stripe Docs). Neutral color palette with clear typography hierarchy. Consider shadcn/ui as a component library for cohesive, accessible design system.

### Target Device and Platforms: Web Responsive (Desktop Primary)

The application targets desktop browsers as the primary platform (Chrome, Firefox, Safari, Edge). While the layout should be responsive and not break on tablet/mobile viewports, mobile optimization is explicitly out of scope for MVP.

## Technical Assumptions

### Repository Structure: Monorepo

The project will use a **monorepo structure** with the following layout:
```
/
├── frontend/     # React application
├── backend/      # Node.js API server
├── shared/       # Shared TypeScript types and utilities
└── docs/         # Project documentation
```

Monorepo enables shared type definitions between frontend and backend, simplified dependency management, and atomic commits across the full stack.

### Service Architecture

**Monolith with Modular Design** — The MVP will be built as a single deployable unit with clear internal separation of concerns:

- **API Layer:** RESTful endpoints for documents, folders, users, search, and comments
- **Search Service Module:** Encapsulated semantic search logic (embeddings generation, vector queries)
- **Auth Module:** Basic authentication with JWT tokens
- **Data Access Layer:** PostgreSQL interactions abstracted for future service extraction

### Testing Requirements

**Unit + Integration Testing** with the following approach:

- **Unit Tests:** Core business logic, utility functions, data transformations
- **Integration Tests:** API endpoint testing with test database, search functionality verification
- **Manual Testing Convenience:** Seed scripts for populating test data, Postman/Insomnia collection for API exploration
- **E2E Tests:** Deferred to post-MVP; manual QA sufficient for initial release

### Additional Technical Assumptions and Requests

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

## Epic List

| # | Epic | Goal |
|---|------|------|
| **Epic 1** | **Foundation & Document Core** | Establish project infrastructure, authentication, and basic document management so users can create, organize, and view Markdown documents in a folder hierarchy |
| **Epic 2** | **Natural Language Search** | Implement semantic search capabilities enabling users to discover documents through conversational queries with context snippets and external fallback |
| **Epic 3** | **Engagement & Access Signals** | Add commenting, view tracking, and access control visualization to transform the static repository into a living, discoverable knowledge base |

## Epic 1: Foundation & Document Core

**Goal:** Establish project infrastructure, authentication, and basic document management so users can create, organize, and view Markdown documents in a folder hierarchy. Upon completion, users can register, log in, browse a folder structure, and create/view Markdown documents.

### Story 1.1: Project Setup & Health Check

**As a** developer,
**I want** the monorepo structure with backend and frontend scaffolding,
**so that** the team has a working foundation to build features on.

**Acceptance Criteria:**
1. Monorepo structure exists with `/frontend`, `/backend`, `/shared`, and `/docs` directories
2. Backend: Fastify server with TypeScript compiles and runs on port 3000
3. Frontend: Vite + React + TypeScript scaffolded with shadcn/ui initialized
4. Shared: TypeScript types package configured for cross-project imports
5. Docker Compose configuration starts PostgreSQL and both services
6. Health endpoint (`GET /health`) returns `{ status: "ok" }` with 200
7. Structured JSON logging (pino) outputs to console
8. Environment configuration via `.env` files with `.env.example` templates
9. README with setup instructions for local development

### Story 1.2: Database Schema & Migrations

**As a** developer,
**I want** the core database schema for users, folders, and documents,
**so that** the application can persist and retrieve knowledge base data.

**Acceptance Criteria:**
1. PostgreSQL database connection established from backend
2. Migration system configured (e.g., node-pg-migrate or Prisma)
3. `users` table: id, email, password_hash, display_name, department, created_at
4. `folders` table: id, name, parent_id (nullable for root), department_id, created_by, created_at
5. `documents` table: id, title, content (text), folder_id, created_by, modified_by, created_at, updated_at
6. Foreign key constraints properly defined
7. Seed script creates sample department folders (Frontend, Backend, Sales, HR)
8. Database can be reset and re-seeded via npm script

### Story 1.3: User Authentication API

**As a** user,
**I want** to register and log in with email/password,
**so that** I can access the knowledge base securely.

**Acceptance Criteria:**
1. `POST /api/auth/register` accepts email, password, display_name, department; returns user object (no password)
2. `POST /api/auth/login` accepts email, password; returns JWT token on success
3. Passwords hashed with bcrypt (cost factor 10+)
4. JWT tokens include user id, email, department; expire in 24 hours
5. `GET /api/auth/me` returns current user when valid JWT provided in Authorization header
6. Invalid credentials return 401 with appropriate error message
7. Duplicate email registration returns 409 Conflict
8. Input validation for email format and password minimum length (8 chars)

### Story 1.4: Folder & Document CRUD API

**As a** user,
**I want** API endpoints to manage folders and documents,
**so that** I can organize and store knowledge base content.

**Acceptance Criteria:**
1. `GET /api/folders` returns folder tree structure for authenticated user
2. `POST /api/folders` creates a new folder (name, parent_id optional)
3. `GET /api/folders/:id` returns folder details with child folders and documents list
4. `GET /api/documents/:id` returns full document with content and metadata
5. `POST /api/documents` creates document (title, content, folder_id); sets created_by from JWT
6. `PUT /api/documents/:id` updates document; sets modified_by from JWT, updates timestamp
7. `DELETE /api/documents/:id` soft-deletes or removes document (owner only)
8. All endpoints require valid JWT; return 401 if missing/invalid
9. Document responses include: id, title, content, folder_id, created_by (user object), modified_by, created_at, updated_at

### Story 1.5: Frontend App Shell & Authentication UI

**As a** user,
**I want** a login screen and authenticated app layout,
**so that** I can securely access the knowledge base interface.

**Acceptance Criteria:**
1. Login page with email/password form, error handling, and loading state
2. Registration page with email, password, display name, department dropdown
3. Successful login stores JWT in localStorage and redirects to home
4. Auth context provides current user state to all components
5. Protected route wrapper redirects unauthenticated users to login
6. App shell layout: sidebar (for folder tree), main content area, top header with user menu
7. User menu shows display name with logout option
8. Logout clears token and redirects to login

### Story 1.6: Folder Tree Navigation

**As a** user,
**I want** to browse the folder hierarchy in a sidebar,
**so that** I can navigate to documents by department and category.

**Acceptance Criteria:**
1. Folder tree component displays hierarchical folder structure
2. Folders are collapsible/expandable with visual indicator (chevron)
3. Clicking a folder shows its contents in the main area (subfolders + documents list)
4. Document count displayed next to each folder name (e.g., "PRDs (7)")
5. Current folder highlighted in tree
6. Document list shows title, last updated date, and owner name
7. Clicking a document navigates to document view
8. Empty folder shows "No documents yet" message with create button

### Story 1.7: Document Viewer & Editor

**As a** user,
**I want** to view and edit Markdown documents,
**so that** I can read and contribute to the knowledge base.

**Acceptance Criteria:**
1. Document view page renders Markdown content with proper formatting
2. Code blocks display with syntax highlighting
3. Metadata bar shows: Created by, Modified by, Last updated (relative time)
4. Edit button (visible to document owner) navigates to editor
5. Editor page has split view: Markdown textarea (left), live preview (right)
6. Save button submits changes and redirects to view page
7. Cancel button discards changes and returns to view
8. Create new document: "New Document" button in folder view opens editor
9. New documents require title; content can be empty
10. Unsaved changes prompt confirmation before navigation

## Epic 2: Natural Language Search

**Goal:** Implement semantic search capabilities using local embedding models, enabling users to discover documents through conversational queries with context snippets and external fallback — all without external API costs.

### Story 2.1: Local Embedding Infrastructure

**As a** developer,
**I want** infrastructure for generating document embeddings locally,
**so that** we can power semantic search without external API costs.

**Acceptance Criteria:**
1. `@xenova/transformers` package installed for local model inference
2. Embedding service module created using `all-MiniLM-L6-v2` model
3. Model downloaded and cached on first run (~80MB)
4. Generates 384-dimension vectors from text input
5. `documents` table extended with `embedding` column (vector(384) via pgvector)
6. pgvector extension enabled in PostgreSQL
7. Embedding generation handles long text by chunking (max 256 tokens per chunk, average embeddings)
8. Unit tests verify embedding output shape and consistency

### Story 2.2: Document Indexing & Embedding Generation

**As a** system,
**I want** documents to be automatically indexed when created or updated,
**so that** they become searchable immediately.

**Acceptance Criteria:**
1. On document create: embedding generated from title + content, stored in database
2. On document update: embedding regenerated if content changed
3. Embedding generation runs synchronously (local inference is fast, ~50-200ms)
4. `indexed_at` timestamp column tracks when document was last indexed
5. Backfill script generates embeddings for all existing documents
6. Progress logging during backfill (e.g., "Indexed 50/200 documents...")
7. IVFFlat index created on embedding column for efficient similarity queries
8. Seed script includes sample documents with pre-generated embeddings for testing

### Story 2.3: Semantic Search API

**As a** user,
**I want** to search documents using natural language queries,
**so that** I can find relevant information without knowing exact keywords.

**Acceptance Criteria:**
1. `POST /api/search` accepts `{ query: string, limit?: number, internal_only?: boolean }`
2. Query text converted to embedding using same local model
3. Vector similarity search using pgvector cosine distance operator (`<=>`)
4. Results ranked by similarity score (highest first)
5. Each result includes: document id, title, folder path, similarity score, snippet
6. Snippet: 150-200 char excerpt from content most relevant to query
7. Default limit: 10 results; max: 50
8. Minimum similarity threshold (e.g., 0.3) filters out irrelevant matches
9. Response time under 500ms for typical queries (local inference advantage)
10. Empty results return `{ results: [], suggestion: "Try different keywords..." }`

### Story 2.4: Search UI & Query Bar

**As a** user,
**I want** a prominent search bar and results display,
**so that** I can easily discover documents through conversation-style queries.

**Acceptance Criteria:**
1. Search bar prominently displayed in header, always visible
2. Placeholder text: "Ask a question or search for documents..."
3. Search triggered on Enter key or search icon click
4. Loading state shown while search in progress
5. Results page displays matched documents as cards
6. Each card shows: title, folder breadcrumb, snippet with query terms highlighted, similarity indicator
7. Clicking a result navigates to document view
8. "No results found" state with helpful suggestions
9. Recent searches stored locally (last 5) and shown as dropdown suggestions
10. Keyboard shortcut (Cmd/Ctrl + K) focuses search bar from anywhere

### Story 2.5: External Search Fallback

**As a** user,
**I want** to search external resources when internal docs don't have answers,
**so that** I can still find information even if it's not documented internally.

**Acceptance Criteria:**
1. Toggle switch in search UI: "Internal only" / "Search everywhere"
2. When "Search everywhere" enabled and internal results < 3, external search triggered
3. External search uses DuckDuckGo Instant Answer API (free, no API key)
4. External results displayed in separate section below internal results
5. External results show: title, source domain, snippet, external link icon
6. Clicking external result opens in new tab
7. External results clearly visually distinguished from internal docs
8. Graceful degradation if external search fails

## Epic 3: Engagement & Access Signals

**Goal:** Add commenting, view tracking, and access control visualization to transform the static repository into a living, discoverable knowledge base. Upon completion, users can see which documents are popular, add comments, and clearly understand access permissions.

### Story 3.1: View Count Tracking

**As a** user,
**I want** to see how many times a document has been viewed,
**so that** I can identify valuable and popular content.

**Acceptance Criteria:**
1. `document_views` table: id, document_id, user_id, viewed_at
2. View recorded when user opens document view page
3. Duplicate views from same user within 30 minutes not counted (session-based deduplication)
4. `GET /api/documents/:id` includes `view_count` in response
5. View count badge displayed in document metadata bar (e.g., "👁 47 views")
6. View count shown in document list/cards in folder view
7. Audit log entry created for each view (for NFR6 compliance)
8. Popular documents (top 5 by views) shown on home dashboard

### Story 3.2: Document Commenting System

**As a** user,
**I want** to add comments to documents,
**so that** I can ask questions, provide feedback, or add context.

**Acceptance Criteria:**
1. `comments` table: id, document_id, user_id, content (text), created_at
2. `POST /api/documents/:id/comments` creates a comment (content required)
3. `GET /api/documents/:id/comments` returns all comments for document
4. `DELETE /api/documents/:id/comments/:commentId` removes comment (author only)
5. Comments displayed below document content in chronological order
6. Each comment shows: author display name, timestamp (relative), content
7. Simple text input for adding new comment (no rich text, no threading)
8. Comment count badge in document metadata bar (e.g., "💬 12 comments")
9. Empty state: "No comments yet. Be the first to add one!"
10. Comments visible to all users who can view the document

### Story 3.3: Department-Based Access Control

**As an** administrator,
**I want** documents to be restricted by department,
**so that** sensitive information is only visible to authorized users.

**Acceptance Criteria:**
1. Folders have `visibility` field: "public" (all users) or "department" (department members only)
2. Documents inherit access from their parent folder
3. `GET /api/folders` and `GET /api/documents/:id` respect access rules
4. Unauthorized access attempts return 403 Forbidden
5. Users can only create documents in folders they have access to
6. Department admins can modify folder visibility (future: for MVP, set via seed data)
7. Access check middleware validates user department against folder permissions
8. Seed data includes mix of public folders and department-restricted folders

### Story 3.4: Access Visualization & Document Preview

**As a** user,
**I want** visual indicators showing which folders I can access,
**so that** I understand the knowledge base structure without trial and error.

**Acceptance Criteria:**
1. Folder tree displays access icons: 🔓 (accessible) or 🔒 (restricted)
2. Restricted folders shown but visually muted (lower opacity)
3. Clicking restricted folder shows "Access restricted to [Department] team" message
4. Document preview panel appears on document hover/selection in folder view
5. Preview shows: title, first 200 chars of content, owner, last updated, view count
6. Preview panel has "Open" button to navigate to full document
7. Search results indicate access status (accessible results highlighted, restricted shown but noted)
8. User's department shown in header user menu for context

---

## Checklist Results Report

### Validation Summary

| Metric | Result |
|--------|--------|
| **Overall Completeness** | 92% |
| **MVP Scope** | Just Right |
| **Architecture Readiness** | ✅ Ready |
| **Total Stories** | 16 across 3 epics |

### Category Results

| Category | Status |
|----------|--------|
| Problem Definition & Context | ✅ PASS |
| MVP Scope Definition | ✅ PASS |
| User Experience Requirements | ✅ PASS |
| Functional Requirements | ✅ PASS |
| Non-Functional Requirements | ✅ PASS |
| Epic & Story Structure | ✅ PASS |
| Technical Guidance | ✅ PASS |
| Cross-Functional Requirements | ⚠️ PARTIAL |
| Clarity & Communication | ✅ PASS |

### Known Gaps (Acceptable for MVP)

- Data retention policy not specified (recommend 90-day audit log retention)
- Password reset flow deferred to post-MVP
- Bulk document import not included (manual creation sufficient for bootstrap)

### Decision

**✅ READY FOR ARCHITECT** — PRD is comprehensive and properly structured.

---

## Next Steps

### UX Expert Prompt

> Review the SimpleConf PRD (`docs/prd.md`) and create UI/UX specifications. Focus on:
> - Wireframes for the 6 core screens (Home/Search, Results, Folder Browse, Document View, Editor, Login)
> - Search-first interaction design with prominent query bar
> - Folder tree with access indicators (🔒/🔓) and document preview panel
> - Mobile-responsive considerations for desktop-primary design
> - WCAG AA accessibility compliance
> - Component library alignment with shadcn/ui

### Architect Prompt

> Review the SimpleConf PRD (`docs/prd.md`) and create the technical architecture document. Key considerations:
> - Monorepo structure: `/frontend`, `/backend`, `/shared`
> - Tech stack: React + Vite, Fastify, PostgreSQL + pgvector
> - Local embeddings via `@xenova/transformers` (all-MiniLM-L6-v2, 384 dimensions)
> - JWT authentication with bcrypt
> - Docker containerization for development and deployment
> - Database schema for users, folders, documents, comments, document_views
> - Vector similarity search implementation with pgvector
> - API design following RESTful conventions

