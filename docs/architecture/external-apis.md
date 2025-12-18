# External APIs

## DuckDuckGo Instant Answer API

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

## No Other External APIs

| Potential Service | Decision | Rationale |
|-------------------|----------|-----------|
| OpenAI / Embeddings API | Not used | Local `@xenova/transformers` instead |
| Pinecone / Vector DB | Not used | pgvector in PostgreSQL |
| Auth0 / Clerk | Not used | Custom JWT auth |

---
