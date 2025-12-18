# Database Schema

## Database Setup

```sql
-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgvector";
```

## Users Table

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

## Folders Table

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

## Documents Table

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

## Comments Table

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

## Document Views Table

```sql
CREATE TABLE document_views (
  document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  PRIMARY KEY (document_id, user_id)
);

CREATE INDEX idx_document_views_lookup ON document_views(document_id, user_id, viewed_at);
```

## Key Queries

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
