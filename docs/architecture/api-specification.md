# API Specification

## Base Configuration

- **Base URL (Development):** `http://localhost:3001/api`
- **Base URL (Production):** `https://simpleconf.yourdomain.com/api`
- **Authentication:** Bearer token in `Authorization` header

## Authentication Endpoints

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

## Folder Endpoints

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

## Document Endpoints

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

## Search Endpoints

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

## Comment Endpoints

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

## Utility Endpoints

| Method | Endpoint | Purpose | Auth Required |
|--------|----------|---------|---------------|
| GET | `/health` | Health check | No |

## Error Response Format

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
