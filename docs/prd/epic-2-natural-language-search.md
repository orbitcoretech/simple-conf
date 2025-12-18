# Epic 2: Natural Language Search

**Goal:** Implement semantic search capabilities using local embedding models, enabling users to discover documents through conversational queries with context snippets and external fallback — all without external API costs.

## Story 2.1: Local Embedding Infrastructure

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

## Story 2.2: Document Indexing & Embedding Generation

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

## Story 2.3: Semantic Search API

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

## Story 2.4: Search UI & Query Bar

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

## Story 2.5: External Search Fallback

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
