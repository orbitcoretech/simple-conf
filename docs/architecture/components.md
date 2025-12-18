# Components

## Frontend Components (Existing)

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

## Frontend Services Layer (New)

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

## Backend Modules (New)

Located in `/apps/api/src/modules/`:

| Module | Responsibility |
|--------|----------------|
| `auth/` | User registration, login, JWT management |
| `folders/` | Folder CRUD, tree structure, access control |
| `documents/` | Document CRUD, view tracking, embedding generation |
| `search/` | Semantic search, external fallback |
| `comments/` | Comment CRUD |

## Backend Services

| Service | Responsibility |
|---------|----------------|
| `embedding.service.ts` | Generate 384-dimension vectors using local model |
| `external-search.service.ts` | DuckDuckGo API fallback |

---
