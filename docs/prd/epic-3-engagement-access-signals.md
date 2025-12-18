# Epic 3: Engagement & Access Signals

**Goal:** Add commenting, view tracking, and access control visualization to transform the static repository into a living, discoverable knowledge base. Upon completion, users can see which documents are popular, add comments, and clearly understand access permissions.

## Story 3.1: View Count Tracking

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

## Story 3.2: Document Commenting System

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

## Story 3.3: Department-Based Access Control

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

## Story 3.4: Access Visualization & Document Preview

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
