# Epic 1: Foundation & Document Core

**Goal:** Establish project infrastructure, authentication, and basic document management so users can create, organize, and view Markdown documents in a folder hierarchy. Upon completion, users can register, log in, browse a folder structure, and create/view Markdown documents.

## Story 1.1: Project Setup & Health Check

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

## Story 1.2: Database Schema & Migrations

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

## Story 1.3: User Authentication API

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

## Story 1.4: Folder & Document CRUD API

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

## Story 1.5: Frontend App Shell & Authentication UI

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

## Story 1.6: Folder Tree Navigation

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

## Story 1.7: Document Viewer & Editor

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
