# Security and Performance

## Security Requirements

| Aspect | Implementation |
|--------|----------------|
| Input Validation | Zod schemas on all endpoints |
| SQL Injection | Drizzle ORM parameterized queries |
| XSS Prevention | React escaping + sanitized markdown |
| CORS | Strict origin whitelist |
| Password Storage | bcrypt (cost factor 10+) |
| Rate Limiting | Nginx (10 req/s per IP) |

## Performance Targets

| Metric | Target |
|--------|--------|
| API Response Time | < 200ms (p95) |
| Search Response Time | < 500ms (p95) |
| First Contentful Paint | < 1.5s |
| Time to Interactive | < 3s |

---
