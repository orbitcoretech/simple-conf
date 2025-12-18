# Error Handling

## Error Response Format

```typescript
interface ApiError {
  error: {
    code: string;       // VALIDATION_ERROR, NOT_FOUND, etc.
    message: string;
    details?: Record<string, string>;
  }
}
```

## Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| VALIDATION_ERROR | 400 | Invalid request |
| UNAUTHORIZED | 401 | Missing/invalid token |
| FORBIDDEN | 403 | Access denied |
| NOT_FOUND | 404 | Resource not found |
| CONFLICT | 409 | Duplicate resource |
| INTERNAL_ERROR | 500 | Server error |

---
